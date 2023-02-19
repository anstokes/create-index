/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import createIndexCode from './createIndexCode';
import readDirectory from './readDirectory';
import readIndexConfig from './readIndexConfig';
import sortByDepth from './sortByDepth';
import validateTargetDirectory from './validateTargetDirectory';

export default (directoryPaths, options = {}) => {
  const sortedDirectoryPaths = sortByDepth(directoryPaths)
    .filter((directoryPath) => validateTargetDirectory(directoryPath, {
      outputFile: options.outputFile,
      silent: options.ignoreUnsafe,
    }));

  _.forEach(sortedDirectoryPaths, (directoryPath) => {
    const config = readIndexConfig(directoryPath, options);
    const optionsWithConfig = { ...options, config };
    const siblings = readDirectory(directoryPath, optionsWithConfig);
    const indexCode = createIndexCode(directoryPath, siblings, optionsWithConfig);
    const indexFilePath = path.resolve(directoryPath, options.outputFile || 'index.js');

    fs.writeFileSync(indexFilePath, indexCode);
  });
};
