import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import stringHelpers from './stringHelpers';
import {DEFAULT_EXPORT_PATTERN} from './constants';

const safeVariableName = (fileName) => {
  // Convert hyphenated filename to camelCase
  const indexOfHyphen = fileName.indexOf('-');

  let safeFileName = fileName;
  if (indexOfHyphen !== -1) {
    safeFileName = stringHelpers.hyphenToCamelCase(fileName);
  }

  // Remove file extension
  const indexOfDot = safeFileName.indexOf('.');

  if (indexOfDot === -1) {
    return safeFileName;
  } else {
    return safeFileName.slice(0, indexOfDot);
  }
};

const buildExportBlock = (directoryPath, files, options) => {
  let importBlock;
  const lineEnding = Boolean(options.noSemicolons) ? '' : ';';
  const prefix = options.config && options.config.prefix || '';
  const suffix = options.config && options.config.suffix || '';

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
      } catch {
        // Unable to read file, revert to default behaviour
      }
    }

    // Check for default export
    const defaultExport = DEFAULT_EXPORT_PATTERN.test(importContents);

    // Define the export name
    const safeName = safeVariableName(fileName);
    const className = prefix ? stringHelpers.capitaliseFirstLetter(safeName) : safeName;
    const exportAs = prefix + className + suffix;
    const exportType = defaultExport ? '{ default as ' + exportAs + ' }' : '* as ' + exportAs;

    return 'export ' + exportType + ' from \'./' + safeName + '\'' + lineEnding;
  });

  importBlock = importBlock.join('\n');

  return importBlock;
};

export default (directoryPath, filePaths, options = {}) => {
  let code;
  let configCode;

  code = '';
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ? options.banner : [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n';

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += '\n' + buildExportBlock(directoryPath, sortedFilePaths, options) + '\n';
  }

  return code;
};
