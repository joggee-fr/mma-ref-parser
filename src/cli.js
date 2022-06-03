#! /usr/bin/env node

import process from 'process';
import Parser from './parser.js';

const args = process.argv.slice(2);

if (args.length == 0) {
	console.log("Missing URL parameter");
	process.exit(1);
}

const url = args[0];

console.log(`Processing URL: ${url}`);

try {
	let ref = await Parser.parse(args[0]);
	console.log('Processing succeed');
	console.log(ref);
} catch (e) {
	console.error('Processing failed');

	if (e.message) {
		console.error(e.message);
		console.log(e);
	}

	process.exit(1);
}
