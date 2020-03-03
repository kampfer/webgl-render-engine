export default class ShaderCode {

    constructor(path, source, dependencies) {
        this._path = path;
        this._source = source;
        this._dependencies = dependencies;
        this._compiled = false;
    }

    getDependency(path) {
        for(let i = 0, dependencies = this._dependencies, l = dependencies.length; i < l; i++) {
            let dependency = dependencies[i];
            if (dependency._path === path) return dependency;
        }
    }

    compile() {

        if (!this._compiled) {

            let includeReg = /#include\s+['"]([^'"]*)['"]/g,
                source = this._source,
                matches = [],
                newSource = this._source,
                match;

            while ((match = includeReg.exec(source)) !== null) {

                let sourcePath = match[1],
                    dependency = this.getDependency(sourcePath);

                if (dependency) {
                    matches.push([match[0], dependency.compile()])
                }

            }

            for(let i = 0, l = matches.length; i < l; i++) {

                let match = matches[i];

                newSource = newSource.replace(match[0], match[1]);

            }

            this._source = newSource;

            this._compiled = true;

        }

        return this._source;

    }

}