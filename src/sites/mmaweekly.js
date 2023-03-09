import SiteFixer from './site-fixer.js';

export default
class MmaWeekly extends SiteFixer {
    constructor(site) {
        super('MMA Weekly');
    }

    _parse(soup, info) {
        super._parse(soup, info);

        // Remove suffix from title
        const suffix = ' | MMAWeekly.com';
        if (info.title.endsWith(suffix))
            info.title = info.title.slice(0, -suffix.length);
    }
}
