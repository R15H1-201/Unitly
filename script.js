/* SIMPLE MOBILE UNIT CONVERTER
   JavaScript File*/
/* UNIT DATA
   The factor converts a unit into its SI/base unit.
   Example:
   1 kilometer = 1000 meters
   So kilometer factor = 1000===================================================== */
const units = {
    /* ---------- LENGTH ---------- */
    length: {
        meter: { name: "Meter (m)", factor: 1 },
        kilometer: { name: "Kilometer (km)", factor: 1000 },
        centimeter: { name: "Centimeter (cm)", factor: 0.01 },
        millimeter: { name: "Millimeter (mm)", factor: 0.001 },
        mile: { name: "Mile (mi)", factor: 1609.344 },
        foot: { name: "Foot (ft)", factor: 0.3048 },
        inch: { name: "Inch (in)", factor: 0.0254 }
    },
    /* ---------- MASS ---------- */
    mass: {
        kilogram: { name: "Kilogram (kg)", factor: 1 },
        gram: { name: "Gram (g)", factor: 0.001 },
        milligram: { name: "Milligram (mg)", factor: 0.000001 },
        pound: { name: "Pound (lb)", factor: 0.45359237 },
        ounce: { name: "Ounce (oz)", factor: 0.0283495 }
    },
    /* ---------- TIME ---------- */
    time: {
        second: { name: "Second (s)", factor: 1 },
        minute: { name: "Minute (min)", factor: 60 },
        hour: { name: "Hour (h)", factor: 3600 },
        day: { name: "Day", factor: 86400 },
        week: { name: "Week", factor: 604800 }
    },
    /* ---------- TEMPERATURE ---------- */
    temperature: {
        celsius: { name: "Celsius (°C)" },
        fahrenheit: { name: "Fahrenheit (°F)" },
        kelvin: { name: "Kelvin (K)" }
    },
    /* ---------- AREA ---------- */
    area: {
        squareMeter: { name: "Square Meter (m²)", factor: 1 },
        squareKilometer: { name: "Square Kilometer (km²)", factor: 1000000 },
        squareCentimeter: { name: "Square Centimeter (cm²)", factor: 0.0001 },
        squareFoot: { name: "Square Foot (ft²)", factor: 0.092903 },
        acre: { name: "Acre", factor: 4046.86 }
    },
    /* ---------- VOLUME ---------- */
    volume: {
        cubicMeter: { name: "Cubic Meter (m³)", factor: 1 },
        liter: { name: "Liter (L)", factor: 0.001 },
        milliliter: { name: "Milliliter (mL)", factor: 0.000001 },
        gallon: { name: "US Gallon", factor: 0.00378541 },
        cubicCentimeter: { name: "Cubic Centimeter (cm³)", factor: 0.000001 }
    },
    /* ---------- SPEED ---------- */
    speed: {
        meterPerSecond: { name: "Meter/Second (m/s)", factor: 1 },
        kilometerPerHour: { name: "Kilometer/Hour (km/h)", factor: 0.2777777778 },
        milePerHour: { name: "Mile/Hour (mph)", factor: 0.44704 },
        knot: { name: "Knot", factor: 0.514444 }
    }
};
/* FUN FACTS*/
const facts = {
    length: "The meter is the SI base unit of length. Today, it is defined using the speed of light.",
    mass: "The kilogram is the SI base unit of mass. It is used to measure how much matter an object contains.",
    time: "The second is the SI base unit of time. Atomic clocks can measure time with incredible precision.",
    temperature: "Kelvin is the SI base unit of temperature. 0 K is called absolute zero.",
    area: "An acre is an old unit of area. The word comes from historical measurements of farmland.",
    volume: "The liter is commonly used for liquids. One liter is equal to 0.001 cubic meters.",
    speed: "The speed of light in vacuum is exactly 299,792,458 meters per second."
};
/* SI BASE UNITS
   These are displayed in the result card.*/
const siUnits = {
    length: "Meter (m)",
    mass: "Kilogram (kg)",
    time: "Second (s)",
    temperature: "Kelvin (K)",
    area: "Square Meter (m²)",
    volume: "Cubic Meter (m³)",
    speed: "Meter per Second (m/s)"
};
/* GET HTML ELEMENTS*/
const category = document.getElementById("category");
const valueInput = document.getElementById("value");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");
const formula = document.getElementById("formula");
const fact = document.getElementById("fact");
const siUnit = document.getElementById("siUnit");
/* LOAD UNITS
   Runs when the category changes.*/
function loadUnits() {
    // Get selected category
    const selectedCategory = category.value;
    // Get units for selected category
    const categoryUnits = units[selectedCategory];
    // Clear old dropdown options
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";
    // Add units to both dropdowns
    for (let key in categoryUnits) {
        // Create From option
        const optionFrom = document.createElement("option");
        optionFrom.value = key;
        optionFrom.textContent = categoryUnits[key].name;
        fromUnit.appendChild(optionFrom);
        // Create To option
        const optionTo = document.createElement("option");
        optionTo.value = key;
        optionTo.textContent = categoryUnits[key].name;
        toUnit.appendChild(optionTo);
    }
    // Select second unit as default To unit
    if (toUnit.options.length > 1) {
        toUnit.selectedIndex = 1;
    }
    // Show fun fact
    fact.textContent = facts[selectedCategory];
    // Show SI base unit
    siUnit.textContent = siUnits[selectedCategory];
    // Reset result
    result.textContent = "Enter a value to convert.";
    formula.textContent =
        "Enter a value and select units to see the formula.";
}
/* MAIN CONVERSION FUNCTION*/
function convertUnit() {
    // Read the entered value
    const value = parseFloat(valueInput.value);
    // Check if value is valid
    if (isNaN(value)) {
        result.textContent =
            "Please enter a valid number.";
        formula.textContent =
            "Enter a number to see the conversion formula.";
        return;
    }
    // Get selected category and units
    const selectedCategory = category.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    /* TEMPERATURE
       Temperature needs special formulas. */
    if (selectedCategory === "temperature") {
        const converted =
            convertTemperature(value, from, to);
        result.textContent =
            value + " " +
            units.temperature[from].name +
            " = " +
            roundNumber(converted) + " " +
            units.temperature[to].name;
        formula.textContent =
            getTemperatureFormula(from, to);
        return;
    }
    /* NORMAL UNITS
       Convert:
       From Unit → SI Unit → To Unit*/
    const fromFactor =
        units[selectedCategory][from].factor;
    const toFactor =
        units[selectedCategory][to].factor;
    // Convert input to SI/base unit
    const baseValue = value * fromFactor;
    // Convert SI/base unit to target unit
    const converted = baseValue / toFactor;
    // Display result
    result.textContent =
        value + " " +
        units[selectedCategory][from].name +
        " = " +
        roundNumber(converted) + " " +
        units[selectedCategory][to].name;
    // Display formula
    formula.textContent =
        getFormula(
            value,
            from,
            to,
            fromFactor,
            toFactor
        );
}
/*TEMPERATURE CONVERSION*/
function convertTemperature(value, from, to) {
    let celsius;
    // Fahrenheit → Celsius
    if (from === "fahrenheit") {
        celsius = (value - 32) * 5 / 9;
    }
    // Kelvin → Celsius
    else if (from === "kelvin") {

        celsius = value - 273.15;
    }
    // Celsius
    else {
        celsius = value;
    }
    // Celsius → Celsius
    if (to === "celsius") {
        return celsius;
    }
    // Celsius → Fahrenheit
    if (to === "fahrenheit") {
        return (celsius * 9 / 5) + 32;
    }
    // Celsius → Kelvin
    return celsius + 273.15;
}
/* NORMAL CONVERSION FORMULA*/
function getFormula(
    value,
    from,
    to,
    fromFactor,
    toFactor
) {
    const fromName =
        units[category.value][from].name;
    const toName =
        units[category.value][to].name;
    return (
        "Formula: (" +
        value +
        " × " +
        fromFactor +
        ") ÷ " +
        toFactor +
        " = " +
        toName
    );
}
/* TEMPERATURE FORMULA*/
function getTemperatureFormula(from, to) {
    if (from === to) {
        return "Both units are the same. No conversion is needed.";
    }
    if (
        from === "celsius" &&
        to === "fahrenheit"
    ) {
        return "°F = (°C × 9/5) + 32";
    }
    if (
        from === "fahrenheit" &&
        to === "celsius"
    ) {
        return "°C = (°F - 32) × 5/9";
    }
    if (
        from === "celsius" &&
        to === "kelvin"
    ) {
        return "K = °C + 273.15";
    }
    if (
        from === "kelvin" &&
        to === "celsius"
    ) {
        return "°C = K - 273.15";
    }
    if (
        from === "fahrenheit" &&
        to === "kelvin"
    ) {
        return "K = (°F - 32) × 5/9 + 273.15";
    }
    if (
        from === "kelvin" &&
        to === "fahrenheit"
    ) {
        return "°F = (K - 273.15) × 9/5 + 32";
    }
}
/* ROUND NUMBER
   Prevents very long decimal answers.*/
function roundNumber(number) {
    return Number(number.toFixed(6));
}
/* SWAP UNITS*/
function swapUnits() {
    // Store From unit temporarily
    const temporary = fromUnit.value;
    // Put To unit into From
    fromUnit.value = toUnit.value;
    // Put old From unit into To
    toUnit.value = temporary;
    // Convert after swapping
    convertUnit();
}
/* COPY RESULT*/
function copyResult() {
    const text = result.textContent;
    // Check if browser supports clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const temporaryInput =
            document.createElement("textarea");
        temporaryInput.value = text;
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        document.execCommand("copy");
        temporaryInput.remove();
    }
    // Change Copy button text
    const button =
        document.querySelector(".copy-btn");
    button.textContent = "Copied!";
    // Change it back after 1 second
    setTimeout(function () {
        button.textContent = "Copy";
    }, 1000);
}
/* DARK MODE*/
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
/* HISTORY BUTTON*/
function showHistory() {
    alert(
        "Conversion history will be added soon."
    );
}
/* ABOUT BUTTON*/
function showAbout() {
    alert(
        "Simple Unit Converter\n\n" +
        "Built using HTML, CSS and JavaScript."
    );
}
/* START APPLICATION
   Load units when the page opens.*/
loadUnits();