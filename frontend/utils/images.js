var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

function readDir(dirPath) {
  return fs.readdirSync(__dirname + '/../assets/images/creator/' + dirPath).map(f => f.split('.')[0]);
};

let parseDir = function(dirPath) {
  files = readDir(dirPath);
  let parsed = {};
  files.forEach(function(file) {
    let key = file.replace(/_back|_front/g, '');
    parsed[key] = parsed[key] || {};

    // Back part
    if (file.match(/_back/)) {
      parsed[key].back = file;
      return;
    }

    parsed[key].front = file;
  });

  return Object.keys(parsed).map(k => parsed[k]);
};

module.exports = {
  base: {
    male: parseDir('base/male'),
    female: parseDir('base/female'),
  },
  hair: {
    male: parseDir('hair/male'),
    female: parseDir('hair/female'),
  },
  'hair-front': {
    male: parseDir('hair-front/male'),
    female: parseDir('hair-front/female'),
  },
  'hair-back': {
    male: parseDir('hair-back/male'),
    female: parseDir('hair-back/female'),
  },
  body: {
    male: parseDir('body/male'),
    female: parseDir('body/female'),
  },
  armor: {
    unissex: parseDir('armor/unissex'),
  },
  accessory: {
    unissex: parseDir('accessory/unissex'),
    male: parseDir('accessory/male'),
    female: parseDir('accessory/female'),
  },
  mantle: {
    unissex: parseDir('mantle/unissex'),
  },
  wing: {
    unissex: parseDir('wing/unissex'),
  },
};
