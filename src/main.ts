
interface IObjWithSvgTag {
  readonly svg: string;
};
interface ITypesetCallback { (o: IObjWithSvgTag): void };
interface IMathjaxAPI {
  start(): void;
  config(o: any): void;
  typeset(o: any, callback: ITypesetCallback): void;
}
const mjAPI = require('mathjax-node') as IMathjaxAPI;


import * as fs from 'fs';
import * as yargs from 'yargs'
import * as jsonc from 'jsonc';

const argv = yargs
  .option('tex', {
    alias: 't',
    description: 'input tex file',
    demandOption: true
  })
  .option('settings', {
    alias: 's',
    description: 'setting json',
    demandOption: true
  })
  .option('out', {
    alias: 'o',
    description: 'output svg file',
    demandOption: true
  })
  .help()
  .argv

const toString = (s: unknown): string => {
  if (typeof s === 'string') {
    return s;
  } else {
    throw `'${s}' is not string`;
  }
};

const texText = fs.readFileSync(toString(argv.tex));
const jsonBuffer = fs.readFileSync(toString(argv.settings));
const settings = jsonc.jsonc.parse(jsonBuffer.toString());
const defaultSettings = { MathJax: {} };

mjAPI.config({ ...defaultSettings, ...settings["config"] });
mjAPI.start();

const defaultOptions = {
  math: texText,
  format: "TeX", // the input format
  svg: true, // generate SVG output
};

mjAPI.typeset(
  { ...defaultOptions, ...settings["options"] },
  (data: IObjWithSvgTag) => {
    fs.writeFileSync(toString(argv.out), data.svg);
  });