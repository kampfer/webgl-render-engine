export default class GLTFLoader {

    request() {
        
    }

    load() {}

    loadGLTF(url) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            let data = JSON.parse(xhr.response);
            this.parse(data);
        });
        xhr.open('GET', url, true);
        xhr.send();
    }

    loadBin(url) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200 || xhr.status === 0) {
                let content = this.decodeText(new Uint8Array(xhr.response)),
                data = JSON.parse(content);
                console.log(data);
            }
        });
        xhr.open('GET', url, true);
        xhr.send();
    }

    parse(data) {
        console.log(data);
    }

    // https://github.com/mrdoob/three.js/blob/master/src/loaders/LoaderUtils.js#L7
    decodeText(array) {
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(array);
        }

        let str = '';
        for (let i = 0, l = array.length; i < l; i++) {
            str += String.fromCharCode(array[i]);
        }

        try {
            return decodeURIComponent(escape(str));
        } catch (e) {
            return str;
        }
    }

}