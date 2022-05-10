import Site from '../site.js';
import Info from '../info.js';

class MmaJunkie extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Junkie';

        this._parseMetaTags(soup, info, info.getFields([ 'authors' ]));

        let item = soup.find('span', { itemprop: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        if (item.text != 'MMA Junkie Staff') {
            info.authors.push(item.text);
        }

        return info;
    }
}

export default new MmaJunkie('mmajunkie.usatoday.com');