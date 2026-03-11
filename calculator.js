(function () {
  const MEDS = {
    paracetamol: {
      label: "Paracetamol",
      age: { minMonths: 1, maxYears: 18 },
      strengths: [
        { value: 120, label: "120 mg / 5 mL" },
        { value: 250, label: "250 mg / 5 mL" }
      ],
      note: `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        Usual dose: 15 mg/kg per dose.<br>
        Maximum single dose: 1000 mg.<br>
        Maximum daily dose: 60 mg/kg/day up to 4000 mg/day.<br>
        Frequency: Every 4 hours as needed, max 4 doses in 24 hours.
      `,
      calc: ({ weightKg }) => {
        const rawDose = weightKg * 15;
        const doseMg = Math.min(rawDose, 1000);
        const maxDailyMg = Math.min(weightKg * 60, 4000);

        return {
          mode: "single",
          frequency: "Every 4 hours as needed, max 4 doses in 24 hours",
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
        { value: 125, label: "125 mg / 5 mL" },
        { value: 250, label: "250 mg / 5 mL" }
      ],
      options: [
        {
          id: "doseLevel",
          label: "Dose Level",
          type: "select",
          choices: [
            { value: "range", label: "Show low + high dose" },
            { value: "low", label: "Low dose (12.5 mg/kg)" },
            { value: "high", label: "High dose (25 mg/kg)" }
          ]
        }
      ],
      note: `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        12.5–25 mg/kg four times daily.<br>
        Use 25 mg/kg for severe infections.<br>
        Maximum single dose: 1 g.
      `,
      calc: ({ weightKg, selections }) => {
        const mode = selections.doseLevel || "range";
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
            doseMg: lowDose,
            maxDailyMg: lowDose * 4,
            warnings,
            extra: [`Daily total at this dose: ${formatMg(lowDose * 4)}`]
          };
        }

        if (mode === "high") {
          return {
            mode: "single",
            frequency: "4 times daily",
            doseMg: highDose,
            maxDailyMg: highDose * 4,
            warnings,
            extra: [`Daily total at this dose: ${formatMg(highDose * 4)}`]
          };
        }

        return {
          mode: "range",
          frequency: "4 times daily",
          lowDoseMg: lowDose,
          highDoseMg: highDose,
          maxDailyMg: highDose * 4,
          warnings,
          extra: [
            `Daily total (low): ${formatMg(lowDose * 4)}`,
            `Daily total (high): ${formatMg(highDose * 4)}`
          ]
        };
      }
    },

    amoxicillin: {
      label: "Amoxicillin",
      age: { minMonths: 1, maxYears: 18 },
      strengths: [
        { value: 125, label: "125 mg / 5 mL" },
        { value: 250, label: "250 mg / 5 mL" }
      ],
      options: [
        {
          id: "dosingType",
          label: "Dosing Type",
          type: "select",
          choices: [
            { value: "general", label: "General" },
            { value: "strepA", label: "Strep A" }
          ]
        },
        {
          id: "doseLevel",
          label: "Dose Level",
          type: "select",
          choices: [
            { value: "range", label: "Show low + high dose" },
            { value: "low", label: "Low dose (15 mg/kg)" },
            { value: "high", label: "High dose (30 mg/kg)" }
          ]
        }
      ],
      note: ({ selections }) => {
        if (selections.dosingType === "strepA") {
          return `
            <strong>Note:</strong> Strep A dosing.<br><br>
            50 mg/kg once daily (maximum daily dose 1000 mg), or<br>
            Weight under 30 kg: 750 mg once daily for 10 days.<br>
            Weight 30 kg and over: 1000 mg once daily for 10 days.
          `;
        }

        return `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
          <strong>General Dosing:</strong><br>
          15–30 mg/kg three times daily.<br>
          Maximum single dose: 1000 mg.
        `;
      },
      calc: ({ weightKg, selections }) => {
        const type = selections.dosingType || "general";

        if (type === "strepA") {
          const doseMg = weightKg < 30 ? 750 : 1000;

          return {
            mode: "single",
            frequency: "Once daily for 10 days",
            doseMg,
            maxDailyMg: doseMg,
            warnings: [],
            extra: [
              `Daily total: ${formatMg(doseMg)}`,
              `Alternative weight-based statement: 50 mg/kg once daily, max 1000 mg/day`
            ]
          };
        }

        const doseLevel = selections.doseLevel || "range";
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
            doseMg: highDose,
            maxDailyMg: highDose * 3,
            warnings,
            extra: [`Daily total at this dose: ${formatMg(highDose * 3)}`]
          };
        }

        return {
          mode: "range",
          frequency: "Three times daily (every 8 hours)",
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
        { value: 125, label: "125 mg / 5 mL" },
        { value: 250, label: "250 mg / 5 mL" }
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
            { value: "range", label: "Show low + high dose" },
            { value: "low", label: "Low dose (12.5 mg/kg)" },
            { value: "high", label: "High dose (25 mg/kg)" }
          ]
        }
      ],
      note: `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        <strong>Impetigo:</strong> 12.5–25 mg/kg twice daily (usual max 500 mg)<br>
        <strong>General Infection:</strong> 12.5–25 mg/kg four times daily (usual max 500 mg; up to 1 g may be used)
      `,
      calc: ({ weightKg, selections }) => {
        const type = selections.dosingType || "impetigo";
        const doseLevel = selections.doseLevel || "range";

        const lowRaw = weightKg * 12.5;
        const highRaw = weightKg * 25;

        const singleDoseCap = type === "generalInfection" ? 1000 : 500;
        const lowDose = Math.min(lowRaw, singleDoseCap);
        const highDose = Math.min(highRaw, singleDoseCap);
        const frequency = type === "impetigo" ? "Twice daily" : "Four times daily";
        const dosesPerDay = type === "impetigo" ? 2 : 4;

        const warnings = [];
        if (lowRaw > singleDoseCap || highRaw > singleDoseCap) {
          warnings.push(`Dose capped at max single dose of ${singleDoseCap} mg for selected indication.`);
        }

        if (doseLevel === "low") {
          return {
            mode: "single",
            frequency,
            doseMg: lowDose,
            maxDailyMg: lowDose * dosesPerDay,
            warnings,
            extra: [`Daily total at this dose: ${formatMg(lowDose * dosesPerDay)}`]
          };
        }

        if (doseLevel === "high") {
          return {
            mode: "single",
            frequency,
            doseMg: highDose,
            maxDailyMg: highDose * dosesPerDay,
            warnings,
            extra: [`Daily total at this dose: ${formatMg(highDose * dosesPerDay)}`]
          };
        }

        return {
          mode: "range",
          frequency,
          lowDoseMg: lowDose,
          highDoseMg: highDose,
          maxDailyMg: highDose * dosesPerDay,
          warnings,
          extra: [
            `Daily total (low): ${formatMg(lowDose * dosesPerDay)}`,
            `Daily total (high): ${formatMg(highDose * dosesPerDay)}`
          ]
        };
      }
    },

    cefaclor: {
      label: "Cefaclor",
      age: { minMonths: 1, maxYears: 18 },
      strengths: [{ value: 125, label: "125 mg / 5 mL" }],
      note: `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        10 mg/kg three times daily.<br>
        Maximum single dose: 500 mg.
      `,
      calc: ({ weightKg }) => {
        const rawDose = weightKg * 10;
        const doseMg = Math.min(rawDose, 500);

        return {
          mode: "single",
          frequency: "Three times daily",
          doseMg,
          maxDailyMg: doseMg * 3,
          warnings: rawDose > 500 ? ["Dose capped at max single dose of 500 mg."] : [],
          extra: [`Daily total: ${formatMg(doseMg * 3)}`]
        };
      }
    },

    erythromycin: {
      label: "Erythromycin Ethylsuccinate",
      age: { minMonths: 1, maxYears: 120 },
      strengths: [
        { value: 200, label: "200 mg / 5 mL" },
        { value: 400, label: "400 mg / 5 mL" }
      ],
      options: [
        {
          id: "dosingType",
          label: "Dosing Type",
          type: "select",
          choices: [
            { value: "general", label: "General" },
            { value: "strepA", label: "Strep A" }
          ]
        },
        {
          id: "doseLevel",
          label: "Dose Level",
          type: "select",
          choices: [
            { value: "range", label: "Show low + high dose" },
            { value: "low", label: "Low dose (10 mg/kg)" },
            { value: "high", label: "High dose (12.5 mg/kg)" }
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
        }
      ],
      note: ({ selections }) => {
        if (selections.dosingType === "strepA") {
          return `
            <strong>Note:</strong> Strep A first-line alternative if concern about IgE mediated or anaphylactic beta-lactam allergy.<br><br>
            Children: 40 mg/kg/day in 2 to 3 divided doses (maximum daily dose 1600 mg) for 10 days.<br>
            Adults: 800 mg twice daily for 10 days.
          `;
        }

        return `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br>
          This calculator is for erythromycin ethylsuccinate.<br><br>
          <strong>General Dosing:</strong><br>
          10–12.5 mg/kg every 6 hours
        `;
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
            doseMg: perDose,
            maxDailyMg: dailyDose,
            warnings,
            extra: [
              `Total daily dose: ${formatMg(dailyDose)}`,
              `Divided into ${divided} doses`
            ]
          };
        }

        const doseLevel = selections.doseLevel || "range";
        const lowRaw = weightKg * 10;
        const highRaw = weightKg * 12.5;

        if (doseLevel === "low") {
          return {
            mode: "single",
            frequency: "Every 6 hours",
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
            doseMg: highRaw,
            maxDailyMg: highRaw * 4,
            warnings: [],
            extra: [`Daily total at this dose: ${formatMg(highRaw * 4)}`]
          };
        }

        return {
          mode: "range",
          frequency: "Every 6 hours",
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
        { value: 125, label: "125 mg / 5 mL + 31.25 mg clavulanic acid" },
        { value: 250, label: "250 mg / 5 mL + 62.5 mg clavulanic acid" }
      ],
      note: `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        Dose based on the <strong>amoxicillin component</strong>.<br>
        15–30 mg/kg three times daily.<br>
        Maximum single dose: 625 mg (amoxicillin component used here as your current max).
      `,
      calc: ({ weightKg }) => {
        const lowRaw = weightKg * 15;
        const highRaw = weightKg * 30;
        const lowDose = Math.min(lowRaw, 625);
        const highDose = Math.min(highRaw, 625);
        const warnings = [];

        if (lowRaw > 625 || highRaw > 625) {
          warnings.push("Dose capped at max single dose of 625 mg.");
        }

        return {
          mode: "range",
          frequency: "Three times daily",
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
      strengths: [],
      options: [
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
      note: `
        <strong>Note:</strong> Strep A dosing for 10 days.<br><br>
        Children under 20 kg: 250 mg 2 or 3 times daily for 10 days.<br>
        Children and adults 20 kg and over: 500 mg 2 or 3 times daily for 10 days.
      `,
      calc: ({ weightKg, selections }) => {
        const doseMg = weightKg < 20 ? 250 : 500;
        const dosesPerDay = selections.strepFreq === "tid" ? 3 : 2;
        const frequency = dosesPerDay === 3 ? "3 times daily for 10 days" : "2 times daily for 10 days";

        return {
          mode: "single",
          frequency,
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
      strengths: [],
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
          doseMg,
          maxDailyMg: doseMg,
          warnings: [],
          extra: [`Equivalent dose: ${units}`]
        };
      }
    },

    roxithromycin: {
      label: "Roxithromycin",
      age: { minMonths: 1, maxYears: 120 },
      strengths: [],
      options: [
        {
          id: "roxAdultMode",
          label: "Adult Regimen",
          type: "select",
          choices: [
            { value: "300od", label: "300 mg once daily" },
            { value: "150bd", label: "150 mg twice daily" }
          ]
        }
      ],
      note: `
        <strong>Note:</strong> Strep A alternative if concern about IgE mediated or anaphylactic beta-lactam allergy.<br><br>
        <strong>Children:</strong> 2.5 mg/kg per dose twice daily for 10 days.<br>
        Only use in children who can be prescribed a full 150 mg tablet due to discontinuation of roxithromycin 50 mg dispersible tablets.<br><br>
        <strong>Adults:</strong> 300 mg once daily or 150 mg twice daily for 10 days.
      `,
      calc: ({ weightKg, ageMonths, selections }) => {
        const warnings = [];
        const ageYears = isFinite(ageMonths) ? ageMonths / 12 : null;

        if (ageYears !== null && ageYears >= 18) {
          const mode = selections.roxAdultMode || "300od";
          const doseMg = mode === "300od" ? 300 : 150;
          const dosesPerDay = mode === "300od" ? 1 : 2;
          const frequency = mode === "300od" ? "Once daily for 10 days" : "Twice daily for 10 days";

          return {
            mode: "single",
            frequency,
            doseMg,
            maxDailyMg: doseMg * dosesPerDay,
            warnings,
            extra: [`Daily total: ${formatMg(doseMg * dosesPerDay)}`]
          };
        }

        const rawDose = weightKg * 2.5;
        const doseMg = rawDose;
        const canUseTablet = doseMg >= 150;

        if (!canUseTablet) {
          warnings.push("Calculated child dose is below 150 mg. Guideline says only use in children who can take a full 150 mg tablet.");
        }

        return {
          mode: "single",
          frequency: "Twice daily for 10 days",
          doseMg,
          maxDailyMg: doseMg * 2,
          warnings,
          extra: [
            `Daily total: ${formatMg(doseMg * 2)}`,
            `Practical tablet check: ${canUseTablet ? "Can use full 150 mg tablet" : "Cannot use full 150 mg tablet"}`
          ]
        };
      }
    }
  };

  function buildCalculatorUI() {
    if (document.getElementById("doseCalculator")) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "calcToggleBtn";
    toggleBtn.type = "button";
    toggleBtn.innerHTML = "🧮";
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

      <label>Age (months):
        <input type="number" id="ageMonths" min="0" step="1" />
      </label>

      <label>Weight (kg):
        <input type="number" id="weight" min="0" step="any" />
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
      if (e.target.id === "medicationSelect") {
        renderMedicationOptions();
      }
      calculateDose();
    });

    panel.addEventListener("input", () => {
      calculateDose();
    });
  }

  function renderMedicationOptions() {
    const medKey = document.getElementById("medicationSelect")?.value;
    const extraDiv = document.getElementById("extraOptions");
    const noteDiv = document.getElementById("medicationNote");
    const resultBox = document.getElementById("result");

    if (!extraDiv || !noteDiv || !resultBox) return;

    extraDiv.innerHTML = "";
    noteDiv.innerHTML = "";
    resultBox.innerHTML = "";
    extraDiv.classList.add("hidden");

    if (!medKey || !MEDS[medKey]) return;

    const med = MEDS[medKey];
    const selections = getMedicationSelections(medKey);

    let html = "";

    if (med.strengths?.length) {
      html += `
        <label>Strength:
          <select id="strengthSelect">
            ${med.strengths
              .map((s) => `<option value="${s.value}">${s.label}</option>`)
              .join("")}
          </select>
        </label>
      `;
    }

    if (med.options?.length) {
      med.options.forEach((opt) => {
        if (opt.type === "hidden") return;

        // Hide general-only dose range for strepA where it does not apply
        if (medKey === "amoxicillin" && opt.id === "doseLevel" && selections.dosingType === "strepA") return;
        if (medKey === "erythromycin" && opt.id === "doseLevel" && selections.dosingType === "strepA") return;
        if (medKey === "erythromycin" && opt.id === "eryStrepFreq" && selections.dosingType !== "strepA") return;

        if (opt.type === "select") {
          html += `
            <label>${opt.label}:
              <select id="${opt.id}">
                ${opt.choices
                  .map((choice) => `<option value="${choice.value}">${choice.label}</option>`)
                  .join("")}
              </select>
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
      med.options.forEach((opt) => {
        const el = document.getElementById(opt.id);
        if (el) selections[opt.id] = el.value;
      });
    }

    return selections;
  }

  function getMedicationNote(medKey) {
    const med = MEDS[medKey];
    if (!med) return "";

    const selections = getMedicationSelections(medKey);

    if (typeof med.note === "function") {
      return med.note({ selections });
    }

    return med.note || "";
  }

  function calculateDose() {
    const medKey = document.getElementById("medicationSelect")?.value;
    const ageMonths = parseFloat(document.getElementById("ageMonths")?.value);
    const weightKg = parseFloat(document.getElementById("weight")?.value);
    const resultBox = document.getElementById("result");
    const noteDiv = document.getElementById("medicationNote");

    if (!resultBox || !noteDiv) return;

    noteDiv.innerHTML = medKey ? getMedicationNote(medKey) : "";

    if (!medKey || !MEDS[medKey]) {
      resultBox.innerHTML = "";
      return;
    }

    if (isNaN(weightKg) || weightKg <= 0) {
      resultBox.innerHTML = "";
      return;
    }

    const med = MEDS[medKey];
    const selections = getMedicationSelections(medKey);
    const strengthMgPer5mL = parseFloat(document.getElementById("strengthSelect")?.value);
    const mgPerMl = !isNaN(strengthMgPer5mL) ? strengthMgPer5mL / 5 : NaN;

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

    const result = med.calc({ weightKg, ageMonths, selections });

    if (result.warnings?.length) {
      warnings.push(...result.warnings);
    }

    resultBox.innerHTML = renderResult(result, mgPerMl, warnings);
  }

  function renderResult(result, mgPerMl, warnings) {
    let html = "";
    const showVolume = isFinite(mgPerMl) && mgPerMl > 0;

    if (result.mode === "single") {
      const doseMl = showVolume ? result.doseMg / mgPerMl : NaN;

      html += `
        <div>Dose: <strong>${formatMg(result.doseMg)}</strong></div>
        ${showVolume ? `<div>Volume: <strong>${formatMl(doseMl)}</strong></div>` : ""}
        <div>Frequency: <strong>${result.frequency}</strong></div>
      `;
    }

    if (result.mode === "range") {
      const lowMl = showVolume ? result.lowDoseMg / mgPerMl : NaN;
      const highMl = showVolume ? result.highDoseMg / mgPerMl : NaN;

      html += `
        <div>Low dose: <strong>${formatMg(result.lowDoseMg)}</strong></div>
        ${showVolume ? `<div>Low volume: <strong>${formatMl(lowMl)}</strong></div>` : ""}
        <br>
        <div>High dose: <strong>${formatMg(result.highDoseMg)}</strong></div>
        ${showVolume ? `<div>High volume: <strong>${formatMl(highMl)}</strong></div>` : ""}
        <div>Frequency: <strong>${result.frequency}</strong></div>
      `;
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

  function formatMg(value) {
    if (!isFinite(value)) return "-";
    if (Math.abs(value - Math.round(value)) < 0.001) return `${Math.round(value)} mg`;
    return `${value.toFixed(1)} mg`;
  }

  function formatMl(value) {
    if (!isFinite(value)) return "-";
    if (value < 1) return `${value.toFixed(2)} mL`;
    return `${value.toFixed(1)} mL`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalculatorUI);
  } else {
    buildCalculatorUI();
  }
})();
