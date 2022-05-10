import Site from '../site.js';
import Info from '../info.js';

class MmaWeekly extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Weekly';

        this._parseMetaTags(soup, info, info.getFields([ 'authors' ]));

        let titleRegex = new RegExp(/(.*) \| MMAWeekly\.com/);
        let match = info.title.match(titleRegex);
        info.title = match ? match[1] : item.text;

        let item = soup.find('div', { class: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        info.authors.push(item.text);

        return info;
    }
}

export default new MmaWeekly('mmaweekly.com');