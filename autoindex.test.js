import test from 'ava';
import fs from 'fs-extra';
import uniqueTempDir from 'unique-temp-dir';
import Promise from 'bluebird';
import childProcess from 'child_process';
const execFile = Promise.promisify(childProcess.execFile, {multiArgs: true});

const touch = (path) => {
  fs.closeSync(fs.openSync(path, 'w'));
};

test('cli: creates summary page', async t => {
  const root = uniqueTempDir({create: true, thunk: true});
  const outputs = await execFile(
    './bin/gitbook-autoindex.js', [root(), '--debug']);
  t.truthy(fs.existsSync(root('SUMMARY.md')), outputs);
});

test('cli: creates summary page under a non-cwd root', async t => {
  const root = uniqueTempDir({create: true, thunk: true});
  fs.ensureDirSync(root('a'));
  touch(root('a/hello.md'));
  const outputs = await execFile(
    './bin/gitbook-autoindex.js', [root('a'), '--debug']);
  t.truthy(fs.existsSync(root('a/SUMMARY.md')), outputs);
});

test('cli: creates summary page under a non-cwd root set by book.json', async t => {
  const root = uniqueTempDir({create: true, thunk: true});
  fs.ensureDirSync(root('a'));
  touch(root('a/hello.md'));
  fs.writeJsonSync(root('book.json'), {'root': 'a'});
  const outputs = await execFile(
    './bin/gitbook-autoindex.js', [root(), '--debug']);
  t.truthy(fs.existsSync(root('a/SUMMARY.md')), outputs);
});

test('cli: creates index pages', async t => {
  const root = uniqueTempDir({create: true, thunk: true});
  fs.ensureDirSync(root('a'));
  touch(root('a/hello.md'));
  const outputs = await execFile(
    './bin/gitbook-autoindex.js', [root(), '--debug']);
  t.truthy(fs.existsSync(root('a/_index.md')), outputs);
});