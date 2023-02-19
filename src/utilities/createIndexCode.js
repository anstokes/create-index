/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import stringHelpers from './stringHelpers';
import { DEFAULT_EXPORT_PATTERN } from './constants';

const safeVariableName = (fileName, caseConversion) => {
  let safeFileName = fileName;

  switch (caseConversion) {
    case 'pascal':
      safeFileName = stringHelpers.hyphenToPascalCase(fileName);
      break;

    case 'snake':
      safeFileName = stringHelpers.hyphenToSnakeCase(fileName);
      break;

    case 'camel':
      safeFileName = stringHelpers.hyphenToCamelCase(fileName);
      break;

    default:
    // No conversion
  }

  // Remove file extension
  const indexOfDot = safeFileName.indexOf('.');

  if (indexOfDot === -1) {
    return safeFileName;
  }
  return safeFileName.slice(0, indexOfDot);
};

const buildExportBlock = (directoryPath, files, options) => {
  const lineEnding = options.lineEnding || options.noSemicolons ? '' : ';';
  const classCase = ((options.config && options.config.case) || '').toLowerCase();
  const prefix = (options.config && options.config.prefix) || '';
  const suffix = (options.config && options.config.suffix) || '';

  let importBlock;
  importBlock = _.map(files, (fileName) => {
    // Default behaviour
    let importContents = 'export default';

    if (directoryPath) {
      try {
        let importPath = path.resolve(directoryPath, fileName);

        // Check if directory
        if (fs.statSync(importPath).isDirectory()) {
          // Read 'index.js' from the directory
          importPath = path.resolve(importPath, 'index.js');
        }

        // Read the file
        importContents = fs.readFileSync(importPath, 'utf-8');
      } catch (err) {
        // Unable to read file, revert to default behaviour
      }
    }

    // Check for default export
    const defaultExport = DEFAULT_EXPORT_PATTERN.test(importContents);

    // Define the export name
    const safeName = safeVariableName(fileName, classCase);
    let className = safeName;
    if (prefix) {
      switch (classCase) {
        // Same operation for camel and pascal case
        case 'camel':
        case 'pascal':
          className = stringHelpers.capitaliseFirstLetter(safeName);
          break;

        case 'snake':
          className = `_${className}`;
          break;

        default:
        // No conversion
      }
    }
    const exportAs = prefix + className + suffix;
    const exportType = defaultExport ? `{ default as ${exportAs} }` : `* as ${exportAs}`;

    return `export ${exportType} from './${safeVariableName(fileName)}'${lineEnding}`;
  });

  importBlock = importBlock.join('\n');

  return importBlock;
};

export default (directoryPath, filePaths, options = {}) => {
  let code;
  let configCode;

  code = '';
  configCode = '';

  if (options.header) {
    const headers = _.isArray(options.header) ? options.header : [options.header];

    headers.forEach((header) => {
      code += `${header}\n`;
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ` ${JSON.stringify(options.config)}`;
  }

  code += `// @create-index${configCode}\n`;

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += `\n${buildExportBlock(directoryPath, sortedFilePaths, options)}\n`;
  }

  return code;
};
