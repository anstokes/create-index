/* eslint-disable no-restricted-syntax */

import {
  expect,
} from 'chai';
import createIndexCode from '../src/utilities/createIndexCode';
import codeExample from './codeExample';

describe('createIndexCode()', () => {
  it('describes no children', () => {
    const indexCode = createIndexCode(null, []);

    expect(indexCode).to.equal(codeExample(`
// @create-index
    `));
  });
  it('describes a single child', () => {
    const indexCode = createIndexCode(null, ['foo']);

    expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as foo } from './foo';
    `));
  });
  it('describes multiple children', () => {
    const indexCode = createIndexCode(null, ['bar', 'foo']);

    expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as bar } from './bar';
export { default as foo } from './foo';
    `));
  });
  context('file with extension', () => {
    it('removes the extension from the export statement', () => {
      const indexCode = createIndexCode(null, ['foo.js']);

      expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as foo } from './foo';
      `));
    });
  });
  context('multiple, unsorted', () => {
    it('sorts the files', () => {
      const indexCode = createIndexCode(null, ['foo', 'bar']);

      expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as bar } from './bar';
export { default as foo } from './foo';
      `));
    });
  });

  context('with config', () => {
    it('should append config', () => {
      const config = {
        ignore: ['/^zoo/'],
      };
      const indexCode = createIndexCode(null, ['foo', 'bar'], {config});

      expect(indexCode).to.equal(codeExample(`
// @create-index {"ignore":["/^zoo/"]}

export { default as bar } from './bar';
export { default as foo } from './foo';
      `));
    });
  });
});
