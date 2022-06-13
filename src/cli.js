#! /usr/bin/env node

import log from 'npmlog';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import Parser from './parser.js';

const logPrefix = 'cli';

const argv = yargs(hideBin(process.argv))
    .alias('f', 'force')
    .nargs('f', 0)
    .alias('l', 'log')
    .nargs('l', 1)
    .argv;

const args = argv._;

if (args.length == 0) {
	log.error(logPrefix, 'Missing URL parameter');
	process.exit(1);
}

const url = args[0];

if (argv.l)
	log.level = argv.l;

log.info(logPrefix, `Processing URL: ${url}`);

try {
	let ref = await Parser.parse(args[0], argv.f);
	log.info(logPrefix, 'Processing succeed');
	console.log(ref);
} catch (e) {
	log.error(logPrefix, 'Processing failed');

	if (e.message) {
		log.error(logPrefix, e.message);
		log.verbose(logPrefix, e);
	}

	process.exit(1);
}
