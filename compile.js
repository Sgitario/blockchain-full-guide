const path = require('path'); // for cross platform 
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');

// Remove build
fs.removeSync(buildPath);

// Create build folder if it does not exist
fs.ensureDirSync(buildPath);

const registry = [ 'inbox.sol', 'lottery.sol' ];
for (let index in registry) {
    let contractPath = path.resolve(__dirname, 'contracts', registry[index]);
    let source = fs.readFileSync(contractPath, 'utf8');
    let output = solc.compile(source, 1).contracts;

    for (let contract in output) {
        fs.outputJsonSync(
            path.resolve(buildPath, contract.replace(':', '') + '.json'), 
            output[contract]
        );
    }
}