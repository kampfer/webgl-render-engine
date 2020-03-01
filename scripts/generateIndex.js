const pathLib = require('path');
const fs = require('fs');
const { walk } = require('./utils');

let entries = [],
    dir = 'src';

walk(dir, (root, dirs, files) => {

    if (files) {

        files.forEach((filePath) => {

            let extname = pathLib.extname(filePath);

            if (extname === '.js') {

                let name = pathLib.basename(filePath, '.js');

                entries.push({
                    name,
                    path: `./${pathLib.relative(dir, filePath).replace(/\\/g, '/').replace('.js', '')}`
                });

            }

        });
    }

});

let indexContent = [];

entries.forEach((entry) => {

    let name = entry.name,
        entryPath = entry.path;

    if (entryPath === './index') return;

    if (entry.name === 'index') {
        entryPath = pathLib.dirname(entryPath);
        name = pathLib.basename(entryPath);
    }

    // indexContent.push(`export ${entry.name} from '${entry.path}';`);
    // indexContent.push(`export default as ${entry.name} from '${entry.path}';`);
    // indexContent.push(`export default from '${entry.path}';`);
    indexContent.push(`export { default as ${name} } from '${entryPath}';`);

});

fs.writeFileSync(pathLib.join(dir, 'index.js'), indexContent.join('\n'));
