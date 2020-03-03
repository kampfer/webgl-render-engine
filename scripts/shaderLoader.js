const path = require('path');

const includeReg = /#include\s+['"]([^'"]*)['"]/g;
const shadersDir = path.join(__dirname, '../src/renderers/shaders');
const shaderCodePath = path.join(shadersDir, 'ShaderCode');

function takeDependencies(source) {

    let dependencies = [],
        match;

    while ((match = includeReg.exec(source)) !== null) {
        dependencies.push(match[1]);
    }

    return dependencies;

}

function generateCode(source) {
    // 替换特殊字符避免报错
    return JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')  // 行分隔符
        .replace(/\u2029/g, '\\u2029'); // 段落分隔符
}

function fixRelativePath(resourcePath) {
    resourcePath = resourcePath[0] !== '.' ? `./${resourcePath}` : resourcePath;
    return resourcePath.replace(/\u005C/g, '/');    // 反斜杠->正斜杠
}

function generateFile(resourcePath, source, dependencies) {

    let dependenciesImports = [],
        dependenciesCode = [],
        resourceRelativePath = fixRelativePath(path.relative(shadersDir, resourcePath)),
        shaderCodeRelativePath = fixRelativePath(path.relative(path.dirname(resourcePath), shaderCodePath));

    dependencies.forEach((dependency) => {

        let extname = path.extname(dependency),
            name = path.basename(dependency, extname);

        dependenciesCode.push(name);
        dependenciesImports.push(`import ${name} from ${generateCode(dependency)};`);

    });

    dependenciesImports = dependenciesImports.join('\n');
    dependenciesCode = dependenciesCode.join(',')

    return `
        import ShaderCode from ${generateCode(shaderCodeRelativePath)};
        ${dependenciesImports}

        export default new ShaderCode(${generateCode(resourceRelativePath)}, ${generateCode(source)}, [${dependenciesCode}]);
    `;

}

module.exports = function(source) {

    let dependencies = takeDependencies(source);

    this.addDependency('./ShaderCode');

    dependencies.forEach((dependency) => {
        this.addDependency(dependency);
    });

    return generateFile(this.resourcePath, source, dependencies);

};
