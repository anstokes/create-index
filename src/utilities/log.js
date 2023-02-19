/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import chalk from 'chalk';
import moment from 'moment';

export default (...append) => {
  // eslint-disable-next-line no-console
  console.log(chalk.dim(`[${moment().format('HH:mm:ss')}]`), ...append);
};
