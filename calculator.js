(function () {
  const IMPETIGO_CARE_NOTE = `
    <br><br><strong>If not settling:</strong><br>
    Consider bleach baths, topical antiseptic such as hydrogen peroxide cream, and oral antibiotics when indicated.<br><br>
    One or two sores: clean with a moist clean cloth or running tap water.<br>
    Large sores: soak daily for at least 15 minutes in a full bath with a quarter cup of bleach added, for up to 7 days.<br><br>
    <strong>Not included in this calculator:</strong> trimethoprim + sulfamethoxazole 24 mg/kg per dose twice daily for 5 days.
  `;

  const MEDS = {
	  customMgKg: {
  label: "Custom mg/kg calculator",
  age: { minMonths: 0, maxYears: 120 },
  strengths: [
    { id: "customLiq", value: 1, label: "Custom suspension" }
  ],
  options: [
    {
      id: "customMgPerKg",
      label: "mg/kg per dose",
      type: "number"
    },
    {
      id: "customFreq",
      label: "Frequency",
      type: "select",
      choices: [
        { value: "od", label: "Once daily" },
        { value: "bd", label: "Twice daily" },
        { value: "tds", label: "Three times daily" },
        { value: "qid", label: "Four times daily" }
      ]
    },
    {
      id: "customDays",
      label: "Duration (days)",
      type: "number"
    },
    {
      id: "customStrengthMg",
      label: "Suspension mg",
      type: "number"
    },
    {
      id: "customStrengthMl",
      label: "Suspension mL",
      type: "number"
    },
    {
      id: "customMaxDose",
      label: "Max single dose (mg)",
      type: "number"
    }
  ],
  note: () => `
    <strong>Note:</strong> Custom weight-based calculator.<br><br>
    Enter mg/kg/dose, frequency, duration, and your own suspension strength.
  `,
  calc: ({ weightKg, selections }) => {
    const mgPerKg = parseFloat(selections.customMgPerKg);
    const strengthMg = parseFloat(selections.customStrengthMg);
    const strengthMl = parseFloat(selections.customStrengthMl);
    const maxDose = parseFloat(selections.customMaxDose);
    const durationDays = parseFloat(selections.customDays);
    const hasDuration = String(selections.customDays || "").trim() !== "";
    const hasValidDuration = isFinite(durationDays) && durationDays > 0;

    if (!isFinite(weightKg) || weightKg <= 0 || !isFinite(mgPerKg) || mgPerKg <= 0) {
      return {
        mode: "single",
        frequency: "",
        sigFrequency: "",
        dosesPerDay: null,
        defaultDurationDays: null,
        doseMg: null,
        maxDailyMg: null,
        warnings: ["Enter weight and mg/kg per dose."],
        extra: []
      };
    }

    const rawDose = weightKg * mgPerKg;
    const doseMg = isFinite(maxDose) && maxDose > 0 ? Math.min(rawDose, maxDose) : rawDose;

    let dosesPerDay = 1;
    let frequency = "Once daily";
    let sigFrequency = "once daily";

    if (selections.customFreq === "bd") {
      dosesPerDay = 2;
      frequency = "Twice daily";
      sigFrequency = "twice daily";
    } else if (selections.customFreq === "tds") {
      dosesPerDay = 3;
      frequency = "Three times daily";
      sigFrequency = "three times daily";
    } else if (selections.customFreq === "qid") {
      dosesPerDay = 4;
      frequency = "Four times daily";
      sigFrequency = "four times daily";
    }

    const warnings = [];
    if (isFinite(maxDose) && maxDose > 0 && rawDose > maxDose) {
      warnings.push(`Dose capped at max single dose of ${formatMg(maxDose)}.`);
    }
    if (hasDuration && !hasValidDuration) {
      warnings.push("Enter a positive duration in days.");
    }

    return {
      mode: "single",
      frequency: hasValidDuration
        ? `${frequency} for ${durationDays} days`
        : frequency,
      sigFrequency,
      dosesPerDay,
      defaultDurationDays: hasValidDuration ? durationDays : null,
      doseMg,
      maxDailyMg: doseMg * dosesPerDay,
      warnings,
      extra: [
        `Calculated from ${mgPerKg} mg/kg/dose`,
        `Daily total: ${formatMg(doseMg * dosesPerDay)}`,
        isFinite(strengthMg) && isFinite(strengthMl) && strengthMg > 0 && strengthMl > 0
          ? `Suspension entered: ${strengthMg} mg / ${strengthMl} mL`
          : ""
      ].filter(Boolean),
      customStrength: {
        mg: strengthMg,
        ml: strengthMl
      }
    };
  }
},
    paracetamol: {
      label: "Paracetamol",
      age: { minMonths: 1, maxYears: 18 },
      strengths: [
  { id: "liq120", type: "liquid", strengthMg: 120, volumeMl: 5, label: "120 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "tab500", type: "tablet", strengthMg: 500, volumeMl: null, label: "500 mg tablet" }
],
      note: ({ formulation, patientType }) => {
        if (formulation?.type === "tablet") {
          if (patientType === "adult") {
            return `
              <strong>Note:</strong> Tablet selected.<br><br>
              Adult fixed dosing can be used without weight.<br><br>
              Usual adult dose here: 500 mg to 1000 mg per dose.<br>
              Maximum single dose: 1000 mg.<br>
              Maximum daily dose: 4000 mg/day.<br>
              Frequency: Every 4 hours as needed, max 4 doses in 24 hours.
            `;
          }

          return `
            <strong>Note:</strong> Tablet selected.<br><br>
            If weight is entered, calculator uses weight-based dosing.<br>
            If no weight is entered, age-based tablet dosing is used as a practical guide.<br><br>
            Usual dose: 15 mg/kg per dose.<br>
            Maximum single dose: 1000 mg.<br>
            Maximum daily dose: 60 mg/kg/day up to 4000 mg/day.<br>
            Frequency: Every 4 hours as needed, max 4 doses in 24 hours.
          `;
        }

        return `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
          Usual dose: 15 mg/kg per dose.<br>
          Maximum single dose: 1000 mg.<br>
          Maximum daily dose: 60 mg/kg/day up to 4000 mg/day.<br>
          Frequency: Every 4 hours as needed, max 4 doses in 24 hours.
        `;
      },
      adultCalc: () => {
        return {
          mode: "single",
          frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
          sigFrequency: "every 4 hours as needed (maximum 4 doses in 24 hours)",
          dosesPerDay: 4,
          defaultDurationDays: null,
          doseMg: 1000,
          maxDailyMg: 4000,
          warnings: [],
          extra: ["Adult fixed-dose regimen used.", "Daily maximum: 4000 mg"]
        };
      },
      tabletAgeCalc: ({ ageMonths, formulation }) => {
        const warnings = [];
        let doseMg = null;

        if (!formulation || formulation.type !== "tablet") {
          return {
            mode: "single",
            frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
            sigFrequency: "every 4 hours as needed (maximum 4 doses in 24 hours)",
            dosesPerDay: 4,
            defaultDurationDays: null,
            doseMg: null,
            maxDailyMg: null,
            warnings: ["Tablet formulation not selected."],
            extra: []
          };
        }

        if (!isFinite(ageMonths) || ageMonths < 0) {
          return {
            mode: "single",
            frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
            sigFrequency: "every 4 hours as needed (maximum 4 doses in 24 hours)",
            dosesPerDay: 4,
            defaultDurationDays: null,
            doseMg: null,
            maxDailyMg: null,
            warnings: ["Enter age in months to use age-based tablet dosing."],
            extra: []
          };
        }

        if (ageMonths >= 144) {
          doseMg = 1000;
        } else if (ageMonths >= 96) {
          doseMg = 500;
        } else if (ageMonths >= 72) {
          doseMg = 500;
        } else if (ageMonths >= 48) {
          doseMg = 250;
        } else {
          warnings.push("Age-based tablet dosing is not suitable at this age; use liquid and weight-based dosing.");
          doseMg = 250;
        }

        return {
          mode: "single",
          frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
          sigFrequency: "every 4 hours as needed (maximum 4 doses in 24 hours)",
          dosesPerDay: 4,
          defaultDurationDays: null,
          doseMg,
          maxDailyMg: Math.min(doseMg * 4, 4000),
          warnings,
          extra: ["Age-based tablet dosing used."]
        };
      },
      calc: ({ weightKg }) => {
        const rawDose = weightKg * 15;
        const doseMg = Math.min(rawDose, 1000);
        const maxDailyMg = Math.min(weightKg * 60, 4000);

        return {
          mode: "single",
          frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
          sigFrequency: "every 4 hours as needed (maximum 4 doses in 24 hours)",
          dosesPerDay: 4,
          defaultDurationDays: null,
          doseMg,
          maxDailyMg,
          warnings: rawDose > 1000 ? ["Dose capped at max single dose of 1000 mg."] : [],
          extra: [`Daily maximum: ${formatMg(maxDailyMg)}`]
        };
      }
    },

  flucloxacillin: {
  label: "Flucloxacillin",
  age: { minMonths: 1, maxYears: 18 },
  strengths: [
  { id: "liq125", type: "liquid", strengthMg: 125, volumeMl: 5, label: "125 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "cap250", type: "tablet", strengthMg: 250, volumeMl: null, label: "250 mg capsule" },
  { id: "cap500", type: "tablet", strengthMg: 500, volumeMl: null, label: "500 mg capsule" },
  { id: "cap1000", type: "tablet", strengthMg: 1000, volumeMl: null, label: "1 g capsule" }
],
  options: [
    {
      id: "dosingType",
      label: "Indication",
      type: "select",
      choices: [
        { value: "general", label: "General" },
        { value: "impetigo", label: "Impetigo" },
        { value: "cellulitis", label: "Cellulitis" }
      ]
    },
    {
      id: "doseLevel",
      label: "Dose Level",
      type: "select",
      choices: [
        { value: "low", label: "Low dose" },
        { value: "high", label: "High dose" },
        { value: "range", label: "Show both" }
      ]
    }
  ],
  note: ({ selections, formulation, patientType }) => {
    const capsuleNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Adult capsule note:</strong> Fixed adult capsule dosing can be used without entering weight.`
        : `<br><br><strong>Capsule note:</strong> Weight is still required for this medicine in children even when capsule formulation is selected.`
      : "";

    if (selections.dosingType === "cellulitis") {
      return `
        <strong>Note:</strong> Cellulitis dosing.<br><br>
        Adult: 1 g four times daily for 5 days.<br><br>
        <strong>Source:</strong> tewhatakura.nz
        ${capsuleNotice}
      `;
    }

    if (selections.dosingType === "impetigo") {
      return `
        <strong>Note:</strong> Impetigo dosing.<br><br>
        Child able to take capsules: 25 mg/kg per dose four times daily for 5 days (maximum 1 g per dose).<br>
        Adult: 1 g four times daily for 5 days with food.<br><br>
        <strong>Source:</strong> tewhatakura.nz
        ${IMPETIGO_CARE_NOTE}
        ${capsuleNotice}
      `;
    }

    return `
      <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
      12.5–25 mg/kg four times daily.<br>
      Use 25 mg/kg for severe infections.<br>
      Maximum single dose: 1 g.<br><br>
      <strong>Source:</strong> tewhatakura.nz
      ${capsuleNotice}
    `;
  },
  adultCalc: ({ selections }) => {
    const type = selections.dosingType || "general";

    if (type === "impetigo") {
      return {
        mode: "single",
        frequency: "4 times daily with food for 5 days",
        sigFrequency: "four times daily with food",
        dosesPerDay: 4,
        defaultDurationDays: 5,
        doseMg: 1000,
        maxDailyMg: 4000,
        warnings: [],
        extra: ["Adult fixed-dose regimen used.", "Source: tewhatakura.nz"]
      };
    }

    if (type === "cellulitis") {
      return {
        mode: "single",
        frequency: "4 times daily for 5 days",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: 5,
        doseMg: 1000,
        maxDailyMg: 4000,
        warnings: [],
        extra: ["Adult cellulitis regimen used.", "Source: tewhatakura.nz"]
      };
    }

    return {
      mode: "single",
      frequency: "4 times daily",
      sigFrequency: "four times daily",
      dosesPerDay: 4,
      defaultDurationDays: null,
      doseMg: 500,
      maxDailyMg: 2000,
      warnings: [],
      extra: ["Adult fixed-dose regimen used.", "Source: tewhatakura.nz"]
    };
  },
  calc: ({ weightKg, selections }) => {
    const type = selections.dosingType || "general";

    if (type === "cellulitis") {
      const doseLevel = selections.doseLevel || "low";
      const lowRaw = weightKg * 12.5;
      const highRaw = weightKg * 25;
      const lowDose = Math.min(lowRaw, 1000);
      const highDose = Math.min(highRaw, 1000);
      const warnings = [];

      if (lowRaw > 1000 || highRaw > 1000) {
        warnings.push("Dose capped at max single dose of 1000 mg.");
      }

      if (doseLevel === "low") {
        return {
          mode: "single",
          frequency: "4 times daily for 5 days",
          sigFrequency: "four times daily",
          dosesPerDay: 4,
          defaultDurationDays: 5,
          doseMg: lowDose,
          maxDailyMg: lowDose * 4,
          warnings,
          extra: [
            `Daily total at this dose: ${formatMg(lowDose * 4)}`,
            "Source: tewhatakura.nz"
          ]
        };
      }

      if (doseLevel === "high") {
        return {
          mode: "single",
          frequency: "4 times daily for 5 days",
          sigFrequency: "four times daily",
          dosesPerDay: 4,
          defaultDurationDays: 5,
          doseMg: highDose,
          maxDailyMg: highDose * 4,
          warnings,
          extra: [
            `Daily total at this dose: ${formatMg(highDose * 4)}`,
            "Source: tewhatakura.nz"
          ]
        };
      }

      return {
        mode: "range",
        frequency: "4 times daily for 5 days",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: 5,
        lowDoseMg: lowDose,
        highDoseMg: highDose,
        maxDailyMg: highDose * 4,
        warnings,
        extra: [
          `Daily total (low): ${formatMg(lowDose * 4)}`,
          `Daily total (high): ${formatMg(highDose * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    if (type === "impetigo") {
      const rawDose = weightKg * 25;
      const doseMg = Math.min(rawDose, 1000);
      const warnings = [];

      if (rawDose > 1000) warnings.push("Dose capped at max single dose of 1000 mg.");

      return {
        mode: "single",
        frequency: "4 times daily for 5 days",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: 5,
        doseMg,
        maxDailyMg: doseMg * 4,
        warnings,
        extra: [
          `Daily total: ${formatMg(doseMg * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    const mode = selections.doseLevel || "low";
    const lowRaw = weightKg * 12.5;
    const highRaw = weightKg * 25;
    const lowDose = Math.min(lowRaw, 1000);
    const highDose = Math.min(highRaw, 1000);
    const warnings = [];

    if (lowRaw > 1000 || highRaw > 1000) {
      warnings.push("Dose capped at max single dose of 1000 mg.");
    }

    if (mode === "low") {
      return {
        mode: "single",
        frequency: "4 times daily",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: null,
        doseMg: lowDose,
        maxDailyMg: lowDose * 4,
        warnings,
        extra: [
          `Daily total at this dose: ${formatMg(lowDose * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    if (mode === "high") {
      return {
        mode: "single",
        frequency: "4 times daily",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: null,
        doseMg: highDose,
        maxDailyMg: highDose * 4,
        warnings,
        extra: [
          `Daily total at this dose: ${formatMg(highDose * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    return {
      mode: "range",
      frequency: "4 times daily",
      sigFrequency: "four times daily",
      dosesPerDay: 4,
      defaultDurationDays: null,
      lowDoseMg: lowDose,
      highDoseMg: highDose,
      maxDailyMg: highDose * 4,
      warnings,
      extra: [
        `Daily total (low): ${formatMg(lowDose * 4)}`,
        `Daily total (high): ${formatMg(highDose * 4)}`,
        "Source: tewhatakura.nz"
      ]
    };
  }
},
    amoxicillin: {
  label: "Amoxicillin",
  age: { minMonths: 1, maxYears: 18 },
  strengths: [
  { id: "liq125", type: "liquid", strengthMg: 125, volumeMl: 5, label: "125 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "cap250", type: "tablet", strengthMg: 250, volumeMl: null, label: "250 mg capsule" },
  { id: "cap500", type: "tablet", strengthMg: 500, volumeMl: null, label: "500 mg capsule" },
  { id: "cap1000", type: "tablet", strengthMg: 1000, volumeMl: null, label: "1 g capsule" }
],
  options: [
    {
      id: "dosingType",
      label: "Dosing Type",
      type: "select",
      choices: [
        { value: "general", label: "General" },
        { value: "otitisMedia", label: "Acute Otitis Media" },
        { value: "acuteSinusitis", label: "Acute Sinusitis" },
        { value: "strepA", label: "Strep A" },
        { value: "arf", label: "Acute rheumatic fever - Strep A eradication" }
      ]
    },
    {
      id: "doseLevel",
      label: "Dose Level",
      type: "select",
      choices: [
        { value: "low", label: "Low dose" },
        { value: "high", label: "High dose" },
        { value: "range", label: "Show both" }
      ]
    },
    {
      id: "aomChildPathway",
      label: "Child AOM pathway",
      type: "select",
      choices: [
        { value: "initial", label: "Initial treatment (15 mg/kg/dose)" },
        { value: "severe", label: "Recent antibiotics / severe / recurrent (30 mg/kg/dose)" }
      ]
    },
    {
      id: "amoxStrepMethod",
      label: "Strep A child dose method",
      type: "select",
      choices: [
        { value: "mgKg", label: "50 mg/kg once daily (max 1 g)" },
        { value: "weightBand", label: "Weight band: 750 mg or 1 g" }
      ]
    },
    {
      id: "arfAmoxSchedule",
      label: "ARF amoxicillin schedule",
      type: "select",
      choices: [
        { value: "od", label: "Once daily (child 50 mg/kg; adult 1000 mg)" },
        { value: "bid", label: "Twice daily (child 25 mg/kg; adult 500 mg)" }
      ]
    }
  ],
  note: ({ selections, formulation, patientType }) => {
    const tabletNotice =
      formulation?.type === "tablet"
        ? patientType === "adult"
          ? `<br><br><strong>Adult capsule note:</strong> Fixed adult dosing can be used without entering weight.`
          : `<br><br><strong>Child capsule note:</strong> Weight is still required for this medicine even when capsule formulation is selected.`
        : "";

    if (selections.dosingType === "otitisMedia") {
      if (patientType === "adult") {
        return `
          <strong>Note:</strong> Acute otitis media dosing.<br><br>
          Adult: 1000 mg three times daily for 5 days.
          ${tabletNotice}
        `;
      }

      const childDose = selections.aomChildPathway === "severe" ? 30 : 15;
      return `
        <strong>Note:</strong> Acute otitis media dosing.<br><br>
        1. Initial treatment: 15 mg/kg per dose three times daily for 5 days.<br>
        2. Recent antibiotic treatment, severe infection, or recurrent infection: 30 mg/kg per dose three times daily for 5 days.<br><br>
        <strong>Selected pathway:</strong> ${childDose} mg/kg per dose.<br>
        Maximum single dose: 1000 mg.
        ${tabletNotice}
      `;
    }

    if (selections.dosingType === "acuteSinusitis") {
      return `
        <strong>Note:</strong> Acute sinusitis dosing.<br><br>
        Child: 25–30 mg/kg/dose three times daily for 7 days.<br>
        Adult: 500–1000 mg three times daily for 7 days.<br>
        Maximum single dose: 1000 mg.
        ${tabletNotice}
      `;
    }

   if (selections.dosingType === "strepA") {
  if (patientType === "adult") {
    return `
      <strong>Note:</strong> For the requested adult Strep A first-line pathway, select Penicillin V 500 mg twice daily for 10 days.
    `;
  }

  return `
    <strong>Note:</strong> Child Strep A dosing.<br><br>
    Option 1: 50 mg/kg once daily for 10 days (maximum 1000 mg per dose).<br>
    Option 2: under 30 kg, 750 mg once daily; 30 kg and over, 1000 mg once daily, for 10 days.<br>
    If the child swallows capsules, round to the nearest 250 mg.
    ${tabletNotice}
  `;
}

    if (selections.dosingType === "arf") {
      return patientType === "adult" ? `
        <strong>Note:</strong> Acute rheumatic fever - initial Strep A eradication.<br><br>
        Amoxicillin 1000 mg once daily for 10 days, or 500 mg twice daily for 10 days.
        ${tabletNotice}
      ` : `
        <strong>Note:</strong> Acute rheumatic fever - initial Strep A eradication.<br><br>
        Amoxicillin 50 mg/kg once daily for 10 days (maximum 1000 mg/day), or 25 mg/kg twice daily for 10 days (maximum 500 mg per dose).
        ${tabletNotice}
      `;
    }

    return `
      <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
      <strong>General Dosing:</strong><br>
      15–30 mg/kg three times daily.<br>
      Maximum single dose: 1000 mg.
      ${tabletNotice}
    `;
  },
  adultCalc: ({ selections }) => {
    const type = selections.dosingType || "general";

    if (type === "otitisMedia") {
      return {
        mode: "single",
        frequency: "Three times daily for 5 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 5,
        doseMg: 1000,
        maxDailyMg: 3000,
        warnings: [],
        extra: ["Adult acute otitis media regimen used."]
      };
    }

    if (type === "acuteSinusitis") {
      const doseLevel = selections.doseLevel || "low";

      if (doseLevel === "low") {
        return {
          mode: "single",
          frequency: "Three times daily for 7 days",
          sigFrequency: "three times daily",
          dosesPerDay: 3,
          defaultDurationDays: 7,
          doseMg: 500,
          maxDailyMg: 1500,
          warnings: [],
          extra: ["Adult acute sinusitis regimen used."]
        };
      }

      if (doseLevel === "high") {
        return {
          mode: "single",
          frequency: "Three times daily for 7 days",
          sigFrequency: "three times daily",
          dosesPerDay: 3,
          defaultDurationDays: 7,
          doseMg: 1000,
          maxDailyMg: 3000,
          warnings: [],
          extra: ["Adult acute sinusitis regimen used."]
        };
      }

      return {
        mode: "range",
        frequency: "Three times daily for 7 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 7,
        lowDoseMg: 500,
        highDoseMg: 1000,
        maxDailyMg: 3000,
        warnings: [],
        extra: [
          "Adult acute sinusitis regimen used.",
          "500 mg TDS to 1000 mg TDS for 7 days."
        ]
      };
    }

    if (type === "strepA") {
  return {
    mode: "single",
    frequency: "Once daily for 10 days",
    sigFrequency: "once daily",
    dosesPerDay: 1,
    defaultDurationDays: 10,
    doseMg: 1000,
    maxDailyMg: 1000,
    warnings: [],
    extra: ["Adult fixed-dose Strep A regimen used."]
  };
}

    if (type === "arf") {
      const twiceDaily = selections.arfAmoxSchedule === "bid";
      return {
        mode: "single",
        frequency: `${twiceDaily ? "Twice" : "Once"} daily for 10 days`,
        sigFrequency: twiceDaily ? "twice daily" : "once daily",
        dosesPerDay: twiceDaily ? 2 : 1,
        defaultDurationDays: 10,
        doseMg: twiceDaily ? 500 : 1000,
        maxDailyMg: 1000,
        warnings: [],
        extra: ["Adult acute rheumatic fever Strep A eradication regimen used."]
      };
    }

    return {
      mode: "single",
      frequency: "Three times daily",
      sigFrequency: "three times daily",
      dosesPerDay: 3,
      defaultDurationDays: null,
      doseMg: 500,
      maxDailyMg: 1500,
      warnings: [],
      extra: ["Adult fixed-dose regimen used."]
    };
  },
  calc: ({ weightKg, selections, formulation }) => {
    const type = selections.dosingType || "general";

    if (type === "otitisMedia") {
      const mgPerKg = selections.aomChildPathway === "severe" ? 30 : 15;
      const rawDose = weightKg * mgPerKg;
      const doseMg = Math.min(rawDose, 1000);
      const warnings = [];

      if (rawDose > 1000) warnings.push("Dose capped at max single dose of 1000 mg.");

      return {
        mode: "single",
        frequency: "Three times daily for 5 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 5,
        doseMg,
        maxDailyMg: doseMg * 3,
        warnings,
        extra: [
          `${mgPerKg} mg/kg/dose pathway used.`,
          `Daily total: ${formatMg(doseMg * 3)}`
        ]
      };
    }

    if (type === "acuteSinusitis") {
      const doseLevel = selections.doseLevel || "low";
      const lowRaw = weightKg * 25;
      const highRaw = weightKg * 30;
      const lowDose = Math.min(lowRaw, 1000);
      const highDose = Math.min(highRaw, 1000);
      const warnings = [];

      if (lowRaw > 1000 || highRaw > 1000) {
        warnings.push("Dose capped at max single dose of 1000 mg.");
      }

      if (doseLevel === "low") {
        return {
          mode: "single",
          frequency: "Three times daily for 7 days",
          sigFrequency: "three times daily",
          dosesPerDay: 3,
          defaultDurationDays: 7,
          doseMg: lowDose,
          maxDailyMg: lowDose * 3,
          warnings,
          extra: [`Daily total at this dose: ${formatMg(lowDose * 3)}`]
        };
      }

      if (doseLevel === "high") {
        return {
          mode: "single",
          frequency: "Three times daily for 7 days",
          sigFrequency: "three times daily",
          dosesPerDay: 3,
          defaultDurationDays: 7,
          doseMg: highDose,
          maxDailyMg: highDose * 3,
          warnings,
          extra: [`Daily total at this dose: ${formatMg(highDose * 3)}`]
        };
      }

      return {
        mode: "range",
        frequency: "Three times daily for 7 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 7,
        lowDoseMg: lowDose,
        highDoseMg: highDose,
        maxDailyMg: highDose * 3,
        warnings,
        extra: [
          `Daily total (low): ${formatMg(lowDose * 3)}`,
          `Daily total (high): ${formatMg(highDose * 3)}`
        ]
      };
    }

    if (type === "strepA") {
  const rawDose = weightKg * 50;
  const method = selections.amoxStrepMethod || "mgKg";
  const calculatedDose = method === "weightBand"
    ? (weightKg < 30 ? 750 : 1000)
    : Math.min(rawDose, 1000);
  const doseMg = formulation?.type === "tablet"
    ? Math.min(Math.round(calculatedDose / 250) * 250, 1000)
    : calculatedDose;
  const warnings = [];

  if (method === "mgKg" && rawDose > 1000) {
    warnings.push("Dose capped at the maximum of 1000 mg per dose.");
  }

  return {
    mode: "single",
    frequency: "Once daily for 10 days",
    sigFrequency: "once daily",
    dosesPerDay: 1,
    defaultDurationDays: 10,
    doseMg,
    maxDailyMg: doseMg,
    warnings,
    extra: [
      method === "weightBand"
        ? `Weight-band pathway selected (${weightKg < 30 ? "under 30 kg" : "30 kg and over"}).`
        : formulation?.type === "tablet"
          ? "Calculated at 50 mg/kg and rounded to the nearest 250 mg for capsules."
          : "Calculated at 50 mg/kg once daily.",
      `Daily total: ${formatMg(doseMg)}`
    ]
  };
}

    if (type === "arf") {
      const twiceDaily = selections.arfAmoxSchedule === "bid";
      const mgPerKg = twiceDaily ? 25 : 50;
      const maxDose = twiceDaily ? 500 : 1000;
      const rawDose = weightKg * mgPerKg;
      const doseMg = Math.min(rawDose, maxDose);
      const dosesPerDay = twiceDaily ? 2 : 1;
      return {
        mode: "single",
        frequency: `${twiceDaily ? "Twice" : "Once"} daily for 10 days`,
        sigFrequency: twiceDaily ? "twice daily" : "once daily",
        dosesPerDay,
        defaultDurationDays: 10,
        doseMg,
        maxDailyMg: doseMg * dosesPerDay,
        warnings: rawDose > maxDose ? [`Dose capped at max single dose of ${maxDose} mg.`] : [],
        extra: [`Calculated at ${mgPerKg} mg/kg per dose.`, `Daily total: ${formatMg(doseMg * dosesPerDay)}`]
      };
    }

    const doseLevel = selections.doseLevel || "low";
    const lowRaw = weightKg * 15;
    const highRaw = weightKg * 30;
    const lowDose = Math.min(lowRaw, 1000);
    const highDose = Math.min(highRaw, 1000);
    const warnings = [];

    if (lowRaw > 1000 || highRaw > 1000) {
      warnings.push("Dose capped at max single dose of 1000 mg.");
    }

    if (doseLevel === "low") {
      return {
        mode: "single",
        frequency: "Three times daily (every 8 hours)",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: null,
        doseMg: lowDose,
        maxDailyMg: lowDose * 3,
        warnings,
        extra: [`Daily total at this dose: ${formatMg(lowDose * 3)}`]
      };
    }

    if (doseLevel === "high") {
      return {
        mode: "single",
        frequency: "Three times daily (every 8 hours)",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: null,
        doseMg: highDose,
        maxDailyMg: highDose * 3,
        warnings,
        extra: [`Daily total at this dose: ${formatMg(highDose * 3)}`]
      };
    }

    return {
      mode: "range",
      frequency: "Three times daily (every 8 hours)",
      sigFrequency: "three times daily",
      dosesPerDay: 3,
      defaultDurationDays: null,
      lowDoseMg: lowDose,
      highDoseMg: highDose,
      maxDailyMg: highDose * 3,
      warnings,
      extra: [
        `Daily total (low): ${formatMg(lowDose * 3)}`,
        `Daily total (high): ${formatMg(highDose * 3)}`
      ]
    };
  }
},

    cefalexin: {
  label: "Cefalexin",
  age: { minMonths: 1, maxYears: 18 },
  strengths: [
  { id: "liq125", type: "liquid", strengthMg: 125, volumeMl: 5, label: "125 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "cap250", type: "tablet", strengthMg: 250, volumeMl: null, label: "250 mg capsule" },
  { id: "cap500", type: "tablet", strengthMg: 500, volumeMl: null, label: "500 mg capsule" },
],
  options: [
    {
      id: "dosingType",
      label: "Indication",
      type: "select",
      choices: [
        { value: "impetigo", label: "Impetigo" },
        { value: "generalInfection", label: "General Infection" }
      ]
    },
    {
      id: "cefalexinImpetigoSchedule",
      label: "Child impetigo indication",
      type: "select",
      choices: [
        { value: "extensive", label: "Extensive / topical treatment ineffective" },
        { value: "surroundingCellulitis", label: "Cellulitis surrounding lesion" }
      ]
    },
    {
      id: "doseLevel",
      label: "Dose Level",
      type: "select",
      choices: [
        { value: "low", label: "Low dose" },
        { value: "high", label: "High dose" },
        { value: "range", label: "Show both" }
      ]
    }
  ],
  note: ({ selections, formulation, patientType }) => {
    const tabletNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Adult capsule note:</strong> Fixed adult dosing can be used without entering weight.`
        : `<br><br><strong>Capsule note:</strong> Weight is still required for this medicine in children even when capsule formulation is selected.`
      : "";

    if (selections.dosingType === "impetigo") {
      if (patientType === "adult") {
        return `
          <strong>Note:</strong> For the requested adult impetigo pathway, select flucloxacillin 1 g four times daily with food for 5 days.
          ${IMPETIGO_CARE_NOTE}
        `;
      }

      return `
        <strong>Note:</strong> Child impetigo dosing.<br><br>
        Extensive disease or topical treatment ineffective: cefalexin 25 mg/kg per dose twice daily for 5 days.<br>
        Cellulitis surrounding the lesion: cefalexin 25 mg/kg per dose three times daily for 5 days.<br>
        Maximum single dose: 1000 mg (1 g).<br><br>
        Palatable suspension, well tolerated, funded.<br><br>
        <strong>Source:</strong> tewhatakura.nz
        ${IMPETIGO_CARE_NOTE}
        ${tabletNotice}
      `;
    }

    return `
      <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
      <strong>General Infection:</strong> 12.5–25 mg/kg four times daily (usual max 500 mg; up to 1 g may be used)<br><br>
      <strong>Source:</strong> tewhatakura.nz
      ${tabletNotice}
    `;
  },
  adultCalc: ({ selections }) => {
    const type = selections.dosingType || "impetigo";

    if (type === "impetigo") {
      return {
        mode: "single",
        frequency: "Twice daily for 5 days",
        sigFrequency: "twice daily",
        dosesPerDay: 2,
        defaultDurationDays: 5,
        doseMg: 500,
        maxDailyMg: 1000,
        warnings: [],
        extra: ["Adult fixed-dose regimen used.", "Source: tewhatakura.nz"]
      };
    }

    return {
      mode: "single",
      frequency: "Four times daily",
      sigFrequency: "four times daily",
      dosesPerDay: 4,
      defaultDurationDays: null,
      doseMg: 500,
      maxDailyMg: 2000,
      warnings: [],
      extra: ["Adult fixed-dose regimen used.", "Source: tewhatakura.nz"]
    };
  },
  calc: ({ weightKg, selections }) => {
    const type = selections.dosingType || "impetigo";
    const doseLevel = selections.doseLevel || "low";

    if (type === "impetigo") {
      const rawDose = weightKg * 25;
      const doseMg = Math.min(rawDose, 1000);
      const dosesPerDay = selections.cefalexinImpetigoSchedule === "surroundingCellulitis" ? 3 : 2;
      const warnings = [];

      if (rawDose > 1000) {
        warnings.push("Dose capped at max single dose of 1000 mg.");
      }

      return {
        mode: "single",
        frequency: `${dosesPerDay === 3 ? "Three times" : "Twice"} daily for 5 days`,
        sigFrequency: dosesPerDay === 3 ? "three times daily" : "twice daily",
        dosesPerDay,
        defaultDurationDays: 5,
        doseMg,
        maxDailyMg: doseMg * dosesPerDay,
        warnings,
        extra: [
          dosesPerDay === 3 ? "Cellulitis surrounding lesion pathway selected." : "Extensive/topical ineffective pathway selected.",
          `Daily total: ${formatMg(doseMg * dosesPerDay)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    const lowRaw = weightKg * 12.5;
    const highRaw = weightKg * 25;
    const lowDose = Math.min(lowRaw, 1000);
    const highDose = Math.min(highRaw, 1000);
    const warnings = [];

    if (lowRaw > 1000 || highRaw > 1000) {
      warnings.push("Dose capped at max single dose of 1000 mg.");
    }

    if (doseLevel === "low") {
      return {
        mode: "single",
        frequency: "Four times daily",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: null,
        doseMg: lowDose,
        maxDailyMg: lowDose * 4,
        warnings,
        extra: [
          `Daily total at this dose: ${formatMg(lowDose * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    if (doseLevel === "high") {
      return {
        mode: "single",
        frequency: "Four times daily",
        sigFrequency: "four times daily",
        dosesPerDay: 4,
        defaultDurationDays: null,
        doseMg: highDose,
        maxDailyMg: highDose * 4,
        warnings,
        extra: [
          `Daily total at this dose: ${formatMg(highDose * 4)}`,
          "Source: tewhatakura.nz"
        ]
      };
    }

    return {
      mode: "range",
      frequency: "Four times daily",
      sigFrequency: "four times daily",
      dosesPerDay: 4,
      defaultDurationDays: null,
      lowDoseMg: lowDose,
      highDoseMg: highDose,
      maxDailyMg: highDose * 4,
      warnings,
      extra: [
        `Daily total (low): ${formatMg(lowDose * 4)}`,
        `Daily total (high): ${formatMg(highDose * 4)}`,
        "Source: tewhatakura.nz"
      ]
    };
  }
},


    erythromycin: {
      label: "Erythromycin Ethylsuccinate",
      age: { minMonths: 1, maxYears: 120 },
      strengths: [
  { id: "liq200", type: "liquid", strengthMg: 200, volumeMl: 5, label: "200 mg / 5 mL" },
  { id: "liq400", type: "liquid", strengthMg: 400, volumeMl: 5, label: "400 mg / 5 mL" },
  { id: "tab400", type: "tablet", strengthMg: 400, volumeMl: null, label: "400 mg tablet" }
],
      options: [
        {
          id: "dosingType",
          label: "Dosing Type",
          type: "select",
          choices: [
            { value: "general", label: "General" },
            { value: "strepA", label: "Strep A" },
            { value: "impetigo", label: "Impetigo" },
            { value: "arf", label: "Acute rheumatic fever - beta-lactam allergy" }
          ]
        },
        {
          id: "doseLevel",
          label: "Dose Level",
          type: "select",
          choices: [
            { value: "low", label: "Low dose" },
            { value: "high", label: "High dose" },
            { value: "range", label: "Show both" }
          ]
        }
      ],
      note: ({ selections, formulation, patientType }) => {
        const tabletNotice = formulation?.type === "tablet"
          ? patientType === "adult"
            ? `<br><br><strong>Adult tablet note:</strong> Fixed adult dosing can be used without entering weight.`
            : `<br><br><strong>Tablet note:</strong> Weight is still required for child dosing unless an explicit fixed adult rule applies.`
          : "";

        if (selections.dosingType === "strepA") {
          return `
            <strong>Note:</strong> Strep A second-line treatment for penicillin allergy.<br><br>
            Children: 20 mg/kg per dose twice daily with food for 10 days (maximum 800 mg per dose).<br>
            Adults: 800 mg twice daily with food for 10 days.
            ${tabletNotice}
          `;
        }

        if (selections.dosingType === "impetigo") {
          return `
            <strong>Note:</strong> Penicillin allergy option for impetigo.<br><br>
            10 to 12.5 mg/kg per dose four times daily for 5 days (maximum 400 mg per dose).
            ${IMPETIGO_CARE_NOTE}
            ${tabletNotice}
          `;
        }

        if (selections.dosingType === "arf") {
          return `
            <strong>Note:</strong> Acute rheumatic fever - initial Strep A eradication for beta-lactam allergy.<br><br>
            Child: erythromycin 20 mg/kg per dose twice daily for 10 days.<br>
            Maximum daily dose: 1000 mg (maximum 500 mg per dose).<br><br>
            No adolescent/adult erythromycin regimen is specified in the supplied table.
            ${tabletNotice}
          `;
        }

        return `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br>
          This calculator is for erythromycin ethylsuccinate.<br><br>
          <strong>General Dosing:</strong><br>
          10–12.5 mg/kg every 6 hours
          ${tabletNotice}
        `;
      },
      adultCalc: ({ selections }) => {
        const type = selections.dosingType || "general";

        if (type === "strepA") {
          return {
            mode: "single",
            frequency: "Twice daily with food for 10 days",
            sigFrequency: "twice daily with food",
            dosesPerDay: 2,
            defaultDurationDays: 10,
            doseMg: 800,
            maxDailyMg: 1600,
            warnings: [],
            extra: ["Adult fixed-dose regimen used."]
          };
        }

        if (type === "impetigo") {
          return {
            mode: "single",
            frequency: "Four times daily for 5 days",
            sigFrequency: "four times daily",
            dosesPerDay: 4,
            defaultDurationDays: 5,
            doseMg: 400,
            maxDailyMg: 1600,
            warnings: [],
            extra: ["Adult fixed-dose regimen used."]
          };
        }

        if (type === "arf") {
          return {
            mode: "single",
            frequency: "",
            sigFrequency: "",
            dosesPerDay: null,
            defaultDurationDays: 10,
            doseMg: null,
            maxDailyMg: null,
            warnings: ["No adolescent/adult erythromycin regimen is specified in the supplied acute rheumatic fever table."],
            extra: []
          };
        }

        return {
          mode: "single",
          frequency: "Every 6 hours",
          sigFrequency: "every 6 hours",
          dosesPerDay: 4,
          defaultDurationDays: null,
          doseMg: 400,
          maxDailyMg: 1600,
          warnings: [],
          extra: ["Adult fixed-dose regimen used."]
        };
      },
      calc: ({ weightKg, ageMonths, selections }) => {
        const type = selections.dosingType || "general";

        if (type === "strepA") {
          const warnings = [];
          const rawDose = weightKg * 20;
          const perDose = Math.min(rawDose, 800);

          if (rawDose > 800) {
            warnings.push("Dose capped at the maximum of 800 mg per dose.");
          }

          return {
            mode: "single",
            frequency: "Twice daily with food for 10 days",
            sigFrequency: "twice daily with food",
            dosesPerDay: 2,
            defaultDurationDays: 10,
            doseMg: perDose,
            maxDailyMg: perDose * 2,
            warnings,
            extra: [
              "Calculated at 20 mg/kg per dose.",
              `Total daily dose: ${formatMg(perDose * 2)}`
            ]
          };
        }

        if (type === "arf") {
          const rawDose = weightKg * 20;
          const doseMg = Math.min(rawDose, 500);
          return {
            mode: "single",
            frequency: "Twice daily for 10 days",
            sigFrequency: "twice daily",
            dosesPerDay: 2,
            defaultDurationDays: 10,
            doseMg,
            maxDailyMg: doseMg * 2,
            warnings: rawDose > 500 ? ["Dose capped at 500 mg per dose (1000 mg/day)."] : [],
            extra: ["Calculated at 20 mg/kg per dose.", `Daily total: ${formatMg(doseMg * 2)}`]
          };
        }

        if (type === "impetigo") {
          const doseLevel = selections.doseLevel || "low";

          const lowRaw = weightKg * 10;
          const highRaw = weightKg * 12.5;
          const lowDose = Math.min(lowRaw, 400);
          const highDose = Math.min(highRaw, 400);
          const warnings = [];

          if (lowRaw > 400 || highRaw > 400) {
            warnings.push("Dose capped at max single dose of 400 mg.");
          }

          const frequency = "Four times daily for 5 days";
          const sigFrequency = "four times daily";
          const dosesPerDay = 4;

          if (doseLevel === "low") {
            const totalDaily = lowDose * 4;

            return {
              mode: "single",
              frequency,
              sigFrequency,
              dosesPerDay,
              defaultDurationDays: 5,
              doseMg: lowDose,
              maxDailyMg: totalDaily,
              warnings,
              extra: [`Daily total: ${formatMg(totalDaily)}`]
            };
          }

          if (doseLevel === "high") {
            const totalDaily = highDose * 4;

            return {
              mode: "single",
              frequency,
              sigFrequency,
              dosesPerDay,
              defaultDurationDays: 5,
              doseMg: highDose,
              maxDailyMg: totalDaily,
              warnings,
              extra: [`Daily total: ${formatMg(totalDaily)}`]
            };
          }

          const lowTotalDaily = lowDose * 4;
          const highTotalDaily = highDose * 4;

          return {
            mode: "range",
            frequency,
            sigFrequency,
            dosesPerDay,
            defaultDurationDays: 5,
            lowDoseMg: lowDose,
            highDoseMg: highDose,
            maxDailyMg: highTotalDaily,
            warnings,
            extra: [
              `Daily total (low): ${formatMg(lowTotalDaily)}`,
              `Daily total (high): ${formatMg(highTotalDaily)}`
            ]
          };
        }

        const doseLevel = selections.doseLevel || "low";
        const lowRaw = weightKg * 10;
        const highRaw = weightKg * 12.5;

        if (doseLevel === "low") {
          return {
            mode: "single",
            frequency: "Every 6 hours",
            sigFrequency: "every 6 hours",
            dosesPerDay: 4,
            defaultDurationDays: null,
            doseMg: lowRaw,
            maxDailyMg: lowRaw * 4,
            warnings: [],
            extra: [`Daily total at this dose: ${formatMg(lowRaw * 4)}`]
          };
        }

        if (doseLevel === "high") {
          return {
            mode: "single",
            frequency: "Every 6 hours",
            sigFrequency: "every 6 hours",
            dosesPerDay: 4,
            defaultDurationDays: null,
            doseMg: highRaw,
            maxDailyMg: highRaw * 4,
            warnings: [],
            extra: [`Daily total at this dose: ${formatMg(highRaw * 4)}`]
          };
        }

        return {
          mode: "range",
          frequency: "Every 6 hours",
          sigFrequency: "every 6 hours",
          dosesPerDay: 4,
          defaultDurationDays: null,
          lowDoseMg: lowRaw,
          highDoseMg: highRaw,
          maxDailyMg: highRaw * 4,
          warnings: [],
          extra: [
            `Daily total (low): ${formatMg(lowRaw * 4)}`,
            `Daily total (high): ${formatMg(highRaw * 4)}`
          ]
        };
      }
    },

    amoxClav: {
  label: "Amoxicillin + Clavulanic Acid",
  age: { minMonths: 1, maxYears: 18 },
  strengths: [
  { id: "liq125", type: "liquid", strengthMg: 125, volumeMl: 5, label: "125 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "tab500_125", type: "tablet", strengthMg: 500, clavulanateMg: 125, volumeMl: null, label: "500 mg + 125 mg tablet" }
],
  options: [
    {
      id: "dosingType",
      label: "Dosing Type",
      type: "select",
      choices: [
  { value: "general", label: "General" },
  { value: "cellulitis", label: "Cellulitis" },
  { value: "bites", label: "Bite wound" }
]
    },
    {
      id: "doseLevel",
      label: "Dose Level",
      type: "select",
      choices: [
        { value: "low", label: "Low dose" },
        { value: "high", label: "High dose" },
        { value: "range", label: "Show both" }
      ]
    }
  ],
  note: ({ selections, formulation, patientType }) => {
    const tabletNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Tablet note:</strong> Fixed adult dosing can be used for the cellulitis pathway without entering weight.`
        : `<br><br><strong>Tablet note:</strong> Weight is still required for this medicine even when tablet formulation is selected.`
      : "";
	  
	  if (selections.dosingType === "bites") {
  return `
    <strong>Note:</strong> Bite wound dosing.<br><br>
    Adult: 625 mg three times daily for 3 days with food.<br>
    Child: 30 mg/kg per dose three times daily for 3 days with food.<br>
    Child maximum single dose: 625 mg.
    ${tabletNotice}
  `;
}

    if (selections.dosingType === "cellulitis") {
      return `
        <strong>Note:</strong> Cellulitis dosing.<br><br>
        Adult: 625 mg three times daily for 5 days.
        ${tabletNotice}
      `;
    }

    return `
      <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
      Dose based on the <strong>amoxicillin component</strong>.<br>
      15–30 mg/kg three times daily.<br>
      Maximum single dose: 625 mg.
      ${tabletNotice}
    `;
  },
  adultCalc: ({ selections }) => {
    const type = selections.dosingType || "general";

if (type === "bites") {
  return {
    mode: "single",
    frequency: "Three times daily for 3 days, with food",
    sigFrequency: "three times daily with food",
    dosesPerDay: 3,
    defaultDurationDays: 3,
    doseMg: 625,
    maxDailyMg: 1875,
    warnings: [],
    extra: ["Adult bite wound regimen used."]
  };
}
    if (type === "cellulitis") {
      return {
        mode: "single",
        frequency: "Three times daily for 5 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 5,
        doseMg: 625,
        maxDailyMg: 1875,
        warnings: [],
        extra: ["Adult cellulitis regimen used."]
      };
    }

    return {
      mode: "single",
      frequency: "Three times daily",
      sigFrequency: "three times daily",
      dosesPerDay: 3,
      defaultDurationDays: null,
      doseMg: 625,
      maxDailyMg: 1875,
      warnings: [],
      extra: ["Adult fixed-dose regimen used."]
    };
  },
calc: ({ weightKg, selections, patientType }) => {
    const type = selections.dosingType || "general";
	
if (type === "bites") {
  const rawDose = weightKg * 30;
  const doseMg = Math.min(rawDose, 625);
  const warnings = [];

  if (patientType === "adult") {
    warnings.push("Adult bite regimen is 625 mg three times daily for 3 days with food. Select adult + tablet if using fixed adult dosing.");
  }

  if (rawDose > 625) {
    warnings.push("Dose capped at max single dose of 625 mg.");
  }

  return {
    mode: "single",
    frequency: "Three times daily for 3 days, with food",
    sigFrequency: "three times daily with food",
    dosesPerDay: 3,
    defaultDurationDays: 3,
    doseMg,
    maxDailyMg: doseMg * 3,
    warnings,
    extra: [`Daily total: ${formatMg(doseMg * 3)}`, "Bite wound regimen used."]
  };
}
    if (type === "cellulitis") {
      return {
        mode: "single",
        frequency: "Three times daily for 5 days",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: 5,
        doseMg: 625,
        maxDailyMg: 1875,
        warnings: [],
        extra: ["Adult cellulitis regimen used."]
      };
    }

    const doseLevel = selections.doseLevel || "low";
    const lowRaw = weightKg * 15;
    const highRaw = weightKg * 30;
    const lowDose = Math.min(lowRaw, 625);
    const highDose = Math.min(highRaw, 625);
    const warnings = [];

    if (lowRaw > 625 || highRaw > 625) {
      warnings.push("Dose capped at max single dose of 625 mg.");
    }

    if (doseLevel === "low") {
      return {
        mode: "single",
        frequency: "Three times daily",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: null,
        doseMg: lowDose,
        maxDailyMg: lowDose * 3,
        warnings,
        extra: [`Daily total at this dose: ${formatMg(lowDose * 3)}`]
      };
    }

    if (doseLevel === "high") {
      return {
        mode: "single",
        frequency: "Three times daily",
        sigFrequency: "three times daily",
        dosesPerDay: 3,
        defaultDurationDays: null,
        doseMg: highDose,
        maxDailyMg: highDose * 3,
        warnings,
        extra: [`Daily total at this dose: ${formatMg(highDose * 3)}`]
      };
    }

    return {
      mode: "range",
      frequency: "Three times daily",
      sigFrequency: "three times daily",
      dosesPerDay: 3,
      defaultDurationDays: null,
      lowDoseMg: lowDose,
      highDoseMg: highDose,
      maxDailyMg: highDose * 3,
      warnings,
      extra: [
        `Daily total (low): ${formatMg(lowDose * 3)}`,
        `Daily total (high): ${formatMg(highDose * 3)}`
      ]
    };
  }
},

   penicillinV: {
  label: "Penicillin V",
  age: { minMonths: 1, maxYears: 120 },
  strengths: [
  { id: "liq125", type: "liquid", strengthMg: 125, volumeMl: 5, label: "125 mg / 5 mL" },
  { id: "liq250", type: "liquid", strengthMg: 250, volumeMl: 5, label: "250 mg / 5 mL" },
  { id: "cap250", type: "tablet", strengthMg: 250, volumeMl: null, label: "250 mg capsule" },
  { id: "cap500", type: "tablet", strengthMg: 500, volumeMl: null, label: "500 mg capsule" }
],
  options: [
    {
      id: "dosingType",
      label: "Dosing Type",
      type: "select",
      choices: [
        { value: "strepA", label: "Strep A" },
        { value: "arf", label: "Acute rheumatic fever - Strep A eradication" }
      ]
    },
    {
      id: "strepFreq",
      label: "Child under 20 kg frequency",
      type: "select",
      choices: [
        { value: "bid", label: "Twice daily" },
        { value: "tid", label: "Three times daily" }
      ]
    }
  ],
  note: ({ selections, formulation, patientType }) => {
    const tabletNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Adult capsule note:</strong> Fixed adult dosing can be used without entering weight.`
        : `<br><br><strong>Child capsule note:</strong> Weight is still used for this pathway.`
      : "";

    if (selections.dosingType === "arf") {
      return patientType === "adult" ? `
        <strong>Note:</strong> Acute rheumatic fever - initial Strep A eradication.<br><br>
        Phenoxymethylpenicillin (Penicillin V) 500 mg twice daily for 10 days.
        ${tabletNotice}
      ` : `
        <strong>Note:</strong> Acute rheumatic fever - initial Strep A eradication.<br><br>
        Weight 20 kg or less: 250 mg twice daily for 10 days.<br>
        Weight over 20 kg: 500 mg twice daily for 10 days.
        ${tabletNotice}
      `;
    }

    return patientType === "adult" ? `
      <strong>Note:</strong> Adult Strep A first-line dosing.<br><br>
      Phenoxymethylpenicillin (Pen V) 500 mg twice daily for 10 days.<br><br>
      Take Pen V roughly 12 hours apart, e.g. morning and evening. If one dose is missed, take it when remembered unless the next dose is almost due. Do not double up. Continue the course until completed.
      ${tabletNotice}
    ` : `
      <strong>Note:</strong> Child Strep A first-line dosing.<br><br>
      Under 20 kg: Pen V 250 mg twice or three times daily for 10 days.<br>
      20 kg and over: Pen V 500 mg twice daily for 10 days.<br><br>
      For twice-daily dosing, take Pen V roughly 12 hours apart, e.g. morning and evening. If one dose is missed, take it when remembered unless the next dose is almost due. Do not double up. Continue the course until completed.
      ${tabletNotice}
    `;
  },
  adultCalc: () => {
    return {
      mode: "single",
      frequency: "Twice daily for 10 days",
      sigFrequency: "twice daily",
      dosesPerDay: 2,
      defaultDurationDays: 10,
      doseMg: 500,
      maxDailyMg: 1000,
      warnings: [],
      extra: [
        "Adult Strep A Pen V regimen used.",
        "Take doses roughly 12 hours apart, e.g. morning and evening.",
        "If one dose is missed, take it when remembered unless the next dose is almost due. Do not double up. Continue the course until completed."
      ]
    };
  },
  calc: ({ weightKg, selections }) => {
    const doseMg = selections.dosingType === "arf"
      ? (weightKg <= 20 ? 250 : 500)
      : (weightKg < 20 ? 250 : 500);
    const dosesPerDay = selections.dosingType !== "arf" && weightKg < 20 && selections.strepFreq === "tid" ? 3 : 2;

    return {
      mode: "single",
      frequency: `${dosesPerDay === 3 ? "Three times" : "Twice"} daily for 10 days`,
      sigFrequency: dosesPerDay === 3 ? "three times daily" : "twice daily",
      dosesPerDay,
      defaultDurationDays: 10,
      doseMg,
      maxDailyMg: doseMg * dosesPerDay,
      warnings: [],
      extra: [
        `Daily total: ${formatMg(doseMg * dosesPerDay)}`,
        dosesPerDay === 2 ? "Take doses roughly 12 hours apart, e.g. morning and evening." : "",
        "If one dose is missed, take it when remembered unless the next dose is almost due. Do not double up. Continue the course until completed."
      ].filter(Boolean)
    };
  }
},

       benzathinePenicillinIM: {
      label: "Benzathine Penicillin IM",
      age: { minMonths: 1, maxYears: 120 },
      strengths: [
        {
          id: "inj1200000",
          type: "liquid",
          strengthMg: 900,
          volumeMl: 2.3,
          doseStepMl: 0.01,
          label: "1,200,000 units / 2.3 mL prefilled syringe"
        }
      ],
      options: [{
        id: "dosingType",
        label: "Indication",
        type: "select",
        choices: [
          { value: "strepA", label: "Strep A" },
          { value: "arf", label: "Acute rheumatic fever - secondary prophylaxis" }
        ]
      }],
      note: ({ selections }) => selections.dosingType === "arf" ? `
        <strong>Note:</strong> Acute rheumatic fever - secondary antibiotic prophylaxis.<br><br>
        Weight under 20 kg: 600,000 units (450 mg) IM.<br>
        Weight 20 kg and over: 1,200,000 units (900 mg) IM.<br>
        Adolescent/adult: 1,200,000 units (900 mg) IM.
      ` : `
        <strong>Note:</strong> Strep A intramuscular treatment.<br><br>
        Single dose only.<br>
        Under 30 kg: 450 mg (600,000 U)<br>
        30 kg and over: 900 mg (1,200,000 U)<br><br>
        Consider low-dose lignocaine 2% 0.25 mL mixed with IM benzathine penicillin to reduce pain.
      `,
      adultCalc: ({ selections }) => ({
        mode: "single",
        frequency: "Single IM dose",
        sigFrequency: "once",
        dosesPerDay: 1,
        defaultDurationDays: 1,
        doseMg: 900,
        maxDailyMg: 900,
        warnings: [],
        extra: [`Equivalent dose: 1,200,000 U${selections.dosingType === "arf" ? " (ARF secondary prophylaxis)" : ""}`]
      }),
      calc: ({ weightKg, selections }) => {
        const thresholdKg = selections.dosingType === "arf" ? 20 : 30;
        const doseMg = weightKg < thresholdKg ? 450 : 900;
        const units = weightKg < thresholdKg ? "600,000 U" : "1,200,000 U";

        return {
          mode: "single",
          frequency: "Single IM dose",
          sigFrequency: "once",
          dosesPerDay: 1,
          defaultDurationDays: 1,
          doseMg,
          maxDailyMg: doseMg,
          warnings: [],
          extra: [`Equivalent dose: ${units}`]
        };
      }
    }
  };



  function buildCalculatorUI() {
    if (document.getElementById("doseCalculator")) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "calcToggleBtn";
    toggleBtn.type = "button";
    toggleBtn.innerHTML = "💊";
    toggleBtn.setAttribute("aria-label", "Open dose calculator");

    const panel = document.createElement("div");
    panel.id = "doseCalculator";
    panel.className = "hidden";

    panel.innerHTML = `
      <h3>Dose Calculator</h3>

      <label>Medication:
        <select id="medicationSelect">
          <option value="">-- Select Medication --</option>
          ${Object.entries(MEDS)
            .map(([key, med]) => `<option value="${key}">${med.label}</option>`)
            .join("")}
        </select>
      </label>

      <label>Patient Type:
        <select id="patientType">
          <option value="child">Child</option>
          <option value="adult">Adult</option>
        </select>
      </label>

      <label>Age (years):
        <input type="number" id="ageYears" min="0" step="0.1" />
      </label>

      <label>Weight (kg):
        <input type="number" id="weight" min="0" step="any" />
      </label>

      <label>Duration (days):
        <input type="number" id="durationDays" min="1" step="1" />
      </label>

      <div id="extraOptions" class="hidden"></div>
      <div id="medicationNote"></div>
      <div id="result"></div>
	  <button type="button" id="addDoseToPlanBtn">
  Add dose to Management/Plan
</button>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("hidden");
    });

    panel.addEventListener("change", (e) => {
      if (
        e.target.id === "medicationSelect" ||
        e.target.id === "dosingType" ||
        e.target.id === "patientType"
      ) {
        renderMedicationOptions();
        updatePatientFieldHints();
      }
      calculateDose();
    });

    panel.addEventListener("input", () => {
      calculateDose();
    });

    updatePatientFieldHints();
  }

  function renderMedicationOptions() {
    const medKey = document.getElementById("medicationSelect")?.value;
    const patientType = document.getElementById("patientType")?.value || "child";
    const extraDiv = document.getElementById("extraOptions");
    const noteDiv = document.getElementById("medicationNote");
    const resultBox = document.getElementById("result");

    if (!extraDiv || !noteDiv || !resultBox) return;

    const previousSelections = {};
   extraDiv.querySelectorAll("select, input").forEach((el) => {
  previousSelections[el.id] = el.value;
});

    extraDiv.innerHTML = "";
    noteDiv.innerHTML = "";
    resultBox.innerHTML = "";
    extraDiv.classList.add("hidden");

    if (!medKey || !MEDS[medKey]) return;

    const med = MEDS[medKey];
    const selections = { ...previousSelections };

    let html = "";

    if (med.strengths?.length) {
      const prevStrength = previousSelections.strengthSelect ?? med.strengths[0].id;
      html += `
        <label>Strength:
          <select id="strengthSelect">
            ${med.strengths
              .map((s) => `
                <option value="${s.id}" ${String(s.id) === String(prevStrength) ? "selected" : ""}>
                  ${s.label}
                </option>
              `)
              .join("")}
          </select>
        </label>
      `;
    }

    if (med.options?.length) {
      med.options.forEach((opt) => {
        if (opt.type === "hidden") return;

        const defaultChoice =
          opt.id === "doseLevel"
            ? "low"
            : (opt.choices?.length ? opt.choices[0].value : "");

        const currentValue = selections[opt.id] ?? defaultChoice;

        if (
  medKey === "amoxicillin" &&
  opt.id === "doseLevel" &&
  (selections.dosingType === "otitisMedia" || selections.dosingType === "strepA" || selections.dosingType === "arf")
) {
  return;
}

        if (
          medKey === "amoxicillin" &&
          opt.id === "aomChildPathway" &&
          (selections.dosingType !== "otitisMedia" || patientType === "adult")
        ) {
          return;
        }

        if (
          medKey === "amoxicillin" &&
          opt.id === "arfAmoxSchedule" &&
          selections.dosingType !== "arf"
        ) {
          return;
        }

        if (
          medKey === "amoxicillin" &&
          opt.id === "amoxStrepMethod" &&
          (selections.dosingType !== "strepA" || patientType === "adult")
        ) {
          return;
        }

        if (
          medKey === "penicillinV" &&
          opt.id === "strepFreq" &&
          (patientType === "adult" || selections.dosingType === "arf")
        ) {
          return;
        }

        if (
          medKey === "cefalexin" &&
          opt.id === "cefalexinImpetigoSchedule" &&
          (selections.dosingType !== "impetigo" || patientType === "adult")
        ) {
          return;
        }

        if (
          medKey === "amoxClav" &&
          opt.id === "doseLevel" &&
          (selections.dosingType === "bites" || selections.dosingType === "cellulitis")
        ) {
          return;
        }

        if (
          medKey === "cefalexin" &&
          opt.id === "doseLevel" &&
          selections.dosingType === "impetigo"
        ) {
          return;
        }

        if (medKey === "erythromycin") {
          if (opt.id === "doseLevel" && (selections.dosingType === "strepA" || selections.dosingType === "arf")) return;
        }

        

        if (opt.type === "select") {
  html += `
    <label>${opt.label}:
      <select id="${opt.id}">
        ${opt.choices
          .map((choice) => `
            <option value="${choice.value}" ${choice.value === currentValue ? "selected" : ""}>
              ${choice.label}
            </option>
          `)
          .join("")}
      </select>
    </label>
  `;
}

if (opt.type === "number") {
  const currentNumber = selections[opt.id] ?? "";
  html += `
    <label>${opt.label}:
      <input type="number" id="${opt.id}" min="0" step="any" value="${currentNumber}">
    </label>
  `;
}
      });
    }

    if (html) {
      extraDiv.innerHTML = html;
      extraDiv.classList.remove("hidden");
    }

    noteDiv.innerHTML = getMedicationNote(medKey);
  }

  function getMedicationSelections(medKey) {
    const med = MEDS[medKey];
    const selections = {};

    if (!med) return selections;

    if (med.options?.length) {
      med.options?.forEach((opt) => {
  const el = document.getElementById(opt.id);
  if (el) selections[opt.id] = el.value;
});
    }

    return selections;
  }

  function getSelectedStrengthForMed(medKey) {
    const med = MEDS[medKey];
    if (!med) return null;

    const strengthSelect = document.getElementById("strengthSelect");
    const selectedStrengthId = strengthSelect ? strengthSelect.value : "";

    return med.strengths?.find((s) => String(s.id) === String(selectedStrengthId)) || null;
  }

  function getMedicationNote(medKey) {
    const med = MEDS[medKey];
    if (!med) return "";

    const selections = getMedicationSelections(medKey);
    const selectedStrength = getSelectedStrengthForMed(medKey);
    const formulation = getFormulationInfo(selectedStrength);
    const patientType = document.getElementById("patientType")?.value || "child";

    if (typeof med.note === "function") {
      return med.note({
        selections,
        formulation,
        strength: selectedStrength,
        patientType
      });
    }

    return med.note || "";
  }
  
  function getEffectiveFormulation(medKey, result, selectedStrength) {
  if (
    medKey === "customMgKg" &&
    result?.customStrength &&
    isFinite(result.customStrength.mg) &&
    isFinite(result.customStrength.ml) &&
    result.customStrength.mg > 0 &&
    result.customStrength.ml > 0
  ) {
    return {
      type: "liquid",
      mgPerMl: result.customStrength.mg / result.customStrength.ml,
      strengthMg: result.customStrength.mg,
      volumeMl: result.customStrength.ml,
      doseStepMl: 0.5,
      label: `${result.customStrength.mg} mg / ${result.customStrength.ml} mL`
    };
  }

  return getFormulationInfo(selectedStrength);
}

  function calculateDose() {
    const medKey = document.getElementById("medicationSelect")?.value;
    const patientType = document.getElementById("patientType")?.value || "child";
    const ageValue = document.getElementById("ageYears")?.value?.trim() || "";
    const weightValue = document.getElementById("weight")?.value?.trim() || "";
    const durationValue = document.getElementById("durationDays")?.value?.trim() || "";
    const ageYears = parseFloat(ageValue);
    const ageMonths = isFinite(ageYears) ? ageYears * 12 : NaN;
    const weightKg = parseFloat(weightValue);
    const parsedDurationDays = parseFloat(durationValue);
    const durationDaysInput = isFinite(parsedDurationDays) && parsedDurationDays > 0
      ? parsedDurationDays
      : NaN;
    const resultBox = document.getElementById("result");
    const noteDiv = document.getElementById("medicationNote");

    if (!resultBox || !noteDiv) return;

    window.lastDoseForPlan = null;
    noteDiv.innerHTML = medKey ? getMedicationNote(medKey) : "";

    if (!medKey || !MEDS[medKey]) {
      resultBox.innerHTML = "";
      return;
    }

    const med = MEDS[medKey];
    const selections = getMedicationSelections(medKey);
    const selectedStrength = getSelectedStrengthForMed(medKey);
    const formulation = getFormulationInfo(selectedStrength);
    const isTabletFormulation = formulation && formulation.type === "tablet";
    const canUseAdultFixedDose =
      patientType === "adult" &&
      typeof med.adultCalc === "function";

    if (
      patientType === "adult" &&
      medKey === "amoxicillin" &&
      selections.dosingType === "strepA"
    ) {
      resultBox.innerHTML = `
        <div class="calcWarnings">
          <div>Adult Strep A first line: select Penicillin V 500 mg twice daily for 10 days.</div>
        </div>
      `;
      return;
    }

    if (
      patientType === "adult" &&
      medKey === "cefalexin" &&
      selections.dosingType === "impetigo"
    ) {
      resultBox.innerHTML = `
        <div class="calcWarnings">
          <div>Adult impetigo pathway: select flucloxacillin 1 g four times daily with food for 5 days.</div>
        </div>
      `;
      return;
    }

    if (
      (patientType !== "adult" && ageValue && (!isFinite(ageYears) || ageYears < 0)) ||
      (!canUseAdultFixedDose && weightValue && (!isFinite(weightKg) || weightKg <= 0))
    ) {
      resultBox.innerHTML = `
        <div class="calcWarnings">
          <div>Enter a non-negative age in years and a weight greater than 0 kg.</div>
        </div>
      `;
      return;
    }

    const warnings = [];

    if (patientType !== "adult" && !isNaN(ageMonths) && med.age) {
      const minMonths = med.age.minMonths ?? 0;
      const maxMonths = med.age.maxYears != null ? med.age.maxYears * 12 : Infinity;

      if (ageMonths < minMonths || ageMonths > maxMonths) {
        const minYears = minMonths / 12;
        warnings.push(
          `Age entered is outside the stated calculator range (${stripTrailingZero(minYears)} to ${med.age.maxYears} years).`
        );
      }
    }

    const hasValidWeight = isFinite(weightKg) && weightKg > 0;

    const canUseChildTabletRule =
      patientType === "child" &&
      isTabletFormulation &&
      typeof med.tabletAgeCalc === "function";

    let result = null;

if (canUseAdultFixedDose) {
  result = med.adultCalc({
    ageMonths,
    selections,
    formulation,
    strength: selectedStrength,
    patientType
  });
} else if (hasValidWeight && typeof med.calc === "function") {
  result = med.calc({
    weightKg,
    ageMonths,
    selections,
    formulation,
    strength: selectedStrength,
    patientType
  });
} else if (canUseChildTabletRule) {
  result = med.tabletAgeCalc({
    ageMonths,
    selections,
    formulation,
    strength: selectedStrength,
    patientType
  });
} else {
  resultBox.innerHTML = weightValue || isTabletFormulation
    ? `<div class="calcWarnings"><div>⚠ A valid weight is required for this selection unless an adult fixed-dose or child tablet rule exists for this medicine.</div></div>`
    : "";

  return;
}

if (result?.warnings?.length) {
  warnings.push(...result.warnings);
}


if (!result || !["single", "range"].includes(result.mode)) {
  resultBox.innerHTML = `
    <div class="calcWarnings">
      <div>⚠ Cannot calculate safely. Invalid dose result.</div>
    </div>
  `;
  return;
}

if (
  result.mode === "single" &&
  (!isFinite(result.doseMg) || result.doseMg <= 0)
) {
  resultBox.innerHTML = `
    <div class="calcWarnings">
      <div>⚠ Cannot calculate safely. Check weight, dose, indication, and strength.</div>
    </div>
  `;
  return;
}

if (
  result.mode === "range" &&
  (
    !isFinite(result.lowDoseMg) ||
    !isFinite(result.highDoseMg) ||
    result.lowDoseMg <= 0 ||
    result.highDoseMg <= 0 ||
    result.lowDoseMg > result.highDoseMg
  )
) {
  resultBox.innerHTML = `
    <div class="calcWarnings">
      <div>⚠ Cannot calculate safely. Check weight, dose range, indication, and strength.</div>
    </div>
  `;
  return;
}

const effectiveFormulation = getEffectiveFormulation(medKey, result, selectedStrength);

if (medKey === "customMgKg" && effectiveFormulation?.type !== "liquid") {
  resultBox.innerHTML = `
    <div class="calcWarnings">
      <div>⚠ Enter a valid suspension strength in mg and mL to calculate the administration volume.</div>
    </div>
  `;
  return;
}

resultBox.innerHTML = renderResult(result, effectiveFormulation, warnings, durationDaysInput);

window.lastDoseForPlan = {
  medication: MEDS[medKey]?.label || "",
  indication: selections.dosingType || "",
  doseMg: result.mode === "single" ? result.doseMg : null,
  lowDoseMg: result.mode === "range" ? result.lowDoseMg : null,
  highDoseMg: result.mode === "range" ? result.highDoseMg : null,
  mode: result.mode,
  frequency: result.sigFrequency || result.frequency || "",
  durationDays: result.defaultDurationDays || null,
  fullText: resultBox.innerText.trim()
};
}


  function renderResult(result, formulation, warnings, enteredDurationDays) {
    let html = "";

    if (result.mode === "single") {
      const primaryDose = getPrimaryDoseText(result.doseMg, formulation);

      html += `
        <div>Dose: <strong>${primaryDose}</strong></div>
        <div>Equivalent: <strong>${formatMg(result.doseMg)}</strong></div>
        <div>Frequency: <strong>${result.frequency}</strong></div>
      `;

      const script = buildScriptAndMitte({
        doseMg: result.doseMg,
        formulation,
        result,
        enteredDurationDays
      });

      if (script.direction) {
        html += `<br><div>Directions: <strong>${script.direction}</strong></div>`;
      }

      if (script.mitte) {
        html += `<div>Mitte: <strong>${script.mitte}</strong></div>`;
      }

      if (script.note) {
        html += `<div>${script.note}</div>`;
      }
    }

    if (result.mode === "range") {
      html += `
        <div>Low dose: <strong>${getPrimaryDoseText(result.lowDoseMg, formulation)}</strong></div>
        <div>Low equivalent: <strong>${formatMg(result.lowDoseMg)}</strong></div>
        <br>
        <div>High dose: <strong>${getPrimaryDoseText(result.highDoseMg, formulation)}</strong></div>
        <div>High equivalent: <strong>${formatMg(result.highDoseMg)}</strong></div>
        <div>Frequency: <strong>${result.frequency}</strong></div>
      `;

      const lowScript = buildScriptAndMitte({
        doseMg: result.lowDoseMg,
        formulation,
        result,
        enteredDurationDays
      });

      const highScript = buildScriptAndMitte({
        doseMg: result.highDoseMg,
        formulation,
        result,
        enteredDurationDays
      });

      if (lowScript.direction) {
        html += `<br><div>Low directions: <strong>${lowScript.direction}</strong></div>`;
      }
      if (lowScript.mitte) {
        html += `<div>Low mitte: <strong>${lowScript.mitte}</strong></div>`;
      }

      if (highScript.direction) {
        html += `<br><div>High directions: <strong>${highScript.direction}</strong></div>`;
      }
      if (highScript.mitte) {
        html += `<div>High mitte: <strong>${highScript.mitte}</strong></div>`;
      }

      if (lowScript.note) {
        html += `<div>${lowScript.note}</div>`;
      }
    }

    if (result.maxDailyMg != null) {
      html += `<div>Max daily total shown here: <strong>${formatMg(result.maxDailyMg)}</strong></div>`;
    }

    if (result.extra?.length) {
      html += `<br>${result.extra.map((line) => `<div>${line}</div>`).join("")}`;
    }

    if (warnings.length) {
      html += `
        <br>
        <div class="calcWarnings">
          ${warnings.map((w) => `<div>⚠ ${w}</div>`).join("")}
        </div>
      `;
    }

    return html;
  }

  function getFormulationInfo(strength) {
  if (!strength) return null;

  const label = String(strength.label || "").toLowerCase();

  // New safer format
  if (strength.type === "liquid") {
    const strengthMg = Number(strength.strengthMg);
    const volumeMl = Number(strength.volumeMl);

    if (!isFinite(strengthMg) || !isFinite(volumeMl) || strengthMg <= 0 || volumeMl <= 0) {
      return null;
    }

    return {
      type: "liquid",
      mgPerMl: strengthMg / volumeMl,
      strengthMg,
      volumeMl,
      doseStepMl: Number(strength.doseStepMl) || 0.5,
      label: strength.label
    };
  }

  if (strength.type === "tablet") {
  const strengthMg = Number(strength.strengthMg);
  const clavulanateMg = Number(strength.clavulanateMg || 0);
  const unitTotalMg = strengthMg + clavulanateMg;

  if (!isFinite(strengthMg) || strengthMg <= 0) {
    return null;
  }

  return {
    type: "tablet",
    mgPerUnit: unitTotalMg,
    strengthMg,
    clavulanateMg,
    unitTotalMg,
    label: strength.label
  };
}

  // Backward compatibility for old format
  if (label.includes("mg / 5 ml") || label.includes("mg/5ml")) {
    return {
      type: "liquid",
      mgPerMl: Number(strength.value) / 5,
      strengthMg: Number(strength.value),
      volumeMl: 5,
      label: strength.label
    };
  }

  if (label.includes("tablet") || label.includes("capsule")) {
    return {
      type: "tablet",
      mgPerUnit: Number(strength.value),
      strengthMg: Number(strength.value),
      label: strength.label
    };
  }

  return null;
}

  function buildScriptAndMitte({ doseMg, formulation, result, enteredDurationDays }) {
    const dosesPerDay = result.dosesPerDay;
    const sigFrequency = result.sigFrequency || result.frequency || "";
    const directionDoseText = getDirectionDoseText(doseMg, formulation);

    if (!directionDoseText || doseMg == null || !isFinite(doseMg)) {
      return {
        direction: null,
        mitte: null,
        note: "Strength or dose is not yet available, so directions and dispense quantity cannot be calculated."
      };
    }

    const chosenDuration = getChosenDuration(result, enteredDurationDays);
    const durationText = getDurationText(result, enteredDurationDays);
    const isIM = /single im dose/i.test(result.frequency || "");

    let direction = "";

    if (isIM) {
      direction = `Administer ${directionDoseText} intramuscularly once`;
    } else {
      direction = durationText
        ? `Take ${directionDoseText} orally ${sigFrequency} for ${durationText}`
        : `Take ${directionDoseText} orally ${sigFrequency}`;
    }

    let mitte = null;
    let note = null;

    if (formulation && dosesPerDay && chosenDuration != null) {
      const quantity = calculateTotalQuantity(doseMg, formulation, dosesPerDay, chosenDuration);
      mitte = formatDispense(quantity, formulation);
    } else if (formulation && dosesPerDay && result.durationRangeDays && !isFinite(enteredDurationDays)) {
      const [minDays, maxDays] = result.durationRangeDays;
      const minQty = calculateTotalQuantity(doseMg, formulation, dosesPerDay, minDays);
      const maxQty = calculateTotalQuantity(doseMg, formulation, dosesPerDay, maxDays);
      mitte = `Dispense ${formatDispenseRange(minQty, maxQty, formulation)}`;
    } else if (formulation && dosesPerDay && !result.defaultDurationDays && !result.durationRangeDays) {
      note = "Enter duration in days to calculate mitte.";
    }

    return { direction, mitte, note };
  }

  function getDirectionDoseText(doseMg, formulation) {
    return getPrimaryDoseText(doseMg, formulation);
  }

  function getChosenDuration(result, enteredDurationDays) {
    if (isFinite(enteredDurationDays) && enteredDurationDays > 0) return enteredDurationDays;
    if (isFinite(result.defaultDurationDays) && result.defaultDurationDays > 0) return result.defaultDurationDays;
    return null;
  }

  function getDurationText(result, enteredDurationDays) {
    if (isFinite(enteredDurationDays) && enteredDurationDays > 0) {
      return `${enteredDurationDays} day${enteredDurationDays === 1 ? "" : "s"}`;
    }

    if (isFinite(result.defaultDurationDays) && result.defaultDurationDays > 0) {
      return `${result.defaultDurationDays} day${result.defaultDurationDays === 1 ? "" : "s"}`;
    }

    if (Array.isArray(result.durationRangeDays) && result.durationRangeDays.length === 2) {
      return `${result.durationRangeDays[0]} to ${result.durationRangeDays[1]} days`;
    }

    return "";
  }

  function calculateTotalQuantity(doseMg, formulation, dosesPerDay, durationDays) {
    const rounded = getRoundedQuantityPerDose(doseMg, formulation);
    if (!isFinite(rounded.value)) return NaN;
    return rounded.value * dosesPerDay * durationDays;
  }

  function formatDispense(quantity, formulation) {
    if (!isFinite(quantity)) return null;

    if (formulation.type === "liquid") {
      return `Dispense ${formatMlQuantity(quantity, formulation.doseStepMl)}`;
    }

    if (formulation.type === "tablet") {
      return `Dispense ${formatTabletQuantity(quantity, formulation)}`;
    }

    return null;
  }

  function formatDispenseRange(minQty, maxQty, formulation) {
    if (!isFinite(minQty) || !isFinite(maxQty)) return "-";

    if (formulation.type === "liquid") {
      return `${formatMlQuantity(minQty, formulation.doseStepMl)} to ${formatMlQuantity(maxQty, formulation.doseStepMl)}`;
    }

    if (formulation.type === "tablet") {
      return `${formatTabletQuantity(minQty, formulation)} to ${formatTabletQuantity(maxQty, formulation)}`;
    }

    return "-";
  }

  function getPrimaryDoseText(doseMg, formulation) {
    if (!isFinite(doseMg)) return "-";
    if (!formulation) return formatMg(doseMg);

    if (formulation.type === "liquid") {
      if (!isFinite(formulation.mgPerMl) || formulation.mgPerMl <= 0) return "-";
      const rawMl = doseMg / formulation.mgPerMl;
      const roundedMl = roundLiquidDoseMl(rawMl, formulation.doseStepMl);
      return `${formatNumberForStep(roundedMl, formulation.doseStepMl)} mL`;
    }

    if (formulation.type === "tablet") {
      if (!isFinite(formulation.mgPerUnit) || formulation.mgPerUnit <= 0) return "-";
      const rawUnits = doseMg / formulation.mgPerUnit;
      const roundedUnits = roundTabletDose(rawUnits);
      const unitLabel = formulation.label.toLowerCase().includes("capsule") ? "capsule" : "tablet";
      return `${stripTrailingZero(roundedUnits)} ${unitLabel}${roundedUnits === 1 ? "" : "s"}`;
    }

    return formatMg(doseMg);
  }

  function getRoundedQuantityPerDose(doseMg, formulation) {
    if (!formulation || !isFinite(doseMg)) return { value: NaN, unit: null };

    if (formulation.type === "liquid") {
      if (!isFinite(formulation.mgPerMl) || formulation.mgPerMl <= 0) {
        return { value: NaN, unit: "mL" };
      }
      const rawMl = doseMg / formulation.mgPerMl;
      return { value: roundLiquidDoseMl(rawMl, formulation.doseStepMl), unit: "mL" };
    }

    if (formulation.type === "tablet") {
      if (!isFinite(formulation.mgPerUnit) || formulation.mgPerUnit <= 0) {
        return { value: NaN, unit: "tablet" };
      }
      const rawUnits = doseMg / formulation.mgPerUnit;
      return { value: roundTabletDose(rawUnits), unit: "tablet" };
    }

    return { value: NaN, unit: null };
  }

  function roundLiquidDoseMl(value, doseStepMl = 0.5) {
    if (!isFinite(value) || !isFinite(doseStepMl) || doseStepMl <= 0) return NaN;
    return Math.round(value / doseStepMl) * doseStepMl;
  }

  function roundTabletDose(value) {
    if (!isFinite(value)) return NaN;
    return Math.round(value * 2) / 2;
  }

  function formatMg(value) {
    if (!isFinite(value)) return "-";
    if (Math.abs(value - Math.round(value)) < 0.001) return `${Math.round(value)} mg`;
    return `${value.toFixed(1)} mg`;
  }

  function formatMlQuantity(value, doseStepMl = 0.5) {
    if (!isFinite(value)) return "-";
    const rounded = doseStepMl < 0.1
      ? roundLiquidDoseMl(value, doseStepMl)
      : roundToOne(value);
    return `${formatNumberForStep(rounded, doseStepMl < 0.1 ? doseStepMl : 0.1)} mL`;
  }

  function formatTabletQuantity(value, formulation) {
    if (!isFinite(value)) return "-";
    const rounded = roundToHalf(value);
    const unitLabel = formulation?.label?.toLowerCase().includes("capsule") ? "capsule" : "tablet";
    return `${stripTrailingZero(rounded)} ${unitLabel}${rounded === 1 ? "" : "s"}`;
  }

  function roundToHalf(value) {
    return Math.round(value * 2) / 2;
  }

  function roundToOne(value) {
    return Math.round(value * 10) / 10;
  }

  function stripTrailingZero(value) {
    return Number.isInteger(value) ? String(value) : String(value.toFixed(1));
  }

  function formatNumberForStep(value, step) {
    if (!isFinite(value)) return "-";
    const decimalPlaces = step < 0.1 ? 2 : 1;
    return value.toFixed(decimalPlaces).replace(/\.?0+$/, "");
  }

  function roundToNearest75(value) {
    if (!isFinite(value)) return 0;
    return Math.round(value / 75) * 75;
  }
  
  window.prefillDoseCalculator = function ({ medKey, dosingType, patientType, strengthId } = {}) {
  const panel = document.getElementById("doseCalculator");
  const medSelect = document.getElementById("medicationSelect");
  const patientTypeSelect = document.getElementById("patientType");

  if (!panel || !medSelect) return;

  panel.classList.remove("hidden");

  if (!medKey || !MEDS[medKey]) return;

  if (patientTypeSelect && patientType) {
    patientTypeSelect.value = patientType;
  }

  medSelect.value = medKey;
  renderMedicationOptions();

  setTimeout(() => {
    const dosingSelect = document.getElementById("dosingType");

    if (dosingSelect && dosingType) {
      dosingSelect.value = dosingType;
    }

    renderMedicationOptions();

    const strengthSelect = document.getElementById("strengthSelect");
    if (strengthSelect && strengthId) {
      strengthSelect.value = strengthId;
    }

    updatePatientFieldHints();
    calculateDose();
  }, 0);
};

  function updatePatientFieldHints() {
    const patientType = document.getElementById("patientType")?.value || "child";
    const ageLabel = document.getElementById("ageYears")?.closest("label");
    const weightLabel = document.getElementById("weight")?.closest("label");
    const medKey = document.getElementById("medicationSelect")?.value || "";
    const hasAdultFixedDose =
      patientType === "adult" &&
      typeof MEDS[medKey]?.adultCalc === "function";

    if (!ageLabel || !weightLabel) return;

    if (patientType === "adult") {
      ageLabel.style.display = "none";
      weightLabel.style.display = hasAdultFixedDose ? "none" : "";
      weightLabel.style.opacity = hasAdultFixedDose ? "1" : "0.7";
    } else {
      ageLabel.style.display = "";
      weightLabel.style.display = "";
      ageLabel.style.opacity = "1";
      weightLabel.style.opacity = "1";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalculatorUI);
  } else {
    buildCalculatorUI();
  }
  
  document.addEventListener("click", (e) => {
  if (e.target.id !== "addDoseToPlanBtn") return;

 if (!window.lastDoseForPlan?.fullText && !window.lastDoseForPlan?.doseMg) {
  alert("No dose result to add yet.");
  return;
}

  window.dispatchEvent(new CustomEvent("dose:addToPlan", {
    detail: window.lastDoseForPlan
  }));
});
})();
