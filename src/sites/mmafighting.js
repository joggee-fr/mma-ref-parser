import Site from '../site.js';
import Info from '../info.js';

class MmaFighting extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Fighting';

        return this._parseMetaTags(soup, info, info.getFields());
    }
}

export default new MmaFighting('mmafighting.com');