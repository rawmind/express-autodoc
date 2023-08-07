const fs = require('fs')

function walk(dir, extensions = ['js']) {
  var results = [];

  var stat = fs.statSync(dir);

  if (!stat || !stat.isDirectory()) {
    return [dir];
  }

  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (/node_modules/.test(file)) {
        return
      }
      results = results.concat(walk(file));
    } else {
      if (!extensions.includes(file.split('.').pop())) {
        return
      }
      results.push(file);
    }
  });
  return results;
}

exports.walk = walk;