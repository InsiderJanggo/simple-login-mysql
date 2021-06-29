require("dotenv").config();
var express = require("express");
const path = require("path");
const session = require("express-session");
var mysql = require('mysql');
var app = express();
const bcrypt = require('bcrypt');
const { loadLang } = require("./utils/locale");
var uniqid = require('uniqid');

let port = process.env.PORT || 5050;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'login-session',
    resave: false,
    saveUninitialized: true
}))
app.use(loadLang);


let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to database ${process.env.DB_NAME}`);
});

app.get("/", (req, res) => {
    res.render("index", {
        lang: global.locales
    })
})

app.get("/register", (req, res) => {
    res.render('register', {
        lang: global.locales
    })
})
app.post("/auth/register", (req, res) => {
    var {username, email, password, country} = req.body;
    const saltRounds = 10;
    //encrypted password
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            //console.log(hash);
            var sql = `INSERT INTO user (username, email, password, country)  VALUES (?, ?, ?, ?)`
            connection.query(sql, [username, email, hash, country],function(err, result) {
                if(err) {
                res.json({
                    message: err
                })
                } else {
                    res.redirect("/");
                    console.log("1 record inserted");
                }
            })
        })
    })
})

app.get("/login", (req, res) => {
    res.render('login', {
        lang: global.locales
    });
})

app.post("/auth/login", (req, res) => {
    var {username, password} = req.body;
    var sql = `SELECT * FROM user WHERE username = ?`;
    connection.query(sql, [username], function(err, results) {
        if(results[0].password) {
            //check if the password is same as the encrypted password
            bcrypt.compare(password, results[0].password, function(err, result) {
                if(result) {
                    req.session.username = username;
                    req.session.avatar = results[0].avatar;
                    req.session.loggedin = true;
                    return res.redirect(`/user/${req.session.username}`)
                } else {
                    return res.json({
                        message: err
                    })
                }
            })
        } else {
            return res.send(`Wrong Password or username`)
        }
    }) 
}) 

app.get("/user/:username", async(req, res) => {
    let {username} = req.params;
    req.session.username = username;
    //check if the user has loggedin
    if(req.session.loggedin) {
        res.render('profile', {
            lang: global.locales,
            user: req.session
        })
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
})

app.get("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.json({
                message: err
            })
        } else {
            return res.redirect('/');
        }
    });
})

app.get('/blog', (req, res) => {
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

app.get("/blog/create", (req, res) => {
    if(req.session.loggedin) {
        res.render('new.ejs')
    } else {
        res.send(`Please Login If You Want to create a blog post`)
    }
})

app.post('/blog/create', (req, res) => {
    var {title, body} = req.body;
    var {username} = req.session;
    var id = uniqid();
    if(req.session.loggedin) {
        var sql = `INSERT INTO blog_post (blog_id, title, body, createdBy)  VALUES (?, ?, ?, ?)`
        connection.query(sql, [id, title, body, username], function(err, results) {
            if(err) {
                return res.json({
                    message: err
                })
            } else {
                if(!title || !body) {
                    return res.send('You Cant Send Empty Post')
                } else {
                    console.log('1 ROW INSERTED')
                    return res.redirect('/blog');
                }
            }
        })
    } else {
        res.send(`Please Login If You Want to create a blog post`)
    }
})

app.get("/blog/:post_id", async(req, res) => {
    let {post_id} = req.params;
    var sql = `SELECT * FROM blog_post WHERE blog_id=?`;
    connection.query(sql, [post_id], function(err, results) {
        if(err) {
            res.json({
                message: err
            })
        } else {
            res.render('views', {
                lang: global.locales,
                data: results
            });
        }
    })
})

app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Connected to port ${port}`);
});