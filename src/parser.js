import Sites from './sites.js';

export default
class Parser {
    static async parse(url) {
        let site = Sites.getSite(url);
        if (!site)
            throw new Error(`Can't find parser for URL: ${url}`);

        let info = await site.retrieveInfo(url);

        let ref = '{{Lien web ';
        ref += `|langue=${info.lang} `;

        if (info.authors.length >= 1) {
            ref += `|auteur=${info.authors[0]} `;
            info.authors.shift();

            let i = 2;
            for (let author of info.authors) {
                ref += `|auteur${i}=${info.authors[i - 2]} `;
                i++;
            }
        }

        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let date = info.date.toLocaleDateString('fr', options);
        let now = new Date().toLocaleDateString('fr', options);

        ref += `|url=${url} `;
        ref += `|titre=${info.title} `;
        ref += `|site=${info.site} `;
        ref += `|date=${date} `;
        ref += `|consulté le=${now}}}`;

        return ref;
    }
}
