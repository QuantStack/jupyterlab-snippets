var requirejs = require('requirejs');
var fs = require('fs');
var sanitizeFilename = require('sanitize-filename');


const source = process.argv[2];
const destination = process.argv[3];
const extension = process.argv[4] || '';

requirejs.config({
    nodeRequire: require
});
require('node-define');

sourceData = require(source);

if (!fs.existsSync(destination)){
    fs.mkdirSync(destination);
}

function createLevel(path, data) {
    if (!data.name) {
        return
    }
    const newPath = `${path}/${sanitizeFilename(data.name)}`;

    if (data.snippet) {
        fs.writeFile(`${newPath}${extension}`, data.snippet.join('\n'), function (err) {
            if (err) throw err;
        });
    } else if (data['sub-menu']) {
        if (!fs.existsSync(newPath)){
            fs.mkdirSync(newPath);
        }
        data['sub-menu'].forEach(submenu => {
            createLevel(newPath, submenu);
        });
    }
}

createLevel(destination, sourceData);
