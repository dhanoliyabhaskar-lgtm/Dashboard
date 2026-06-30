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
        maxAge: 1000 * 60 * 60 * 12  //  1/2 day
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
    theme : {type : String , default : "1" } ,
    spotify : {
        accesstoken : String,
        refreshtoken : String,
        username : String,
        follow : String,
        email : String,
        id : String,
        
        listeninghours : {type : String , default : "10"}
    } ,
    codeforces : {
        accesstoken : String,
        refreshtoken : String,
        username : { type : String , default : "user_abc"},
        problemsolved : { type : String , default : "50"}
    },
    newgoal : {
        goal1:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal2:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal3:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal4:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal5:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal6:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal7:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal8:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal9:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal10:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal11:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal12:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal13:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal14:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        },
        goal15:{
            type:{type:String , default: null},
            goal:{type:String , default: ""},
            target:{type:Number , default: null},
            deadline:{type:Date , default: null}
        }
    }
});
var newUser = mongoose.model('newUser', newuserSchema);


//express 

app.use("/static", express.static('static'));


//pug

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//Functions

//Daily

async function fetchdatafromspotify(userId){
    try {
        if (userId) {
            const user = await newUser.findById(userId);

            let spotifyusername = null;
            let spotifyemail = null;
            let spotifyid = null;
            let spotifyprofilepic = null;
            let spotifyrecentlyplayed = null;
            let spotifytopartist = null;

            if (user.spotify.accesstoken) {
                try {
                    let spotifyresponse = await axios.get('https://api.spotify.com/v1/me', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    spotifyusername = spotifyresponse.data.display_name;
                   
                    spotifyemail = spotifyresponse.data.email;
                  
                    spotifyid = spotifyresponse.data.id;

                    spotifyprofilepic = spotifyresponse.data.image[0].url;
                    
                    
                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/player/recently_played', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });
                    spotifyrecentlyplayed = spotifyresponse.data.track.name;
                    
                    
                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/artist', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });
                    spotifytopartist = spotifyresponse.data.items;


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
                            await newUser.findByIdAndUpdate(userId, {
                                spotifyaccesstoken: newtoken
                            });

                            fetchdatafromspotify();
                            return;
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
            await findByIdAndUpdate(req.session.userId , {

            });
        }
    }catch(err){
        console.error(err);
    }
};

async function fetchdatafromcalender(){

};

async function fetchdatafromleetcode(){

};

async function fetchdatafromgithub(){

};



// Node Cron (for live fetching)



// Setinterval (live sync)



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
            
            fetchdatafromspotify(req.session.userId);

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

            res.status(200).render('dashboard', { user: user });
        } else {
            res.status(401).redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard page! Try to login again');
    }
});

app.get('/analyticsoverview', (req, res) => {
    if(req.session.userId){
        res.status(200).redirect('/analyticsspotify');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/analyticsspotify', (req, res) => {
    if(req.session.userId){
        res.status(200).render('analyticsspotify');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/analyticsleetcode', (req, res) => {
    if(req.session.userId){
        res.status(200).render('analyticsleetcode');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/analyticsgithub', (req, res) => {
    if(req.session.userId){
        res.status(200).render('analyticsgithub');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/analyticscalender', (req, res) => {
    if(req.session.userId){
        res.status(200).render('analyticscalender');
    }else{
        res.status(500).redirect('/');
    }
});


app.get('/goals', (req, res) => {
    if(req.session.userId){
        res.status(200).render('goals');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/goalsweekly', (req, res) => {
    if(req.session.userId){
        res.status(200).render('goalsweekly');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/goalscustom', (req, res) => {
    if(req.session.userId){
        res.status(200).render('goalscustom');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/goalsmonthly', (req, res) => {
    if(req.session.userId){
        res.status(200).render('goalsmonthly');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/newgoals', (req, res) => {
    if(req.session.userId){
        res.status(200).render('newgoals');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/integration', (req, res) => {
    if(req.session.userId){
        res.status(200).render('integration');
    }else{
        res.status(500).redirect('/');
    }
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

app.get('/settingsprofile', async(req, res) => {
    let user ="";
    if(req.session.userId){
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('settingsprofile' , {user:user} );
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/settingsprivacy', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('settingsprivacy');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/settingsnotifications', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('settingsnotifications');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/settingslogout', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('settingslogout');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/settingshelp', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('settingshelp');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/contact', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('contact');
    }else{
        res.status(500).redirect('/');
    }
});

app.get('/settingstheme', async (req, res) => {
    let user = '';
    if (req.session.userId) {
        try {
            const USER = await newUser.findById(req.session.userId);
            user = USER;
            res.status(200).render('settingstheme', { user: user });
        } catch (err) {
            console.error("Terminal Log -> Database query me error:", err);
        }
    } else {
        console.log("Terminal Log -> Session me userId nahi mili, redirecting...");
        res.redirect('/');
    }
});

app.get('/invaliddetailsforrepassword', async(req, res) => {
    if(req.session.userId){
        res.status(200).render('invaliddetailsforrepassword');
    }else{
        res.status(500).redirect('/');
    }
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
    fetchdatafromspotify();
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

app.post('/settingsprivacy', async (req, res) => {
    let user ='';
    const { current , newpassword , repassword } = req.body;
    try {
        const user = await newUser.findOne({ password : current });
        if (user) {
            await newUser.findByIdAndUpdate(req.session.userId , {
                password : newpassword
            });
            res.status(200).render('settingsprivacy');
        } else {
            res.status(401).redirect('/invaliddetailsforrepassword');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while updating the password!');
    }

});

app.post('/settingstheme' , async(req,res) =>{
    let user ='';
    const THEME = req.body.theme;
    try{
        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId , {
                theme : THEME
            });
            const USER = await newUser.findById(req.session.userId);
            user = USER;
            res.status(200).render('settingstheme', {user : user});
        }else {
            res.status(401).redirect('/');
        };
    }catch(err){
        console.error(err);
    };
});

app.post('/newgoals' , async(req,res)=>{
    const {type, goal, target, deadline}= req.body;
    try{
        if(req.session.userId){
            const user = await newUser.findById(req.session.userId);
            if(!user.newgoal.goal15.goal){
                if(!user.newgoal.goal14.goal){
                    if(!user.newgoal.goal13.goal){
                        if(!user.newgoal.goal12.goal){
                            if(!user.newgoal.goal11.goal){
                                if(!user.newgoal.goal10.goal){
                                    if(!user.newgoal.goal9.goal){
                                        if(!user.newgoal.goal8.goal){
                                            if(!user.newgoal.goal7.goal){
                                                if(!user.newgoal.goal6.goal){
                                                    if(!user.newgoal.goal5.goal){
                                                        if(!user.newgoal.goal4.goal){
                                                            if(!user.newgoal.goal3.goal){
                                                                if(!user.newgoal.goal2.goal){
                                                                    if(!user.newgoal.goal1.goal){
                                                                        await newUser.findByIdAndUpdate(req.session.userId , {
                                                                            $set : {
                                                                                'newgoal.goal1.type' : type,
                                                                                'newgoal.goal1.goal' : goal,
                                                                                'newgoal.goal1.target' : target,
                                                                                'newgoal.goal1.deadline' : deadline
                                                                            }
                                                                        });
                                                                    };
                                                                    await newUser.findByIdAndUpdate(req.session.userId , {
                                                                        $set : {
                                                                            'newgoal.goal2.type' : type,
                                                                            'newgoal.goal2.goal' : goal,
                                                                            'newgoal.goal2.target' : target,
                                                                            'newgoal.goal2.deadline' : deadline
                                                                        }
                                                                    });
                                                                };
                                                                await newUser.findByIdAndUpdate(req.session.userId , {
                                                                    $set : {
                                                                        'newgoal.goal3.type' : type,
                                                                        'newgoal.goal3.goal' : goal,
                                                                        'newgoal.goal3.target' : target,
                                                                        'newgoal.goal3.deadline' : deadline
                                                                    }
                                                                });
                                                            };
                                                            await newUser.findByIdAndUpdate(req.session.userId , {
                                                                $set : {
                                                                    'newgoal.goal4.type' : type,
                                                                    'newgoal.goal4.goal' : goal,
                                                                    'newgoal.goal4.target' : target,
                                                                    'newgoal.goal4.deadline' : deadline
                                                                }
                                                            });
                                                        };
                                                        await newUser.findByIdAndUpdate(req.session.userId , {
                                                            $set : {
                                                                'newgoal.goal5.type' : type,
                                                                'newgoal.goal5.goal' : goal,
                                                                'newgoal.goal5.target' : target,
                                                                'newgoal.goal5.deadline' : deadline
                                                            }
                                                        });
                                                    };
                                                    await newUser.findByIdAndUpdate(req.session.userId , {
                                                        $set : {
                                                            'newgoal.goal6.type' : type,
                                                            'newgoal.goal6.goal' : goal,
                                                            'newgoal.goal6.target' : target,
                                                            'newgoal.goal6.deadline' : deadline
                                                        }
                                                    });
                                                };
                                                await newUser.findByIdAndUpdate(req.session.userId , {
                                                    $set : {
                                                        'newgoal.goal7.type' : type,
                                                        'newgoal.goal7.goal' : goal,
                                                        'newgoal.goal7.target' : target,
                                                        'newgoal.goal7.deadline' : deadline
                                                    }
                                                });
                                            };
                                            await newUser.findByIdAndUpdate(req.session.userId , {
                                                $set : {
                                                    'newgoal.goal8.type' : type,
                                                    'newgoal.goal8.goal' : goal,
                                                    'newgoal.goal8.target' : target,
                                                    'newgoal.goal8.deadline' : deadline
                                                }
                                            });
                                        };
                                        await newUser.findByIdAndUpdate(req.session.userId , {
                                            $set : {
                                                'newgoal.goal9.type' : type,
                                                'newgoal.goal9.goal' : goal,
                                                'newgoal.goal9.target' : target,
                                                'newgoal.goal9.deadline' : deadline
                                            }
                                        });
                                    };
                                    await newUser.findByIdAndUpdate(req.session.userId , {
                                        $set : {
                                            'newgoal.goal10.type' : type,
                                            'newgoal.goal10.goal' : goal,
                                            'newgoal.goal10.target' : target,
                                            'newgoal.goal10.deadline' : deadline
                                        }
                                    });
                                };
                                await newUser.findByIdAndUpdate(req.session.userId , {
                                    $set : {
                                        'newgoal.goal11.type' : type,
                                        'newgoal.goal11.goal' : goal,
                                        'newgoal.goal11.target' : target,
                                        'newgoal.goal11.deadline' : deadline
                                    }
                                });
                            };
                            await newUser.findByIdAndUpdate(req.session.userId , {
                                $set : {
                                    'newgoal.goal12.type' : type,
                                    'newgoal.goal12.goal' : goal,
                                    'newgoal.goal12.target' : target,
                                    'newgoal.goal12.deadline' : deadline
                                }
                            });
                        };
                        await newUser.findByIdAndUpdate(req.session.userId , {
                            $set : {
                                'newgoal.goal13.type' : type,
                                'newgoal.goal13.goal' : goal,
                                'newgoal.goal13.target' : target,
                                'newgoal.goal13.deadline' : deadline
                            }
                        });
                    };
                    await newUser.findByIdAndUpdate(req.session.userId , {
                        $set : {
                            'newgoal.goal14.type' : type,
                            'newgoal.goal14.goal' : goal,
                            'newgoal.goal14.target' : target,
                            'newgoal.goal14.deadline' : deadline
                        }
                    });
                };
                await newUser.findByIdAndUpdate(req.session.userId , {
                    $set : {
                        'newgoal.goal15.type' : type,
                        'newgoal.goal15.goal' : goal,
                        'newgoal.goal15.target' : target,
                        'newgoal.goal15.deadline' : deadline
                    }
                });
            }
            else{
                res.status(200).redirect('/extragoals');
            }
        };
    }catch(err){
        console.error(err);
    }
});


//server


app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
