// Create a "pgl" language file, containing pig latin translations

const fs = require('fs');
const gettextParser = require('gettext-parser');

if (process.argv.length != 4) {
  console.error("Usage: test-translation <.pot input> <.po output>");
  process.exit(1);
}

var potInput = process.argv[2];
var poOutput = process.argv[3];

function toPigLatin(str) {
  function convertWord(word) {
    if (word.match(/^[A-Za-z]/) === null) {
      // If the word does not start with a letter, leave it alone
      return word;
    } else if (word.match(/^[AEIOUaeiou]/) !== null) {
      // If the word starts with a vowel, add "yay" to the end
      return word + "yay";
    } else {
      // Otherwise, take all consonants up to the first vowel, move them to the end,
      // and add "ay" to the end of that
      var match = word.match(/^([^AEIOUaeiou]*)(.*)/);
      return match[2] + match[1] + "ay";
    }
  }

  return str.split(" ").map(convertWord).join(" ");
}

var input = fs.readFileSync(potInput);
var pot = gettextParser.po.parse(input);
var po  = JSON.parse(JSON.stringify(pot));

// Walk the pot object, and add a msgstr for every msgid
Object.keys(pot.translations).forEach((msgctxt) => {
  Object.keys(pot.translations[msgctxt]).forEach((msgid) => {
    // Skip the empty id
    if (msgid === '') {
      return;
    }

    po.translations[msgctxt][msgid]["msgstr"][0] = toPigLatin(msgid);
  });
});

// Set some header data
po.headers['language'] = 'pgl';
po.headers['plural-forms'] = 'nplurals=2; plural=(n != 1)';

var output = gettextParser.po.compile(po);
fs.writeFileSync(poOutput, output);
