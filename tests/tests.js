import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { parse } from 'csv-parse';

import sites from '../src/sites/sites.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const csvFile = `${dirname}/tests.csv`;

function getSite(url) {
    for (const site of sites) {
        if (site.checkUrl(url))
            return site;
    }

    return null;
}

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

        console.log(`Testing URL: ${data.url}`);

        const site = getSite(data.url);
        if (!site)
            throw new Error(`Can't find parser for URL: ${url}`);

        const info = await site.retrieveInfo(data.url);

        // Check values
        for (const key of Object.keys(data)) {
            if (key !== 'url')
                if (!checkValue(info[key], data[key]))
                    console.error(`Unexpected value (${info[key]}) instead of (${data[key]}) for field ${key}`);
        }
    }
}

let stream = fs.createReadStream(csvFile)
    .pipe(parse({ columns: true }));

try {
    processData(stream);
} catch (e) {
    console.error(e.message);
    console.log(e);
    process.exit(1);
}