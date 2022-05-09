import Site from '../site.js';
import Info from '../info.js';

class CagesidePress extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'Cageside Press';

        return this._parseMetaTags(soup, info, info.getFields());
    }
}

export default new CagesidePress('cagesidepress.com');