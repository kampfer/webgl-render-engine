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
        default:
            console.warn(`未知的module: ${name}`);
    }

}

window.addEventListener('hashchange', handleHashChange, false);

handleHashChange();
