const { readFile } = require("fs");

exports.loadLang = (req, res, next) => {
    if(!req.session.locale) req.session.locale = 'en-US';
    req.c
    if(req.query.locale) req.session.locale = req.query.locale;
    var langfile = "./src/locales/" + req.session.locale + ".json";
    readFile(langfile, function(err, data) {
        if(err) {
            res.send("Error Loading Language file:" + langfile);
        }
        else {
            global.locales = JSON.parse(data);
            next();
        }
})
}