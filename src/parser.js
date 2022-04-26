import moment from 'moment';
import 'moment/locale/fr.js';
import sites from './sites/sites.js';

class Parser {
    async _getSite(url) {
        for (let site of sites) {
            if (site.checkUrl(url))
                return site;
        }

        return null;
    }

    async parse(url) {
        let site = await this._getSite(url);
        if (!site)
            throw new Error(`Can't find parser for URL: ${url}`);

        let info = await site.retrieveInfo(url);

        let ref = '{{Lien web ';
        ref += `|langue=${info.lang} `;

        if (info.authors.length > 1) {
            ref += `|auteur=${info.authors[0]} `;
            info.authors.shift();

            let i = 2;
            for (let author of info.authors) {
                ref += `|auteur${i}=${info.authors[i - 2]} `;
                i++;
            }
        }

        moment.locale('fr');
        let date = info.date.format("D MMMM YYYY");
        let now = moment().format("D MMMM YYYY");

        ref += `|url=${url} `;
        ref += `|titre=${info.title} `;
        ref += `|site=${info.site} `;
        ref += `|date=${date} `;
        ref += `|consulté le=${now}}}`;

        return ref;
    }
}

export default new Parser();
