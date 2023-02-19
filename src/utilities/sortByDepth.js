/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import _ from 'lodash';

export default (paths) => _.sortBy(paths, (path) => -path.split('/').length);
