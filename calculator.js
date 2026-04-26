(function () {
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

    return {
      mode: "single",
      frequency: selections.customDays
        ? `${frequency} for ${selections.customDays} days`
        : frequency,
      sigFrequency,
      dosesPerDay,
      defaultDurationDays: isFinite(parseFloat(selections.customDays))
        ? parseFloat(selections.customDays)
        : null,
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
        25 mg/kg/dose four times daily (maximum 1 g per dose) for 5 days.<br><br>
        Can be taken with fruit juice.<br><br>
        <strong>Source:</strong> tewhatakura.nz
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
        frequency: "4 times daily for 5 days",
        sigFrequency: "four times daily",
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
        { value: "otitisMedia", label: "Otitis Media" },
        { value: "acuteSinusitis", label: "Acute Sinusitis" },
        { value: "strepA", label: "Strep A" }
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
    const tabletNotice =
      formulation?.type === "tablet"
        ? patientType === "adult"
          ? `<br><br><strong>Adult capsule note:</strong> Fixed adult dosing can be used without entering weight.`
          : `<br><br><strong>Child capsule note:</strong> Weight is still required for this medicine even when capsule formulation is selected.`
        : "";

    if (selections.dosingType === "otitisMedia") {
      return `
        <strong>Note:</strong> Otitis media dosing.<br><br>
        15 mg/kg/dose three times daily for 5 days.<br>
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
  return `
    <strong>Note:</strong> Strep A dosing.<br><br>
    Oral 50 mg/kg once daily (maximum daily dose 1000 mg).<br><br>
    Weight under 30 kg: 750 mg once daily for 10 days.<br>
    Weight 30 kg and over: 1000 mg once daily for 10 days.
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
        doseMg: 500,
        maxDailyMg: 1500,
        warnings: [],
        extra: ["Adult fixed-dose regimen used."]
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
  calc: ({ weightKg, selections }) => {
    const type = selections.dosingType || "general";

    if (type === "otitisMedia") {
      const rawDose = weightKg * 15;
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
        extra: [`Daily total: ${formatMg(doseMg * 3)}`]
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
  let doseMg = weightKg < 30 ? 750 : 1000;
  const warnings = [];

  if (rawDose > 1000) {
    warnings.push("Calculated dose exceeds maximum daily dose, so dose capped at 1000 mg once daily.");
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
      "50 mg/kg once daily pathway selected.",
      `Daily total: ${formatMg(doseMg)}`
    ]
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
      return `
        <strong>Note:</strong> Impetigo dosing.<br><br>
        25 mg/kg twice daily (maximum 1 g per dose) for 5 days.<br><br>
        Palatable suspension, well tolerated, funded.<br><br>
        <strong>Source:</strong> tewhatakura.nz
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
      const warnings = [];

      if (rawDose > 1000) {
        warnings.push("Dose capped at max single dose of 1000 mg.");
      }

      return {
        mode: "single",
        frequency: "Twice daily for 5 days",
        sigFrequency: "twice daily",
        dosesPerDay: 2,
        defaultDurationDays: 5,
        doseMg,
        maxDailyMg: doseMg * 2,
        warnings,
        extra: [
          `Daily total: ${formatMg(doseMg * 2)}`,
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
            { value: "impetigo", label: "Impetigo" }
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
          id: "eryStrepFreq",
          label: "Strep A Frequency",
          type: "select",
          choices: [
            { value: "bid", label: "2 divided doses" },
            { value: "tid", label: "3 divided doses" }
          ]
        },
        {
          id: "eryImpFreq",
          label: "Impetigo Schedule",
          type: "select",
          choices: [
            { value: "qid", label: "4 times daily" },
            { value: "bid", label: "2 divided doses" }
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
            <strong>Note:</strong> Strep A first-line alternative if concern about IgE mediated or anaphylactic beta-lactam allergy.<br><br>
            Children: 40 mg/kg/day in 2 to 3 divided doses (maximum daily dose 1600 mg) for 10 days.<br>
            Adults: 800 mg twice daily for 10 days.
            ${tabletNotice}
          `;
        }

        if (selections.dosingType === "impetigo") {
          return `
            <strong>Note:</strong> Penicillin allergy option for impetigo.<br><br>
            10 to 12.5 mg/kg/dose four times a day (maximum 400 mg per dose).<br>
            Total daily dose may be given in 2 divided doses.
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
            frequency: "Twice daily for 10 days",
            sigFrequency: "twice daily",
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
            frequency: "Four times daily",
            sigFrequency: "four times daily",
            dosesPerDay: 4,
            defaultDurationDays: null,
            doseMg: 400,
            maxDailyMg: 1600,
            warnings: [],
            extra: ["Adult fixed-dose regimen used."]
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
          const ageYears = isFinite(ageMonths) ? ageMonths / 12 : null;

          if (ageYears !== null && ageYears >= 18) {
            const doseMg = 800;
            return {
              mode: "single",
              frequency: "Twice daily for 10 days",
              sigFrequency: "twice daily",
              dosesPerDay: 2,
              defaultDurationDays: 10,
              doseMg,
              maxDailyMg: 1600,
              warnings,
              extra: [`Daily total: ${formatMg(1600)}`]
            };
          }

          const dailyRaw = weightKg * 40;
          const dailyDose = Math.min(dailyRaw, 1600);
          const divided = selections.eryStrepFreq === "tid" ? 3 : 2;
          const perDose = dailyDose / divided;

          if (dailyRaw > 1600) {
            warnings.push("Total daily dose capped at 1600 mg/day.");
          }

          return {
            mode: "single",
            frequency: `${divided} divided doses daily for 10 days`,
            sigFrequency: divided === 3 ? "three times daily" : "twice daily",
            dosesPerDay: divided,
            defaultDurationDays: 10,
            doseMg: perDose,
            maxDailyMg: dailyDose,
            warnings,
            extra: [
              `Total daily dose: ${formatMg(dailyDose)}`,
              `Divided into ${divided} doses`
            ]
          };
        }

        if (type === "impetigo") {
          const doseLevel = selections.doseLevel || "low";
          const impFreq = selections.eryImpFreq || "qid";

          const lowRaw = weightKg * 10;
          const highRaw = weightKg * 12.5;
          const lowDose = Math.min(lowRaw, 400);
          const highDose = Math.min(highRaw, 400);
          const warnings = [];

          if (lowRaw > 400 || highRaw > 400) {
            warnings.push("Dose capped at max single dose of 400 mg.");
          }

          const frequency = impFreq === "bid"
            ? "Twice daily (using total daily dose split into 2 doses)"
            : "Four times daily";

          const sigFrequency = impFreq === "bid" ? "twice daily" : "four times daily";
          const dosesPerDay = impFreq === "bid" ? 2 : 4;

          if (doseLevel === "low") {
            const totalDaily = lowDose * 4;
            const shownDose = impFreq === "bid" ? totalDaily / 2 : lowDose;

            return {
              mode: "single",
              frequency,
              sigFrequency,
              dosesPerDay,
              defaultDurationDays: null,
              doseMg: shownDose,
              maxDailyMg: totalDaily,
              warnings,
              extra: [`Daily total: ${formatMg(totalDaily)}`]
            };
          }

          if (doseLevel === "high") {
            const totalDaily = highDose * 4;
            const shownDose = impFreq === "bid" ? totalDaily / 2 : highDose;

            return {
              mode: "single",
              frequency,
              sigFrequency,
              dosesPerDay,
              defaultDurationDays: null,
              doseMg: shownDose,
              maxDailyMg: totalDaily,
              warnings,
              extra: [`Daily total: ${formatMg(totalDaily)}`]
            };
          }

          const lowTotalDaily = lowDose * 4;
          const highTotalDaily = highDose * 4;
          const lowShownDose = impFreq === "bid" ? lowTotalDaily / 2 : lowDose;
          const highShownDose = impFreq === "bid" ? highTotalDaily / 2 : highDose;

          return {
            mode: "range",
            frequency,
            sigFrequency,
            dosesPerDay,
            defaultDurationDays: null,
            lowDoseMg: lowShownDose,
            highDoseMg: highShownDose,
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
    const tabletNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Tablet note:</strong> Fixed adult dosing can be used for the cellulitis pathway without entering weight.`
        : `<br><br><strong>Tablet note:</strong> Weight is still required for this medicine even when tablet formulation is selected.`
      : "";

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
  calc: ({ weightKg, selections }) => {
    const type = selections.dosingType || "general";

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
        { value: "strepA", label: "Strep A" }
      ]
    },
    {
      id: "strepFreq",
      label: "Frequency",
      type: "select",
      choices: [
        { value: "bid", label: "2 times daily" },
        { value: "tid", label: "3 times daily" }
      ]
    }
  ],
  note: ({ formulation, patientType }) => {
    const tabletNotice = formulation?.type === "tablet"
      ? patientType === "adult"
        ? `<br><br><strong>Adult capsule note:</strong> Fixed adult dosing can be used without entering weight.`
        : `<br><br><strong>Child capsule note:</strong> Weight is still used for this pathway.`
      : "";

    return `
      <strong>Note:</strong> Strep A dosing for 10 days.<br><br>
      Children under 20 kg: 250 mg 2 or 3 times daily for 10 days.<br>
      Children and adults over 20 kg: 500 mg 2 or 3 times daily for 10 days.
      ${tabletNotice}
    `;
  },
  adultCalc: ({ selections }) => {
    const dosesPerDay = selections.strepFreq === "tid" ? 3 : 2;
    const frequency = dosesPerDay === 3 ? "3 times daily for 10 days" : "2 times daily for 10 days";

    return {
      mode: "single",
      frequency,
      sigFrequency: dosesPerDay === 3 ? "three times daily" : "twice daily",
      dosesPerDay,
      defaultDurationDays: 10,
      doseMg: 500,
      maxDailyMg: 500 * dosesPerDay,
      warnings: [],
      extra: ["Adult fixed-dose regimen used."]
    };
  },
  calc: ({ weightKg, selections }) => {
    const doseMg = weightKg < 20 ? 250 : 500;
    const dosesPerDay = selections.strepFreq === "tid" ? 3 : 2;
    const frequency = dosesPerDay === 3 ? "3 times daily for 10 days" : "2 times daily for 10 days";

    return {
      mode: "single",
      frequency,
      sigFrequency: dosesPerDay === 3 ? "three times daily" : "twice daily",
      dosesPerDay,
      defaultDurationDays: 10,
      doseMg,
      maxDailyMg: doseMg * dosesPerDay,
      warnings: [],
      extra: [`Daily total: ${formatMg(doseMg * dosesPerDay)}`]
    };
  }
},

       benzathinePenicillinIM: {
      label: "Benzathine Penicillin IM",
      age: { minMonths: 1, maxYears: 120 },
      strengths: [
        { id: "inj1200000", value: 1016.6, label: "1,200,000 units / 2.3 mL prefilled syringe" }
      ],
      note: `
        <strong>Note:</strong> Strep A intramuscular treatment.<br><br>
        Single dose only.<br>
        Under 30 kg: 450 mg (600,000 U)<br>
        30 kg and over: 900 mg (1,200,000 U)<br><br>
        Consider low-dose lignocaine 2% 0.25 mL mixed with IM benzathine penicillin to reduce pain.
      `,
      calc: ({ weightKg }) => {
        const doseMg = weightKg < 30 ? 450 : 900;
        const units = weightKg < 30 ? "600,000 U" : "1,200,000 U";

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

      <label>Age (months):
        <input type="number" id="ageMonths" min="0" step="1" />
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
        e.target.id === "roxMode" ||
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
          opt.id === "doseLevel" || opt.id === "roxDoseLevel"
            ? "low"
            : (opt.choices?.length ? opt.choices[0].value : "");

        const currentValue = selections[opt.id] ?? defaultChoice;

        if (
  medKey === "amoxicillin" &&
  opt.id === "doseLevel" &&
  (selections.dosingType === "otitisMedia" || selections.dosingType === "strepA")
) {
  return;
}

        if (medKey === "erythromycin") {
          if (opt.id === "doseLevel" && selections.dosingType === "strepA") return;
          if (opt.id === "eryStrepFreq" && selections.dosingType !== "strepA") return;
          if (opt.id === "eryImpFreq" && selections.dosingType !== "impetigo") return;
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
      label: `${result.customStrength.mg} mg / ${result.customStrength.ml} mL`
    };
  }

  return getFormulationInfo(selectedStrength);
}

  function calculateDose() {
    const medKey = document.getElementById("medicationSelect")?.value;
    const patientType = document.getElementById("patientType")?.value || "child";
    const ageMonths = parseFloat(document.getElementById("ageMonths")?.value);
    const weightKg = parseFloat(document.getElementById("weight")?.value);
    const durationDaysInput = parseFloat(document.getElementById("durationDays")?.value);
    const resultBox = document.getElementById("result");
    const noteDiv = document.getElementById("medicationNote");

    if (!resultBox || !noteDiv) return;

    noteDiv.innerHTML = medKey ? getMedicationNote(medKey) : "";

    if (!medKey || !MEDS[medKey]) {
      resultBox.innerHTML = "";
      return;
    }

    const med = MEDS[medKey];
    const selections = getMedicationSelections(medKey);
    const selectedStrength = getSelectedStrengthForMed(medKey);
    const formulation = getFormulationInfo(selectedStrength);

    const warnings = [];

    if (!isNaN(ageMonths) && med.age) {
      const minMonths = med.age.minMonths ?? 0;
      const maxMonths = med.age.maxYears != null ? med.age.maxYears * 12 : Infinity;

      if (ageMonths < minMonths || ageMonths > maxMonths) {
        warnings.push(
          `Age entered is outside the stated calculator range (${minMonths} months to ${med.age.maxYears} years).`
        );
      }
    }

    const hasValidWeight = isFinite(weightKg) && weightKg > 0;
    const isTabletFormulation = formulation && formulation.type === "tablet";

    const canUseChildTabletRule =
      patientType === "child" &&
      isTabletFormulation &&
      typeof med.tabletAgeCalc === "function";

    const canUseAdultFixedDose =
      patientType === "adult" &&
      isTabletFormulation &&
      typeof med.adultCalc === "function";

    let result = null;

    if (hasValidWeight) {
      result = med.calc({
        weightKg,
        ageMonths,
        selections,
        formulation,
        strength: selectedStrength,
        patientType
      });
    } else if (canUseAdultFixedDose) {
      result = med.adultCalc({
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
      resultBox.innerHTML = isTabletFormulation
        ? `<div class="calcWarnings"><div>⚠ Weight is still required for this selection unless an adult fixed-dose or child tablet rule exists for this medicine.</div></div>`
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
  (!isFinite(result.lowDoseMg) || !isFinite(result.highDoseMg))
) {
  resultBox.innerHTML = `
    <div class="calcWarnings">
      <div>⚠ Cannot calculate safely. Check weight, dose range, indication, and strength.</div>
    </div>
  `;
  return;
}

const effectiveFormulation = getEffectiveFormulation(medKey, result, selectedStrength);
resultBox.innerHTML = renderResult(result, effectiveFormulation, warnings, durationDaysInput);
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
      label: strength.label
    };
  }

  if (strength.type === "tablet") {
    const strengthMg = Number(strength.strengthMg);

    if (!isFinite(strengthMg) || strengthMg <= 0) {
      return null;
    }

    return {
      type: "tablet",
      mgPerUnit: strengthMg,
      strengthMg,
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
      return `Dispense ${formatMlQuantity(quantity)}`;
    }

    if (formulation.type === "tablet") {
      return `Dispense ${formatTabletQuantity(quantity, formulation)}`;
    }

    return null;
  }

  function formatDispenseRange(minQty, maxQty, formulation) {
    if (!isFinite(minQty) || !isFinite(maxQty)) return "-";

    if (formulation.type === "liquid") {
      return `${formatMlQuantity(minQty)} to ${formatMlQuantity(maxQty)}`;
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
      const rawMl = doseMg / formulation.mgPerMl;
      const roundedMl = roundLiquidDoseMl(rawMl);
      return `${stripTrailingZero(roundedMl)} mL`;
    }

    if (formulation.type === "tablet") {
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
      const rawMl = doseMg / formulation.mgPerMl;
      return { value: roundLiquidDoseMl(rawMl), unit: "mL" };
    }

    if (formulation.type === "tablet") {
      const rawUnits = doseMg / formulation.mgPerUnit;
      return { value: roundTabletDose(rawUnits), unit: "tablet" };
    }

    return { value: NaN, unit: null };
  }

  function roundLiquidDoseMl(value) {
    if (!isFinite(value)) return NaN;
    return Math.round(value * 2) / 2;
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

  function formatMlQuantity(value) {
    if (!isFinite(value)) return "-";
    const rounded = roundToOne(value);
    return `${stripTrailingZero(rounded)} mL`;
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

  function roundToNearest75(value) {
    if (!isFinite(value)) return 0;
    return Math.round(value / 75) * 75;
  }

  function updatePatientFieldHints() {
    const patientType = document.getElementById("patientType")?.value || "child";
    const ageLabel = document.getElementById("ageMonths")?.closest("label");
    const weightLabel = document.getElementById("weight")?.closest("label");

    if (!ageLabel || !weightLabel) return;

    if (patientType === "adult") {
      ageLabel.style.opacity = "0.7";
      weightLabel.style.opacity = "0.7";
    } else {
      ageLabel.style.opacity = "1";
      weightLabel.style.opacity = "1";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalculatorUI);
  } else {
    buildCalculatorUI();
  }
})();
