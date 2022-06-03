import Site from '../site.js';

export default
class MmaWeekly extends Site {
    _parse(soup, info) {
        info.site = 'MMA Weekly'

        super._parse(soup, info);

        let titleRegex = new RegExp(/(.*) \| MMAWeekly\.com/);
        let match = info.title.match(titleRegex);
        info.title = match ? match[1] : info.title;
    }
}
