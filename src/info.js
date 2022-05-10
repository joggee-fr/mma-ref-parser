export default
class Info {
    constructor(url, site) {
        this.lang = '';
        this.title = '';
        this.authors = [];
        this.date = null;
        this.site = '';
    }

    getFields(excludes = []) {
        return Object.keys(this).filter(field => {
            return !excludes.includes(field);
        });
    }
}
