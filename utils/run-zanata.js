// look for zanata authentication information in the environment
const spawnSync = require("child_process").spawnSync;
var auth_args = [];
if ("ZANATA_USER" in process.env) {
  auth_args.push('-u');
  auth_args.push(process.env["ZANATA_USER"]);
}
if ("ZANATA_API_KEY" in process.env) {
  auth_args.push('-K');
  auth_args.push(process.env["ZANATA_API_KEY"]);
}

var zanata = spawnSync("zanata-js",
  auth_args.concat(process.argv.slice(2)),
  {stdio: 'inherit'}
);

console.log(zanata.status);
console.log(zanata.error);

if (zanata.error && zanata.error.errno === "ENOENT") {
  console.error("zanata-js doen not seem to be installed. Run `npm install zanata-js`");
  process.exit(2); // ENOENT
}

process.exit(zanata.status);
