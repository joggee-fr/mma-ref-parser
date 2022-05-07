import Site from '../site.js';
import Info from '../info.js';

class MmaWeekly extends Site {
    _parse(soup) {
        let info = new Info();

        info.lang = 'en';
        info.site = 'MMA Weekly';

        var item = soup.find('title');
        if (!item)
            throw new Error('Unable to find title item');

        let titleRegex = new RegExp(/(.*) \| MMAWeekly\.com/);
        console.log(item.text);
        let match = item.text.match(titleRegex);
        info.title = match ? match[1] : item.text;

        item = soup.find('div', { class: 'author' });
        if (!item)
            throw new Error('Unable to find author item');

        info.authors.push(item.text);

        item = soup.find('div', { class: 'author' });
        if (!item)
            throw new Error('Unable to find author item');
        
         item = soup.find('div', { class: 'date' });
        if (!item)
            throw new Error('Unable to find date item');

        info.date = new Date(item.text);

        return info;
    }
}

export default new MmaWeekly('mmaweekly.com');