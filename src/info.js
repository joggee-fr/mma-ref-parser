export default
class Info {
    constructor(url, site) {
        this.lang = '';
        this.title = '';
        this.authors = [];
        this.date = null;
        this.site = '';
    }

    isComplete(field) {
        if (field) {
            if (typeof this[field] === 'string')
                return (this[field].length > 0);

            if (Array.isArray(this[field]))
                return (this[field].length > 0);

            return !!this[field];
        }

        for (const field of Object.keys(this)) {
            if (!this.isComplete(field))
                return false;
        }

        return true;
    }
}
