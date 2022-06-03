import Site from '../site.js';

export default
class MmaWeekly extends Site {
    _parse(soup, info) {
        info.site = 'MMA Weekly'
        super._parse(soup, info);
    }
}
