import requestPromise from 'request-promise';
import cheerio from 'cheerio';

class Wiki {
    constructor() {
        this.base_url = 'https://en.wikipedia.org/wiki/';
        const base = '.mw-parser-output a[href][title]:first-of-type';
        const conditions = [
            ':not(.image)',
            ':not(.internal)',
            ':not(.hatnote a)',
            ':not(table a)',
            ':not(sup a)',
            ':not(small a)',
            ':not(.tright a)',
            ':not(.rt-commentedText a)',
            ':not(.rt-commentedText+a)',
            ':not(.IPA a)',
            ':not(.haudio a)',
            ':not(.zh-Hans a)',
            ':not(.nowraplinks a)',
            ':not(#coordinates a)',
            ':not(#right-navigation a)',
            ':not(.mw-editsection a)'
        ];

        this.selector = base + conditions.join('');
    }

    async parse(slug) {
        const url = this.base_url + slug;

        const html = await requestPromise(url);
        const parsed = cheerio(this.selector, html);

        const keys = Object.keys(parsed);
        const elem = parsed[keys[0]];
        
        const text = elem.children[0].data;
        const attribSlug = elem.attribs.href.substring(6);
        const link = this.base_url + attribSlug;
        return {text, link, slug: attribSlug};
    }
}

export default Wiki;