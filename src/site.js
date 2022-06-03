import axios from 'axios';
import JSSoup from 'jssoup';
import Info from './info.js';
import he from 'he';

export default
class Site {
    async retrieveInfo(url) {
        const res = await axios.get(url);
        if (res.status != 200)
            throw new Error(`Unexpected status: ${res.status}`);

        const soup = new JSSoup.default(res.data);
        const info = new Info();
        this._parse(soup, info);

        // Just in case, unescape HTML
        info.title = he.unescape(info.title);

        return info;
    }

    static #normalizeLang(lang) {
        switch (lang) {
            case 'en_US':
            case 'en-US':
                return 'en';
        }

        return lang;
    }

    static #parseHtmlLang(soup, info) {
        const item = soup.find('html');

        if (item && item.attrs.lang)
            info.lang = Site.#normalizeLang(item.attrs.lang);
    }

    static #getMetaTag(soup, name) {
        const item = soup.find('meta', { name: name })
            || soup.find('meta', { property: name });

        if (item && item.attrs.content)
            return item.attrs.content;

        return null;
    }

    static #parseMetaLang(value, info) {
        info.lang = Site.#normalizeLang(value);
    }

    static #parseMetaAuthor(value, info) {
        info.authors.push(value);
    }

    static #parseMetaDate(value, info) {
        // Reset hour part and keep only date
        const regex = new RegExp(/^(\d{4}-\d{2}-\d{2})T.*$/);
        const match = value.match(regex);
        const date = match ? match[1] : value;
        info.date = new Date(date);
    }

    _parseMetaTags(soup, info) {
        // Parse meta tags added for Open Graph, Twitter
        // or analytics tools like Parse.ly or Sailthru for example
        const tags = {
            site: {
                names: [ 'og:site_name' ],
                parser: null,
            },
            lang: {
                names: [ 'og:locale' ],
                parser: Site.#parseMetaLang,
            },
            title: {
                names: [ 
                    'og:title',
                    'twitter:title', 'twitter:text:title', 
                    'sailthru.title', 'parsely-title',
                ],
                parser: null,
            },
            date: {
                names: [ 
                    'article:published_time', 
                    'sailthru.date', 'parsely-pub-date',
                ],
                parser: Site.#parseMetaDate,
            },
            authors: {
                names: [ 'author', 'parsely-author' ],
                parser: Site.#parseMetaAuthor,
            },
        };

        for (const [ key, value ] of Object.entries(tags)) {
            // Skip if already defined
            if ((info[key] instanceof Array) && (info[key].length > 0))
                continue;
            else if (info[key] && !(info[key] instanceof Array))
                continue;

            let tagValue = null;

            for (const name of value.names) {
                if (tagValue = Site.#getMetaTag(soup, name))
                    break;
            }

            if (tagValue) {
                if (value.parser) {
                    (value.parser.bind(this))(tagValue, info);
                } else {
                    info[key] = tagValue;
                }
            }
        }
    }

    _parse(soup, info) {
        Site.#parseHtmlLang(soup, info);
        this._parseMetaTags(soup, info);
    }
}
