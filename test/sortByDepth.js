/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import { expect } from 'chai';

import sortByDepth from '../src/utilities/sortByDepth';

describe('sortByDepth()', () => {
  it('sorts from deepest to the most shallow', () => {
    const paths = [
      '/b',
      '/a',
      '/a/b/c',
      '/a/b',
    ];

    const sortedPaths = sortByDepth(paths);

    expect(sortedPaths).to.deep.equal(['/a/b/c', '/a/b', '/b', '/a']);
  });
});
