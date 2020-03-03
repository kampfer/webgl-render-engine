const pathLib = require('path');
const fs = require('fs');
const { walk } = require('./utils');

let entries = [],
    dir = pathLib.join(__dirname, '../src'),
    indexPath = pathLib.join(dir, 'index.js');

fs.unlinkSync(indexPath);

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

    if (entry.name === 'index') {
        entryPath = pathLib.dirname(entryPath);
        name = pathLib.basename(entryPath);
    }

    if (entryPath === './constants') {
        indexContent.push(`import * as ${name} from '${entryPath}';`);
        indexContent.push(`export { ${name} };`);
        return;
    }

    if (entryPath === './math/utils') {
        indexContent.push(`import * as mathUtils from '${entryPath}';`);
        indexContent.push(`export { mathUtils };`);
        return;
    }

    // indexContent.push(`export ${entry.name} from '${entry.path}';`);
    // indexContent.push(`export default as ${entry.name} from '${entry.path}';`);
    // indexContent.push(`export default from '${entry.path}';`);
    indexContent.push(`export { default as ${name} } from '${entryPath}';`);

});

fs.writeFileSync(indexPath, indexContent.join('\n'));
