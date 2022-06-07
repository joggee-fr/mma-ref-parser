
import MmaJunkie from './sites/mmajunkie.js';
import Sherdog from './sites/sherdog.js';
import SiteFixer from './sites/site-fixer.js';
import Site from './site.js';

class Sites {
    #sites;

    constructor() {
        this.#sites = new Map();
        this.#sites.set('bloodyelbow.com', null);
        this.#sites.set('cagesidepress.com', null);
        this.#sites.set('mmafighting.com', null);
        this.#sites.set('mmamania.com', () => new SiteFixer('MMA Mania'));
        this.#sites.set('mmanews.com', null);
        this.#sites.set('mmajunkie.usatoday.com', () => new MmaJunkie());
        this.#sites.set('mmaweekly.com', () => new SiteFixer('MMA Weekly'));
        this.#sites.set('sherdog.com', () => new Sherdog());
        this.#sites.set('sports.yahoo.com', () => new SiteFixer('Yahoo! Sports'));
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
        if (getSite === null)
            return this.getDefaultSite();
        else if (getSite)
            return getSite();

        return null;
    }
}

export default new Sites();
