"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _lodash = _interopRequireDefault(require("lodash"));
var _stringHelpers = _interopRequireDefault(require("./stringHelpers"));
var _constants = require("./constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

const safeVariableName = (fileName, caseConversion) => {
  let safeFileName = fileName;
  switch (caseConversion) {
    case 'pascal':
      safeFileName = _stringHelpers.default.hyphenToPascalCase(fileName);
      break;
    case 'snake':
      safeFileName = _stringHelpers.default.hyphenToSnakeCase(fileName);
      break;
    case 'camel':
      safeFileName = _stringHelpers.default.hyphenToCamelCase(fileName);
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
  const classCase = (options.config && options.config.case || '').toLowerCase();
  const prefix = options.config && options.config.prefix || '';
  const suffix = options.config && options.config.suffix || '';
  let importBlock;
  importBlock = _lodash.default.map(files, fileName => {
    // Default behaviour
    let importContents = 'export default';
    if (directoryPath) {
      try {
        let importPath = _path.default.resolve(directoryPath, fileName);

        // Check if directory
        if (_fs.default.statSync(importPath).isDirectory()) {
          // Read 'index.js' from the directory
          importPath = _path.default.resolve(importPath, 'index.js');
        }

        // Read the file
        importContents = _fs.default.readFileSync(importPath, 'utf-8');
      } catch (err) {
        // Unable to read file, revert to default behaviour
      }
    }

    // Check for default export
    const defaultExport = _constants.DEFAULT_EXPORT_PATTERN.test(importContents);

    // Define the export name
    const safeName = safeVariableName(fileName, classCase);
    let className = safeName;
    if (prefix) {
      switch (classCase) {
        // Same operation for camel and pascal case
        case 'camel':
        case 'pascal':
          className = _stringHelpers.default.capitaliseFirstLetter(safeName);
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
var _default = function _default(directoryPath, filePaths) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let code;
  let configCode;
  code = '';
  configCode = '';
  if (options.header) {
    const headers = _lodash.default.isArray(options.header) ? options.header : [options.header];
    headers.forEach(header => {
      code += `${header}\n`;
    });
    code += '\n';
  }
  if (options.config && _lodash.default.size(options.config) > 0) {
    configCode += ` ${JSON.stringify(options.config)}`;
  }
  code += `// @create-index${configCode}\n`;
  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();
    code += `\n${buildExportBlock(directoryPath, sortedFilePaths, options)}\n`;
  }
  return code;
};
exports.default = _default;
//# sourceMappingURL=createIndexCode.js.map