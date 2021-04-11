import requestPromise from 'request-promise';
import cheerio from 'cheerio';

class Wiki {
    constructor() {
        this.base_url = 'https://en.wikipedia.org/wiki/';
    }

    async parse(slug) {
        const url = this.base_url + slug;

        const html = await requestPromise(url);
        const cssPath = '.mw-parser-output a[href]:not(.image):not(.internal):first-of-type:not(.hatnote a):not(table a):not(sup a):not(.tright a):not(.rt-commentedText a):not(.rt-commentedText+a):not(.IPA a):not(.haudio a):not(small a):not(.zh-Hans a):not(.nowraplinks a)';
        const parsed = cheerio(cssPath, html);

        const keys = Object.keys(parsed);
        const elem = parsed[keys[0]];
        
        const text = elem.children[0].data;
        const attribSlug = elem.attribs.href.substring(6);
        const link = this.base_url + attribSlug;
        return {text, link, slug: attribSlug};
    }
}

export default Wiki;