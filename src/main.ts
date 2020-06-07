import * as mjAPI from 'mathjax-node';
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

console.log(argv.tex);
console.log(argv.settings);
console.log(argv.out);

const toString = (s: unknown): string => {
  if (typeof s === 'string') {
    return s;
  } else {
    throw `'${s}' is not string`;
  }
};

const yourMath = fs.readFileSync(toString(argv.tex));
const jsonBuffer = fs.readFileSync(toString(argv.settings));
const settings = jsonc.jsonc.parse(jsonBuffer.toString());
const defaultSettings = { MathJax: {} };

mjAPI.config({ ...defaultSettings, ...settings["config"] });
mjAPI.start();


console.log("hoge");

const defaultOptions = {
  math: yourMath,
  format: "TeX", // or "inline-TeX", "MathML"
  svg: true,      // or svg:true, or html:true
};

mjAPI.typeset(
  { ...defaultOptions, ...settings["options"] },
  (data: any) => {
    fs.writeFileSync(toString(argv.out), data.svg);
  });