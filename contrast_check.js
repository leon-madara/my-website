const ColorPairs = [
    // Light Mode
    { name: "Light: Primary Text on White", bg: "#ffffff", fg: "#1e293b" }, // --primary-text
    { name: "Light: Secondary Text on White", bg: "#ffffff", fg: "#64748b" }, // --secondary-text
    { name: "Light: Content Primary on White", bg: "#ffffff", fg: "#1a202c" }, // --content-text-primary
    { name: "Light: Content Secondary on White", bg: "#ffffff", fg: "#4a5568" }, // --content-text-secondary
    { name: "Light: Kenyan Green Text on White", bg: "#ffffff", fg: "#006b3f" }, // --kenyan-green
    { name: "Light: Kenyan Red Text on White", bg: "#ffffff", fg: "#ce1126" }, // --kenyan-red

    // Dark Mode
    { name: "Dark: Primary Text on Bg", bg: "#0a0e12", fg: "#e8edf3" }, // body color
    { name: "Dark: Description Text on Bg", bg: "#0a0e12", fg: "#a8b5c7" }, // .portfolio-header-description
    { name: "Dark: Label Green on Bg", bg: "#0a0e12", fg: "#10cf74" }, // .portfolio-header-label
    { name: "Dark: Accordion/Card Text on Card Bg", bg: "#1e2730", fg: "#e8edf3" },
    { name: "Dark: Accordion/Card Secondary on Card Bg", bg: "#1e2730", fg: "#a8b5c7" },
    { name: "Dark: Accordion/Card Green on Card Bg", bg: "#1e2730", fg: "#10cf74" }
];

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function luminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateRatio(bgHex, fgHex) {
    const bg = hexToRgb(bgHex);
    const fg = hexToRgb(fgHex);
    const lum1 = luminance(bg.r, bg.g, bg.b);
    const lum2 = luminance(fg.r, fg.g, fg.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

console.log("WCAG AA Contrast Report");
console.log("-----------------------");
console.log("Standard: AA Normal Text requires 4.5:1, Large Text requires 3:1");
console.log("");

let failCount = 0;

ColorPairs.forEach(pair => {
    const ratio = calculateRatio(pair.bg, pair.fg);
    const passAA = ratio >= 4.5;
    const passAALarge = ratio >= 3.0;

    let status = "PASS";
    if (!passAA) {
        status = passAALarge ? "PASS (Large Only)" : "FAIL";
        if (status === "FAIL") failCount++;
    }

    console.log(`${pair.name}`);
    console.log(`   BG: ${pair.bg} | FG: ${pair.fg}`);
    console.log(`   Ratio: ${ratio.toFixed(2)}:1  [${status}]`);
    console.log("");
});

if (failCount === 0) {
    console.log("All checked pairs pass WCAG AA (at least for large text).");
} else {
    console.log(`${failCount} pairs FAILED WCAG AA requirements.`);
}
