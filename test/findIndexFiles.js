/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import glob from 'glob';
import path from 'path';
import { expect } from 'chai';

import findIndexFiles from '../src/utilities/findIndexFiles';

const fixturesPath = path.resolve(__dirname, '../../fixtures/find-index-files');

describe('findIndexFiles()', () => {
  it('finds only the directories that have an existing valid index file', () => {
    let names;

    names = findIndexFiles(path.resolve(fixturesPath));
    names = names.sort();

    expect(names).to.deep.equal(glob.sync(path.resolve(fixturesPath, '**/find-*')));
  });
});
