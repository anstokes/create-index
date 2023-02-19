/**
 * @author    Adrian Stokes <adrian@anstech.co.uk>
 * @company   ANSTECH Limited
 * @copyright 2023 ANSTECH Limited
 * @license   None, all rights reserved
 */

import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import codeExample from './codeExample';
import writeIndex from '../src/utilities/writeIndex';

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

const removeFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    // File may not exist, from previous failed test
  }
};

const appendToFile = (filePath, content) => {
  fs.appendFileSync(filePath, content, 'utf-8');
};

const fixturesPath = path.resolve(__dirname, 'fixtures/write-index');

describe('writeIndex()', () => {
  it('creates index in target directory', () => {
    const indexFilePath = path.resolve(fixturesPath, 'mixed/index.js');

    removeFile(indexFilePath);
    writeIndex([path.resolve(fixturesPath, 'mixed')]);
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index

export * as bar from './bar';
export * as foo from './foo';
    `));
  });

  it('creates index with config in target directory', () => {
    const indexFilePath = path.resolve(fixturesPath, 'with-config/index.js');
    const ignoredExportLine = 'export { default as bar } from \'./bar.js\';';

    appendToFile(indexFilePath, ignoredExportLine);
    expect(readFile(indexFilePath).includes(ignoredExportLine)).to.equal(true);

    writeIndex([path.resolve(fixturesPath, 'with-config')]);
    const indexCode = readFile(indexFilePath);

    expect(indexCode).to.equal(codeExample(`
// @create-index {"ignore":["/bar.js$/"]}

export * as foo from './foo';
    `));
  });
});
