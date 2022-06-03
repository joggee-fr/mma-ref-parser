import Site from '../site.js';

export default
class SiteFixer extends Site {
    constructor(site) {
        super();
        this.site = site;
    }

    _parse(soup, info) {
        info.site = this.site;
        super._parse(soup, info);
    }
}
