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

    _getMetaTag(soup, name) {
        let item = soup.find('meta', { name: name })
            || soup.find('meta', { property: name });

        if (item && item.attrs.content)
            return item.attrs.content;

        return null;
    }

    _parseMetaAuthor(value, info) {
        info.authors.push(value);
    }

    _parseMetaDate(value, info) {
        // Reset hour part and keep only date
        let regex = new RegExp(/^(\d{4}-\d{2}-\d{2})T.*$/);
        const match = value.match(regex);
        const date = match ? match[1] : value;
        info.date = new Date(date);
    }

    _parseMetaTags(soup, info, mandatoryFields = []) {
        // Parse meta tags added for Open Graph, Twitter
        // or analytics tools like Parse.ly or Sailthru for example
        const tags = { 
            title: {
                names: [ 
                    'og:title', 
                    'twitter:title', 'twitter:text:title', 
                    'sailthru.title', 'parsely-title'
                ],
                parser: null,
            },
            date: {
                names: [ 
                    'article:published_time', 
                    'sailthru.date', 'parsely-pub-date'
                ],
                parser: this._parseMetaDate,
            },
            authors: {
                names: [ 'author', 'parsely-author' ],
                parser: this._parseMetaAuthor,
            },
        };

        for (const [ key, value ] of Object.entries(tags)) {
            var tagValue = null;

            for (const name of value.names) {
                if (tagValue = this._getMetaTag(soup, name))
                    break;
            }

            if (mandatoryFields.includes(key) && !tagValue)
                throw new Error(`Failed to retrieve ${key} from meta tags`);

            if (tagValue) {
                if (value.parser)
                    value.parser(tagValue, info);
                else
                    info[key] = tagValue;
            }
        }

        return info;
    }
}
