#!/usr/bin/env node

/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import yargs from 'yargs';

import {
  writeIndexCli,
} from '../utilities';

const { argv } = yargs
  .demand(1)
  .options({
    recursive: {
      alias: 'r',
      default: false,
      description: 'Create/update index files recursively. Halts on any unsafe "index.js" files.',
      type: 'boolean',
    },
  })
  .options({
    ignoreUnsafe: {
      alias: 'i',
      default: false,
      description: 'Ignores unsafe "index.js" files instead of halting.',
      type: 'boolean',
    },
  })
  .options({
    ignoreDirectories: {
      alias: 'd',
      default: false,
      description: 'Ignores importing directories into the index file, even if they have a safe "index.js".',
      type: 'boolean',
    },
  })
  .options({
    update: {
      alias: 'u',
      default: false,
      description: 'Updates only previously created index files (recursively).',
      type: 'boolean',
    },
  })
  .options({
    header: {
      description: 'Add a custom header at the top of the index files',
      type: 'string',
    },
  })
  .options({
    extensions: {
      alias: 'x',
      default: ['js'],
      description: 'Allows some extensions to be parsed as valid source. First extension will always be preferred to homonyms with another allowed extension.',
      type: 'array',
    },
  })
  .options({
    outputFile: {
      alias: 'o',
      default: 'index.js',
      description: 'Output file',
      type: 'string',
    },
  })
  .options({
    noSemicolons: {
      alias: 'nsc',
      default: false,
      description: 'No semicolons at the end of each export line',
      type: 'boolean',
    },
  })
  .example(
    'create-index ./src ./src/utilities',
    'Creates or updates an existing create-index index file in the target (./src, ./src/utilities) directories.',
  )
  .example(
    'create-index --update ./src ./tests',
    'Finds all create-index index files in the target directories and descending directories. Updates found index files.',
  )
  .example(
    'create-index ./src --extensions js jsx',
    'Creates or updates an existing create-index index file in the target (./src) directory for both .js and .jsx extensions.',
  );

writeIndexCli(argv._, {
  extensions: argv.extensions,
  header: argv.header,
  ignoreDirectories: argv.ignoreDirectories,
  ignoreUnsafe: argv.ignoreUnsafe,
  noSemicolons: argv.noSemicolons,
  outputFile: argv.outputFile,
  recursive: argv.recursive,
  updateIndex: argv.update,
});
