/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import chalk from 'chalk';

import createIndexCode from './createIndexCode';
import log from './log';
import findIndexFiles from './findIndexFiles';
import readDirectory from './readDirectory';
import readIndexConfig from './readIndexConfig';
import sortByDepth from './sortByDepth';
import validateTargetDirectory from './validateTargetDirectory';

export default (directoryPaths, options = {}) => {
  let sortedDirectoryPaths;

  sortedDirectoryPaths = sortByDepth(directoryPaths);

  log('Target directories', sortedDirectoryPaths);
  log('Output file', options.outputFile);
  if (options.updateIndex) {
    log('Update index:', options.updateIndex ? chalk.green('true') : chalk.red('false'));
  } else {
    log('Recursive:', options.recursive ? chalk.green('true') : chalk.red('false'));
    log('Ignore unsafe:', options.ignoreUnsafe ? chalk.green('true') : chalk.red('false'));
    log('Extensions:', chalk.green(options.extensions));
    log('Semicolons:', options.noSemicolons ? chalk.red('false') : chalk.green('true'));
  }

  if (options.updateIndex || options.recursive) {
    sortedDirectoryPaths = _.map(sortedDirectoryPaths, (directory) => findIndexFiles(directory, {
      fileName: options.updateIndex ? options.outputFile || 'index.js' : '*',
      silent: options.updateIndex || options.ignoreUnsafe,
    }));
    sortedDirectoryPaths = _.flatten(sortedDirectoryPaths);
    sortedDirectoryPaths = _.uniq(sortedDirectoryPaths);
    sortedDirectoryPaths = sortByDepth(sortedDirectoryPaths);

    log('Updating index files in:', sortedDirectoryPaths.reverse().join(', '));
  }

  sortedDirectoryPaths = sortedDirectoryPaths.filter(
    (directoryPath) => validateTargetDirectory(directoryPath, {
      outputFile: options.outputFile,
      silent: options.ignoreUnsafe,
    }),
  );

  _.forEach(sortedDirectoryPaths, (directoryPath) => {
    let existingIndexCode;

    const config = readIndexConfig(directoryPath, options);

    const siblings = readDirectory(directoryPath, {
      config,
      extensions: options.extensions,
      ignoreDirectories: options.ignoreDirectories,
      silent: options.ignoreUnsafe,
    });

    const indexCode = createIndexCode(directoryPath, siblings, {
      header: options.header,
      config,
      noSemicolons: options.noSemicolons,
    });

    const indexFilePath = path.resolve(directoryPath, options.outputFile || 'index.js');

    try {
      existingIndexCode = fs.readFileSync(indexFilePath, 'utf8');
    } catch (err) {
      // Unable to read file
    }

    fs.writeFileSync(indexFilePath, indexCode);

    if (existingIndexCode && existingIndexCode === indexCode) {
      log(indexFilePath, chalk.yellow('[index has not changed]'));
    } else if (existingIndexCode && existingIndexCode !== indexCode) {
      log(indexFilePath, chalk.green('[updated index]'));
    } else {
      log(indexFilePath, chalk.green('[created index]'));
    }
  });

  log('Done');
};
