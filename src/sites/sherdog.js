import Site from '../site.js';


export default
class Sherdog extends Site {
    _parse(soup, info) {
        let item = soup.find('div', { class: 'article-info' });
        if (!item)
            throw new Error('Unable to find article info item');

        let subItem = item.find('a');
        if (!item)
            throw new Error('Unable to find author item');

        info.authors = [];
        info.authors.push(subItem.text);

        subItem = item.find('span');
        if (!item)
            throw new Error('Unable to find date item');

        info.date = new Date(subItem.text);

        super._parse(soup, info);
    }
}
