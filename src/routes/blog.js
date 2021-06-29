const { Router } = require("express");
var router = Router();

router.route("/").get(async(req, res) => {
    var sql = `SELECT * FROM blog_post`;
    connection.query(sql, function(err, data) {
        if(err) {
            res.json({
                message: err
            })
        } else {
            res.render('blog', {
                lang: global.locales,
                blog: data
            })
        }
    })
})

module.exports = router();