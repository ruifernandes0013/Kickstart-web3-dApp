import path from 'path'
import { fileURLToPath } from 'url';
import solc from 'solc'
import fs from 'fs-extra'

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)


const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf-8')
const output = solc.compile(source, 1).contracts
console.log(output)

fs.ensureDirSync(buildPath)
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  )
}
