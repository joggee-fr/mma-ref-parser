import Site from '../site.js';

export default
class MmaJunkie extends Site {
    _parse(soup, info) {
        // Get first div only as the page may display several articles
        let div = soup.find('div', { itemprop: 'author' });
        if (!div)
            throw new Error('Unable to find authors div');

        let items = div.findAll('a', { itemprop: 'name' });
        if (!items)
            throw new Error('Unable to find authors item');

        for (const item of items) {
            if (    (item.text !== 'MMA Junkie Staff')
                 && (info.authors.indexOf(item.text) < 0)) {
                info.authors.push(item.text);
            }
        }

        super._parse(soup, info);
    }
}
