const crypto = require('crypto');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { fstat } = require('fs');
const { schedulingPolicy } = require('cluster');
// var mysql = require('mysql');
// var dbConfig = require('./dbconfig');
// var conn = mysql.createConnection(dbOptions);
// conn.connect();


module.exports = function (app) {
  app.use(session({
    secret: '!@#$%^&*',
    // store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
  }));

  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  app.get('/', function (req, res) {
    if (!req.session.name)
      res.redirect('/login');
    else
      res.redirect('/logout');
  });

  // 회원가입
  app.get('/signup', function (req, res) {
    res.render('signup.ejs');
  });

  app.post('/signup', function (req, res) {
    // 세션으로 저장 or DB에 저장하고

    res.redirect('/');
  });

  // 로그인
  app.get('/login', function (req, res) {
    if (!req.session.name)
      res.render('login', { message: 'input your id and password.' });
    else
      res.redirect('/home');
  });

  app.get('/welcome', function (req, res) {
    if (!req.session.name)
      return res.redirect('/login');
    else
      res.render('welcome', { name: req.session.name });
  });

  app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

  app.post('/login', function (req, res) {
    let id = req.body.username;
    let password = req.body.password;

    let salt = '';
    let pw = '';

    crypto.randomBytes(64, (err, buf) => {
      if (err) throw err;
      salt = buf.toString('hex');
    });

    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) throw err;
      pw = derivedKey.toString('hex');
    });

    // var user = results[0];
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', function (err, derivedKey) {
      if (err)
        console.log(err);
      if (derivedKey.toString('hex') === pw) {
        req.session.name = id;
        req.session.save(function () {
          return res.redirect('/home');
        });
      }
      else {
        return res.render('login', { message: 'please check your password.' });
      }
    });//pbkdf2
  }); // end of app.post

  // app.post('/login', function (req, res) {
  // var id = req.body.username;
  // var pw = req.body.password;
  // var sql = 'SELECT * FROM user WHERE id=?';
  // conn.query(sql, [id], function (err, results) {
  // if (err)
  // console.log(err);

  // if (!results[0])
  // return res.render('login', { message: 'please check your id.' });

  // var user = results[0];
  // crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function (err, derivedKey) {
  // if (err)
  // console.log(err);
  // if (derivedKey.toString('hex') === user.password) {
  // req.session.name = user.name;
  // req.session.save(function () {
  // return res.redirect('/welcome');
  // });
  // }
  // else {
  // return res.render('login', { message: 'please check your password.' });
  // }
  // });//pbkdf2
  // });//query
  // });

  // 메인 페이지
  app.get('/home', function (req, res) {
    res.render('home.html', { name: req.session.name });
  });

  // QRcode 페이지
  app.get('/QRcode', function (req, res) {
    res.render('QRcode.html');
  });

  // 내정보 페이지
  app.get('/mypage', function (req, res) {
    res.render('mypage.html');
  });

  // 주변 매장 찾기 페이지
  app.get('/findshop', function (req, res) {
    res.render('findshop.html');
  });

  // 코인 충전 페이지
  app.get('/buycoin', function (req, res) {
    res.render('buycoin.html');
  });

  // GET ALL SHOPS
  app.get('/api/shops', function (req, res) {
    
  });

  // GET SINGLE SHOPS
  app.get('/api/shops/:shop_id', function (req, res) {
    res.end();
  });

  // CREATE SHOPS
  app.post('/api/shops', function (req, res) {
    res.end();
  });

  // UPDATE THE BOOK
  app.put('/api/shops/:shop_id', function (req, res) {
    res.end();
  });

  // DELETE BOOK
  app.delete('/api/shops/:shop_id', function (req, res) {
    res.end();
  });
}