import fs from 'fs';
import glob from 'glob';
import { injectTestValues } from '../../tests/grammar/util';

const templates: string[] = [];

// Use a leading space to avoid messing up with markers like "r_column_1".
const NUMBER_VALUES = [' 5', ' 15', ' 0.5', ' 1'];
const replaceNumberValues = (query: string): string => {
  NUMBER_VALUES.forEach(pattern => {
    query = query.replace(RegExp(pattern, 'g'), ' r_number');
  });
  return query;
};

const STRING_VALUES = ['buick'];
const replaceStringValues = (query: string): string => {
  STRING_VALUES.forEach(pattern => {
    query = query.replace(RegExp(pattern, 'g'), 'r_string');
  });
  return query;
};

const replaceStopNouns = (query: string): string => {
  query = query.replace(/cars/g, 'elements');
  return query;
};

const normalizeTemplate = (template: string): string => {
  // Replace number and string values by markers.
  template = replaceNumberValues(template);
  template = replaceStringValues(template);
  template = replaceStopNouns(template);
  // Replaces special utterances by markers.
  template = injectTestValues(template);
  return template;
};

glob('tests/**/*.test.ts', (err, files) => {
  for (const filepath of files) {
    const f = fs.readFileSync(filepath).toString();
    for (const line of f.split('\n')) {
      const matched = line.match(/checkQuery\(\'([^,]*)\',/);
      if (matched === null) {
        continue;
      }
      templates.push(normalizeTemplate(matched[1]));
      fs.writeFileSync('data/templates.json', JSON.stringify(templates, undefined, 2), 'utf8');
    }
  }
});
