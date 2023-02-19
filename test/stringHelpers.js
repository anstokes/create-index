/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import { expect } from 'chai';

import stringHelpers from '../src/utilities/stringHelpers';

describe('capitaliseFirstLetter()', () => {
  it('converts "this" to "This"', () => {
    const Capitalised = stringHelpers.capitaliseFirstLetter('this');

    expect(Capitalised).to.equal('This');
  });
});

describe('hyphenToCamelCase()', () => {
  it('converts "this-is-good" to "thisIsGood"', () => {
    const Camelised = stringHelpers.hyphenToCamelCase('this-is-good');

    expect(Camelised).to.equal('thisIsGood');
  });
});

describe('hyphenToPascalCase()', () => {
  it('converts "this-is-good" to "ThisIsGood"', () => {
    const Pascalised = stringHelpers.hyphenToPascalCase('this-is-good');

    expect(Pascalised).to.equal('ThisIsGood');
  });
});

describe('hyphenToPascalCase()', () => {
  it('converts "this-is-good" to "this_is_good"', () => {
    const Snaked = stringHelpers.hyphenToSnakeCase('this-is-good');

    expect(Snaked).to.equal('this_is_good');
  });
});
