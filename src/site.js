import axios from 'axios';
import he from 'he';
import JSSoup from 'jssoup';

import Info from './info.js';

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
        info.site = he.unescape(info.site);

        return info;
    }

    static #normalizeLang(lang) {
        switch (lang) {
            case 'en_US':
            case 'en_us':
            case 'en-US':
            case 'en-us':
            case 'English':
            case 'english':
                return 'en';
        }

        return lang;
    }

    static #normalizeDate(date) {
        // Reset hour part and keep only date
        const regex = new RegExp(/^(\d{4}-\d{2}-\d{2})T.*$/);
        const match = date.match(regex);
        return new Date(match ? match[1] : date);
    }

    static #parseHtmlLang(soup, info) {
        const item = soup.find('html');

        if (item && item.attrs.lang)
            info.lang = Site.#normalizeLang(item.attrs.lang);
    }

    static #deepSearch(searchable, key, value, checker) {
        if (Array.isArray(searchable)) {
            for (const s of searchable) {
                const res = Site.#deepSearch(s, key, value, checker);
                if (res)
                    return res;
            }
        } else if (typeof searchable === 'object') {
            if (searchable.hasOwnProperty(key) && (searchable[key] === value)) {
                if (checker(searchable))
                    return searchable;
            }

            for (const k of Object.keys(searchable)) {
                if (typeof searchable[k] === 'object') {
                    const res = Site.#deepSearch(searchable[k], key, value, checker);
                    if (res)
                        return res;
                }
            }
        }

        return null;
    }

    static #parseJsonLd(soup, info) {
        const items = soup.findAll('script', { type: 'application/ld+json' });

        if (!items)
            return;

        for (const item of items) {
            const data = JSON.parse(item.text);
            if (!data)
                continue;

            const article = Site.#deepSearch(data, '@type', 'Article', x => true)
                || Site.#deepSearch(data, '@type', 'NewsArticle', x => true);

            if (!article)
                return;

            if (!info.isComplete('lang') && article.hasOwnProperty('inLanguage'))
                info.lang = Site.#normalizeLang(article.inLanguage);

            if (!info.isComplete('title') && article.hasOwnProperty('headline'))
                info.title = article.headline;
            
            if (!info.isComplete('date') && article.hasOwnProperty('datePublished'))
                info.date = Site.#normalizeDate(article.datePublished);

            if (!info.isComplete('authors') && article.hasOwnProperty('author')) {
                if (article.author.hasOwnProperty('name')) {
                    info.authors.push(article.author.name);
                } else if (article.author.hasOwnProperty('@id')) {
                    const id = article.author['@id'];
                    const person = Site.#deepSearch(data, '@type', 'Person', 
                        x => (x.hasOwnProperty('@id') && (x['@id'] === id)));

                    if (person && person.hasOwnProperty('name'))
                        info.authors.push(person.name);
                }
            }
        }
    }

    static #getMetaTag(soup, name) {
        const item = soup.find('meta', { name: name })
            || soup.find('meta', { property: name });

        if (item && item.attrs.content)
            return item.attrs.content;

        return null;
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
                parser: (value, info) => {
                    info.lang = Site.#normalizeLang(value);
                },
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
                parser: (value, info) => {
                    info.date = Site.#normalizeDate(value);
                },
            },
            authors: {
                names: [ 'author', 'parsely-author' ],
                parser: (value, info) => {
                    info.authors.push(value);
                },
            },
        };

        for (const [ key, value ] of Object.entries(tags)) {
            // Skip if already defined
            if (info.isComplete(key))
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
        Site.#parseJsonLd(soup, info);

        if (!info.isComplete('lang'))
            Site.#parseHtmlLang(soup, info);

        if (!info.isComplete())
            this._parseMetaTags(soup, info);
    }
}
