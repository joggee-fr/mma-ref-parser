import Site from '../site.js';
import Info from '../info.js';
import he from 'he';

class Sherdog extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'Sherdog';

        var item = soup.find('h1');
        if (!item)
            throw new Error('Unable to find title item');

        info.title = he.unescape(item.text);

        item = soup.find('div', { class: 'article-info' });
        if (!item)
            throw new Error('Unable to find article info item');

        let subItem = item.find('a');
        if (!item)
            throw new Error('Unable to find author item');

        info.authors.push(item.text);

        subItem = item.find('span');
        if (!item)
            throw new Error('Unable to find date item');

        info.date = new Date(subItem.text);

        return info;
    }
}

export default new Sherdog('sherdog.com');