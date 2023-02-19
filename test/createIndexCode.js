/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import { expect } from 'chai';

import createIndexCode from '../src/utilities/createIndexCode';
import codeExample from './codeExample';

describe('createIndexCode()', () => {
  // No modules
  it('describes no children', () => {
    const indexCode = createIndexCode(null, []);

    expect(indexCode).to.equal(codeExample(`
// @create-index
    `));
  });

  // Single module
  it('describes a single child', () => {
    const indexCode = createIndexCode(null, ['foo']);

    expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as foo } from './foo';
    `));
  });

  // Nultiple modules
  it('describes multiple children', () => {
    const indexCode = createIndexCode(null, ['bar', 'foo']);

    expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as bar } from './bar';
export { default as foo } from './foo';
    `));
  });

  // Module with file extension
  context('file with extension', () => {
    it('removes the extension from the export statement', () => {
      const indexCode = createIndexCode(null, ['foo.js']);

      expect(indexCode).to.equal(codeExample(`
// @create-index

export { default as foo } from './foo';
      `));
    });
  });

  // Multiple, unsorted modules
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

  // With custom configuration
  context('with config', () => {
    it('should append config', () => {
      const config = {
        ignore: ['/^zoo/'],
      };
      const indexCode = createIndexCode(null, ['foo', 'bar'], { config });

      expect(indexCode).to.equal(codeExample(`
// @create-index {"ignore":["/^zoo/"]}

export { default as bar } from './bar';
export { default as foo } from './foo';
      `));
    });

    // Apply configuration
    context('should use "case" config, if provided', () => {
      it('should corrected apply Camel case', () => {
        const config = {
          case: 'camel',
        };

        const indexCode = createIndexCode(null, ['convert-to-camel'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"case":"camel"}

export { default as convertToCamel } from './convert-to-camel';
        `));
      });

      it('should corrected apply Pascal case', () => {
        const config = {
          case: 'pascal',
        };

        const indexCode = createIndexCode(null, ['convert-to-pascal'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"case":"pascal"}

export { default as ConvertToPascal } from './convert-to-pascal';
        `));
      });

      it('should corrected apply Snake case', () => {
        const config = {
          case: 'snake',
        };

        const indexCode = createIndexCode(null, ['convert-to-snake'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"case":"snake"}

export { default as convert_to_snake } from './convert-to-snake';
        `));
      });

      it('should corrected apply prefix with camelCase', () => {
        const config = {
          case: 'camel',
          prefix: 'prefix',
        };

        const indexCode = createIndexCode(null, ['foo'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"case":"camel","prefix":"prefix"}

export { default as prefixFoo } from './foo';
        `));
      });

      it('should corrected apply prefix with snake_case', () => {
        const config = {
          case: 'snake',
          prefix: 'prefix',
        };

        const indexCode = createIndexCode(null, ['foo'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"case":"snake","prefix":"prefix"}

export { default as prefix_foo } from './foo';
        `));
      });

      it('should corrected apply suffix', () => {
        const config = {
          suffix: 'suffix',
        };

        const indexCode = createIndexCode(null, ['foo'], { config });
        expect(indexCode).to.equal(codeExample(`
// @create-index {"suffix":"suffix"}

export { default as foosuffix } from './foo';
        `));
      });
    });
  });

  // With header
  context('with header', () => {
    it('should prefix header', () => {
      const header = '/* eslint-disable */';
      const indexCode = createIndexCode(null, ['foo'], { header });

      expect(indexCode).to.equal(codeExample(`
/* eslint-disable */

// @create-index

export { default as foo } from './foo';
      `));
    });
  });
});
