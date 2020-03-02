const pathLib = require('path');
const fs = require('fs');

exports.walk = function walk(path, callback) {

    let root,
        dirs = null,
        files = null,
        stat = fs.statSync(path);

    if (stat.isDirectory()) {

        root = path;

        let paths = fs.readdirSync(path);

        for(let i = 0, l = paths.length; i < l; i++) {

            let subPath = pathLib.join(path, paths[i]),
                subStat = fs.statSync(subPath);

            if (subStat.isDirectory()) {
                if (dirs === null) dirs = [];
                dirs.push(subPath);
            } else {
                if (files === null) files = [];
                files.push(subPath);
            }

        }

    } else {

        root = pathLib.dirname(path);

        if (files === null) files = [];
        files.push(path);

    }

    if (callback) callback(root, dirs, files);

    if (dirs) {

        for(let i = 0, l = dirs.length; i < l; i++) {

            walk(dirs[i], callback);

        }

    }

}

exports.findEntries = function findEntries(dir) {
    let paths = fs.readdirSync(dir),
        entries = {};

    for(let i = 0, l = paths.length; i < l; i++) {
        let p = pathLib.join(dir, paths[i]),
            extname = pathLib.extname(p);
        if (extname === '') {
            let subEntries = findEntries(p);
            for (let name in subEntries) {
                entries[name] = subEntries[name];
            }
        } else if(extname === '.html') {
            let basename = pathLib.basename(p, extname);
            entries[basename] = {
                name: basename,
                html: pathLib.format({
                    dir,
                    name: basename,
                    ext: '.html'
                }),
                js: pathLib.format({
                    dir,
                    name: basename,
                    ext: '.js'
                })
            };
        }
    }

    return entries;
}

