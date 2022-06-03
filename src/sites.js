
import MmaJunkie from './sites/mmajunkie.js';
import MmaWeekly from './sites/mmaweekly.js';
import Sherdog from './sites/sherdog.js';
import Site from './site.js';

class Sites {
    #sites;

    constructor() {
        this.#sites = new Map();
        this.#sites.set('cagesidepress.com', this.getDefaultSite);
        this.#sites.set('mmafighting.com', this.getDefaultSite);
        this.#sites.set('mmajunkie.usatoday.com', () => new MmaJunkie());
        this.#sites.set('mmaweekly.com', () => new MmaWeekly());
        this.#sites.set('sherdog.com', () => new Sherdog());
    }

    getDefaultSite() {
        return new Site();
    }

    getSite(url) {
        let baseUrl = new URL(url).hostname;

        // Ignore www subdomain
        if (baseUrl.substring(0, 4) === 'www.')
            baseUrl = baseUrl.slice(4);

        const getSite = this.#sites.get(baseUrl);
        if (getSite)
            return getSite();

        return null;
    }
}

export default new Sites();
