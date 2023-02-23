"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _lodash = _interopRequireDefault(require("lodash"));
var _createIndexCode = _interopRequireDefault(require("./createIndexCode"));
var _readDirectory = _interopRequireDefault(require("./readDirectory"));
var _readIndexConfig = _interopRequireDefault(require("./readIndexConfig"));
var _sortByDepth = _interopRequireDefault(require("./sortByDepth"));
var _validateTargetDirectory = _interopRequireDefault(require("./validateTargetDirectory"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */
var _default = function _default(directoryPaths) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const sortedDirectoryPaths = (0, _sortByDepth.default)(directoryPaths).filter(directoryPath => (0, _validateTargetDirectory.default)(directoryPath, {
    outputFile: options.outputFile,
    silent: options.ignoreUnsafe
  }));
  _lodash.default.forEach(sortedDirectoryPaths, directoryPath => {
    const config = (0, _readIndexConfig.default)(directoryPath, options);
    const optionsWithConfig = {
      ...options,
      config
    };
    const siblings = (0, _readDirectory.default)(directoryPath, optionsWithConfig);
    const indexCode = (0, _createIndexCode.default)(directoryPath, siblings, optionsWithConfig);
    const indexFilePath = _path.default.resolve(directoryPath, options.outputFile || 'index.js');
    _fs.default.writeFileSync(indexFilePath, indexCode);
  });
};
exports.default = _default;
//# sourceMappingURL=writeIndex.js.map