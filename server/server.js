/*
I declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I also acknowledge that I am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : Fan Chun Ho
Student ID : 1155160706
Class/Section : CSCI2720
Date : 12/12/2023 
*/

//to call express.js
const express = require('express');
const app = express();
const cors = require('cors');//allow cors traffic
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//to call mongodb.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here

//----------------------   Q1 Start---------------------------------------------
// creating an user schema for mongoose
const UserSchema = mongoose.Schema({
    UserId: { type: Number, required: [true, "User ID is required"], unique: true },
    UserName: { type: String, required: [true, "User Name is required"]},
    UserPwHash: { type: String, required: [true, "User Password is required"]},
    Admin: { type: Boolean, required: true},//CRUD access
    Comments: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'} ],//list of Comments
    Pinned: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Location'}],//list of Pinned Locations
},{
    versionKey: false
});
// creating an location schema for mongoose
const LocationSchema = mongoose.Schema({
    locId: { type: Number, required: [true, "Location ID is required"], unique: true },
    name: { type: String, required: true },
    quota: { type: Number },
},{
    versionKey: false
});
// creating a comment schema for mongoose
const CommentSchema = mongoose.Schema({
    commentId: {type: Number, required: [true, "Comment ID is required"], unique: true },
    content: {type: String, required: true },
    User: {type: mongoose.Schema.Types.ObjectId, required: true },
    location: {type: mongoose.Schema.Types.ObjectId, required: true}
},{
    versionKey: false
})

const Event = mongoose.model("Event", EventSchema);
const Location = mongoose.model("Location", LocationSchema);
//----------------------   Q1 End---------------------------------------------

const db = mongoose.connection;

// Catch connection failure
db.on('error', console.error.bind(console, 'Connection error:'));

// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...");//DB connection successful  

    //----------------------   Q2 Start ---------------------------------------------
    app.get('/ev/:eventId', (req,res) => {
        Event.findOne({eventId: req.params['eventId']})
        .populate('loc')
        .then((data) => {
            //testing
            // console.log(data.loc.locId);
            // res.status(200)
            // res.set('Content-Type', 'text/plain');
            // res.send('locId: '+data.loc.locId+'\n Hi!');
            
            if(data===null){
                res.status(404);
                res.set('Content-Type', 'text/plain');
                res.send('Status: 404 (Event doesn\'t exist)');
                return;
            }
            else{
                res.status(200);
                res.set('Content-Type', 'text/plain');
                res.send(
                    '{\n' +
                        '"eventId": ' + data.eventId + ',\n' +
                        '"name": "' + data.name + '",\n' +
                        '"loc":\n' +
                        '{\n' +
                        '"locId": ' + data.loc.locId + ',\n' +
                        '"name": "' + data.loc.name + '"\n' +
                        '},\n' +
                        '"quota": ' + data.quota + '\n' +
                    '}' 
                );
                return;
            }
        })
        .catch((error) => console.log(error));
    });

    //----------------------   Q3 Start ---------------------------------------------
    app.post('/ev', (req, res) => {
        //console.log(req.body['loc']);
        Event.findOne().sort({eventId: -1 }).then((result) => {
            console.log(result.eventId);
            if (result === null) {
                res.status(406);
                res.set('Content-Type', 'text/plain');
                res.send('Status: 406 Event couldn\t create (an unknown issue occurs)');
                return;
            }

            let newEventId = result.eventId + 1;
            Location.findOne(
                { locId: req.body['loc'] }
            ).then(
                (location) => {
                    if (location === null) {
                        res.status(406);
                        res.set('Content-Type', 'text/plain');
                        res.send('Status: 406 Event couldn\'t create (location doesn\'t exist)')
                        return;
                    }

                    let LocQuota = location.quota;
                    if (LocQuota < req.body['quota']) {
                        res.status(406);
                        res.set('Content-Type', 'text/plain');
                        res.send('Status: 406 (Event isn\'t created due to exceeding Location Capacity)');
                        return;
                    }

                    let newEvent = new Event({
                        eventId: newEventId,
                        name: req.body['name'],
                        loc: location,
                        quota: req.body['quota'],
                    });
                    Event.create(newEvent)
                    .then(() => {
                        res.status(201);
                        //res.redirect('/ev/' + newEventId);
                        res.send('<a href="http://localhost:3000/ev/' + newEventId + '" target="_blank">http://localhost:3000/ev/' + newEventId + '</a>');
                    })
                    .catch((error) => console.log(error));
                }
            );
        })
    });

    //----------------------   Q4 Start ---------------------------------------------
    app.delete('ev/:eventId', (req,res) =>{
        Event.deleteOne({eventId: req.params['eventId']})
        .then((data) => {
                if(data.deleteCount == 0){
                    res.status(404);
                    res.set('Content-Type','text/plain');
                    res.send('Status: 404 (Event can\'t delete due to non-existence)')
                }
                else{
                    res.status(204);
                    //res.set('Content-Type','text/plain');
                    //res.send('Status: 204 (Event deleted)');
                }
        })
    });
    //----------------------   Q5.1 Start ---------------------------------------------
    app.get('/ev', (req,res) => {
        Event.find().sort({eventId: 1})
        .populate('loc')
        .then((event) => {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            let output = '[\n';
            let LastEvent = event[event.length - 1];
            for (let one of event){
                output += 
                '{\n' +
                '"eventId": ' + one.eventId + ',\n' +
                '"name": "' + one.eventId + ',\n' +
                '"loc": \n' +
                    '{\n' +
                    '"locId": ' + one.loc.locId + ',\n' +
                    '"name": "' + one.loc.name + '"\n' +
                '},\n' +
                '"quota": ' + one.quota + '\n' +
                ((one != LastEvent) ? '},\n' : '}\n');
            }
            output += ']';
            res.send(output);
        })
        .catch((error) => console.log(error));
    });
    //----------------------   Q5.2 Start ---------------------------------------------
    app.get('/lo/:locationId', (req,res) => {
        Location.findOne({locId: req.params['locationId']})
        .then((location) => {
            if (location === null) {
                res.status(404);
                res.set('Content-Type','text/plain');
                res.send('Status: 404 (Location doesn\'t find)');
            }
            else {
                //may need to fix
                    res.status(200);
                    res.set('Content-Type', 'text/plain');
                    res.send(
                        '{\n' +
                        '"locId": ' + location.locId + ',\n' +
                        '"name": "' + location.name + '",\n' +
                        '"quota": ' + location.quota + '\n' +
                        '}'
                    );
            }
        })
        .catch((error) => console.log(error));
    });
    //----------------------   Q5.3 Start ---------------------------------------------
    app.get('/lo', (req,res) => {
        Location.find().sort({locId: 1})
        .then((location) => {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            let output = '[\n';
            let LastLocation = location[location.length - 1];
            for (let one of location){
                output += 
                    '{\n' +
                    '"locId": ' + one.locId + ',\n' +
                    '"name": "' + one.name + '",\n' +
                    '"quota": ' + one.quota + '\n' +
                ((one != LastLocation) ? '},\n' : '}\n'); // branch to handle the last character of an item
            }
            output += ']';
            res.send(output);
        })
        .catch((error) => console.log(error));
    });
    //----------------------   Q5.4 Start ---------------------------------------------
    app.get('/ev', (req,res) => {
        let setquota = req.query['q'];
        Event.find({quota: {$gte: setquota}})
        .sort({eventId: 1})
        .populate('loc')
        .then((event) => {
            if (event === null){
                res.status(200);
                res.set('Content-Type', 'text/plain');
                res.send('[ \n' + ']');
                return;
            }
            else{
                res.status(200);
                res.set('Content-Type', 'text/plain');
                let output = '[\n';
                let LastEvent = event[event.length - 1];
                for (let one of event){
                    output += 
                    '{\n' +
                    '"eventId": ' + one.eventId + ',\n' +
                    '"name": "' + one.eventId + ',\n' +
                    '"loc": \n' +
                        '{\n' +
                        '"locId": ' + one.loc.locId + ',\n' +
                        '"name": "' + one.loc.name + '"\n' +
                    '},\n' +
                    '"quota": ' + one.quota + '\n' +
                    ((one != LastEvent) ? '},\n' : '}\n');
                }
                output += ']';
                res.send(output);
            }
        })
        .catch((error) => console.log(error));
    });        
    //---------------------- Q6 Start ---------------------------------------------
    app.put('/ev/:eventId', (req,res) =>{
        Event.findOne({eventId: req.params['eventId']})
        .populate('loc')
            .then((event) => {
                Location.findOne({locId: req.body['locId']})
                .then((location) => {
                    event.name = req.body['name'];
                    event.loc = location;
                    event.quota = req.body['quota'];
                    event.save();
                });
                res.status(200);
                res.set('Content-Type', 'text/html');
                res.send(
                    '{\n' +
                    '"eventId": ' + event.eventId + ',\n' +
                    '"name": "' + event.name + '",\n' +
                    '"loc":\n' +
                    '{\n' +
                    '"locId": ' + event.loc.locId + ',\n' +
                    '"name": "' + event.loc.name + '"\n' +
                    '},\n' +
                    '"quota": ' + event.quota + '\n' +
                    '}' 
                );
                    
            });
    });
    app.all('/', (req, res) => {
        // send this to client
        res.send('Hello World!');
    });
    // handle ALL requests
    app.all('/*', (req, res) => {
        // send this to client
        res.send('Error! (URL doesn\'t exist)');
    });
})

// listen to port 3000
const server = app.listen(3000);