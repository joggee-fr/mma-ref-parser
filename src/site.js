import axios from 'axios';
import JSSoup from 'jssoup';

export default
class Site {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    checkUrl(url) {
        const regex = new RegExp('https?:\/\/(www\.)?' + this.baseUrl + '/.*');
        const match = url.match(regex);
        return (match != null);
    }

    async retrieveInfo(url) {
        let res = await axios.get(url);
        if (res.status != 200)
            throw new Error(`Unexpected status: ${res.status}`);

        let soup = new JSSoup.default(res.data);
        return this._parse(soup);
    }
}
