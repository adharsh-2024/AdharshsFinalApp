const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');



const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/authDemo4');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});


const User = require('./models/User');

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const theclimateRouter = require('./routes/theclimate');






const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//mongoDB_URI
app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/theclimate',theclimateRouter);



const myLogger = (req,res,next) => {
  console.log('inside a route!')
  next()
}





app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })


app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/help", (request, response) => {
  response.render("help");
});





app.get("/apikey", async (req,res,next) => {
  res.render('apikey')
})

const APIKey = require('./models/APIKey')

app.post("/apikey",
  isLoggedIn,
  async (req,res,next) => {
    const domainName = req.body.domainName
    const apikey = req.body.apikey
    const apikeydoc = new APIKey({
      userId:req.user._id,
      domainName:domainName,
      apikey:apikey
    })
    const result = await apikeydoc.save()
    console.log('result=')
    console.dir(result)
    res.redirect('/apikeys')
})

app.get('/apikeys', isLoggedIn,
  async (req,res,next) => {
    res.locals.apikeys = await APIKey.find({})
    console.log('apikeys='+JSON.stringify(res.locals.apikeys.length))
    res.render('apikeys')
  })

app.get('/apikeyremove/:apikey_id', isLoggedIn,
  async (req,res,next) => {

    const apikey_id = req.params.apikey_id
    console.log(`id=${apikey_id}`)
    await APIKey.deleteOne({_id:apikey_id})
    res.redirect('/apikeys')

  })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Add adharsh personal app stuff here ///////////////////////////////////////////



app.get("/climateform", (request,response) => {
  response.render("climatedataform")
})









////////////////////////////////////////////////







module.exports = app;
