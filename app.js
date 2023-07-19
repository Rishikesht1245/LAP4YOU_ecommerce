const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const nocache = require('nocache');



//configuring .env
dotenv.config({path:'config.env'});


// logging requests to console
const morgan = require('morgan');
app.use(morgan('tiny'));


// creating request object from req usl
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//database
require('./config/db');

// deleting cache
app.use(nocache());



// setting view engine to ejs
app.set('view engine', 'ejs');


// intializing session
const session = require('express-session');
app.use(
      session({
      secret: process.env.SESSION_SECRET,
      name: "LAP4YOU-Session",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
 );

 const flash = require('connect-flash');
 app.use(flash());


// serving the static files
app.use('/public', express.static(path.join(__dirname, 'public')));


//routing to admin router
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);


// routing to index (Landing Page) router
const indexRouter = require('./routes/index');
app.use('/', indexRouter);


//routing to user router
const userRouter = require('./routes/user');
app.use('/users', userRouter);

// routing to manger router
const managerRouter = require('./routes/manager');
app.use('/manager', managerRouter);


// 404 rendering
const userCLTN = require('./models/users/userDetails');
app.all('*', async (req, res) => {
      const currentUser = await userCLTN.findById(req.session.userId);
      res.render('index/404', {
            documentTitle : '404 | Page Not Found',
            url: req.originalUrl,
            session: req.session.userId,
            currentUser,
      });
})


// listening to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err)=> {
      if(err){
            console.log('Error starting Error' +err);
      }
      else{
      console.log(`Server is running on http://localhost:${PORT}`)
      }
});
