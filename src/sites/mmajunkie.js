import Site from '../site.js';
import Info from '../info.js';
import moment from 'moment';

class MmaJunkie extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Junkie';

        var item = soup.find('title');
        if (!item)
            throw new Error('Unable to find title item');

        info.title = item.text;

        item = soup.find('span', { itemprop: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        if (item.text != 'MMA Junkie Staff') {
            info.authors.push(item.text);
        }

        item = soup.find('span', { itemprop: 'datePublished' });
        if (!item)
            throw new Error('Unable to find date item');

        let date = item.attrs.content
        if (!date)
            throw new Error('Unable to find date content');

        info.date = moment(date);

        return info;
    }
}

export default new MmaJunkie('mmajunkie.usatoday.com');