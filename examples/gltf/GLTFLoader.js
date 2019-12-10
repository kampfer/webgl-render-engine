import request from './request';
import GLTFParser from './GLTFParser';

export default class GLTFLoader {

    load(url) {
        return request({url}).then((xhr) => {
            return this.parse(xhr.response);
        });
    }

    // 将返回结果转成json
    parse(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        let parser = new GLTFParser();
        return parser.parse(data);
    }

    // loadBin(url) {
    //     let xhr = new XMLHttpRequest();
    //     xhr.responseType = 'arraybuffer';
    //     xhr.addEventListener('load', () => {
    //         if (xhr.status === 200 || xhr.status === 0) {
    //             let content = this.decodeText(new Uint8Array(xhr.response)),
    //             data = JSON.parse(content);
    //             console.log(data);
    //         }
    //     });
    //     xhr.open('GET', url, true);
    //     xhr.send();
    // }
}