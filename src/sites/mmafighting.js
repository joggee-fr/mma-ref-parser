import Site from '../site.js';
import Info from '../info.js';

class MmaFighting extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Fighting';

        var item = soup.find('title');
        if (!item)
            throw new Error('Unable to find title item');

        let titleRegex = new RegExp('(.*) - MMA Fighting');
        let match = item.text.match(titleRegex);
        info.title = match ? match[1] : item.text;

        item = soup.find('meta', { property: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        let author = item.attrs.content;
        if (!author)
            throw new Error('Unable to find author content');

        item = soup.find('meta', { property: 'article:published_time' });
        if (!item)
            throw new Error('Unable to find date item');

        let date = item.attrs.content;
        if (!date)
            throw new Error('Unable to find author content');

        info.date = new Date(date);

        return info;
    }
}

export default new MmaFighting('mmafighting.com');