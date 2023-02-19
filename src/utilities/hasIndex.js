/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import fs from 'fs';
import path from 'path';

export default (directoryPath, options = {}) => {
  const indexPath = path.resolve(directoryPath, options.outputFile || 'index.js');

  try {
    fs.statSync(indexPath);

    return true;
  } catch (err) {
    return false;
  }
};
