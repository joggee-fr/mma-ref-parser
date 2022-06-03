import Site from '../site.js';

export default
class MmaJunkie extends Site {
    _parse(soup, info) {
        let items = soup.findAll('span', { itemprop: 'author' });
        if (!items)
            throw new Error('Unable to find author items');

        for (const item of items) {
            if (    (item.text !== 'MMA Junkie Staff')
                 && (info.authors.indexOf(item.text) < 0)) {
                info.authors.push(item.text);
            }
        }

        super._parse(soup, info);
    }
}
