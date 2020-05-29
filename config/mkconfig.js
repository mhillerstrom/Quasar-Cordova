/**
 * Utility for creating (and maintaining) default.json and production.json
 */
const fs = require('fs');
const path = require('path');

// Source files
const mkconfig = path.join(__dirname,'./mkconfig.js');
const environmentDev = path.join(__dirname,'../environment-dev.env');
const environmentProd = path.join(__dirname,'../environment.env');
const defaultFile = path.join(__dirname,'./default.js');
const productionFile = path.join(__dirname,'./production.js');
const sourceFiles = [mkconfig, environmentDev, environmentProd, defaultFile, productionFile];

// Target files
const defaultJson = path.join(__dirname,'./default.client');
const productionJson = path.join(__dirname,'./production.client');
const targetFiles = [defaultJson, productionJson];

/**
 * Utility functions
 */
const getTimeStamp = function(file) {
  if (!fs.existsSync(file))
    return 0;

  var fsStats = fs.statSync(file);
  return fsStats.mtimeMs;
};

const writeFile = function(file,header,str) {
  var data = header + '\n' + str;
  return fs.writeFileSync(file,data);
};


// Determine newest source timestamp
var sourceTS = 0;
for (var six in sourceFiles)
  sourceTS = Math.max(sourceTS, getTimeStamp(sourceFiles[six]));


// Ok, we need to update/create the target files
const dotenv = require('dotenv');

// Save enviromnment info
const env = process.env;

// Build new 'default.json'
//   If target timestamp is newer than source timestamp we are done
if (getTimeStamp(defaultJson) <= sourceTS) {
  process.env.NODE_ENV = 'development';
  dotenv.config({/*debug: true, */path: environmentDev});
  const def = require(defaultFile);
  writeFile(defaultJson,'// This file is created automatically and will be overwritten\n\nmodule.exports = ',JSON.stringify(def));
  console.log(`Client configuration file '${defaultJson}' has been re-created`);
}

// Build new 'production.json'
if (getTimeStamp(productionJson) <= sourceTS) {
  process.env = env;
  process.env.NODE_ENV = 'production';
  dotenv.config({path: environmentProd});
  const def = require(defaultFile);
  const prod = require(productionFile);
  const combined = Object.assign({}, def, prod);
  writeFile(productionJson,'// This file is created automatically and will be overwritten\n\nmodule.exports = ',JSON.stringify(combined));
  console.log(`Client configuration file '${productionJson}' has been re-created`);
}

// Restore before we leave
process.env = env;

process.exit();

