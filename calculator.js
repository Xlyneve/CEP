(function () {
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
          <option value="paracetamol">Paracetamol</option>
          <option value="flucloxacillin">Flucloxacillin</option>
          <option value="amoxicillin">Amoxicillin</option>
          <option value="cefalexin">Cefalexin</option>
          <option value="cefaclor">Cefaclor</option>
          <option value="erythromycin">Erythromycin</option>
          <option value="amoxClav">Amoxicillin + Clavulanic Acid</option>
        </select>
      </label>

      <div id="medicationNote"></div>
      <div id="extraOptions" class="hidden"></div>

      <label>Weight (kg):
        <input type="number" id="weight" step="any" />
      </label>

      <div id="result"></div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("hidden");
    });

    const medSelect = panel.querySelector("#medicationSelect");
    const weightInput = panel.querySelector("#weight");

    if (medSelect) {
      medSelect.addEventListener("change", handleMedicationChange);
    }

    if (weightInput) {
      weightInput.addEventListener("input", calculateDose);
    }
  }

  function attachAutoCalcListeners() {
    const weightInput = document.getElementById("weight");
    const strengthSelect = document.getElementById("strengthSelect");
    const dosingType = document.getElementById("dosingType");
    const doseLevelSelect = document.getElementById("doseLevelSelect");

    if (weightInput) {
      weightInput.addEventListener("input", calculateDose);
    }

    if (strengthSelect) {
      strengthSelect.addEventListener("change", calculateDose);
    }

    if (dosingType) {
      dosingType.addEventListener("change", () => {
        if (document.getElementById("medicationSelect")?.value === "amoxicillin") {
          updateAmoxicillinNote();
        }
        calculateDose();
      });
    }

    if (doseLevelSelect) {
      doseLevelSelect.addEventListener("change", calculateDose);
    }
  }

  function handleMedicationChange() {
    const med = document.getElementById("medicationSelect")?.value;
    const extraDiv = document.getElementById("extraOptions");
    const noteDiv = document.getElementById("medicationNote");
    const resultBox = document.getElementById("result");

    if (!extraDiv || !noteDiv || !resultBox) return;

    extraDiv.innerHTML = "";
    extraDiv.classList.add("hidden");
    noteDiv.innerHTML = "";
    resultBox.innerHTML = "";

    if (!med) return;

    let html = "";

    switch (med) {
      case "paracetamol":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="120">120 mg / 5 ml</option>
              <option value="250">250 mg / 5 ml</option>
            </select>
          </label>
        `;
        break;

      case "flucloxacillin":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="125">125 mg / 5 ml</option>
              <option value="250">250 mg / 5 ml</option>
            </select>
          </label>
          <label>Dosing Level:
            <select id="doseLevelSelect">
              <option value="low">Low Dose (12.5 mg/kg)</option>
              <option value="high">High Dose (25 mg/kg)</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> 12.5–25 mg/kg four times daily. Use 25 mg/kg for severe infections. Max dose: 1 g per dose.
        `;
        break;

      case "amoxicillin":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="125">125 mg / 5 ml</option>
              <option value="250">250 mg / 5 ml</option>
            </select>
          </label>
          <label>Dosing Type:
            <select id="dosingType">
              <option value="general">General</option>
              <option value="strepA">Strep A</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
          <strong>General Dosing:</strong><br>
          1 month - 18 years: 15–30 mg/kg (maximum 1,000 mg) three times daily.
        `;
        break;

      case "cefalexin":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="125">125 mg / 5 ml</option>
              <option value="250">250 mg / 5 ml</option>
            </select>
          </label>
          <label>Dosing Type:
            <select id="dosingType">
              <option value="impetigo">Impetigo</option>
              <option value="generalInfection">General Infection</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
          This calculator uses <strong>12.5 mg/kg/dose</strong>.<br><br>
          <strong>Dosing Options:</strong><br>
          • <strong>Impetigo:</strong> 12.5–25 mg/kg (usual max 500 mg) <strong>twice daily</strong><br>
          • <strong>General Infection:</strong> 12.5–25 mg/kg (usual max 500 mg; up to 1 g may be used) <strong>four times daily</strong>
        `;
        break;

      case "cefaclor":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="125">125 mg / 5 ml</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br>
          <strong>General Dosing:</strong><br>
          1 month - 18 years 10 mg/kg (maximum 500 mg) three times daily
        `;
        break;

      case "erythromycin":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="200">200 mg / 5 ml</option>
              <option value="400">400 mg / 5 ml</option>
            </select>
          </label>
          <label>Dosing Type:
            <select id="dosingType">
              <option value="general">General</option>
              <option value="strepA">Strep A</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br>
          This calculator is for erythromycin ethylsuccinate.<br><br>
          <strong>General Dosing:</strong><br>
          1 month - 18 years: 10-12.5 mg/kg every 6 hours<br><br>
          <strong>Strep A Dosing:</strong><br>
          Child 20 mg/kg twice daily; max 800 mg twice daily for 10 days
        `;
        break;

      case "amoxClav":
        html += `
          <label>Strength:
            <select id="strengthSelect">
              <option value="156.25">125 mg / 5 ml + 31.25 mg</option>
              <option value="312.5">250 mg / 5 ml + 62.5 mg</option>
            </select>
          </label>
        `;
        noteDiv.innerHTML = `
          <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
          <strong>General Dosing:</strong><br>
          1 month – 18 years: 15–30 mg/kg (maximum 625 mg) three times daily.
        `;
        break;
    }

    if (html) {
      extraDiv.innerHTML = html;
      extraDiv.classList.remove("hidden");
    }

    attachAutoCalcListeners();
    calculateDose();
  }

  function updateAmoxicillinNote() {
    const noteDiv = document.getElementById("medicationNote");
    const dosingType = document.getElementById("dosingType")?.value;
    if (!noteDiv) return;

    if (dosingType === "strepA") {
      noteDiv.innerHTML = `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        <strong>Strep A Dosing:</strong><br>
        Under 15 kg: 50 mg/kg once daily for 10 days<br>
        15–29.9 kg: 750 mg once daily for 10 days<br>
        30 kg or over: 1,000 mg once daily for 10 days
      `;
    } else {
      noteDiv.innerHTML = `
        <strong>Note:</strong> For ages 1 month to 18 years only.<br><br>
        <strong>General Dosing:</strong><br>
        1 month - 18 years: 15–30 mg/kg (maximum 1,000 mg) three times daily.
      `;
    }
  }

  function calculateDose() {
    const med = document.getElementById("medicationSelect")?.value;
    const weight = parseFloat(document.getElementById("weight")?.value);
    const resultBox = document.getElementById("result");

    if (!resultBox) return;

    if (!med || isNaN(weight)) {
      resultBox.innerHTML = "";
      return;
    }

    const strengthSelect = document.getElementById("strengthSelect");
    const concMg = strengthSelect ? parseFloat(strengthSelect.value) : NaN;
    const concMl = 5;

    if (isNaN(concMg) || concMg === 0) {
      resultBox.innerHTML = "";
      return;
    }

    let doseMg = 0;
    let frequency = "";

    switch (med) {
      case "paracetamol":
        doseMg = Math.min(weight * 15, 1000);
        frequency = "Every 4 hours as needed, max 4 doses in 24 hours";
        break;

      case "flucloxacillin": {
        const doseLevel = document.getElementById("doseLevelSelect")?.value || "low";
        doseMg = doseLevel === "high"
          ? Math.min(weight * 25, 1000)
          : Math.min(weight * 12.5, 1000);
        frequency = "4 times daily";
        break;
      }

      case "amoxicillin": {
        const dosingType = document.getElementById("dosingType")?.value || "general";
        if (dosingType === "strepA") {
          if (weight < 15) doseMg = weight * 50;
          else if (weight < 30) doseMg = 750;
          else doseMg = 1000;
          frequency = "Once daily for 10 days";
        } else {
          doseMg = Math.min(weight * 30, 1000);
          frequency = "Three times daily (every 8 hours)";
        }
        break;
      }

      case "cefalexin":
        doseMg = Math.min(weight * 12.5, 500);
        frequency = "Twice or four times daily depending on indication";
        break;

      case "cefaclor":
        doseMg = Math.min(weight * 10, 500);
        frequency = "Three times daily";
        break;

      case "erythromycin": {
        const erythroType = document.getElementById("dosingType")?.value || "general";
        if (erythroType === "strepA") {
          doseMg = Math.min(weight * 20, 800);
          frequency = "Twice daily for 10 days";
        } else {
          doseMg = Math.min(weight * 12.5, 1600);
          frequency = "Every 6 hours";
        }
        break;
      }

      case "amoxClav":
        doseMg = Math.min(weight * 30, 625);
        frequency = "Three times daily";
        break;

      default:
        resultBox.innerHTML = "";
        return;
    }

    const mgPerMl = concMg / concMl;
    const doseMl = doseMg / mgPerMl;

    resultBox.innerHTML = `
      Dose: <strong>${doseMg.toFixed(1)} mg</strong><br/>
      Volume: <strong>${doseMl.toFixed(2)} mL</strong><br/>
      Frequency: <strong>${frequency}</strong>
    `;
  }

  document.addEventListener("DOMContentLoaded", buildCalculatorUI);
})();