// Extract the title from cockpit's manifest.json and append it to a .pot file
// This assumes the .pot file already exists.

const fs = require('fs');
const jsel = require('jsel');

if (process.argv.length != 4) {
  console.error("Usage: add-title <manifest.json> <POT-file>");
  process.exit(1);
}

var manifestJsonName = process.argv[2];
var outputPOTName = process.argv[3];

var manifest = JSON.parse(fs.readFileSync(manifestJsonName, 'utf8'));

// Anything in a "label" property is translatable
// For each, output the string itself as the msgid, and an
// empty msgstr (because it's a .pot)
var dom = jsel(manifest);
var potData = dom.selectAll('//@label').map((label) => {
  return `
#: ${manifestJsonName}
msgid "${label}"
msgstr ""
`
});

fs.appendFileSync(outputPOTName, potData, 'utf8');
