/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

const stringHelpers = {
  capitaliseFirstLetter: (string) => string.charAt(0).toUpperCase() + string.slice(1),
  hyphenToCamelCase: (hyphenated) => hyphenated.replace(/-([a-z])/g, (string) => string[1].toUpperCase()),
  hyphenToPascalCase: (hyphenated) => {
    const camelCase = stringHelpers.hyphenToCamelCase(hyphenated);

    return camelCase[0].toUpperCase() + camelCase.slice(1, camelCase.length);
  },
  hyphenToSnakeCase: (hyphenated) => hyphenated.replace(/-([a-z])/g, (letter) => `_${letter[1].toLowerCase()}`),
};

export default stringHelpers;
