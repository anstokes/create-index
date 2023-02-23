"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_EXPORT_PATTERN = exports.CREATE_INDEX_PATTERN = void 0;
/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

const CREATE_INDEX_PATTERN = /(?:^|[\n\r]+)\/\/ @create-index\s?({.*})?[\n\r]+/;
exports.CREATE_INDEX_PATTERN = CREATE_INDEX_PATTERN;
const DEFAULT_EXPORT_PATTERN = /export default/is;
exports.DEFAULT_EXPORT_PATTERN = DEFAULT_EXPORT_PATTERN;
//# sourceMappingURL=constants.js.map