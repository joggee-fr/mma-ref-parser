import Site from '../site.js';
import Info from '../info.js';

export default
class MmaJunkie extends Site {
    _parse(soup, info) {
        let item = soup.find('span', { itemprop: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        if (item.text != 'MMA Junkie Staff') {
            info.authors.push(item.text);
        }

        super._parse(soup, info);
    }
}
