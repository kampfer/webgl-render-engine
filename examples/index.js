const examples = {
    gridHelper: () => import('./gridHelper'),
    cameraHelper: () => import('./cameraHelper'),
    axesHelper: () => import('./axesHelper')
};

function appendExampleList() {
    let ul = document.createElement('ol'),
        contentHtml = '';
    for(example in examples) {
        contentHtml += `<li><a href="#${example}">${example}</a></li>`
    }
    ul.innerHTML = contentHtml;
    document.body.appendChild(ul);
}

function clearBody() {
    let children = document.body.children,
    child = children[0];
    while(child) {
        document.body.removeChild(child);
        child = children[0];
    }
}

function handleHashChange() {

    let name = location.hash.slice(1);

    clearBody();

    let example = examples[name];

    if (example) {
        example().then(({default: ExampleContructor}) => {
            if (ExampleContructor) {
                if (curExample) curExample.destroy();
                curExample = runExample(ExampleContructor);
            }
        });
    } else {
        appendExampleList();
    }

}

function runExample(Example) {
    let example = new Example();
    example.run();
    return example;
}

let curExample = null;

window.addEventListener('hashchange', handleHashChange, false);

handleHashChange();
