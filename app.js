//modules import

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const { configDotenv } = require('dotenv');
const { default: axios } = require('axios');
const MongoStore = require('connect-mongo').default;
const app = express();
const port = 3000;

require('./Oauth/google');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//creation of session and passport

app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/soc_project',
        collectionName: 'sessions'
    }),
    cookie: {
        secure : false ,
        samesite : 'lax',
        maxAge: 1000 * 60 * 60 * 12  //1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//mongoose

mongoose.connect('mongodb://127.0.0.1:27017/soc_project_id');


var newuserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    spotify : {
        accesstoken : String,
        refreshtoken : String,
        username : String,
        follow : String,
        listeninghours : {type : String , default : "10"}
    } ,
    codeforces : {
        accesstoken : String,
        refreshtoken : String,
        username : { type : String , default : "user_abc"},
        problemsolved : { type : String , default : "50"}
    }
});
var newUser = mongoose.model('newUser', newuserSchema);


//express 

app.use("/static", express.static('static'));


//pug

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



//endpoints for get request


app.get('/', (req, res) => {
    res.status(200).render('login');
});

app.get('/invaliddetails', (req, res) => {
    res.status(200).render('invaliddetails');
});

app.get('/register', (req, res) => {
    res.status(200).render('register');
});

app.get('/basic', (req, res) => {
    res.status(200).render('basic');
});

app.get('/profile', (req, res) => {
    res.status(200).render('profile');
});

app.get('/dashboard', async(req, res) => {
    let user = " ";
    if(req.session.userId){
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('dashboard' , {user : user });
    }else{
        res.status(500).redirect('/');
    };
});

app.get('/dashboards', async (req, res) => {
    try {
        if (req.session.userId) {
            const user = await newUser.findById(req.session.userId);
            let spotifydata = null;
            let calenderdata = null;
            let githubdata = null;
            let codeforcesdata = null;
            let leetcodedata = null;
            if (user.spotify.accesstoken) {
                try {
                    const spotifyresponse = await axios.get('https://api.spotify.com/v1/me', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });
                    spotifydata = spotifyresponse.data;

                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        try {
                            const refreshresponse = await axios.post('http://accounts.spotify.com/api/token', {
                                grant_type : 'refresh_token',
                                refresh_token: user.spotifyrefreshtoken,
                                client_id : process.env.SPOTIFY_CLIENT_ID,
                                client_secret : process.env.SPOTIFY_CLIENT_SECRET
                            }, {
                                headers: { 'Content-Type': 'application/x/www-form-urlencoded' }
                            });
                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(req.session.userId, {
                                spotifyaccesstoken: newtoken
                            });
                            return res.redirect('/dashboard');
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }

            if (user.calenderaccesstoken) {
                try {
                    const calenderresponse = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                        headers: { 'Authorization': `Bearer ${user.calenderaccesstoken}` }
                    });
                    calenderdata = calenderresponse.data;

                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        try {
                            const refreshresponse = await axios.post('https://oauth2.googleapis.com/token', {
                                grant_type : 'refresh_token',
                                refresh_token: user.calenderrefreshtoken,
                                client_id : process.env.CALENDER_CLIENT_ID,
                                client_secret : process.env.CALENDER_CLIENT_SECRET
                            }, {
                                headers: { 'Content-Type': 'application/x/www-form-urlencoded' }
                            });
                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(req.session.userId, {
                                calenderaccesstoken: newtoken
                            });
                            return res.redirect('/dashboard');
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }

            if (user.githubaccesstoken) {
                try {
                    const githubresponse = await axios.get('https://api.github.com/user', {
                        headers: {
                            'Authorization': `Bearer ${user.githubAccessToken}`,
                            'User-Agent': 'My-Express-App'
                        }
                    });
                    githubdata = githubresponse.data;

                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        try {
                            const refreshresponse = await axios.post('https://oauth2.googleapis.com/token', {
                                grant_type : 'refresh_token',
                                refresh_token: user.githubrefreshtoken,
                                client_id : process.env.GITHUB_CLIENT_ID,
                                client_secret : process.env.GITHUB_CLIENT_SECRET
                            }, {
                                headers: { 'Accept': 'application/json' }
                            });
                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(req.session.userId, {
                                githubaccesstoken: newtoken
                            });
                            return res.redirect('/dashboard');
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }

            res.status(200).render('dashboard', {
                user: user,
                spotifyuser: spotifydata,
                calenderuser: calenderdata,
                githubuser: githubdata,
                leetcodeuser: leetcodedata,
                codeforcesuser: codeforcesdata
            })
        } else {
            res.status(401).redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard page! Try to login again');
    }
});

app.get('/analytics', (req, res) => {
    res.status(200).render('analytics');
});

app.get('/goals', (req, res) => {
    res.status(200).render('goals');
});

app.get('/integrations', (req, res) => {
    res.status(200).render('integrations');
});

app.get('/calender', (req, res) => {
    res.status(200).render('calender');
});

app.get('/reports', (req, res) => {
    res.status(200).render('reports');
});

app.get('/achievements', (req, res) => {
    res.status(200).render('achievements');
});

app.get('/settings', (req, res) => {
    res.status(200).render('settings');
});

app.get('/api/check-username', async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Username is requried" });
        }
        const userExists = await newUser.findOne({ email: username });

        if (userExists) {
            return res.json({ isAvailable: false });
        } else {
            return res.json({ isAvailable: true });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    req.logout(() => {
        res.redirect('/');
    });
});


// call of third party API(s)

app.get('/auth/spotify', (req, res) => {
    let scope = 'user-read-playback-state user-follow-read user-top-read user-read-recently-played user-library-read user-read-private' ;
    const spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' + 
        'client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent('http://127.0.0.1:3000/spotifycallback') +
        `&scope=` + encodeURIComponent(scope);
    res.redirect(spotifyLoginUrl);
});

app.get('/auth/calender', (req, res) => {
    let scope = '' ;
    const calenderLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
        'client_id=' + process.env.CALENDER_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(process.env.CALENDER_CALLBACK_URI) +
        '&scope=' + encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile') +
        '&access_type=offline' + 
        '&prompt=consent';       
    res.redirect(calenderLoginUrl);
});

app.get('/auth/github', (req, res) => {
    let scope = '' ;
    const githubLoginUrl = 'https://github.com/login/oauth/authorize?' + 
        'client_id=' + process.env.GITHUB_CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(process.env.GITHUB_CALLBACK_URI) +
        `&scope=` + encodeURIComponent(scope);

    res.redirect(githubLoginUrl);
});

app.get('/auth/youtube', (req, res) => {
    let scope = '' ;
    const googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
        'client_id=' + process.env.YOUTUBE_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(process.env.YOUTUBE_CALLBACK_URI) +
        '&scope=' + encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile') +
        '&access_type=offline' + 
        '&prompt=consent';       
    res.redirect(googleLoginUrl);
});


// endpoints of Authentication using API(s)

app.get('/spotifycallback', async (req, res) => {
    const mycode = req.query.code;
    if (!mycode) {
        return res.status(400).send("USER DENIED THE PERMISION !");
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code'); 
        params.append('code', mycode);
        params.append('redirect_uri', process.env.SPOTIFY_CALLBACK_URL ); 
        params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
        params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

        
        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        });

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        if(req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId,
                {
                    $set : {
                        'spotify.accesstoken' : accessToken,
                        'spotify.refreshtoken' : refreshToken
                    }
                }

            );
        }
    } catch (err) {
        console.error(err);
    }
    res.status(200).redirect("/integrations");
});

app.get('/calendercallback', async (req, res) => {
    const mycode = req.query.code;
    if (!mycode) {
        return res.status(400).send("USER DENIED THE PERMISION !");
    }

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            grant_type : 'authorization_code',
            code : mycode,
            redirect_uri : process.env.CALENDER_CALLBACK_URL,
            client_id : process.env.CALENDER_CLIENT_ID,
            client_secret : process.env.CALENDER_CLIENT_SECRET,
            access_type: 'offline'
        }, {
            headers: { 'Content-Type': 'application/x/www-form-urlencoded' }
        });
        const accesstoken = response.data.access_token;
        const refreshtoken = response.data.refresh_token;

        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId,
                {
                    calenderaccesstoken: accesstoken,
                    calenderrefreshtoken: refreshtoken
                }
            );

        }
    } catch (err) {
        console.error(err);
    }
});

app.get('/githubcallback', async (req, res) => {
    const mycode = req.query.code;
    if (!mycode) {
        return res.status(400).send("USER DENIED THE PERMISION !");
    }

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            code : mycode,
            redirect_uri : process.env.GITHUB_CALLBACK_URL,
            client_id : process.env.GITHUB_CLIENT_ID,
            client_secret : process.env.GITHUB_CLIENT_SECRET
        }, {
            headers: { 'Accept': 'application/json' }
        });
        const accesstoken = response.data.access_token;
        const refreshtoken = response.data.refresh_token;

        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId,
                {
                    githubaccesstoken: accesstoken,
                    githubrefreshtoken: refreshtoken
                }
            );

        }
    } catch (err) {
        console.error(err);
    }
});

//endpoints for post request

app.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await newUser.findOne({ email: username, password: password });
        if (user) {
            req.session.userId = user._id;
            res.status(200).render('dashboard', { user: user });
        } else {
            res.status(401).redirect('/invaliddetails');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while fetching user data');
    }
});

app.post('/register', (req, res) => {
    const { name, email, password, dob } = req.body;
    const newUserData = new newUser({
        name,
        email,
        password,
        dob
    });
    newUserData.save()
        .then(() => {
            res.status(200).render('basic');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error occurred while saving user data');
        });
});


//server


app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});

