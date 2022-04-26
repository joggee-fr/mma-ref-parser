import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const outputDirectory = `${dirname}/../src/sites`;
const outputFile = `${outputDirectory}/sites.js`;
let writer = fs.createWriteStream(outputFile);
const modules = [];

let files = fs.readdirSync(outputDirectory);
for (let file of files) {
    if (file == 'sites.js')
        continue;

    let module = path.parse(file);
    modules.push(module.name);
    writer.write(`import ${module.name} from './${file}';\n`);
}

writer.write('\nconst sites = [\n');

for (let module of modules) {
    writer.write(`    ${module},\n`);
}

writer.write(`];\n\n`);
writer.end(`export default sites;\n`);
