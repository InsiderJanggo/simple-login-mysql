require("dotenv").config();
var express = require("express");
const path = require("path");
const session = require("express-session");
var mysql = require('mysql');
var app = express();
const bcrypt = require('bcrypt');
const { loadLang } = require("./utils/locale");

let port = process.env.PORT || 5050;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'login-session',
    resave: false,
    saveUninitialized: true
}))
app.use(loadLang);


var connection = mysql.createConnection({
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
    res.render('register')
})
app.post("/auth/register", (req, res) => {
    var {username, email, password, country} = req.body;
    const saltRounds = 10;
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
    res.render('login');
})

app.post("/auth/login", (req, res) => {
    var {username, password} = req.body;
    var sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
    if(username && password) {        
        connection.query(sql, [username, password], function(err, result, field) {
            if(err) {
                res.json({
                    message: err
                })
            } else {
                if(result.length > 0) {
                    let encryptedPass = result[0].password;
                    let verified = bcrypt.compare(password, encryptedPass);
                    if(verified) {
                        res.send('yes')
                    } else {
                        res.send('Email and password does not match')
                    }
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
            }
            res.end();
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
})

app.get("/:username", async(req, res) => {
    let {username} = req.params;
    if(req.session.loggedin) {
        res.send(`Welcome back ${req.session.username}`)
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Connected to port ${port}`);
});