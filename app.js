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
const { type } = require('os');
const { url } = require('inspector');
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
        email : String,
        id : String,

        recentlyplayed : [{
            song : {type : String},
            time : {type : Date} , 
            duaration : {type : Number}
        }],
        
        recentlyplyedtime : [{
            type : String
        }],

        lastsong : {
            type : Date
        },

        totallisteningtime : [{
            type : Number
        }],

        songplayed : [{
            type : Number
        }],

        totallisteningtimeforweek : {
            type : String 
        },

        totalsongforweek : {
            type : Number 
        },

        avgtrack : {
            type : String 
        },

        topartist : [{
            name : {type : String},
            popularity : {type : Number},
            logo : {type : String}
        }],

        toptrack : [{
            name : {type : String},
            artist : {type : String},
            logo : {type : String}
        }],

        topplaylist : [{
            name : {type : String},
            track : {type : Number},
            logo : {type : String}
        }],

        newartist : [{
            type : Number
        }]

    } ,
    codeforces : {
        accesstoken : String,
        refreshtoken : String,
        username : { type : String , default : "user_abc"},
        problemsolved : { type : String , default : "50"}
    },
    newgoal : [{
        type : {type:String , default: null},
        goal : {type:String , default: ""},
        target : {type:Number , default: null},
        deadline : {type:Date , default: null},
        done : {type : Number}
    }]
});
var newUser = mongoose.model('newUser', newuserSchema);


//express 

app.use("/static", express.static('static'));


//pug

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


//Functions

// to be called

async function addtimeandsong(userId , addtime , songcount) {
    const user = await newUser.findById(userId);

    let newtotaltime = 0;
    let newtotalsong = 0;

    newtotaltime = addtime + user.spotify.totallisteningtime[0];
    newtotalsong = songcount + user.spotify.songplayed[0];

    await newUser.findByIdAndUpdate(userId , {
        $set : {
            [`spotify.totallisteningtime.${0}`] : newtotaltime ,
            [`spotify.songplayed.${0}`] : newtotalsong
        }
    },
    {new : true})
};

async function timeandsongaddforweek(userId) {
    const user = await newUser.findById(userId);

    let totaltime = 0;
    let totaltime1 = 0;
    let totalsong = 0;
    let hour = 0;
    let min = 0;

    for (let i=0 ; i<7 ; i++){
        totaltime = totaltime + user.spotify.totallisteningtime[i];
        totalsong = totaltime + user.spotify.songplayed[i];
    }

    totaltime1 = totaltime;
    totaltime = totaltime1/(1000*60); // time converted to minutes
    totaltime1 = totaltime;
    totaltime = Math.floor(totaltime1); //removing the fractional part 
    totaltime1 = totaltime;
    hour = Math.floor(totaltime1/60); // Making it into hour
    min = totaltime - (hour*60);

    await newUser.findByIdAndUpdate(userID ,{
        $set : {
            'spotify.totallisteningtimeforweek' : `${hour}h ${min}m` ,
            'spotify.totalsongforweek' : totalsong 
        }
    },
    {new : true})
};

async function avgtrack(userId) {
    const user = await newUser.findById(userId);

    let avg = 0 ;
    let avg1 = 0 ;
    let min = 0 ;
    
    for (let i=0 ; i<50 ; i++){
        avg = avg + user.spotify.recentlyplayed[i].duaration;
    }

    avg1 = avg ;
    avg = avg1/(1000); // Converted to second
    avg1 = avg ;
    min = Math.floor(avg/(60));
    avg = avg1 - (min*60);

    await newUser.findByIdAndUpdate(userID , {
        $set : {
            'spotify.avgtrack' : `${min}m ${avg}s`
        }
    },
    {new : true}
    )
};

function gettime(time) {
    const playedAt = new Date(time); 
    const now = new Date();          

    const diff = now - playedAt;
    const min = Math.floor(diff / (1000 * 60));

    if (min < 1) {
        return '1 min ago' ;
    } else if (min < 60) {
        return `${min} min ago`;
    } else {
        const hour = Math.floor(min / 60);
        return `${hour} hour ago`;
    }
};

async function gettimeago(userId) {
    const user = await newUser.findById(userId);

    let timeago = [];

    for (let i=0 ; i<50 ; i++){
        timeago[i]=gettime(user.spotify.recentlyplayed[i].time)
    }

    await newUser.findByIdAndUpdate(userId , {
        $set : {
            [`spotify.recentlyplayedtime`] : timeago
        }
    },
    { new : true }
    )

};

//Daily



// For apps

async function fetchdatafromspotify(userId){
    try {
        if (userId) {
            const user = await newUser.findById(userId);

            if (user.spotify.accesstoken) {
                try {
                    const user = await newUser.findById(userId);
                    let spotifyresponse = await axios.get('https://api.spotify.com/v1/me', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    
                    
                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/player/recently_played', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    let recently = {};
                    let recentlyfortime = 0;
                    let songcount = 0;

                    for(let i=0; i<50 ; i++){
                        recently[`spotify.recentlyplayed.${i}.song`] = spotifyresponse.data.item[i].track.name;
                        recently[`spotify.recentlyplayed.${i}.time`] = spotifyresponse.data.item[i].played_at;
                        recently[`spotify.recentlyplayed.${i}.duration`] = spotifyresponse.data.item[i].track.duartion_ms;
                    };

                    let latestsong = spotifyresponse.data.item[0].played_at;

                    for (let i=0 ; i<50 ; i++){
                        if(user.spotify.lastsong == spotifyresponse.data.item[i].played_at){
                            break;
                        }else{
                            recentlyfortime = recentlyfortime + spotifyresponse.data.item[i].track.duartion_ms;
                            songcount = songcount + 1 ;
                        }
                    };
                    
                    addtimeandsong(userId , recentlyfortime , songcount);
                    timeandsongaddforweek(userId);
                    avgtrack(userId);
                    gettimeago(userId);   // isko har min me run karana hai 
                    
                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    let artist ={};
                    
                    for(let i=0; i<50 ; i++){
                        artist[`spotify.topartist.${i}.name`] = spotifyresponse.data.item[i].name;
                        artist[`spotify.topartist.${i}.popularity`] = spotifyresponse.data.item[i].popularity;
                        artist[`spotify.topartist.${i}.logo`] = spotifyresponse.data.item[i].images[0].url;
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    let track = {};

                    for(let i=0; i<50 ; i++){
                        track[`spotify.toptrack.${i}.name`] = spotifyresponse.data.item[i].name;
                        track[`spotify.toptrack.${i}.artist`] = spotifyresponse.data.item[i].artist[0].name;
                        track[`spotify.toptrack.${i}.logo`] = spotifyresponse.data.item[i].album.images[0].url;
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    let playlist = {};

                    for(let i=0; i<50 ; i++){
                        playlist[`spotify.topplaylist.${i}.name`] = spotifyresponse.data.item[i].name;
                        playlist[`spotify.topplaylist.${i}.track`] = spotifyresponse.data.item[i].tracks.total;
                        playlist[`spotify.topplaylist.${i}.logo`] = spotifyresponse.data.item[i].images[0].url;
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/following', {
                        headers: { 'Authorization': `Bearer ${user.spotifyaccesstoken}` }
                    });

                    let totalartist = spotifyresponse.data.artists.total;

                    // Saving the data

                    await newUser.findByIdAndUpdate(req.session.userId , {
                        $set : {
                            recently ,
                            'spotify.lastsong' : latestsong ,
                            artist , 
                            track ,
                            playlist , 
                            [`spotify.newartist.0`] : totalartist
                        }
                    })

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

                            fetchdatafromspotify(userId);
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

            const user = await newUser.findById(req.session.userId);
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
            let a=1 ;
            let i=0 ;
            while(a){
                if(user.newgoals[i].goal){
                    i++;
                    continue;
                }else{
                    a=0;
                    await newUser.findByIdAndUpdate(req.session.userId , {
                        $set : {
                            [`newgoal.${i}.type`] : type,
                            [`newgoal.${i}.goal`] : goal,
                            [`newgoal.${i}.target`] : target,
                            [`newgoal.${i}.deadline`] : deadline
                        }
                    },
                    {new : true}
                    )
                    break ;
                }
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
