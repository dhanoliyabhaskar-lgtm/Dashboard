//modules import

const express = require('express');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const nodecron = require('node-cron');
const { configDotenv } = require('dotenv');
const { default: axios } = require('axios');
const { URLSearchParams } = require('url');
const MongoStore = require('connect-mongo').default;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const port = 3000;

const io = new Server(server, {
    cors: { origin: "*" } 
});

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
        secure: false,
        sameSite: 'lax',
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

    login : {type : String , default : 'yes'},

    todaydate : {type : Number , default : 0},
    lastlogindate : {type : Number , default : 0},

    theme: { type: String, default: "1" },

    status: {
        spotify: { type: String, default: 'no' },
        github: { type: String, default: 'no' },
        leetcode: { type: String, default: 'no' },
        codeforces: { type: String, default: 'no' },
        calender: { type: String, default: 'no' }
    },

    spotify: {
        accesstoken: { type: String },
        refreshtoken: { type: String },
        username: String,
        email: String,
        id: String,

        totallisteningtimeforweek: [{
            type: String
        }],
        totalsongforweek: {
            type: Number
        },
        newartist: [{
            type: Number
        }],
        avgtrack: {
            type: String
        },

        totallisteningtime: [{
            type: Number
        }],

        recentlyplayed: [{
            song: { type: String },
            time: { type: Date },
            duration: { type: Number }
        }],

        recentlyplayedtime: [{
            type: String
        }],

        lastsong: {
            type: Date
        },

        songplayed: [{
            type: Number
        }],

        topartist: [{
            name: { type: String },
            popularity: { type: Number },
            logo: { type: String }
        }],

        toptrack: [{
            name: { type: String },
            artist: { type: String },
            logo: { type: String }
        }],

        topplaylist: [{
            name: { type: String },
            track: { type: Number },
            logo: { type: String }
        }]
    },

    calender: {
        accesstoken: { type: String },
        refreshtoken: { type: String },

        totaleventsforweek: {
            value: { type: String },
            change: { type: String }
        },
        totaleventsforlastweek: [{
            type: Number
        }],

        totalbusytimeforweek: {
            value: { type: String },
            change: { type: String }
        },
        totalbusytimeforlastweek: [{
            type: Number
        }],

        totalfreetimeforweek: {
            value: { type: String },
            change: { type: String }
        },
        totalfreetimeforlastweek: [{
            type: Number
        }],

        avgeventtimeforweek: {
            value: { type: String },
            change: { type: String }
        },
        avgeventtimeforlastweek: [{
            type: Number
        }],

        avgeventtime: [{
            type: Number
        }],

        scheduletime: [{
            value: { type: Number },
            at: { type: String }
        }],

        todayschedule: [{
            name: { type: String },
            time: { type: String },
            start: { type: String },
        }],

        events: [{
            name: { type: String },
            time: { type: String },
            date: { type: String }
        }],

        mostbusydays: [{
            value: { type: Number },
            at: { type: String }
        }],

        todaybusy: {
            free: {
                hr: { type: Number },
                min: { type: Number }
            },
            busy: {
                hr: { type: Number },
                min: { type: Number }
            }
        },

    },

    github: {
        accesstoken: { type: String },
        refreshtoken: { type: String },

        name: { type: String },

        commitsovertime: [{
            value: { type: Number },
            at: { type: String },
            realdt: { type: String }
        }],

        language: {
            type : Map ,
            of : Number , 
            default : {}
        },

        repolist: [{
            name: { type: String },
            createdat: { type: String },
            stars: { type: String },
            watchers: { type: Number },
            language: { type: String },
            forks: { type: String },
            size: { type: String }
        }],

        totalrepo: { type: Number },

        totalstar: { type: Number },

        totalfollow: { type: Number },

        week : {type : Number}

    },

    codeforces: {
        name: { type: String },

        maxrank: { type: String, default: "NEWBIE" },

        currentrank : { Type : Number , default : 0},

        currentrank : {type : String , default : "NEWBIE"},

        followcount: { type: Number },

        problemsolved: { type: Number },

        ratinghistory: [{
            value: { type: Number },
            at: { type: String }
        }],

        topics: {
            type: Map,
            of: Number,
            default: {}
        },

        difficulty: [{
            name: { type: String },
            value: { type: Number }
        }],

        wronganswers: [{
            name: { type: String },
            language: { type: String },
            type: { type: String },
            duration: { type: Number }
        }],

        content: [{
            name: { type: String },
            language: { type: String },
            type: { type: String },
            duration: { type: Number },
            memory: { type: Number },
            date: { type: String }
        }]
    },

    newgoal: [{
        type: { type: String, default: null },
        goal: { type: String, default: "" },
        target: { type: Number, default: null },
        deadline: { type: Date, default: null },
        done: { type: Number, default: 0 }
    }],

    totalnotification : {
        type : Number
    },

    notification : [{
        name : {type : String},
        date : {type : String},
        dt : {type : Number}
    }],

    achievementlevel: {
        type: [{
            topic: { type: String },
            name: { type: String },
            level: { type: Number },
            bgimage: [{
                type: String
            }],
            progress: { type: Number },
            target: [{
                type: Number
            }]
        }],
        default: [
            { // done
                topic: 'The Real Additive',
                name: 'No. of hours of songs listen on spotify',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [10, 30, 75, 200, 500]
            },
            { // done
                topic: 'Event Maker',
                name: 'Hours of Events make',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [10, 50, 100, 500, 2000]
            },
            { // done 
                topic: 'Commit Maker',
                name: 'Make Commit on Github',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [10, 25, 50, 100, 500]
            },
            { // done
                topic: "Real Coder",
                name: 'Make repo on Github',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [1, 5, 10, 25, 50]
            },
            { // done
                topic: 'The Psyco',
                name: 'Song played on Spotify',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [25, 100, 250, 1000, 5000]
            },
            { // done
                topic: 'App Lover',
                name : 'Connect to the third party apps',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: [1,2,5,10,20]
            },
            {
                topic: '',
                name: '',
                level: 1,
                bgimage: [''],
                progress: 0,
                target: []
            }
        ]
    },
    achievementone: {
        type: [{
            topic: { type: String },
            name: { type: String },
            bgimage: { type: String }
        }],
        default: [
            {
                topic: 'Night owl',
                name: 'Solve a problem b/w 12-4 am',
                bgimage: ''
            }
        ]
    }
});
var newUser = mongoose.model('newUser', newuserSchema);


//express 

app.use("/static", express.static('static'));


//pug

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global io ko module.exports mein daal rahe hain tak ki cron file me use ho sake
global.io = io;


//Functions

//all rounder

function datecalculater(value) {
    let a = new Date(value);
    let dt = 0;
    let mth = '';

    dt = a.getDate();
    mth = a.toLocaleString('en-US', { month: 'short' });

    return `${mth} ${dt}`;
}

function changecalculater(value1, value2) {
    let incrementtext = '';

    if (value1 < value2) {
        let diff = (((value2 - value1) / value1) * 100);
        incrementtext = `▼ ${diff}% vs last week`;
    } else if (value1 > value2) {
        let diff = (((value1 - value2) / value1) * 100);
        incrementtext = `▲ ${diff}% vs last week`;
    } else {
        incrementtext = 'Same as last week'
    }

    return incrementtext;
};

function resizer(value) {
    if (value >= 1024) {
        value = Math.floor(value / 1024);
        if (value >= 1024) {
            value = Math.floor(value / 1024);
            return `${value} GB`;
        }
        return `${value} MB`;
    }
    return `${value} KB`;
};

function dayfetch(value) {
    let a = new Date(value);
    let yr = a.getFullYear();
    let mth = a.getMonth() + 1;
    let dt = a.getDate();

    return `${dt}/${mth}/${yr}`;
};


function daysfetch() {
    let a = new Date();
    let dt = [];

    let b = a.getDate();
    let c = a.getMonth()+1;
    for (let i = 0; i < 30; i++) {
        if (b == 1) {
            if ([2, 4, 6, 8, 9, 11].includes(c)) {
                dt[i] = `${b}/${c}`;
                b = 31;
                c = c - 1;
            } else if ([5, 7, 10, 12].includes(c)) {
                dt[i] = `${b}/${c}`;
                b = 30;
                c = c - 1;
            } else if (c == 1) {
                dt[i] = `${b}/${c}`;
                b = 31;
                c = 12;
            } else if (c == 3) {
                dt[i] = `${b}/${c}`;
                b = 28;
                c = c - 1;
            }
        } else {
            dt[i] = `${b}/${c}`;
            b = b - 1;
        }
    };

    return dt;
}

//rat ko 12 baje chalne vale functions

//function jo data ko save karke rakhenge for future use (mtlb data ko by pass karenge as a new variable in array)

async function commits(userId) {
    const user = await newUser.findById(userId);
    if (user.status.github == 'yes') {
        let changeobj = {};
        for (let i = 0; i < user.github.commitsovertime.length; i++) {
            changeobj[`github.commitsovertime.${i + 1}.value`] = user.github.commitsovertime[i].value;
            changeobj[`github.commitsovertime.${i + 1}.at`] = user.github.commitsovertime[i].at;
        };

        await newUser.findByIdAndUpdate(userId, {
            $set: {
                ...changeobj
            }
        }, { new: true }
        );
    }
};

async function listeninghourtime(userId) {
    const user = await newUser.findById(userId);
    if (user.status.spotify == 'yes') {
        let changeobj = {};
        for (let i = 0; i < user.spotify.totallisteningtime.length; i++) {
            changeobj[`spotify.totallisteningtime.${i + 1}`] = user.spotify.totallisteningtime[i];
            changeobj[`spotify.songplayed.${i + 1}`] = user.spotify.songplayed[i];
            changeobj[`spotify.newartist.${i + 1}`] = user.spotify.newartist[i];
        };

        changeobj[`spotify.totallisteningtime.${0}`] = 0;
        changeobj[`spotify.songplayed.${0}`] = 0;
        changeobj[`spotify.newartist.${0}`] = 0;

        await newUser.findByIdAndUpdate(userId, { 
            $set: {
                ...changeobj
            }
        }, { new: true }
        );
    }
};

async function hoursschedule(userId) {
    const user = await newUser.findById(userId);
    if (user.status.calender == 'yes') {
        let changeobj = {};
        for (let i = 0; i < user.calender.scheduletime.length; i++) {
            changeobj[`calender.scheduletime.${i + 1}.value`] = user.calender.scheduletime[i].value;
            changeobj[`calender.scheduletime.${i + 1}.at`] = user.calender.scheduletime[i].at;

        };

        await newUser.findByIdAndUpdate(userId, {
            $set: {
                ...changeobj
            }
        }, { new: true }
        );
    }
};

// to be called

//spotify 

async function addtimeandsong(userId, addtime, songcount) {
    const user = await newUser.findById(userId);

    let newtotaltime = 0;
    let newtotalsong = 0;

    newtotaltime = addtime + user.spotify.totallisteningtime[0];
    newtotalsong = songcount + user.spotify.songplayed[0];

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            [`spotify.totallisteningtime.${0}`]: newtotaltime,
            [`spotify.songplayed.${0}`]: newtotalsong
        }
    },
        { new: true })
};

async function timeandsongaddforweek(userId) {
    const user = await newUser.findById(userId);

    let totaltime = 0;
    let totaltime1 = 0;
    let totaltime2 = 0;
    let incrementtext = '';
    let totalsong = 0;
    let hour = 0;
    let min = 0;

    for (let i = 0; i < 7; i++) {
        totaltime = totaltime + user.spotify.totallisteningtime[i];
        totalsong = totalsong + user.spotify.songplayed[i];
    }

    for (let i = 7; i < 14; i++) {
        totaltime2 = totaltime2 + user.spotify.totallisteningtime[i];
    }

    incrementtext = changecalculater(totaltime, totaltime2);

    totaltime1 = totaltime;
    totaltime = totaltime1 / (1000 * 60); // time converted to minutes
    totaltime1 = totaltime;
    totaltime = Math.floor(totaltime1); //removing the fractional part 
    totaltime1 = totaltime;
    hour = Math.floor(totaltime1 / 60); // Making it into hour
    min = totaltime - (hour * 60);

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            ['spotify.totallisteningtimeforweek.0']: `${hour}h ${min}m`,
            ['spotify.totallisteningtimeforweek.1']: incrementtext,
            'spotify.totalsongforweek': totalsong
        }
    },
        { new: true })
};

async function avgtrack(userId) {
    const user = await newUser.findById(userId);

    let avg = 0;
    let min = 0;
    let limit = Math.min(50, user.spotify.recentlyplayed.length);

    for (let i = 0; i < limit; i++) {
        avg = avg + (user.spotify.recentlyplayed[i].duaration  || 0);
    }

    if (limit > 0) {
        let averageMs = avg / limit; 
        let totalSeconds = averageMs / 1000; 
        
        min = Math.floor(totalSeconds / 60); 
        avg = Math.floor(totalSeconds - (min * 60)); 

        await newUser.findByIdAndUpdate(userId, {
            $set: {
                'spotify.avgtrack': `${min}m ${avg}s`
            }
        }, { new: true });
    }
};

function gettime(time) {
    const playedAt = new Date(time);
    const now = new Date();

    const diff = now - playedAt;
    const min = Math.floor(diff / (1000 * 60));

    if (min < 1) {
        return '1 min ago';
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

    for (let i = 0; i < 50; i++) {
        timeago[i] = gettime(user.spotify.recentlyplayed[i].time)
    }

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            [`spotify.recentlyplayedtime`]: timeago
        }
    },
        { new: true }
    )

};

//Daily

//Calender

async function hoursscheduleovertime(userId, data) {
    const newdate = new Date();

    let diff = 0;
    let value = [0, 0, 0, 0, 0, 0, 0];
    let b = 0;
    let c = 0;
    let dt = [];
    let mth = [];
    let avg1 = [0, 0, 0, 0, 0, 0, 0];
    let avg = [];
    let a = new Date();
    let len = [0, 0, 0, 0, 0, 0, 0];
    let freehr = 0;
    let freemin = 0;
    let busymin = 0;
    let busyhr = 0;
    let d = 0;

    let obj = {};
    let obj1 = {};

    for (let i = 0; i < data.items.length; i++) {
        b = new Date(data.items[i].end.dateTime);
        c = new Date(data.items[i].start.dateTime);
        b = b - c;
        c = b / (1000 * 60);
        b = Math.floor(c / 60);
        diff = data.items[i].start.datetime - newdate;
        a = data.items[i].start.datetime;
        a = new Date(a);
        if (diff <= 86400000) {
            value[0] = b + value[0];
            avg1[i] = avg[i] + Math.floor(c);
            busyhr = busyhr + b;
            busymin = busymin + Math.floor(c * 60) - (b * 60);
            len[i] = len[i] + 1;
            dt[0] = a.getDate();
            mth[0] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 2) && diff > (86400000)) {
            value[1] = b + value[1];
            len[i] = len[i] + 1;
            dt[1] = a.getDate();
            mth[1] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 3) && diff > (86400000 * 2)) {
            value[2] = b + value[2];
            len[i] = len[i] + 1;
            dt[2] = a.getDate();
            mth[2] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 4) && diff > (86400000 * 3)) {
            value[3] = b + value[3];
            len[i] = len[i] + 1;
            dt[3] = a.getDate();
            mth[3] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 5) && diff > (86400000 * 4)) {
            value[4] = b + value[4];
            len[i] = len[i] + 1;
            dt[4] = a.getDate();
            mth[4] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 6) && diff > (86400000 * 5)) {
            value[5] = b + value[5];
            len[i] = len[i] + 1;
            dt[5] = a.getDate();
            mth[5] = a.toLocaleString('en-US', { month: 'short' });
        } else if (diff <= (86400000 * 7) && diff > (86400000 * 6)) {
            value[6] = b + value[6];
            len[i] = len[i] + 1;
            dt[6] = a.getDate();
            mth[6] = a.toLocaleString('en-US', { month: 'short' });
        }
    }

    if (busymin > 60) {
        d = Math.floor(busymin / 60);
        busyhr = busyhr + d;
        busymin = busymin - d * 60;
    }

    if (busymin != 0) {
        freehr = 15 - busyhr;
        freemin = 60 - busymin;
    } else {
        freehr = 16 - busyhr;
    }

    let value1 = value.reverse();
    let dt1 = dt.reverse();
    let mth1 = mth.reverse();
    let len1 = len.reverse();

    for (let i = 0; i < 7; i++) {
        obj[`calender.scheduletime.${i}.value`] = value1[i];
        obj[`calender.scheduletime.${i}.at`] = `${mth1[i]} ${dt1[i]}`;
        obj[`calender.mostbusydays.${i}.at`] = `${mth1[i]} ${dt1[i]}`;
        obj[`calender.mostbusydays.${i}.value`] = len1[i];
        avg[i] = len[i] > 0 ? (avg1[i] || 0) / len[i] : 0;
    }

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            ...obj,
            'calender.todaybusy.busy.hr': busyhr,
            'calender.todaybusy.busy.min': busymin,
            'calender.todaybusy.free.min': freemin,
            'calender.todaybusy.free.hr': freehr,
            'calender.avgeventtime': avg
        }
    })
};

async function todayschedule(userId, data) {
    let obj = {};
    let tem = [];
    let TEM = [];
    let dt = [];
    let b = 0;
    let c = 0;
    let a = 0;

    for (let i = 0; i < data.items.length; i++) {
        a = new Date(data.items[i].end.dateTime);
        b = new Date(data.items[i].start.dateTime);
        a = a - b;
        TEM[i] = a / (1000 * 60);
        if (TEM[i] < 60) {
            tem[i] = `${TEM[i]}min`;
        } else {
            a = Math.floor(TEM[i] / (60));
            TEM[i] = TEM[i] - (a * 60);
            tem[i] = `${a}h${TEM[i]}min`;
        }
    };
    for (let i = 0; i < data.items.length; i++) {
        b = new Date(data.items[i].start.dateTime);
        a = b.getHours();
        c = b.getMinutes();
        if (a <= 12 && a >= 1) {
            dt[i] = `${a} ${c} AM`;
        } else if (a == 0) {
            dt[i] = `12 ${c} AM`;
        } else {
            a = a - 12;
            dt[i] = `${a} ${c} PM`;
        }
    };

    for (let i = 0; i < data.items.length; i++) {
        obj[`calender.todayschedule.${i}.name`] = data.items[i].summary;
        obj[`calender.todayschedule.${i}.start`] = dt[i];
        obj[`calender.todayschedule.${i}.time`] = tem[i];
    }

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            obj
        }
    }, { new: true }
    )
};

async function upcomingevents(userId, data) {
    let tem = [];
    let dt = [];
    let obj = {};
    let a = 0;
    let b = 0;
    let c = 0;
    let diff = 0;
    let newdate = new Date();

    const user = await newUser.findById(userId);

    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].start.dateTime) {
            b = new Date(data.items[i].start.dateTime);
            a = b.getHours();
            c = b.getMinutes();
            if (a <= 12 && a >= 1) {
                tem[i] = `${a} ${c} AM`;
            } else if (a == 0) {
                tem[i] = `12 ${c} AM`;
            } else {
                a = a - 12;
                tem[i] = `${a} ${c} PM`;
            }
        } else {
            tem[i] = 'All Day';
        }
    };

    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].start.dateTime) {
            a = new Date(data.items[i].start.dateTime);
            dt[i] = datecalculater(a);
        } else {
            b = new Date(data.items[i].start.date);
            dt[i] = datecalculater(b);
        }
    };

    let todaydate = new Date();
    todaydate.setHours(1, 0, 0, 0)
    let dayafter = new Date(todaydate + 7);
    let after = datecalculater(dayafter);

    let count = 0;

    for (let i = 0; i < data.items.length; i++) {
        if (after == dt[i]) {
            count++;
        }
    };

    for (let i = 0; i < data.items.length; i++) {
        obj[`calender.events.${i + count}.date`] = user.calender.events[i].date;
        obj[`calender.events.${i + count}.time`] = user.calender.events[i].time;
        obj[`calender.events.${i + count}.name`] = user.calender.events[i].name;
    };

    let dt1 = dt.reverse();
    let tem1 = tem.reverse();
    let data1 = data.items;
    let data2 = data1.reverse();

    for (let i = 0; i < count; i++) {
        obj[`calender.events.${i}.date`] = dt1[i];
        obj[`calender.events.${i}.time`] = `${tem1[i]}`;
        obj[`calender.events.${i}.name`] = data2[i].summary;
    };

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            ...obj
        }
    }, { new: true }
    )
};

async function totaleventsforweek(userId) {
    const user = await newUser.findById(userId);

    let total = 0;
    let total1 = 0;
    let incrementtext = '';

    for (let i = 0; i < 7; i++) {
        total = total + user.calender.mostbusydays[i].value;
    }

    for (let i = 0; i < 7; i++) {
        total1 = total1 + user.calender.totateventsforlastweek[i];
    }

    incrementtext = changecalculater(total, total1);


    await newUser.findByIdAndUpdate(userId, {
        $set: {
            'calender.totaleventsforweek.value': `${total}`,
            'calender.totaleventsforweek.change': incrementtext
        }
    })
};

async function totalfreetimeforweek(userId) {
    const user = await newUser.findById(userId);

    let total = 0;
    let total1 = 0;
    let incrementtext = '';

    let busytime = parseInt(user.calender.totalbusytimeforweek.value, 10) || 0;
    total = 112 - busytime;

    for (let i = 0; i < 7; i++) {
        total1 = total1 + (user.calender.totatfreetimeforlastweek[i]  || 0);
    }

    incrementtext = changecalculater(total, total1);

    await newUser.findByIdAndUpdate(userId, {
        $set: {
            'calender.totalfreetimeforweek.value': `${total}`,
            'calender.totalfreetimeforweek.change': incrementtext
        }
    })
}

async function totalbusytimeforweek(userId) {
    const user = await newUser.findById(userId);

    let total = 0;
    let total1 = 0;
    let incrementtext = '';

    for (let i = 0; i < 7; i++) {
        total = total + user.calender.scheduletime[i].value;
    }

    for (let i = 0; i < 7; i++) {
        total1 = total1 + user.calender.totatbusytimeforlastweek[i];
    }

    incrementtext = changecalculater(total, total1);


    await newUser.findByIdAndUpdate(userId, {
        $set: {
            'calender.totalbusytimeforweek.value': `${total}`,
            'calender.totalbusytimeforweek.change': incrementtext
        }
    })
};

async function avgeventtimeforweek(userId) {
    const user = await newUser.findById(userId);

    let total = 0;
    let total1 = 0;
    let incrementtext = '';

    for (let i = 0; i < user.calender.avgeventtime.length; i++) {
        total = total + user.calender.avgeventtime[i];
    }

    total = user.calender.avgeventtime.length > 0 
        ? total / user.calender.avgeventtime.length 
        : 0;


    for (let i = 0; i < 7; i++) {
        total1 = total1 + user.calender.avgeventtimeforlastweek[i];
    }

    incrementtext = changecalculater(total, total1)


    await newUser.findByIdAndUpdate(userId, {
        $set: {
            'calender.avgeventtimeforweek.value': `${total}`,
            'calender.avgeventtimeforweek.change': incrementtext
        }
    })
};

// sorting funtion for achievements and goals

async function achievementsort(userId){
    const user = await newUser.findById(userId);
    try{
        let sortlevel = user.achievementlevel;
        let sortone = user.achievementone;

        let obj1 ={};
        let obj2 = {};

        // for level sorting
        for(let i=0 ; i<sortlevel.length ; i++){
            if(sortlevel[i].level == 5 && sortlevel[i].progress == sortlevel[i].target[4]){
                continue;
            };
            for(let j=i ; j<sortlevel.length ; j++){
                if(sortlevel[i].level<sortlevel[j].level){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        let level1 = 0;
        let level2 = 0;
        let level3 = 0;
        let level4 = 0;
        let level5 = 0;

        for(let i=0 ; i<sortlevel.length ; i++){
            if(sortlevel[i].level == 1){
                level1++;
            }else if(sortlevel[i].level == 2){
                level2++;
            }else if(sortlevel[i].level == 3){
                level3++;
            }else if(sortlevel[i].level == 4){
                level4++;
            }else if(sortlevel[i].level == 5){
                level5++;
            }
        };

        let target1 = 0;
        let progress1 = 0;
        let diff1 = 0;
        let perct1 = 0;
        let target2 = 0;
        let progress2 = 0;
        let diff2 = 0; 
        let perct2 = 0;

        for(let i=0 ; i<level5 ; i++){
            if(sortlevel[i].level == 5 && sortlevel[i].progress == sortlevel[i].target[4]){
                continue;
            };
            target1 = sortlevel[i].target[4];
            progress1 = sortlevel[i].progress;
            diff1 = target1 - progress1;
            perct1 = diff1/(target1-sortlevel[i].target[3]);
            for(let j=i ; j<level5 ; j++){
                target2 = sortlevel[j].target[4];
                progress2 = sortlevel[j].progress;
                diff2 = target2 - progress2;
                perct2 = diff2/(target2-sortlevel[j].target[3]);
                if(perct1>perct2){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        for(let i=level5 ; i<level5+level4 ; i++){
            target1 = sortlevel[i].target[3];
            progress1 = sortlevel[i].progress;
            diff1 = target1 - progress1;
            perct1 = diff1/(target1-sortlevel[i].target[2]);
            for(let j=i ; j<level5+level4 ; j++){
                target2 = sortlevel[j].target[3];
                progress2 = sortlevel[j].progress;
                diff2 = target2 - progress2;
                perct2 = diff2/(target2-sortlevel[j].target[2]);
                if(perct1>perct2){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        for(let i=level5+level4 ; i<level5+level4+level3 ; i++){
            target1 = sortlevel[i].target[2];
            progress1 = sortlevel[i].progress;
            diff1 = target1 - progress1;
            perct1 = diff1/(target1-sortlevel[i].target[1]);
            for(let j=i ; j<level5+level4+level3 ; j++){
                target2 = sortlevel[j].target[2];
                progress2 = sortlevel[j].progress;
                diff2 = target2 - progress2;
                perct2 = diff2/(target2-sortlevel[j].target[1]);
                if(perct1>perct2){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        for(let i=level5+level4+level3 ; i<level5+level4+level3+level2 ; i++){
            target1 = sortlevel[i].target[1];
            progress1 = sortlevel[i].progress;
            diff1 = target1 - progress1;
            perct1 = diff1/(target1-sortlevel[i].target[0]);
            for(let j=i ; j<level5+level4+level3+level2 ; j++){
                target2 = sortlevel[j].target[1];
                progress2 = sortlevel[j].progress;
                diff2 = target2 - progress2;
                perct2 = diff2/(target2-sortlevel[j].target[0]);
                if(perct1>perct2){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        for(let i=level5+level4+level3+level2 ; i<level5+level4+level3+level2+level1 ; i++){
            target1 = sortlevel[i].target[4];
            progress1 = sortlevel[i].progress;
            diff1 = target1 - progress1;
            perct1 = diff1/(target1);
            for(let j=i ; j<level5+level4+level3+level2+level1 ; j++){
                target2 = sortlevel[j].target[4];
                progress2 = sortlevel[j].progress;
                diff2 = target2 - progress2;
                perct2 = diff2/(target2);
                if(perct1>perct2){
                    obj1 = sortlevel[i];
                    obj2 = sortlevel[j];
                    sortlevel[i] = obj2;
                    sortlevel[j] = obj3;
                }
            };
        };

        await newUser.findByIdAndUpdate(userId , {
            $set : {
                'achievementlevel' : sortlevel
            }
        });

    }catch(err){
        console.error(err);
    }
};

async function achievementcomplete(userId) {
    const user = await newUser.findById(userId);
    try{
        let changeobj = {};

        let ind=0;
        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'Commit Maker'){
                ind = i;
                break;
            }
        };
        if(user.status.github == 'yes'){
            if(user.achievementlevel[i].level == 1){
                if(user.achievementlevel[i].progress + user.github.commitsovertime[0].value >= user.achievementlevel[i].target[0]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                    changeobj[`achievementlevel.${i}.level`] = 2;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                }
            };
            if(user.achievementlevel[i].level == 2){
                if(user.achievementlevel[i].progress + user.github.commitsovertime[0].value >= user.achievementlevel[i].target[1]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                    changeobj[`achievementlevel.${i}.level`] = 3;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                }
            };
            if(user.achievementlevel[i].level == 3){
                if(user.achievementlevel[i].progress + user.github.commitsovertime[0].value >= user.achievementlevel[i].target[2]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                    changeobj[`achievementlevel.${i}.level`] = 4;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                }
            };
            if(user.achievementlevel[i].level == 4){
                if(user.achievementlevel[i].progress + user.github.commitsovertime[0].value >= user.achievementlevel[i].target[3]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                    changeobj[`achievementlevel.${i}.level`] = 5;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                }
            };
            if(user.achievementlevel[i].level == 5){
                if(user.achievementlevel[i].progress + user.github.commitsovertime[0].value >= user.achievementlevel[i].target[4]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].target[4];
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.github.commitsovertime[0].value;
                }
            };
        };

        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'The Psyco'){
                ind = i;
                break;
            }
        };
        if(user.status.spotify == 'yes'){
            if(user.achievementlevel[i].level == 1){
                if(user.achievementlevel[i].progress + user.spotify.songplayed[0] >= user.achievementlevel[i].target[0]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                    changeobj[`achievementlevel.${i}.level`] = 2;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                }
            };
            if(user.achievementlevel[i].level == 2){
                if(user.achievementlevel[i].progress + user.spotify.songplayed[0] >= user.achievementlevel[i].target[1]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                    changeobj[`achievementlevel.${i}.level`] = 3;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                }
            };
            if(user.achievementlevel[i].level == 3){
                if(user.achievementlevel[i].progress + user.spotify.songplayed[0] >= user.achievementlevel[i].target[2]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                    changeobj[`achievementlevel.${i}.level`] = 4;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                }
            };
            if(user.achievementlevel[i].level == 4){
                if(user.achievementlevel[i].progress + user.spotify.songplayed[0] >= user.achievementlevel[i].target[3]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                    changeobj[`achievementlevel.${i}.level`] = 5;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                }
            };
            if(user.achievementlevel[i].level == 5){
                if(user.achievementlevel[i].progress + user.spotify.songplayed[0] >= user.achievementlevel[i].target[4]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].target[4];
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.songplayed[0];
                }
            };
        };

        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'The Real Addictive'){
                ind = i;
                break;
            }
        };
        if(user.status.spotify == 'yes'){
            if(user.achievementlevel[i].level == 1){
                if(user.achievementlevel[i].progress + user.spotify.totallisteningtime[0] >= user.achievementlevel[i].target[0]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                    changeobj[`achievementlevel.${i}.level`] = 2;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                }
            };
            if(user.achievementlevel[i].level == 2){
                if(user.achievementlevel[i].progress + user.spotify.totallisteningtime[0] >= user.achievementlevel[i].target[1]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                    changeobj[`achievementlevel.${i}.level`] = 3;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                }
            };
            if(user.achievementlevel[i].level == 3){
                if(user.achievementlevel[i].progress + user.spotify.totallisteningtime[0] >= user.achievementlevel[i].target[2]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                    changeobj[`achievementlevel.${i}.level`] = 4;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                }
            };
            if(user.achievementlevel[i].level == 4){
                if(user.achievementlevel[i].progress + user.spotify.totallisteningtime[0] >= user.achievementlevel[i].target[3]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                    changeobj[`achievementlevel.${i}.level`] = 5;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                }
            };
            if(user.achievementlevel[i].level == 5){
                if(user.achievementlevel[i].progress + user.spotify.totallisteningtime[0] >= user.achievementlevel[i].target[4]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].target[4];
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.spotify.totallisteningtime[0];
                }
            };
        };

        let connectcount = 0;
        if(user.status.github == 'yes'){
            connectcount++;
        };
        if(user.status.spotify == 'yes'){
            connectcount++;
        };
        if(user.status.codeforces == 'yes'){
            connectcount++;
        };
        if(user.status.calender == 'yes'){
            connectcount++;
        };

        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'App Lover'){
                ind = i;
                break;
            }
        };

        if(connectcount == 1){
            changeobj[`achievementlevel.${i}.progress`] = 1;
            changeobj[`achievementlevel.${i}.level`] = 2;
        }else if(connectcount == 2){
            changeobj[`achievementlevel.${i}.progress`] = 2;
            changeobj[`achievementlevel.${i}.level`] = 3;
        }else if(connectcount >=3 && connectcount <5){
            changeobj[`achievementlevel.${i}.progress`] = connectcount;
            changeobj[`achievementlevel.${i}.level`] = 4;
        }else if(connectcount >=5 && connectcount <10){
            changeobj[`achievementlevel.${i}.progress`] = connectcount;
            changeobj[`achievementlevel.${i}.level`] = 5;
        }else if(connectcount >=10 && connectcount <20){
            changeobj[`achievementlevel.${i}.progress`] = connectcount;
            changeobj[`achievementlevel.${i}.level`] = 5;
        };

        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'Event Maker'){
                ind = i;
                break;
            }
        };


        if(changeobj != {}){
            await newUser.findByIdAndUpdate(userId , {
                $set : {
                    ...changeobj
                }
            })
        };
        if(user.status.calender == 'yes'){
            if(user.achievementlevel[i].level == 1){
                if(user.achievementlevel[i].progress + user.calender.scheduletime[0] >= user.achievementlevel[i].target[0]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                    changeobj[`achievementlevel.${i}.level`] = 2;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                }
            };
            if(user.achievementlevel[i].level == 2){
                if(user.achievementlevel[i].progress + user.calender.scheduletime[0] >= user.achievementlevel[i].target[1]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                    changeobj[`achievementlevel.${i}.level`] = 3;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                }
            };
            if(user.achievementlevel[i].level == 3){
                if(user.achievementlevel[i].progress + user.calender.scheduletime[0] >= user.achievementlevel[i].target[2]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                    changeobj[`achievementlevel.${i}.level`] = 4;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                }
            };
            if(user.achievementlevel[i].level == 4){
                if(user.achievementlevel[i].progress + user.calender.scheduletime[0] >= user.achievementlevel[i].target[3]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                    changeobj[`achievementlevel.${i}.level`] = 5;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                }
            };
            if(user.achievementlevel[i].level == 5){
                if(user.achievementlevel[i].progress + user.calender.scheduletime[0] >= user.achievementlevel[i].target[4]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].target[4];
                }else{
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].progress + user.calender.scheduletime[0];
                }
            };
        };

        for (let i=0 ; i<user.achievementlevel.lenght ; i++){
            if(user.achievementlevel[i].topic == 'Real Coder'){
                ind = i;
                break;
            }
        };
        if(user.status.github == 'yes'){
            if(user.achievementlevel[i].level == 1){
                if(user.github.totalrepo >= user.achievementlevel[i].target[0]){
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                    changeobj[`achievementlevel.${i}.level`] = 2;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                }
            };
            if(user.achievementlevel[i].level == 2){
                if(user.github.totalrepo >= user.achievementlevel[i].target[1]){
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                    changeobj[`achievementlevel.${i}.level`] = 3;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                }
            };
            if(user.achievementlevel[i].level == 3){
                if(user.github.totalrepo >= user.achievementlevel[i].target[2]){
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                    changeobj[`achievementlevel.${i}.level`] = 4;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                }
            };
            if(user.achievementlevel[i].level == 4){
                if( user.github.totalrepo >= user.achievementlevel[i].target[3]){
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                    changeobj[`achievementlevel.${i}.level`] = 5;
                }else{
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                }
            };
            if(user.achievementlevel[i].level == 5){
                if(user.github.totalrepo >= user.achievementlevel[i].target[4]){
                    changeobj[`achievementlevel.${i}.progress`] = user.achievementlevel[i].target[4];
                }else{
                    changeobj[`achievementlevel.${i}.progress`] =user.github.totalrepo;
                }
            };
        };
        
    }catch(err){
        console.error(err);
    }
};


// For apps

async function fetchdatafromspotify(userId) {
    try {
        if (userId) {
            const user = await newUser.findById(userId);

            if (user.spotify.accesstoken) {
                try {
                    // let spotifyresponse = await axios.get('https://api.spotify.com/v1/me', {
                    //     headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    // });



                    let spotifyresponse = await axios.get('https://api.spotify.com/v1/me/player/recently_played?limit=50', {
                        headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    });

                    let recently = {};
                    let recentlyfortime = 0;
                    let songcount = 0;
                    let limit = Math.min(spotifyresponse.data.items.length, 50);

                    for (let i = 0; i < limit; i++) {
                        recently[`spotify.recentlyplayed.${i}.song`] = spotifyresponse.data.items[i].track.name;
                        recently[`spotify.recentlyplayed.${i}.time`] = gettime(spotifyresponse.data.items[i].played_at);
                        recently[`spotify.recentlyplayed.${i}.duration`] = spotifyresponse.data.items[i].track.duration_ms;
                    };

                    let latestsong = spotifyresponse.data.items[0]?.played_at || null;

                    if (!user.spotify.lastsong) { // for new user
                        for (let i = 0; i < limit; i++) {
                            recentlyfortime += spotifyresponse.data.items[i].track.duration_ms;
                            songcount += 1;
                        };
                    } else { // for old user
                        for (let i = 0; i < limit; i++) {
                            if (user.spotify.lastsong === spotifyresponse.data.items[i].played_at) {
                                break; 
                            } else {
                                recentlyfortime += spotifyresponse.data.items[i].track.duration_ms;
                                songcount += 1;
                            }
                        };
                    };

                    addtimeandsong(userId, recentlyfortime, songcount);
                    timeandsongaddforweek(userId);
                    avgtrack(userId);

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/artists?offset=0&limit=50', {
                        headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    });

                    limit = Math.min(spotifyresponse.data.items.length, 50);

                    for (let i = 0; i < limit; i++) {
                        recently[`spotify.topartist.${i}.name`] = spotifyresponse.data.items[i].name;
                        recently[`spotify.topartist.${i}.popularity`] = spotifyresponse.data.items[i].popularity;
                        recently[`spotify.topartist.${i}.logo`] = spotifyresponse.data.items[i].images[0]?.url || 'artist logo.jpeg';
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50', {
                        headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    });

                    limit = Math.min(spotifyresponse.data.items.length, 50);

                    for (let i = 0; i < limit; i++) {
                        recently[`spotify.toptrack.${i}.name`] = spotifyresponse.data.items[i].name;
                        recently[`spotify.toptrack.${i}.artist`] = spotifyresponse.data.items[i].artists[0].name;
                        recently[`spotify.toptrack.${i}.logo`] = spotifyresponse.data.items[i].album.images[0]?.url || 'album logo.jpeg';
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/playlists?offset=0&limit=50', {
                        headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    });

                    limit = Math.min(spotifyresponse.data.items.length, 50);

                    for (let i = 0; i < limit; i++) {
                        recently[`spotify.topplaylist.${i}.name`] = spotifyresponse.data.items[i].name;
                        recently[`spotify.topplaylist.${i}.track`] = spotifyresponse.data.items[i].tracks.total;
                        recently[`spotify.topplaylist.${i}.logo`] = spotifyresponse.data.items[i].images[0]?.url || 'playlist icon.jpeg';
                    };

                    spotifyresponse = await axios.get('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
                        headers: { 'Authorization': `Bearer ${user.spotify.accesstoken}` }
                    });

                    let totalartist = spotifyresponse.data.artists.total;

                    // Saving the data

                    await newUser.findByIdAndUpdate(userId, {
                        $set: {
                            ...recently,
                            'spotify.lastsong': latestsong,
                            [`spotify.newartist.0`]: totalartist
                        }
                    }, { new: true }
                    )

                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        try {
                            const params = new URLSearchParams();

                            params.append('grant_type', 'refresh_token');
                            params.append('refresh_token', user.spotify.refreshtoken);
                            params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
                            params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);

                            const refreshresponse = await axios.post('https://accounts.spotify.com/api/token', params, {
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });
                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(userId, {
                                $set: {
                                    'spotify.accesstoken': newtoken
                                }
                            });

                            return fetchdatafromspotify(userId);

                        } catch (err) {
                            console.error(err);
                            return;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
};


async function fetchdatafromcalender(userId) {
    try {
        if (userId) {
            const user = await newUser.findById(userId);
            if (user.calender.accesstoken) {
                try {
                    const startdate = new Date();
                    startdate.setHours(0, 0, 0, 0);

                    const enddate = new Date();
                    enddate.setDate(startdate.getDate() + 7);
                    enddate.setHours(23, 59, 59, 999);

                    let response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startdate.toISOString())}&timeMax=${encodeURIComponent(enddate.toISOString())}&singleEvents=true&orderBy=startTime`, {
                        headers: {
                            'Authorization': `Bearer ${user.calender.accesstoken}`,
                            'Accept': 'application/json'
                        }
                    });

                    await hoursscheduleovertime(userId, response.data);

                    let enddate1 = new Date();
                    enddate1.setDate(startdate.getDate());
                    enddate1.setHours(23, 59, 59, 999);

                    response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startdate.toISOString())}&timeMax=${encodeURIComponent(enddate1.toISOString())}&singleEvents=true&orderBy=startTime`, {
                        headers: {
                            'Authorization': `Bearer ${user.calender.accesstoken}`,
                            'Accept': 'application/json'
                        }
                    });

                    await todayschedule(userId, response.data);

                    let enddate2 = new Date();
                    enddate2.setDate(startdate.getDate() + 7);
                    enddate2.setHours(23, 59, 59, 999);

                    response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startdate.toISOString())}&timeMax=${encodeURIComponent(enddate2.toISOString())}&singleEvents=true&orderBy=startTime`, {
                        headers: {
                            'Authorization': `Bearer ${user.calender.accesstoken}`,
                            'Accept': 'application/json'
                        }
                    });

                    await upcomingevents(userId, response.data);




                } catch (err) {
                    if (err.response && err.response.status === 401) {
                        try {
                            const params = new URLSearchParams();
                            params.append('grant_type', 'refresh_token');
                            params.append('refresh_token', user.calender.refreshtoken);
                            params.append('client_id', process.env.CALENDER_CLIENT_ID);
                            params.append('client_secret', process.env.CALENDER_CLIENT_SECRET);

                            const refreshresponse = await axios.post('https://oauth2.googleapis.com/token', params, {
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });

                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(userId, {
                                $set: {
                                    'calender.accesstoken': newtoken
                                }
                            });


                            return fetchdatafromcalender(userId);;

                        } catch (err) {
                            console.error(err);
                            return;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
};


async function fetchdatafromcodeforces(userId) {
    try {
        if (userId) {
            let user = await newUser.findById(userId);
            if (user.codeforces.name) {
                try {
                    let obj = {};
                    let maxrank = '';

                    let response = await axios.get(`https://codeforces.com/api/user.rating?handle=${user.codeforces.name}`);

                    let ratinghistory = response.data.result.reverse();
                    let looplimit = Math.min(ratinghistory.length, 15);

                    for (let i = 0; i < looplimit; i++) {
                        obj[`codeforces.ratinghistory.${i}.value`] = ratinghistory[i].newRating;
                        obj[`codeforces.ratinghistory.${i}.at`] = datecalculater(ratinghistory[i].ratingUpdateTimeSeconds);
                    }


                    let followcount = 0;

                    response = await axios.get(`https://codeforces.com/api/user.info?handles=${user.codeforces.name}`);
                    maxrank = response.data.result[0].maxRank;
                    followcount = response.data.result[0].friendOfCount;

                    let currentrating = response.data.result[0].rating;
                    let currentrank = response.data.result[o].rank;

                    response = await axios.get(`https://codeforces.com/api/user.status?handle=${user.codeforces.name}`);

                    let arr = [0, 0, 0, 0];
                    let j = 0;
                    let k = 0;
                    let problemcount = 0;

                    if (response.data.status == 'OK') {
                        for (let i = 0; i < response.data.result.length; i++) {
                            if (response.data.result[i].verdict == 'OK') {

                                //for language of the codes
                                for (let lang of response.data.result[i].problem.tags) {
                                    if (obj[`codeforces.topics.${lang}`]) {
                                        obj[`codeforces.topics.${lang}`]++;
                                    } else {
                                        obj[`codeforces.topics.${lang}`] = 1;
                                    }
                                }

                                //for rating of the questions 
                                if(!response.data.result[i].problem.rating){

                                }else if (response.data.result[i].problem.rating == 800) {
                                    arr[0]++;
                                    obj[`codeforces.difficulty.${0}.name`] = 800;
                                    obj[`codeforces.difficulty.${0}.value`] = arr[0];
                                } else if (response.data.result[i].problem.rating == 900 || response.data.result[i].problem.rating == 1000 || response.data.result[i].problem.rating == 1100) {
                                    arr[1]++;
                                    obj[`codeforces.difficulty.${1}.name`] = 1000;
                                    obj[`codeforces.difficulty.${1}.value`] = arr[1];
                                } else if (response.data.result[i].problem.rating == 1200 || response.data.result[i].problem.rating == 1300 || response.data.result[i].problem.rating == 1400) {
                                    arr[2]++;
                                    obj[`codeforces.difficulty.${2}.name`] = 1300;
                                    obj[`codeforces.difficulty.${2}.value`] = arr[2];
                                } else {
                                    arr[3]++;
                                    obj[`codeforces.difficulty.${3}.name`] = '1500+';
                                    obj[`codeforces.difficulty.${3}.value`] = arr[3];
                                }

                                //for problem solved count
                                problemcount++;
                            }

                            //for wrong answers selection
                            if (response.data.result[i].verdict == "WRONG_ANSWER" || response.data.result[i].verdict == "TIME_LIMIT_EXCEEDED" || response.data.result[i].verdict == "COMPILATION_ERROR") {
                                if (j < 5) {
                                    obj[`codeforces.wronganswers.${j}.name`] = response.data.result[i].problem.name;
                                    obj[`codeforces.wronganswers.${j}.language`] = response.data.result[i].programmingLanguage;
                                    obj[`codeforces.wronganswers.${j}.type`] = response.data.result[i].verdict;
                                    obj[`codeforces.wronganswers.${j}.duration`] = response.data.result[i].timeConsumedMillis;
                                    j++;
                                }
                            }

                            //for the table of all the data

                            if (response.data.result.length > 1000) {
                                if (k < 1000) {
                                    obj[`codeforces.content.${k}.name`] = response.data.result[i].problem.name;
                                    obj[`codeforces.content.${k}.language`] = response.data.result[i].programmingLanguage;
                                    obj[`codeforces.content.${k}.type`] = response.data.result[i].verdict;
                                    obj[`codeforces.content.${k}.duration`] = response.data.result[i].timeConsumedMillis;
                                    obj[`codeforces.content.${k}.memory`] = response.data.result[i].memoryConsumedBytes;
                                    obj[`codeforces.content.${k}.date`] = datecalculater(response.data.result[i].creationTimeSeconds);
                                    k++;
                                }
                            } else {
                                obj[`codeforces.content.${i}.name`] = response.data.result[i].problem.name;
                                obj[`codeforces.content.${i}.language`] = response.data.result[i].programmingLanguage;
                                obj[`codeforces.content.${i}.type`] = response.data.result[i].verdict;
                                obj[`codeforces.content.${i}.duration`] = response.data.result[i].timeConsumedMillis;
                                obj[`codeforces.content.${i}.memory`] = response.data.result[i].memoryConsumedBytes;
                                obj[`codeforces.content.${i}.date`] = datecalculater(response.data.result[i].creationTimeSeconds);
                            }

                        }
                    }

                    await newUser.findByIdAndUpdate(userId, {
                        $set: {
                            ...obj,
                            'codeforces.maxrank': maxrank,
                            'codeforces.followcount': followcount,
                            'codeforces.problemsolved': problemcount,
                            'codeforces.currentrating' : currentrank,
                            'codeforces.currentrank' : currentrank
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
};

async function fetchdatafromgithub(userId) {
    try {
        if (userId) {
            let user = await newUser.findById(userId);
            if (user.github.accesstoken) {
                try {
                    let response = await axios.get(`https://api.github.com/user`, {
                        headers: {
                            'Authorization': `Bearer ${user.github.accesstoken}`,
                            'Accept': 'application/vnd.github+json'
                        }
                    });

                    let name = response.data.login;
                    let repocount = response.data.public_repos;
                    let followcount = response.data.followers;

                    response = await axios.get(`https://api.github.com/user/repos?per_page=50&sort=updated`, {
                        headers: {
                            'Authorization': `Bearer ${user.github.accesstoken}`,
                            'Accept': 'application/vnd.github+json'
                        }
                    });
                    let obj = {};
                    let starcount = 0;

                    for (let i = 0; i < response.data.length; i++) {
                        obj[`github.repolist.${i}.name`] = response.data[i].name;
                        obj[`github.repolist.${i}.stars`] = response.data[i].stargazers_count;
                        obj[`github.repolist.${i}.watchers`] = response.data[i].watchers_count;
                        obj[`github.repolist.${i}.language`] = response.data[i].language;
                        obj[`github.repolist.${i}.forks`] = response.data[i].forks_count;
                        obj[`github.repolist.${i}.size`] = resizer(response.data[i].size);
                        obj[`github.repolist.${i}.createdat`] = datecalculater(response.data[i].created_at);
                        starcount = starcount + response.data[i].stargazers_count;
                    };

                    let len = [];
                    let dt = [];
                    let a = 0;
                    let data3 = [];


                    a = response.data.length;
                    for (let i = 0; i < a; i++) {
                        response = await axios.get(`https://api.github.com/repos/${name}/${obj[`github.repolist.${i}.name`]}/stats/commit_activity`, {
                            headers: {
                                'Authorization': `Bearer ${user.github.accesstoken}`,
                                'Accept': 'application/vnd.github+json'
                            }
                        });

                        data3 = response.data.reverse();
                        let weekname = data3[0].week ;
                        let week = new Date(weekname*1000);
                        let todaydate = new Date();
                        let diff = todaydate-week ;
                        diff = Math.floor(diff/(84600*1000));
                        let count = 0;
                        let data4 = [];
                        for (let j = 0; j < 5; j++) {
                            if (!data3[j] || !data3[j].days) {
                                continue;
                            }
                            data4 = data3[j].days.reverse();
                            let newno = 6-diff;
                            if(j==0){
                                for (let k = newno; k < 7; k++) {
                                    let currentdaycommits = data4[k] || 0;
                                    len[count] = (len[count] || 0) + currentdaycommits;
                                    count++;
                                };
                            }
                            if(j!=0){
                                for (let k = 0; k < 7; k++) {
                                    let currentdaycommits = data4[k] || 0;
                                    len[count] = (len[count] || 0) + currentdaycommits;
                                    count++;
                                    if(count == 30){
                                        break;
                                    }
                                };
                                if(count == 30){
                                    break;
                                }
                            }
                        };
                    };

                    let realdt = [];
                    let realdate = new Date(data3[0].week*1000 + (1000*60*60*24*6));
                    for (let i = 0; i < 30; i++) {
                        realdt[i] = datecalculater(new Date(realdate+(1000 * 60 * 60 * 24)*i));
                    };

                    dt = daysfetch();

                    let weekname = data3[0].week ;
                    for (let i = 0; i < 30; i++) {
                        obj[`github.commitsovertime.${i}.value`] = len[i];
                        obj[`github.commitsovertime.${i}.at`] = dt[i];
                        obj[`github.commitsovertime.${i}.realdate`] = realdt[i];
                    };

                    let obj2 ={};

                    if (a < 50) {
                        for (let i = 0; i < a; i++) {
                            response = await axios.get(`https://api.github.com/repos/${name}/${obj[`github.repolist.${i}.name`]}/languages`, {
                                headers: {
                                    'Authorization': `Bearer ${user.github.accesstoken}`,
                                    'Accept': 'application/vnd.github+json'
                                }
                            });
                            for (let lang in response.data) {
                                let size = response.data[lang];
                                if (obj2[lang]) {
                                    obj2[lang] += size;
                                } else {
                                    obj2[lang] = size;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < 50; i++) {
                            response = await axios.get(`https://api.github.com/repos/${name}/${obj[`github.repolist.${i}.name`]}/languages`, {
                                headers: {
                                    'Authorization': `Bearer ${user.github.accesstoken}`,
                                    'Accept': 'application/vnd.github+json'
                                }
                            });
                            for (let lang in response.data) {
                                let size = response.data[lang];
                                if (obj2[lang]) {
                                    obj2[lang] += size;
                                } else {
                                    obj2[lang] = size;
                                }
                            }
                        }
                    }

                    await newUser.findByIdAndUpdate(userId, {
                        $set: {
                            ...obj,
                            'github.language' : obj2,
                            'github.name': name,
                            'github.totalrepo': repocount,
                            'github.totalstar': starcount,
                            'github.totalfollow': followcount,
                            'github.week' : weekname
                        }
                    }, { new: true }
                    );

                } catch (err) {
                    console.log('err');
                    if (err.response && err.response.status === 401) {
                        try {
                            const params = new URLSearchParams();
                            params.append('grant_type', 'refresh_token');
                            params.append('refresh_token', user.github.refreshtoken);
                            params.append('client_id', process.env.GITHUB_CLIENT_ID);
                            params.append('client_secret', process.env.GITHUB_CLIENT_SECRET);

                            const refreshresponse = await axios.post('https://github.com/login/oauth/access_token', params, {
                                headers: { 'Accept': 'application/json' }
                            });

                            const newtoken = refreshresponse.data.access_token;
                            await newUser.findByIdAndUpdate(userId, {
                                $set :{
                                    'github.accesstoken': newtoken
                                }

                            });

                            return fetchdatafromgithub(userId);

                        } catch (err) {
                            console.error(err);
                            return;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
};


// Node Cron (for live fetching)

//nodecron.schedule('1 0 * * *', async() => { // 12:01
//    try {
//        const users = await newUser.find({ 'status.calender': "yes" });
//        for (let user of users) {
//            await fetchdatafromcalender(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//
//    try {
//        const users = await newUser.find({ 'status.github': "yes" });
//        for (let user of users) {
//            await fetchdatafromgithub(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//
//    try {
//        const users = await newUser.find({ 'status.codeforces': "yes" });
//        for (let user of users) {
//            await fetchdatafromcodeforces(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('1 4 * * *', async() => { // rat ke 4 baje
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('1 8 * * *', async() => { // subh ke 8 baje
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('1 12 * * *', async() => { // din ke 12 baje
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('1 16 * * *', async() => { // din ke 4 baje
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('1 20 * * *', async() => { // rat ke 8 baje
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('50 23 * * *', async() => { // 23:50 (for saving the previous day data)
//    try {
//        const users = await newUser.find({ 'status.github': "yes" });
//        for (let user of users) {
//            await commits(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//
//    try {
//        const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await listeninghourtime(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//
//    try {
//        const users = await newUser.find({ 'status.calender': "yes" });
//        for (let user of users) {
//            await hoursschedule(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//    try {
//        const users = await newUser.find({'login' : 'yes});
//        for (let user of users) {
//            await achievementsort(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//
//nodecron.schedule('45 23 * * *' , async() =>{ //consecutive day ke liye
//    try {
//        const users = await newUser.find({'login' : 'yes});
//        for (let user of users) {
//            await consecutivelogin(user._id);
//        }
//    }catch(err){
//        console.error(err);
//    };
//});
//nodecron.schedule('* */4 * * *' , async() =>{ //har 4 ghante vale
//    try{
//       const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await fetchdatafromspotify(user._id);
//        } 
//    }catch(err){
//        console.error(err);
//    }
//});
//
//nodecron.schedule('* * * * *' , async() =>{ // per minute
//    try{
//       const users = await newUser.find({ 'status.spotify': "yes" });
//        for (let user of users) {
//            await gettimeago(user._id);
//        }
//              // socket.io ka logic likhna hai 
//
//
//
//2. CRITICAL STEP: Database update hone ke baad frontend ko data phenko
//'updatedData' mein tumhara naya time data hoga (jaise "1 min ago")
//io.emit('spotify-time-update', updatedData);
//    }catch(err){
//        console.error(err);
//    }
//});

// Setinterval (live sync)

// PDF making

async function chartmaking(config) {
    let charturl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}`;

    let imageresponse = await axios.get(charturl, {
        'responseType': 'arraybuffer'
    });

    return imageresponse.data;
};


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

app.get('/dashboard', async (req, res) => {
    let user = " ";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('dashboard', { user: user });
    } else {
        res.status(500).redirect('/');
    };
});

app.get('/analyticsspotify', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('analyticsspotify', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/analyticscodeforces', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('analyticscodeforces', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/analyticsgithub', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('analyticsgithub', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/analyticscalender', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('analyticscalender', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});


app.get('/goals', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('goals', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/goalsweekly', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('goalsweekly', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/goalscustom', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('goalscustom', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/goalsmonthly', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        fetchdatafromgithub(req.session.userId);
        res.status(200).render('goalsmonthly', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/newgoals', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('newgoals');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/integration', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('integration', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/codeforceslogin', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('codeforceslogin');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/wronghandle', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('wronghandle');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/reports', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('reports', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/achievements', async (req, res) => {
    let user = '';
    if (req.session.userId) {
        const USER = await newUser.findById(req.session.userId);
        user = USER;
        res.status(200).render('achievements', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/settingsprofile', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('settingsprofile', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/settingsprivacy', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('settingsprivacy');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/settingsnotifications', async (req, res) => {
    let user = "";
    if (req.session.userId) {
        const User = await newUser.findById(req.session.userId);
        user = User;
        res.status(200).render('settingsnotifications', { user: user });
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/settingslogout', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('settingslogout');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/settingshelp', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('settingshelp');
    } else {
        res.status(500).redirect('/');
    }
});

app.get('/contact', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('contact');
    } else {
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

app.get('/invaliddetailsforrepassword', async (req, res) => {
    if (req.session.userId) {
        res.status(200).render('invaliddetailsforrepassword');
    } else {
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
    req.session.destroy((err) => {
        if (err) console.error(err);
        req.logout(() => {
            res.redirect('/');
        });
    });
});


// call of third party API(s)

app.get('/auth/spotify', (req, res) => {
    let scope = 'user-follow-read user-top-read user-read-recently-played user-library-read user-read-private playlist-read-private';
    const spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' +
        'client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent('http://127.0.0.1:3000/spotifycallback') +
        `&scope=` + encodeURIComponent(scope);
    res.redirect(spotifyLoginUrl);
});

app.get('/auth/calender', (req, res) => {
    let scope = 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly';
    const calenderLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=' + process.env.CALENDER_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(process.env.CALENDER_CALLBACK_URL) +
        '&scope=' + encodeURIComponent(scope) +
        '&access_type=offline' +
        '&prompt=consent';
    res.redirect(calenderLoginUrl);
});

app.get('/auth/github', (req, res) => {
    let scope = 'read:user repo';
    const githubLoginUrl = 'https://github.com/login/oauth/authorize?' +
        'client_id=' + process.env.GITHUB_CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(process.env.GITHUB_CALLBACK_URL) +
        `&scope=` + encodeURIComponent(scope);

    res.redirect(githubLoginUrl);
});

app.get('/auth/youtube', (req, res) => {
    let scope = '';
    const googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=' + process.env.YOUTUBE_CLIENT_ID +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(process.env.YOUTUBE_CALLBACK_URL) +
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
        params.append('redirect_uri', process.env.SPOTIFY_CALLBACK_URL);
        params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
        params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);


        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId,
                {
                    $set: {
                        'spotify.accesstoken': accessToken,
                        'spotify.refreshtoken': refreshToken,
                        'status.spotify': 'yes'
                    }
                }

            );
        }
    } catch (err) {
        console.error(err);
    }
    if(req.session.userId){
        await fetchdatafromspotify(req.session.userId);
    }
    res.status(200).redirect("/integration");
});

app.get('/calendercallback', async (req, res) => {
    const mycode = req.query.code;
    if (!mycode) {
        return res.status(400).send("USER DENIED THE PERMISION !");
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', mycode);
        params.append('redirect_uri', process.env.CALENDER_CALLBACK_URL);
        params.append('client_id', process.env.CALENDER_CLIENT_ID);
        params.append('client_secret', process.env.CALENDER_CLIENT_SECRET);

        const response = await axios.post('https://oauth2.googleapis.com/token', params, {
            headers: { 'Content-Type': 'application/x/www-form-urlencoded' }
        });

        const accesstoken = response.data.access_token;
        const refreshtoken = response.data.refresh_token;

        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId, {
                $set: {
                    'calender.accesstoken': accesstoken,
                    'calender.refreshtoken': refreshtoken,
                    'status.calender': 'yes'
                }
            }, { new: true }
            );

        }
    } catch (err) {
        console.error(err);
    }
    if(req.session.userId){
        await fetchdatafromcalender(req.session.userId);
    }
    res.status(200).redirect("/integration");
});

app.get('/githubcallback', async (req, res) => {
    const mycode = req.query.code;
    if (!mycode) {
        return res.status(400).send("USER DENIED THE PERMISION !");
    }

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            code: mycode,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET
        }, {
            headers: { 'Accept': 'application/json' }
        });
        const accesstoken = response.data.access_token;
        const refreshtoken = response.data.refresh_token;

        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId,
                {$set : {
                    'github.accesstoken': accesstoken,
                    'github.refreshtoken': refreshtoken,
                    'status.github': 'yes'
                }
                },{new : true}
            );
        }
    } catch (err) {
        console.error(err);
    }
    if(req.session.userId){
        await fetchdatafromgithub(req.session.userId);
    }
    
    res.status(200).redirect("/integration");
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

app.post('/codeforceslogin' , async(req,res)=>{
    const {name} = req.body;
    if(req.session.userId){
        try{
            const response = await axios.get(`https://codeforces.com/api/user.info?handles=${name}`);

            if (response.data.status === 'OK') {
                await newUser.findByIdAndUpdate(req.session.userId , {
                    $set : {
                        'codeforces.name' : name,
                        'status.codeforces' : 'yes'
                    }
                });

                res.status(200).redirect('/integration');
            }
        }catch(err){
            if (err.response && err.response.data && err.response.data.status === 'FAILED') {
                res.status(500).redirect('/wronghandle');
            }
            console.error(err);
        };
    };
})

app.post('/newgoals', async (req, res) => {
    const { type, goal, target, deadline } = req.body;
    try {
        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId, {
                    $push: {
                        newgoal: { 
                            type: type,
                            goal: goal,
                            target: target,
                            deadline: deadline,
                            done: 0 
                        }
                    }
                },
                { new: true }
            );
            res.status(200).redirect('/goals');
        }else{
            res.status(501).redirect('/');
        }

    } catch (err) {
        console.error(err);
    }
});

app.post('/reports', async (req, res) => {
    const { type, when } = req.body;
    try {
        if (req.session.userId) {
            if (type == 'weekly') {
                //making of functionlet dt = when;
                let dt =new Date(when) ;

                const user = await newUser.findById(req.session.userId);

                const PDFDocument = require('pdfkit');
                const fs = require('fs');

                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50
                });

                const reportFilePath = `./reports/Report_${req.session.userId}_${Date.now()}.pdf`;
                const writestream = fs.createWriteStream(reportFilePath);
                doc.pipe(writestream);

                //doc.rect(45,90,510,75).lineWidth(2).strokeColor('#000000').stroke();

                doc.fontSize(40).font('Helvetica-Bold').fillColor('#000000').text("PRODUCTIVITY & DIGITAL LIFE REPORT", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.fontSize(15)
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 1 of 7`, 50, 750, {
                        align: 'center'
                    });

                let realdate = new Date();

                let diff = realdate - dt;

                diff = Math.floor(diff / (1000 * 60 * 60 * 24));

                let datearr = [];

                for (let i = 0; i < 7; i++) {
                    datearr[i] = datecalculater(dt + (1000 * 60 * 60 * 24) * i);
                }

                let daybefore = datecalculater(dt - (1000 * 60 * 60 * 24))

                let spotifyhours = [];
                let spotifysong = [];
                let spotifyartist = [];

                let ind = 0;

                for (let i = diff; i > Math.min(diff - 7, -1); i--) {
                    spotifyhours[ind] = (user.spotify.totallisteningtime && user.spotify.totallisteningtime[i] !== undefined) ? user.spotify.totallisteningtime[i] : 0;
                    spotifysong[ind] = (user.spotify.songplayed && user.spotify.songplayed[i] !== undefined) ? user.spotify.songplayed[i] : 0;
                    spotifyartist[ind] = (user.spotify.newartist && user.spotify.newartist[i] !== undefined) ? user.spotify.newartist[i] : 0;
                    ind++;
                };

                let totalhours = 0;
                let totalsongs = 0;
                let totalartist = 0;

                for (let i = 0; i < spotifyhours.length; i++) {
                    totalhours = totalhours + spotifyhours[i];
                    totalsongs = totalsongs + spotifysong[i];
                    totalartist = totalartist + spotifyartist[i];
                }

                let calenderhours = [];
                let calendereventsname = [];
                let calendereventstime = [];
                let calendereventsdate = [];
                ind = 0;
                let ind1 = 0;

                for (let i = diff; i > Math.min(diff - 7, -1); i--) {
                    calenderhours[ind] = user.calender.scheduletime[i].value;
                    ind++;
                };

                let check = true;

                ind = 0;

                while (check && ind < user.calender.events.length) {
                    if (daybefore == user.calender.events[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[7] == user.calender.events[ind1].date) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                let ind2 = ind;
                ind = 0;

                let eventscount = 0;

                for (let i = ind2; i >= ind1; i--) {
                    calendereventsname[ind] = user.calender.events[i].name;
                    calendereventsdate[ind] = user.calender.events[i].date;
                    calendereventstime[ind] = user.calender.events[i].time;
                    eventscount++;
                    ind++;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.codeforces.content[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[7] == user.codeforces.content[ind1].date) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let codeforcesname = [];
                let codeforcesverdict = [];
                let codeforceslanguage = [];
                let codeforcestime = [];
                let codeforcessize = [];
                let cfrating = user.codeforces.currentrating ;
                let cfrank= user.codeforces.currentrank;

                for (let i = ind2; i >= ind1; i--) {
                    codeforcesname[ind] = user.codeforces.content[i].name;
                    codeforcesverdict[ind] = user.codeforces.content[i].type;
                    codeforceslanguage[ind] = user.codeforces.content[i].language;
                    codeforcestime[ind] = user.codeforces.content[i].duration;
                    codeforcessize[ind] = user.codeforces.content[i].memory;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.github.repolist[ind].createdat) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[7] == user.github.repolist[ind1].createdat) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let githubcommit = [];
                let githubreponame = [];
                let githubrepostar = [];
                let githubrepowatcher = [];
                let githubrepolanguage = [];
                let githubrepofork = [];
                let githubreposize = [];
                let githbufollow = user.github.totalstar;
                let githubstars = user.github.totalfollow;

                for (let i = ind2; i >= ind1; i--) {
                    githubreponame[ind] = user.github.repolist[i].name;
                    githubrepostar[ind] = user.github.repolist[i].stars;
                    githubrepowatcher[ind] = user.github.repolist[i].watchers;
                    githubrepolanguage[ind] = user.github.repolist[i].language;
                    githubrepofork[ind] = user.github.repolist[i].forks;
                    githubreposize[ind] = user.github.repolist[i].size;
                };

                ind = 0;

                let githubforold = '';

                if (diff > 30) {
                    githubforold = 'Your date is very older for over saved data , Plaese select a date within 30 days range for using this feature.'
                } else {
                    for (let i = diff; i > Math.min(diff - 7, -1); i--) {
                        githubcommit[ind] = user.github.commitsovertime[i].value;
                        ind++;
                    };
                };

                let totalcommit = 0;
                if (diff > 30) {

                } else {
                    for (let i = 0; i < githubcommit.length; i++) {
                        totalcommit = totalcommit + githubcommit[i];
                    }
                };

                doc.rect(45, 230, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 310, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 390, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 470, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#2b2a2a').text(`Github Commits this Week : ${totalcommit}`, 50, 235, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Codeforces Current Rating : ${cfrating} , Rank : ${cfrank}`, 50, 315, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Spotify Weekly Minutes Tracked : ${totalhours} min.`, 50, 395, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Total Events Managed this Week : ${eventscount}`, 50, 475, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 2 of 7`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("GITHUB DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.rect(45, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(210, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(375, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Commits this", 50, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Week:", 50, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalcommit}`, 120, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Star Earned:", 215, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${githubstars}`, 270, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text(" Followers Count:", 380, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${githbufollow}`, 430, 180, {
                    width: 500,
                    align: 'justify'
                });

                let chartcommit;
                let chartconfig;

                if (githubforold == 'Your date is very older for over saved data , Plaese select a date within 30 days range for using this feature.') {
                    doc.fontSize(25)
                    .text(githubforold, 50, 225, {
                        align : 'center'
                    })
                } else {
                    chartconfig = {
                        type: 'bar',
                        data: {
                            labels: datearr,
                            datasets: [{
                                label: 'Weekly Commit Record', // Label dena achha rehta hai
                                data: githubcommit
                            }]
                        }
                    };

                    try {
                        chartcommit = await chartmaking(chartconfig);

                        if (chartcommit) {
                            doc.image(chartcommit, 50, 225, { width: 500, height: 250 });
                        }
                    } catch (error) {
                        console.error("Chart download fail ho gaya:", error.message);
                        doc.text("Chart could not be loaded.", 50, 250);
                    };
                }

                doc.fontSize(25).font('Helvetica-Bold').fillColor('#000000').text("REPOS  INSIGHTS", 50, 490, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 550)
                    .lineTo(532, 550)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Stars', 180, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Watchers', 240, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 330, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Forks', 420, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 530);

                let yaxis = 570;
                let xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, githubreponame.length); i++) {

                    doc.text(`${githubreponame[i]}`, 50, yaxis);
                    doc.text(`${githubrepostar[i]}`, 180, yaxis);
                    doc.text(`${githubrepowatcher[i]}`, 240, yaxis);
                    doc.text(`${githubrepolanguage[i]}`, 330, yaxis);
                    doc.text(`${githubrepofork[i]}`, 420, yaxis);
                    doc.text(`${githubreposize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 3 of 7`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("SPOTIFY DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.rect(45, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(210, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(375, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Listening ", 50, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Hours:", 50, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalhours}`, 120, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Song Played:", 215, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalsong}`, 270, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text(" Unique Artist:", 380, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalartist}`, 430, 180, {
                    width: 500,
                    align: 'justify'
                });

                chartconfig = {
                    type: 'line',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'Listening Hours day wise',
                            data: spotifyhours
                        }]
                    }
                };

                try {
                    let chartlistening = await chartmaking(chartconfig);

                    if (chartlistening) {
                        doc.image(chartlistening, 50, 225, { width: 500 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                chartconfig = {
                    type: 'bar',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'No. of Songs Listen that Week',
                            data: spotifysong
                        }]
                    }
                };

                try {
                    let chartsongs = await chartmaking(chartconfig);

                    if (chartsongs) {
                        doc.image(chartsongs, 50, 550, { width: 500, height: 200 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 4 of 7`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("CODEFORCES DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("PROBLEMS  INSIGHTS", 50, 150, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 210)
                    .lineTo(532, 210)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 190, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Verdict', 300, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 400, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 190);

                yaxis = 230;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, codeforceslanguage.length); i++) {

                    doc.text(`${codeforcesname[i]}`, 50, yaxis);
                    doc.text(`${codeforceslanguage[i]}`, 190, yaxis);
                    doc.text(`${codeforcesverdict[i]}`, 300, yaxis);
                    doc.text(`${codeforcestime[i]}`, 400, yaxis);
                    doc.text(`${codeforcessize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                let answertype = [0, 0, 0, 0];

                for (let i = 0; i < codeforcesverdict.length; i++) {
                    if (codeforcesverdict[i] == 'OK') {
                        answertype[0]++;
                    } else if (codeforcesverdict[i] == 'WRONG_ANSWER') {
                        answertype[1]++;
                    } else if (codeforcesverdict[i] == 'TIME_LIMIT_EXCEEDED') {
                        answertype[2]++;
                    } else if (codeforcesverdict[i] == 'COMPILATION_ERROR') {
                        answertype[3]++;
                    }
                };

                chartconfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['OK', 'WRONG_ANSWER', 'T_LIMIT_EXCEDED', 'COMPILATION ERROR'],
                        datasets: [{
                            label: 'Answer type',
                            data: answertype
                        }]
                    }
                };

                try {
                    let chartanswertype = await chartmaking(chartconfig);

                    if (chartanswertype) {
                        doc.image(chartanswertype, 50, 500, { width: 500, height: 250 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 5 of 7`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("CALENDAR DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                chartconfig = {
                    type: 'bar',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'Hours Schedule Over Time',
                            data: calenderhours
                        }]
                    }
                };

                try {
                    let charthours = await chartmaking(chartconfig);

                    if (charthours) {
                        doc.image(charthours, 50, 125, { width: 500 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.fontSize(25).font('Helvetica-Bold').fillColor('#000000').text("Events that Week", 50, 490, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 550)
                    .lineTo(532, 550)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 70, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 300, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Date', 450, 530);

                yaxis = 570;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, calendereventsname.length); i++) {

                    doc.text(`${calendereventsname[i]}`, 70, yaxis);
                    doc.text(`${calendereventstime[i]}`, 300, yaxis);
                    doc.text(`${calendereventsdate[i]}`, 450, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 6 of 7`, 50, 750, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("AI GENERATED SUMMARIES", 50, 100, {
                    width: 500,
                    align: 'center'
                });


                const geminiurl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;


                let requestBodygithub = {
                    contents: [{
                        parts: [{
                            text: `You are an expert developer-advocate and technical productivity analyst specializing in personalized weekly engineering wrap-ups.
        
                                I am providing you with the user's GitHub activity metrics entirely as structured text and parallel arrays.
                                                    
                                USER'S GLOBAL METRICS:
                                - Total Commits this Week: ${totalcommit}
                                - Total Stars Earned: ${githubstars}
                                - Total Followers Count: ${githbufollow}
                                                    
                                COMMIT LOGS (Respective Arrays):
                                - Dates: ${JSON.stringify(datearr)}
                                - Commits on these dates: ${JSON.stringify(githubcommit)}
                                                    
                                REPOSITORY INSIGHTS TABLE (Respective Columns Arrays):
                                - Repository Names: ${JSON.stringify(githubreponame)}
                                - Stars per Repo: ${JSON.stringify(githubrepostar)}
                                - Watchers per Repo: ${JSON.stringify(githubrepowatcher)}
                                - Primary Languages: ${JSON.stringify(githubrepolanguage)}
                                - Forks per Repo: ${JSON.stringify(githubrepofork)}
                                - Code Sizes: ${JSON.stringify(githubreposize)}
                                                    
                                YOUR TASK:
                                Analyze these parallel datasets, identify the highest commit date, pinpoint the most impactful repository from the lists, and write an inspiring, sharp 4-point weekly summary that concludes with a                           practical developer suggestion.
                                                    
                                STRICT LAYOUT & FORMAT CONSTRAINTS (CRITICAL FOR PDF RENDERING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be between 180 to 200 words (approx. 45-50 words per point). 
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Do not include titles, introductory lines, or closing remarks. Start directly with "1. " and end with the final word of the 4th point.
                                5. Structure:
                                   - Point 1: Highlight the global productivity metrics (total commits and total stars) with an encouraging tech tone.
                                   - Point 2: Identify the peak activity date by checking the commit arrays and explicitly mention that exact date string (e.g., "15 jul") as their maximum flow-state day.
                                   - Point 3: Reference the repository lists, highlighting the top-performing repo name, its primary language, and its community engagement (stars/forks).
                                   - Point 4 (Suggestion): Provide a witty, data-driven engineering suggestion on how they can optimize their workflow or open-source footprint next week (e.g., modularizing code, documenting                            repositories, or balancing commit distributions).`
                        }]
                    }]
                };

                let requestBodycodeforces = {
                    contents: [{
                        parts: [{
                            text: `You are an expert competitive programming coach and technical writer specializing in gamified weekly performance reviews for developers.
        
                                   I am providing you with the user's Codeforces problem-solving metrics entirely as structured text and parallel arrays.

                                   SUBMISSION VERDICTS DISTRIBUTION (Respective Arrays):
                                   - Verdict Categories: ['OK','WRONG_ANSWER','T_LIMIT_EXCEDED','COMPILATION ERROR'],
                                   - Respective Submission Counts: ${JSON.stringify(answertype)}

                                   PROBLEMS INSIGHTS TABLE (Respective Columns Arrays):
                                   - Problem Names: ${JSON.stringify(codeforcesname)}
                                   - Languages Used: ${JSON.stringify(codeforceslanguage)}
                                   - Specific Verdicts: ${JSON.stringify(codeforcesverdict)}
                                   - Execution Times: ${JSON.stringify(codeforcestime)}
                                   - Code Sizes: ${JSON.stringify(codeforcessize)}

                                   YOUR TASK:
                                   Analyze these parallel datasets, extract the total successful accepted solutions, identify the bottleneck errors, evaluate their coding efficiency from the table lists, and write a sharp 4-point                       weekly summary that concludes with a strategic suggestion.

                                   STRICT LAYOUT & FORMAT CONSTRAINTS (CRITICAL FOR PDF RENDERING):
                                   1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                   2. Length Control: Total word count across all points must be between 180 to 200 words (approx. 45-50 words per point). 
                                   3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                   4. No Intro/Outro: Do not include titles, introductory lines, or closing remarks. Start directly with "1. " and end with the final word of the 4th point.
                                   5. Structure:
                                      - Point 1: Celebrate the total number of successful 'OK' / accepted solutions found in the verdict arrays with a high-energy competitive programming tone.
                                      - Point 2: Address the errors present in the distribution list (like WRONG_ANSWER or TIME_LIMIT_EXCEEDED counts) as tactical bugs to crush.
                                      - Point 3: Highlight their primary programming language (like C++) and efficiency metrics (execution times/sizes) from the problem lists.
                                      - Point 4 (Suggestion): Give a highly specific, data-driven optimization suggestion on how they can improve their execution speed, reduce errors, or pick better algorithmic approaches next week.`
                        }]
                    }]
                };

                let requestBodyspotify = {
                    contents: [{
                        parts: [{
                            text: `You are an expert personalized content creator and music analyst specializing in weekly music wrap-ups.

                                I am providing you with the user's Spotify listening metrics for the week as text. The daily breakdown arrays are perfectly mapped by index position to the dates provided in the dates array.

                                USER'S WEEKLY METRICS:
                                - Total hours of music listened to: ${totalhours} hours
                                - Total number of unique songs played: ${totalsongs} songs
                                - Number of new artists discovered/followed: ${totalartist} new artists
                                - Mapped Dates Array: ${JSON.stringify(datearr)}
                                - Mapped Listening Hours Array: ${JSON.stringify(spotifyhours)}
                                - Mapped Number of Songs Played Array: ${JSON.stringify(spotifysong)}

                                YOUR TASK:
                                Analyze the numbers across the mapped arrays, find the exact date(s) where the user had the highest activity peaks, and write an incredibly engaging, sharp, and witty 4-point weekly summary that                      ends with a creative suggestion.

                                STRICT LAYOUT & FORMAT CONSTRAINTS (CRITICAL FOR PDF RENDERING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be between 180 to 200 words (approx. 45-50 words per point). 
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Do not include titles, introductory lines, or closing remarks. Start directly with "1. " and end with the final word of the 4th point.
                                5. Structure:
                                   - Point 1: Highlight the overall high-level metrics (total hours and total songs) with an energetic, Spotify-Wrapped style vibe.
                                   - Point 2: Identify the index of the highest peak from the hours and songs arrays, find its corresponding date from the dates array, and comment on that specific date's massive music session.
                                   - Point 3: Highlight the new artists followed and describe what it says about their expanding or experimental musical taste.
                                   - Point 4 (Suggestion): Give a fun, personalized suggestion on how they can improve or diversify their listening habits next week based on their data trends.`
                        }]
                    }]
                };

                let requestBodycalender = {
                    contents: [{
                        parts: [{
                            text: `You are an expert productivity coach and time-management specialist specializing in personalized weekly routine analysis and reports.

                                I am providing you with the user's weekly calendar schedule metrics entirely as structured text and parallel arrays.

                                SCHEDULE TRENDS LOGS (Respective Arrays):
                                - Dates: ${JSON.stringify(datearr)}
                                - Scheduled Hours on these dates: ${JSON.stringify(calenderhours)}

                                EVENTS LOGS TABLE (Respective Columns Arrays):
                                - Event Names: ${JSON.stringify(calendereventsname)}
                                - Event Timings: ${JSON.stringify(calendereventstime)}
                                - Event Dates: ${JSON.stringify(calendereventsdate)}

                                YOUR TASK:
                                Analyze these parallel datasets, identify the highest peak scheduled date from the logs, evaluate the critical commitments they handled from the event lists, and write a sharp 4-point weekly                      productivity summary that concludes with a practical time-management suggestion.

                                STRICT LAYOUT & FORMAT CONSTRAINTS (CRITICAL FOR PDF RENDERING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be between 180 to 200 words (approx. 45-50 words per point). 
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Do not include titles, introductory lines, or closing remarks. Start directly with "1. " and end with the final word of the 4th point.
                                5. Structure:
                                   - Point 1: Reflect on the overall commitment, productivity, and time-allocation strategy shown by the user this week.
                                   - Point 2: Identify the peak activity date by checking the schedule arrays and explicitly mention that exact date string (e.g., "15 jul") as their maximum grind day.
                                   - Point 3: Reference the specific events lists, highlighting key deadlines, meetings, or major tasks they successfully managed.
                                   - Point 4 (Suggestion): Provide a clever, data-driven time-management suggestion on how they can optimize their upcoming weekly routine, balance deep-work buffers, or prevent burnout based on                      high-hour clusters.`
                        }]
                    }]
                };
                
                let [responsegithub , responsecodeforces , responsespotify , responsecalender] = await Promise.all([
                    axios.post(geminiurl, requestBodygithub, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodycodeforces, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodyspotify, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodycalender, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                ]);
                
                let replygithub = responsegithub.data.candidates[0].content.parts[0].text;
                
                let replycodeforces = responsecodeforces.data.candidates[0].content.parts[0].text;

                let replyspotify = responsespotify.data.candidates[0].content.parts[0].text;

                let replycalender = responsecalender.data.candidates[0].content.parts[0].text;


                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("1. Github", 50, 150, {
                    width: 500,
                    align: 'justify'
                });
                
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replygithub, 50, 175, {
                    width: 500,
                    align: 'justify'
                });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("2. Codeforces", 50, 430, {
                    width: 500,
                    align: 'justify'
                });
                
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replycodeforces, 50, 455, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Weekly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 7 of 7`, 50, 750, {
                        align: 'center'
                    });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("3. Spotify", 50, 100, {
                    width: 500,
                    align: 'justify'
                });
                
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replyspotify, 50, 125, {
                    width: 500,
                    align: 'justify'
                });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("4. Calendar", 50, 380, {
                    width: 500,
                    align: 'justify'
                });

                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replycalender, 50, 405, {
                    width: 500,
                    align: 'justify'
                });



                doc.end();

                res.setHeader('Content-Type', 'application/pdf');

                writestream.on('finish', () => {
                    res.download(reportFilePath, 'Performance_Report.pdf', (err) => {
                        if (err){ 
                            console.error(err)
                        };
                        fs.unlink(reportFilePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Temp file deletion failed:", unlinkErr);
                        });
                    });
                });


            } else if (type == 'monthly') {
                //making of function
                let dt = new Date(when);

                const user = await newUser.findById(req.session.userId);

                const PDFDocument = require('pdfkit');
                const fs = require('fs');

                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50
                });

                const reportFilePath = `./reports/Report_${req.session.userId}_${Date.now()}.pdf`;
                const writestream = fs.createWriteStream(reportFilePath);
                doc.pipe(writestream);

                //doc.rect(45,90,510,75).lineWidth(2).strokeColor('#000000').stroke();

                doc.fontSize(40).font('Helvetica-Bold').fillColor('#000000').text("PRODUCTIVITY & DIGITAL LIFE REPORT", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                let realdate = new Date();

                let diff = realdate - dt;

                diff = Math.floor(diff / (1000 * 60 * 60 * 24));

                let datearr = [];

                for (let i = 0; i < 30; i++) {
                    datearr[i] = datecalculater(dt + (1000 * 60 * 60 * 24) * i);
                }

                let daybefore = datecalculater(dt - (1000 * 60 * 60 * 24))

                let spotifyhours = [];
                let spotifysong = [];
                let spotifyartist = [];

                let ind = 0;

                for (let i = diff; i > Math.min(diff - 30, -1); i--) {
                    spotifyhours[ind] = (user.spotify.totallisteningtime && user.spotify.totallisteningtime[i] !== undefined) ? user.spotify.totallisteningtime[i] : 0;
                    spotifysong[ind] = (user.spotify.songplayed && user.spotify.songplayed[i] !== undefined) ? user.spotify.songplayed[i] : 0;
                    spotifyartist[ind] = (user.spotify.newartist && user.spotify.newartist[i] !== undefined) ? user.spotify.newartist[i] : 0;
                    ind++;
                };

                let totalhours = 0;
                let totalsongs = 0;
                let taotalartist = 0;

                for (let i = 0; i < spotifyhours.length; i++) {
                    totalhours = totalhours + spotifyhours[i];
                    totalsongs = totalsongs + spotifysong[i];
                    totalartist = totalartist[i];
                }

                let calenderhours = [];
                let calendereventsname = [];
                let calendereventstime = [];
                let calendereventsdate = [];
                ind = 0;
                let ind1 = 0;

                for (let i = diff; i > Math.min(diff - 30, -1); i--) {
                    calenderhours[ind] = user.calender.scheduletime[i].value;
                    ind++;
                };

                let check = true;

                ind = 0;

                while (check && ind < user.calender.events.length) {
                    if (daybefore == user.calender.events[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[29] == user.calender.events[ind1].date) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                let ind2 = ind;
                ind = 0;

                let eventscount = 0;

                for (let i = ind2; i >= ind1; i--) {
                    calendereventsname[ind] = user.calender.events[i].name;
                    calendereventsdate[ind] = user.calender.events[i].date;
                    calendereventstime[ind] = user.calender.events[i].time;
                    eventscount++;
                    ind++;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.codeforces.content[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[29] == user.codeforces.content[ind1].date) {
                        check = false;
                    }

                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let codeforcesname = [];
                let codeforcesverdict = [];
                let codeforceslanguage = [];
                let codeforcestime = [];
                let codeforcessize = [];
                let cfrating = user.codeforces.currentrating ;
                let cfrank= user.codeforces.currentrank;

                for (let i = ind2; i >= ind1; i--) {
                    codeforcesname[ind] = user.codeforces.content[i].name;
                    codeforcesverdict[ind] = user.codeforces.content[i].type;
                    codeforceslanguage[ind] = user.codeforces.content[i].language;
                    codeforcestime[ind] = user.codeforces.content[i].duration;
                    codeforcessize[ind] = user.codeforces.content[i].memory;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.github.repolist[ind].createdat) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[29] == user.github.repolist[ind1].createdat) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let githubcommit = [];
                let githubreponame = [];
                let githubrepostar = [];
                let githubrepowatcher = [];
                let githubrepolanguage = [];
                let githubrepofork = [];
                let githubreposize = [];
                let githbufollow = user.github.totalstar;
                let githubstars = user.github.totalfollow;

                for (let i = ind2; i >= ind1; i--) {
                    githubreponame[ind] = user.github.repolist[i].name;
                    githubrepostar[ind] = user.github.repolist[i].stars;
                    githubrepowatcher[ind] = user.github.repolist[i].watchers;
                    githubrepolanguage[ind] = user.github.repolist[i].language;
                    githubrepofork[ind] = user.github.repolist[i].forks;
                    githubreposize[ind] = user.github.repolist[i].size;
                };

                ind = 0;

                let githubforold = '';

                if (diff > 30) {
                    githubforold = 'Your date is very older for over saved data , Plaese select a date within 30 days range for using this feature.'
                } else {
                    for (let i = diff; i > Math.min(diff - 30, -1); i--) {
                        githubcommit[ind] = user.github.commitsovertime[i].value;
                        ind++;
                    };
                };

                let totalcommit = 0;
                if (diff > 30) {

                } else {
                    for (let i = 0; i < githubcommit.length; i++) {
                        totalcommit = totalcommit + githubcommit[i];
                    }
                };

                doc.fontSize(10)
                    .text(`Page 1 of 10`, 50, 750, {
                        align: 'center'
                    });

                doc.rect(45, 230, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 310, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 390, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 470, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 550, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 630, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#2b2a2a').text(`Github Commits this Week : ${totalcommit}`, 50, 235, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Codeforces Current Rating : ${cfrating} , Rank : ${cfrank}`, 50, 315, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Spotify Weekly Minutes Tracked : ${totalhours} min.`, 50, 395, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Total Events Managed this Week : ${eventscount}`, 50, 475, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 2 of 10`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(25)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('CONTENT', 50, 150, {
                        align: 'center'
                    });

                doc.moveTo(50, 180)
                    .lineTo(532, 180)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('1. Github Data', 50, 240);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('2. Spotify Data', 50, 270);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('3. Codeforces Data', 50, 300);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('4. Calendar Data', 50, 330);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('5. Github AI Generated Summary', 50, 360);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('6. Codeforces AI Generated Summary', 50, 390);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('7. Spotify AI Generated Summary', 50, 420);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('8. Calendar AI Generated Summary', 50, 450);

                doc.moveTo(50, 180)
                    .lineTo(532, 180)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..3', 500, 240);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..4', 500, 270);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..5', 500, 300);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..6', 500, 330);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..7', 500, 360);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..8', 500, 390);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..9', 500, 420);

                doc.fontSize(15)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text('..10', 495, 450);

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 3 of 10`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("GITHUB DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.rect(45, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(210, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(375, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Commits this", 50, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Month:", 50, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalcommit}`, 120, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Star Earned:", 215, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${githubstars}`, 270, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text(" Followers Count:", 380, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${githbufollow}`, 430, 180, {
                    width: 500,
                    align: 'justify'
                });

                let chartcommit;
                let chartconfig;

                if (githubforold == 'Your date is very older for over saved data , Plaese select a date within 30 days range for using this feature.') {
                    doc.fontSize(25)
                        .text(githubforold, 50, 225, {
                            align : 'center'
                        })
                } else {
                    chartconfig = {
                        type: 'bar',
                        data: {
                            labels: datearr,
                            datasets: [{
                                label: 'Weekly Commit Record', // Label dena achha rehta hai
                                data: githubcommit
                            }]
                        }
                    };

                    try {
                        chartcommit = await chartmaking(chartconfig);

                        if (chartcommit) {
                            doc.image(chartcommit, 50, 225, { width: 500, height: 250 });
                        }
                    } catch (error) {
                        console.error("Chart download fail ho gaya:", error.message);
                        doc.text("Chart could not be loaded.", 50, 250);
                    };
                }

                doc.fontSize(25).font('Helvetica-Bold').fillColor('#000000').text("REPOS  INSIGHTS", 50, 490, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 550)
                    .lineTo(532, 550)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Stars', 180, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Watchers', 240, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 330, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Forks', 420, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 530);

                let yaxis = 570;
                let xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(10, githubreponame.length); i++) {

                    doc.text(`${githubreponame[i]}`, 50, yaxis);
                    doc.text(`${githubrepostar[i]}`, 180, yaxis);
                    doc.text(`${githubrepowatcher[i]}`, 240, yaxis);
                    doc.text(`${githubrepolanguage[i]}`, 330, yaxis);
                    doc.text(`${githubrepofork[i]}`, 420, yaxis);
                    doc.text(`${githubreposize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 4 of 10`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("SPOTIFY DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.rect(45, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(210, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(375, 150, 160, 60).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Listening ", 50, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Hours:", 50, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalhours}`, 120, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text("Total Song Played:", 215, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalsong}`, 270, 180, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(17).font('Helvetica-Bold').fillColor('#000000').text(" Unique Artist:", 380, 155, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#61e615').text(`${totalartist}`, 430, 180, {
                    width: 500,
                    align: 'justify'
                });

                chartconfig = {
                    type: 'line',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'Listening Hours day wise',
                            data: spotifyhours
                        }]
                    }
                };

                try {
                    let chartlistening = await chartmaking(chartconfig);
                
                    listeningimage = chartlistening ;
                
                    if (chartlistening) {
                        doc.image(chartlistening, 50, 225, { width: 500 , height : 300 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                chartconfig = {
                    type: 'bar',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'No. of Songs Listen that Week',
                            data: spotifysong
                        }]
                    }
                };

                try {
                    let chartsongs = await chartmaking(chartconfig);
                
                    if (chartsongs) {
                        doc.image(chartsongs, 50, 550, { width: 500 , height : 200});
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 5 of 10`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("CODEFORCES DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("PROBLEMS  INSIGHTS", 50, 150, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 210)
                    .lineTo(532, 210)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 190, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Verdict', 300, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 400, 190);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 190);

                yaxis = 230;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(13, codeforceslanguage.length); i++) {

                    doc.text(`${codeforcesname[i]}`, 50, yaxis);
                    doc.text(`${codeforceslanguage[i]}`, 190, yaxis);
                    doc.text(`${codeforcesverdict[i]}`, 300, yaxis);
                    doc.text(`${codeforcestime[i]}`, 400, yaxis);
                    doc.text(`${codeforcessize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                let answertype = [0, 0, 0, 0];

                for (let i = 0; i < codeforcesverdict.length; i++) {
                    if (codeforcesverdict[i] == 'OK') {
                        answertype[0]++;
                    } else if (codeforcesverdict[i] == 'WRONG_ANSWER') {
                        answertype[1]++;
                    } else if (codeforcesverdict[i] == 'TIME_LIMIT_EXCEEDED') {
                        answertype[2]++;
                    } else if (codeforcesverdict[i] == 'COMPILATION_ERROR') {
                        answertype[3]++;
                    }
                }

                chartconfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['OK', 'WRONG_ANSWER', 'T_LIMIT_EXCEDED', 'COMPILATION ERROR'],
                        datasets: [{
                            label: 'Listening Hours day wise',
                            data: answertype
                        }]
                    }
                }

                try {
                    let chartanswertype = await chartmaking(chartconfig);
                
                    if (chartanswertype) {
                        doc.image(chartanswertype, 50, 500, { width: 500 , height : 250 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 6 of 10`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("CALENDAR DATA", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                chartconfig = {
                    type: 'bar',
                    data: {
                        labels: datearr,
                        datasets: [{
                            label: 'Hours Schedule Over Time',
                            data: calenderhours
                        }]
                    }
                };

                try {
                    let charthours = await chartmaking(chartconfig);
                
                    if (charthours) {
                        doc.image(charthours, 50, 125, { width: 500 , height : 280});
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.fontSize(25).font('Helvetica-Bold').fillColor('#000000').text("Events that Week", 50, 490, {
                    width: 500,
                    align: 'center'
                });

                doc.moveTo(50, 550)
                    .lineTo(532, 550)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 70, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 300, 530);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Date', 450, 530);

                yaxis = 570;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(10, calendereventsname.length); i++) {

                    doc.text(`${calendereventsname[i]}`, 70, yaxis);
                    doc.text(`${calendereventstime[i]}`, 300, yaxis);
                    doc.text(`${calendereventsdate[i]}`, 450, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 7 of 10`, 50, 750, {
                        align: 'center'
                    });

                doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000').text("AI GENERATED SUMMARIES", 50, 100, {
                    width: 500,
                    align: 'center'
                });

                const geminiurl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

                let requestBodygithub = {
                    contents: [{
                        parts: [{
                            text: `You are an expert developer-advocate and senior technical productivity analyst specializing in generating comprehensive, long-form Monthly Engineering Wrap-ups.
        
                                I am providing you with the user's entire GitHub monthly activity metrics as structured text and parallel arrays.

                                USER'S MONTHLY GLOBAL METRICS:
                                - Total Commits this Week: ${totalcommit}
                                - Total Stars Earned: ${githubstars}
                                - Total Followers Count: ${githbufollow}

                                MONTHLY COMMIT LOGS (Respective Arrays across ~30 days):
                                - Dates: ${JSON.stringify(datearr)}
                                - Commits on these dates: ${JSON.stringify(githubcommit)}

                                REPOSITORY INSIGHTS TABLE (Respective Columns Arrays):
                                - Repository Names: ${JSON.stringify(githubreponame)}
                                - Stars per Repo: ${JSON.stringify(githubrepostar)}
                                - Watchers per Repo: ${JSON.stringify(githubrepowatcher)}
                                - Primary Languages: ${JSON.stringify(githubrepolanguage)}
                                - Forks per Repo: ${JSON.stringify(githubrepofork)}
                                - Code Sizes: ${JSON.stringify(githubreposize)}

                                YOUR TASK:
                                Analyze this extensive monthly dataset. Look for macro trends across the weeks, locate the highest peak commit dates, evaluate the core repositories driving growth, and write a detailed,                      motivating, and in-depth 4-point monthly summary. 

                                STRICT LAYOUT & FORMAT CONSTRAINTS (FOR FULL A4 PAGE PRINTING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be STRICTLY between 400 to 450 words (approx. 100-110 words per point). Each point needs to be a rich, descriptive paragraph to adequately                       fill an A4 page layout at 11pt font size.
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Start directly with "1. " and end with the final word of the 4th point. No headings or greetings.
                                5. Structure:
                                   - Point 1 (Monthly Macro Overview): Provide an expansive analysis of the total commits and stars earned. Reflect on the user's overall consistency, dedication, and open-source momentum across                      the entire month.
                                   - Point 2 (Timeline & Velocity Analysis): Dive deep into the monthly commit arrays. Identify specific peak dates (mentioning exact date strings) and analyze the sprint velocity—noting which                        weeks or blocks of days saw the highest concentration of code changes.
                                   - Point 3 (Repository Core Architecture): Analyze the repository columns arrays comprehensively. Highlight the standout projects, discuss the prominent technical stack (languages used), and                        evaluate how community engagement (watchers, forks) evolved over these thirty days.
                                   - Point 4 (Strategic Monthly Suggestion): Provide a highly technical, forward-looking monthly strategic advice. Suggest how they can optimize their workflow, manage large repository sizes,                         improve branching strategies, or structure their upcoming month's roadmap based on their activity valleys.`
                        }]
                    }]
                };

                let requestBodycodeforces = {
                    contents: [{
                        parts: [{
                            text: `You are an expert competitive programming coach and senior algorithmic consultant specializing in generating comprehensive, long-form Monthly Developer Performance Reviews.
        
                                    I am providing you with the user's entire Codeforces problem-solving metrics for the past month as structured text and parallel arrays.

                                    SUBMISSION VERDICTS DISTRIBUTION (Respective Arrays):
                                    - Verdict Categories: ['OK','WRONG_ANSWER','T_LIMIT_EXCEDED','COMPILATION ERROR'],
                                    - Respective Submission Counts: ${JSON.stringify(answertype)}

                                    PROBLEMS INSIGHTS TABLE (Respective Columns Arrays):
                                    - Problem Names: ${JSON.stringify(codeforcesname)}
                                    - Languages Used: ${JSON.stringify(codeforceslanguage)}
                                    - Specific Verdicts: ${JSON.stringify(codeforcesverdict)}
                                    - Execution Times: ${JSON.stringify(codeforcestime)}
                                    - Code Sizes: ${JSON.stringify(codeforcessize)}

                                    YOUR TASK:
                                    Analyze this extensive monthly dataset. Evaluate the user's algorithmic progression, identify systematic error patterns, assess execution efficiency, and write a detailed, highly technical, and                              motivating 4-point monthly summary.
                                                        
                                    STRICT LAYOUT & FORMAT CONSTRAINTS (FOR FULL A4 PAGE PRINTING):
                                    1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                    2. Length Control: Total word count across all points must be STRICTLY between 400 to 450 words (approx. 100-110 words per point). Each point must be a long, detailed paragraph to fully occupy an                                A4 page sheet at 11pt font size.
                                    3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                    4. No Intro/Outro: Start directly with "1. " and end with the final word of the 4th point. No custom greetings or structural headings.
                                    5. Structure:
                                    - Point 1 (Monthly Mastery Overview): Provide an expansive analysis of the total successful 'OK' or accepted solutions across the month. Discuss the user's overall logic building capacity,                                dedication to consistency, and problem-solving velocity over these thirty days.
                                    - Point 2 (Error Mitigation & Debugging Analysis): Deeply analyze the negative verdicts in the lists (like WRONG_ANSWER, TIME_LIMIT_EXCEEDED, or COMPILATION_ERROR counts). Explain what these                              repetitive bottlenecks imply about boundary case testing or time-complexity oversights.
                                    - Point 3 (Language Efficiency & Optimization): Review the problem insights arrays thoroughly. Highlight their primary language stack (like C++), evaluating runtime performance (execution times)                              and space complexity optimization (code sizes) across different problem difficulties.
                                    - Point 4 (Strategic Monthly Roadmap): Provide a highly strategic, actionable competitive programming advice. Suggest specific training methodologies for the upcoming month, such as filtering                             problems by tags, practicing virtual contests, or optimizing I/O operations to elevate their rating.`
                        }]
                    }]
                };


                let requestBodyspotify = {
                    contents: [{
                        parts: [{
                            text: `You are an expert personalized content creator and veteran music analyst specializing in generating highly comprehensive, long-form Monthly Music Wrap-ups.
        
                                    I am providing you with the user's entire Spotify listening metrics for the past month as structured text and parallel arrays.
                                                        
                                    USER'S MONTHLY GLOBAL METRICS:
                                    - Total hours of music listened to: ${totalhours} hours
                                    - Total number of unique songs played: ${totalsongs} songs
                                    - Number of new artists discovered/followed: ${totalartist} new artists
                                    - Dates Array (Monthly Timeline): ${JSON.stringify(datearr)}
                                    - Respective listening hours for each date above: ${JSON.stringify(spotifyhours)}
                                    - Respective number of songs played for each date above: ${JSON.stringify(spotifysong)}
                                                        
                                    YOUR TASK:
                                    Analyze this extensive monthly timeline dataset. Identify the macro listening behaviors, isolate the single highest peak listening date string, track the pace of discovery, and write a detailed,                             highly engaging 4-point monthly summary.
                                                        
                                    STRICT LAYOUT & FORMAT CONSTRAINTS (FOR FULL A4 PAGE PRINTING):
                                    1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                    2. Length Control: Total word count across all points must be STRICTLY between 400 to 450 words (approx. 100-110 words per point). Each point must be rendered as a rich, full paragraph to fill the                               A4 page template perfectly at 11pt font size.
                                    3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                    4. No Intro/Outro: Start directly with "1. " and end with the final word of the 4th point. Do not add headers, subheaders, or conversational pleasantries.
                                    5. Structure:
                                       - Point 1 (Monthly Audio Consumption): Provide an expansive analysis of the total streaming hours and unique track count. Reflect on the user's overall relationship with music this month, how                             deeply music is integrated into their daily life, and what these high-level metrics say about their lifestyle.
                                       - Point 2 (Peak Date & Weekly Velocity): Dive deep into the parallel arrays. Pinpoint the exact date string (e.g., "15 jul") that represents the absolute maximum listening hour spike, and                             describe the rhythm of the weeks—noting whether they had high-volume clusters or sustained listening cycles.
                                       - Point 3 (Discovery & Taste Mapping): Thoroughly analyze the new artists metric. Discuss how actively the user is expanding their musical boundaries, what this indicates about their willingness                              to break comfort zones, and the overall transformation of their sonic profile over the thirty-day cycle.
                                       - Point 4 (Strategic Audio Curation Suggestion): Provide a creative, data-driven playlist curation strategy for the next month. Suggest how they can balance out low-activity days found in the                             arrays, build structural mood playlists for intense work sessions, or refine their discovery radar.`
                        }]
                    }]
                };

                let requestBodycalender = {
                    contents: [{
                        parts: [{
                            text: `You are an expert productivity coach, operational strategist, and senior time-management consultant specializing in generating comprehensive, long-form Monthly Routine Analysis Reports.
        
                                I am providing you with the user's entire monthly calendar schedule metrics as structured text and parallel arrays.

                                SCHEDULE TRENDS LOGS (Respective Arrays across ~30 days):
                                - Dates: ${JSON.stringify(datearr)}
                                - Scheduled Hours on these dates: ${JSON.stringify(calenderhours)}

                                EVENTS LOGS TABLE (Respective Columns Arrays):
                                - Event Names: ${JSON.stringify(calendereventsname)}
                                - Event Timings: ${JSON.stringify(calendereventstime)}
                                - Event Dates: ${JSON.stringify(calendereventsdate)}

                                YOUR TASK:
                                Analyze this extensive monthly timeline dataset. Evaluate the user's overall allocation of time, identify structural trends or shifts in productivity, isolate                      the highest peak activity date string, and write a detailed, highly professional 4-point monthly summary.

                                STRICT LAYOUT & FORMAT CONSTRAINTS (FOR FULL A4 PAGE PRINTING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be STRICTLY between 400 to 450 words (approx. 100-110 words per point). Each point must be a long,                       descriptive paragraph to adequately fill an A4 page layout at 11pt font size.
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Start directly with "1. " and end with the final word of the 4th point. No titles, headers, or greeting remarks.
                                5. Structure:
                                    - Point 1 (Monthly Time Commitment): Provide a broad, high-level overview of the total time committed to scheduled tasks and events across the entire month.                            Reflect on the user's overall consistency, time budgeting discipline, and focus stamina over these thirty days.
                                    - Point 2 (Peak Demands & Load Distribution): Analyze the parallel scheduling arrays. Pinpoint the exact date string (e.g., "15 jul") that represents the                           absolute maximum scheduled hour spike, and evaluate how heavy blocks or sprints of activity were distributed throughout the weeks.
                                    - Point 3 (Event Milestones & Context): Review the individual event columns arrays thoroughly. Highlight the crucial deadlines, significant meetings, lab                           submissions, or major collaborative sessions successfully handled, analyzing how effectively they context-switched between different priorities.
                                    - Point 4 (Strategic Workflow Suggestion): Provide a highly refined, data-driven operational strategy for the next month. Suggest how they can optimize                         their scheduling frameworks, establish clean deep-work blocks, minimize low-value time drains, or better manage rest cycles following high-intensity days to                        optimize overall efficiency.`
                        }]
                    }]
                };

                let [responsegithub , responsecodeforces , responsespotify , responsecalender] = await Promise.all([
                    axios.post(geminiurl, requestBodygithub, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodycodeforces, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodyspotify, {
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    axios.post(geminiurl, requestBodycalender, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                ]);
                
                let replygithub = responsegithub.data.candidates[0].content.parts[0].text;
                
                let replycodeforces = responsecodeforces.data.candidates[0].content.parts[0].text;

                let replyspotify = responsespotify.data.candidates[0].content.parts[0].text;

                let replycalender = responsecalender.data.candidates[0].content.parts[0].text;

                
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("1. Github", 50, 150, {
                    width: 500,
                    align: 'justify'
                });
                
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replygithub, 50, 175, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 8 of 10`, 50, 750, {
                        align: 'center'
                    });


                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("2. Codeforces", 50, 100, {
                    width: 500,
                    align: 'justify'
                });


                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replycodeforces, 50, 125, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 9 of 10`, 50, 750, {
                        align: 'center'
                    });

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("3. Spotify", 50, 100, {
                    width: 500,
                    align: 'justify'
                });


                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replyspotify, 50, 125, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Monthly Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 10 of 10`, 50, 750, {
                        align: 'center'
                    });


                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text("4. Calendar", 50, 100, {
                    width: 500,
                    align: 'justify'
                });


                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(replycalender, 50, 125, {
                    width: 500,
                    align: 'justify'
                });



                doc.end();

                res.setHeader('Content-Type', 'application/pdf');

                writestream.on('finish', () => {
                    res.download(reportFilePath, 'Performance_Report.pdf', (err) => {
                        if (err){ 
                            console.error(err)
                        };
                        fs.unlink(reportFilePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Temp file deletion failed:", unlinkErr);
                        });
                    });
                });

            } else if (type == 'custom') {
                //making of function
                let dt = new Date(when);

                const user = await newUser.findById(req.session.userId);

                const PDFDocument = require('pdfkit');
                const fs = require('fs');

                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50
                });

                const reportFilePath = `./reports/Report_${req.session.userId}_${Date.now()}.pdf`;
                const writestream = fs.createWriteStream(reportFilePath);
                doc.pipe(writestream);

                //doc.rect(45,90,510,75).lineWidth(2).strokeColor('#000000').stroke();

                doc.fontSize(40).font('Helvetica-Bold').fillColor('#000000').text("PRODUCTIVITY & DIGITAL LIFE REPORT", 50, 100, {
                    width: 500,
                    align: 'center'
                });


                doc.fontSize(10)
                    .text(`Page 1 of 5`, 50, 750, {
                        align: 'center'
                    });

                let realdate = new Date();

                let diff = realdate - dt;

                diff = Math.floor(diff / (1000 * 60 * 60 * 24));

                let datearr = [datecalculater(dt)];

                let daybefore = datecalculater(dt - (1000 * 60 * 60 * 24))

                let spotifyhours = user.spotify.totallisteningtime[0];;
                let spotifysong = user.spotify.songplayed[0];
                let spotifyartist = user.spotify.newartist[0];

                let ind = 0;

                let calenderhours = user.calender.scheduletime[diff].value;
                let calendereventsname = [];
                let calendereventstime = [];
                let calendereventsdate = [];

                let check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.calender.events[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                let ind1 = 0;

                while (check) {
                    if (datearr[0] == user.calender.events[ind1].date) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                let ind2 = ind;
                ind = 0;

                let eventscount = 0;

                for (let i = ind2; i >= ind1; i--) {
                    calendereventsname[ind] = user.calender.events[i].name;
                    calendereventsdate[ind] = user.calender.events[i].date;
                    calendereventstime[ind] = user.calender.events[i].time;
                    eventscount++;
                    ind++;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.codeforces.content[ind].date) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[0] == user.codeforces.content[ind1].date) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let codeforcesname = [];
                let codeforcesverdict = [];
                let codeforceslanguage = [];
                let codeforcestime = [];
                let codeforcessize = [];
                let cfrating = user.codeforces.currentrating ;
                let cfrank= user.codeforces.currentrank;

                for (let i = ind2; i >= ind1; i--) {
                    codeforcesname[ind] = user.codeforces.content[i].name;
                    codeforcesverdict[ind] = user.codeforces.content[i].type;
                    codeforceslanguage[ind] = user.codeforces.content[i].language;
                    codeforcestime[ind] = user.codeforces.content[i].duration;
                    codeforcessize[ind] = user.codeforces.content[i].memory;
                };

                ind1 = 0;

                check = true;

                ind = 0;

                while (check) {
                    if (daybefore == user.github.repolist[ind].createdat) {
                        check = false;
                    }
                    ind++;
                }

                ind--;
                ind--;

                check = true;

                while (check) {
                    if (datearr[0] == user.github.repolist[ind1].createdat) {
                        check = false;
                    }
                    ind1++;
                }

                ind1--;

                ind2 = ind;
                ind = 0;

                let githubcommit;
                let githubreponame = [];
                let githubrepostar = [];
                let githubrepowatcher = [];
                let githubrepolanguage = [];
                let githubrepofork = [];
                let githubreposize = [];
                let githbufollow = user.github.totalstar;
                let githubstars = user.github.totalfollow;

                for (let i = ind2; i >= ind1; i--) {
                    githubreponame[ind] = user.github.repolist[i].name;
                    githubrepostar[ind] = user.github.repolist[i].stars;
                    githubrepowatcher[ind] = user.github.repolist[i].watchers;
                    githubrepolanguage[ind] = user.github.repolist[i].language;
                    githubrepofork[ind] = user.github.repolist[i].forks;
                    githubreposize[ind] = user.github.repolist[i].size;
                };

                ind = 0;

                let githubforold = '';

                if (diff > 30) {
                    githubforold = 'Your date is very older for over saved data , Plaese select a date within 30 days range for using this feature.'
                } else {
                    githubcommit = user.github.commitsovertime[diff].value;
                };

                doc.rect(45, 230, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 310, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 390, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();
                doc.rect(45, 470, 510, 75).lineWidth(1.5).strokeColor('#000000').stroke();

                doc.fontSize(20).font('Helvetica-Bold').fillColor('#2b2a2a').text(`Github Commits this day : ${githubcommit}`, 50, 235, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Codeforces Current Rating : ${cfrating} , Rank : ${cfrank}`, 50, 315, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Minutes Tracked : ${spotifyhours}`, 50, 395, {
                    width: 500,
                    align: 'justify'
                });
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#000000').text(`Total Events Managed this Day : ${calenderhours}`, 50, 475, {
                    width: 500,
                    align: 'justify'
                });

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Day Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 2 of 5`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(25)
                    .text("Here are some Insights of that Day : ", 50, 100);

                doc.fontSize(18)
                    .text(`Your Number of Commits that Day : ${githubcommit}`, 50, 170);

                doc.text(`You Earned ${githubstars} stars that Day`, 50, 210);

                doc.text(`${githbufollow} Followers incresed that Day on Github`, 50, 250);

                doc.text(`You listen for ${spotifyhours} hours that Day`, 50, 290);

                doc.text(`You play ${spotifysong} songs that day`, 50, 330);

                doc.text(`You follow ${spotifyartist} artist that Day`, 50, 370);

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .text('Day Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 3 of 5`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(25)
                    .text("Here are the list of some of your data for this Day : ", 50, 80);

                doc.fontSize(20)
                    .text("1. Repo table", 50, 150);

                doc.moveTo(50, 200)
                    .lineTo(532, 200)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 180);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Stars', 180, 180);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Watchers', 240, 180);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 330, 180);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Forks', 420, 180);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 180);

                let yaxis = 220;
                let xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, githubreponame.length); i++) {

                    doc.text(`${githubreponame[i]}`, 50, yaxis);
                    doc.text(`${githubrepostar[i]}`, 180, yaxis);
                    doc.text(`${githubrepowatcher[i]}`, 240, yaxis);
                    doc.text(`${githubrepolanguage[i]}`, 330, yaxis);
                    doc.text(`${githubrepofork[i]}`, 420, yaxis);
                    doc.text(`${githubreposize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.fontSize(20)
                    .font('Helvetica-Bold')
                    .text("2. Problem Of Codeforces ", 50, 430);

                doc.moveTo(50, 480)
                    .lineTo(532, 480)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 50, 460);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Language', 190, 460);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Verdict', 300, 460);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 400, 460);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Size', 480, 460);

                yaxis = 500;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, codeforceslanguage.length); i++) {

                    doc.text(`${codeforcesname[i]}`, 50, yaxis);
                    doc.text(`${codeforceslanguage[i]}`, 190, yaxis);
                    doc.text(`${codeforcesverdict[i]}`, 300, yaxis);
                    doc.text(`${codeforcestime[i]}`, 400, yaxis);
                    doc.text(`${codeforcessize[i]}`, 480, yaxis);

                    yaxis = yaxis + 20;
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Day Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 4 of 5`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(20)
                    .text("3. Events of Calendar", 50, 100);

                doc.moveTo(50, 150)
                    .lineTo(532, 150)
                    .strokeColor('#000000')
                    .lineWidth(2)
                    .stroke();

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Name', 70, 130);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Time', 300, 130);

                doc.fontSize(13)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Date', 450, 130);

                yaxis = 170;
                xaxis = 50;

                doc.fontSize(13)
                    .font('Helvetica')

                for (let i = 0; i < Math.min(7, calendereventsname.length); i++) {

                    doc.text(`${calendereventsname[i]}`, 70, yaxis);
                    doc.text(`${calendereventstime[i]}`, 300, yaxis);
                    doc.text(`${calendereventsdate[i]}`, 450, yaxis);

                    yaxis = yaxis + 20;
                };

                let chartconfig = {
                    type: 'bar',
                    data: {
                        labels: ['No. of Commits','Star earned','Follow increase','Songs listening hours','Songs played','Follow artist'],
                        datasets: [{
                            label: 'Day Insigth',
                            data: [githubcommit,githubstars,githbufollow,spotifyhours,spotifysong,spotifyartist]
                        }]
                    }
                };
            
                let commitimage
            
                try {
                    let chartcommit = await chartmaking(chartconfig);
                
                    commitimage = chartcommit;
                
                    if (chartcommit) {
                        doc.image(chartcommit, 50, 450, { width: 500 , height : 250 });
                    }
                } catch (error) {
                    console.error("Chart download fail ho gaya:", error.message);
                    doc.text("Chart could not be loaded.", 50, 250);
                };

                doc.addPage({
                    size: 'A4',
                    margin: 50
                });

                doc.fontSize(15)
                    .font('Helvetica-Bold')
                    .text('Day Report', 50, 20, {
                        align: 'center'
                    });

                doc.fontSize(10)
                    .text(`Page 5 of 5`, 50, 775, {
                        align: 'center'
                    });

                doc.fontSize(20)
                    .text("AI Based Summay For This Day : ", 50, 100);

                const geminiurl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

                let requestBody = {
                    contents: [{
                        parts: [{
                            text: `You are an elite productivity strategist, technical mentor, and personal lifestyle analyst. Your task is to generate a comprehensive, long-form Daily Digital Life Wrap-up summarizing a developer's single day of activity.

                                I am providing you with the exact metrics, repository details, competitive programming submissions, and schedule events for this specific day entirely as structured text and parallel arrays.

                                GLOBAL DAILY METRICS FOR ${datearr[0]}:
                                - GitHub Commits Shipped: ${githubcommit}
                                - Repository Stars Earned: ${githubstars}
                                - New GitHub Followers: ${githbufollow}
                                - Codeforces Current Rating: ${cfrating} (Rank: ${cfrank})
                                - Total Time Tracked on Tasks: ${calenderhours} minutes
                                - Total Calendar Events/Tasks Managed: ${calenderhours}
                                - Spotify Music Listening Duration: ${spotifyhours} hours
                                - Total Songs Played: ${spotifysong}
                                - New Music Artists Followed: ${spotifyartist}

                                DAILY COMPONENT DETAILS (Respective Columns Arrays):
                                1. REPOSITORIES WORKED ON:
                                   - Names: ${JSON.stringify(githubreponame)} | Primary Languages: ${JSON.stringify(githubrepolanguage)} | Stars: ${JSON.stringify(githubrepostar)} | Forks: ${JSON.stringify(githubrepofork)} |                        Sizes: ${JSON.stringify(githubreposize)}
                                2. CODEFORCES SUBMISSIONS:
                                   - Problem Names: ${JSON.stringify(codeforcesname)} | Verdicts: ${JSON.stringify(codeforcesverdict)} | Languages: ${JSON.stringify(codeforceslanguage)} | Time Take to run: ${JSON.stringify(codeforcestime)} | Memory required : ${JSON.stringify(codeforcessize)}
                                3. SCHEDULED CALENDAR EVENTS:
                                   - Event Names: ${JSON.stringify(calendereventsname)} | Timings: ${JSON.stringify(calendereventstime)} 

                                YOUR TASK:
                                Synthesize these diverse metrics from engineering, algorithm problem-solving, schedule execution, and musical tastes into a deep, highly engaging, cohesive 4-point daily performance evaluation.

                                STRICT LAYOUT & FORMAT CONSTRAINTS (FOR FULL A4 PAGE PRINTING):
                                1. Format: The output MUST be a strict numbered list with EXACTLY 4 points, labeled as 1., 2., 3., 4.
                                2. Length Control: Total word count across all points must be STRICTLY between 400 to 450 words (approx. 100-110 words per point). Each point must be a long, narrative paragraph to completely fill                        the A4 page layout at 11pt font size.
                                3. No Markdown: Do NOT use any bold (**), italics (*), or special markdown symbols.
                                4. No Intro/Outro: Start directly with "1. " and end with the final word of the 4th point. Do not add headers, titles, or conversational pleasantries.
                                5. Structure:
                                   - Point 1 (Software Engineering & Open Source): Analyze their software development impact on this day. Blend the total commits, stars earned, and follower growth with the specific repositories                         worked on from the arrays, reflecting on code pushing frequency and technical footprint.
                                   - Point 2 (Competitive Programming & Logic Grind): Evaluate their Codeforces activity on this day. Focus heavily on their rating position, rank status, and deep-dive into the submission arrays                         to analyze their debugging success rate, logic execution speed, and language choice efficiency.
                                   - Point 3 (Routine, Time Tracking & Focus Stamina): Discuss their time management and daily calendar execution. Analyze the minutes tracked on tasks and the total events managed, matching it                       with specific event logs from the calendar arrays to evaluate how effectively they managed context switching and daily responsibilities.
                                   - Point 4 (Audio Spectrum & Daily Lifestyle Suggestion): Analyze their Spotify consumption metrics. Connect their high-volume music listening patterns with their workload, and wrap up with a                       highly customized, witty, and actionable suggestion on how they can better balance deep-work focus minutes with lifestyle pacing tomorrow.`
                        }]
                    }]
                };

                let response = await axios.post(geminiurl, requestBody, {
                  headers: { 'Content-Type': 'application/json' }
                });
                
                // Gemini ka response extract karna
                let reply = response.data.candidates[0].content.parts[0].text;

                doc.fontSize(11)
                    .font('Helvetica')
                    .text(reply, 50, 130);


                doc.end();

                res.setHeader('Content-Type', 'application/pdf');

                writestream.on('finish', () => {
                    res.download(reportFilePath, 'Performance_Report.pdf', (err) => {
                        if (err){ 
                            console.error(err)
                        };
                        fs.unlink(reportFilePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Temp file deletion failed:", unlinkErr);
                        });
                    });
                });

            }
        } else {
            res.status(500).redirect('/');
        }
    } catch (err) {
        console.error(err);
    }
})

app.post('/settingsprivacy', async (req, res) => {
    let user = '';
    const { current, newpassword, repassword } = req.body;
    try {
        const user = await newUser.findById(req.session.userId);
        if (user && user.password === current) {
            await newUser.findByIdAndUpdate(req.session.userId, {
                password: newpassword
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

app.post('/settingstheme', async (req, res) => {
    let user = '';
    const THEME = req.body.theme;
    try {
        if (req.session.userId) {
            await newUser.findByIdAndUpdate(req.session.userId, {
                theme: THEME
            });
            const USER = await newUser.findById(req.session.userId);
            user = USER;
            res.status(200).render('settingstheme', { user: user });
        } else {
            res.status(401).redirect('/');
        };
    } catch (err) {
        console.error(err);
    };
});


//server


server.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
