import _ from 'lodash';
import stringHelpers from './stringHelpers';

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

const buildExportBlock = (files, options) => {
  let importBlock;
  const prefix = options.config && options.config.prefix || '';
  const suffix = options.config && options.config.suffix || '';
  const noSemicolons = Boolean(options.noSemicolons);

  importBlock = _.map(files, (fileName) => {
    const importName = prefix ? stringHelpers.capitaliseFirstLetter(safeVariableName(fileName)) : safeVariableName(fileName);

    return 'export { default as ' + prefix + importName + suffix + ' } from \'./' + fileName + '\'' + (noSemicolons ? '' : ';');
  });

  importBlock = importBlock.join('\n');

  return importBlock;
};

export default (filePaths, options = {}) => {
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

    code += '\n' + buildExportBlock(sortedFilePaths, options) + '\n';
  }

  return code;
};
