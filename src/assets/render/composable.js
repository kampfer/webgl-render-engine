export default (superClass) => class extends superClass {

    constructor(...args) {
        super(...args);
        this.children = [];
        this.parent = null;
    }

    add(object) {
        if (object.parent !== null) {
            object.parent.remove(object);
        }

        object.parent = this;
        this.children.push(object);
    }

    remove(object) {
        let index = this.children.indexOf(object);
        if (index >= 0) {
            object.parent = null;
            this.children.splice(index, 1);
        }
    }

}