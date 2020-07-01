// Extract the title from cockpit's manifest.json and append it to a .pot file
// This assumes the .pot file already exists.

const fs = require("fs");
const jsel = require("jsel");

if (process.argv.length !== 4) {
  console.error("Usage: add-title <manifest.json> <POT-file>");
  process.exit(1);
}

const manifestJsonName = process.argv[2];
const outputPOTName = process.argv[3];

const manifest = JSON.parse(fs.readFileSync(manifestJsonName, "utf8"));

// Anything in a "label" property is translatable
// For each, output the string itself as the msgid, and an
// empty msgstr (because it's a .pot)
const dom = jsel(manifest);
const potData = dom.selectAll("//@label").map((label) => {
  return `
#: ${manifestJsonName}
msgid "${label}"
msgstr ""
`;
});

fs.appendFileSync(outputPOTName, potData.join(""), "utf8");
