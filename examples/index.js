function handleHashChange() {

    let name = location.hash.slice(1);

    if (!name) return false;

    let children = document.body.children,
        child = children[0];
    while(child && child.tagName.toLowerCase() !== 'script') {
        document.body.removeChild(child);
        child = children[0];
    }

    switch(name) {
        case 'wireframe':
            return import('./wireframe');
        case 'line':
            return import('./line');
        case 'lineSegments':
            return import('./lineSegments');
        case 'gridHelper':
            import('./gridHelper').then(({default: ExampleContructor}) => {
                if (ExampleContructor) example = runExample(ExampleContructor);
            });
            break;
        default:
            console.warn(`未知的module: ${name}`);
    }

}

function runExample(Example) {
    let example = new Example();
    example.run();
    return example;
}

let example = null;

window.addEventListener('hashchange', handleHashChange, false);

handleHashChange();
