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

spawnSync("zanata-js",
  auth_args.concat(process.argv.slice(2)),
  {stdio: 'inherit'}
);
