import Site from '../site.js';

export default
class MmaWeekly extends Site {
    _parse(soup, info) {
        info.site = 'MMA Weekly'

        let item = soup.find('div', { class: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        info.authors.push(item.text);

        super._parse(soup, info);

        let titleRegex = new RegExp(/(.*) \| MMAWeekly\.com/);
        let match = info.title.match(titleRegex);
        info.title = match ? match[1] : info.title;
    }
}
