import { parse } from 'csv-parse';
import fs from 'fs';
import log from 'npmlog';
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import Sites from '../src/sites.js';

const logPrefix = 'tests';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const csvFile = `${dirname}/tests.csv`;

function checkArray(retrievedValue, expectedValue) {
    if (expectedValue.length === retrievedValue.length) {
        retrievedValue.sort();
        return expectedValue.sort().every((item, index) => {
            return (item === retrievedValue[index]);
        });
    }

    return false;
}

function checkValue(retrievedValue, expectedValue) {
    if (Array.isArray(expectedValue)) {
        const check = checkArray(retrievedValue, expectedValue);
        return check;
    }

    if (expectedValue instanceof Date) {
        return (
               (expectedValue.getDay() === retrievedValue.getDay())
            && (expectedValue.getMonth() === retrievedValue.getMonth())
            && (expectedValue.getFullYear() === retrievedValue.getFullYear()));
    }

    return (retrievedValue === expectedValue);
}

async function processData(readable) {
    for await (let data of readable) {
        // Create author array
        data.authors = data.authors.split(',');
        data.authors.forEach((item, index, array) => {
            array[index] = item.trim();
        });

        // Create date
        data.date = new Date(data.date);

        log.info(logPrefix, `Testing URL: ${data.url}`);

        const site = Sites.getSite(data.url);
        if (!site)
            throw new Error(`Can't find parser for URL: ${url}`);

        const info = await site.retrieveInfo(data.url);

        // Check values
        for (const key of Object.keys(data)) {
            if (key !== 'url')
                if (!checkValue(info[key], data[key]))
                    log.error(logPrefix, `Unexpected value (${info[key]}) instead of (${data[key]}) for field ${key}`);
        }
    }
}

const argv = yargs(hideBin(process.argv))
    .alias('l', 'log')
    .nargs('l', 1)
    .argv;

if (argv.l)
    log.level = argv.l;

const stream = fs.createReadStream(csvFile)
    .pipe(parse({ columns: true }));

try {
    processData(stream);
} catch (e) {
    log.error(logPrefix, e.message);
    log.verbose(logPrefix, e);
    process.exit(1);
}