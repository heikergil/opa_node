require('dotenv').config()

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const get_opa_decision = require('./get_opa_decision')

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '164737519617-3f7urgtthrppma6ddcf5smq8rc8s8tij.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


const PORT = 3000;

// Middleware

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/login', (req,res)=>{
    res.render('login');
})

app.post('/login', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})

app.get('/profile', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
})

app.get('/onlyioet', checkDomain, (req,res)=>{
    res.send('This route is for ioet members only')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
        user.domain = payload.hd
      }
      verify()
      .then(()=>{
          req.user = user;
          // opa checks if user.domain is equal to ioet.com
            next();
          
          
      })
      .catch(err=>{
          res.redirect('/login')
      })

}

function checkDomain(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
        user.domain = payload.hd
      }
      verify()
      .then(()=>{
          req.user = user;
          get_opa_decision(user.domain).then(response => {
              if (response.data.result.example.allow) {
                  next()
              } else {
                  
                res.redirect('/login')
              }          
        })
      })
      .catch(err=>{
          res.redirect('/login')
      })

}


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})