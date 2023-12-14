//to call express.js
const express = require('express');
const app = express();
const cors = require('cors');//allow cors traffic
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: 'CSCI2720', //a key for signing cookie ID
    cookie: {maxAge: 3600000}, //expires in 60 min
    resave: true,
    saveUninitialized: true
}));

//to call mongodb.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here

// creating an user schema for mongoose
const UserSchema = mongoose.Schema({
    UserId: { type: Number, required: [true, "User ID is required"], unique: true },
    UserName: { type: String, required: [true, "User Name is required"]},
    UserPwHash: { type: String, required: [true, "User Password is required"]},
    Admin: { type: Boolean, required: true},//CRUD access
    Comments: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'} ],//list of Comments
    Pinned: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Venue'}],//list of Pinned Locations
},{
    versionKey: false
});
// creating a comment schema for mongoose
const CommentSchema = mongoose.Schema({
    commentId: {type: Number, required: [true, "Comment ID is required"], unique: true },
    content: {type: String, required: true },
    User: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    location: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Venue'}
},{
    versionKey: false
});
// creating an event schema for mongoose
const EventSchema = mongoose.Schema({
eventID: {type: Number, required: true,unique: true,},
title: {type: String, required: true,},
venueID: {type: Number, required: true,},
date: {type: String},
description: {type: String,},
presenter: {type: String,},
price: [{ type: Number, required: true}]
},{
    versionKey: false
});
// creating a venue schema for mongoose
const VenueSchema = mongoose.Schema({
venueID: {type: Number, required: true, unique: true,},
venue: {type: String, required: true,},
latitude: {type: Number,required: true,},
longitude: {type: Number,required: true,},
eventlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
comment: [{ type: String}]
},{
    versionKey: false
});


const User = mongoose.model("User", UserSchema); 
const Comment = mongoose.model("Comment", CommentSchema); 
const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);
//The declaration of Schemas are completed

const AdminCheck = (req,res, next) => {
    if (req.session.admin){
        return next();
    }
    else{
        res.status(401);
        res.set('Content-Type','text/plain');
        res.send('401 (Access denied (Illegal Admin access))');
    }
};

const LoginCheck = (req, res, next) => {
    if (req.session.isLoggedin){
        return next();
    }
    else{
        res.status(401);
        res.set('Content-Type','test/plain');
        res.send('401 (Access denied (Illegal User access))');
    }
};

// The declaration of database function is completed
  
const db = mongoose.connection;

// Catch connection failure
db.on('error', console.error.bind(console, 'Connection error:'));

// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...");//DB connection successful  
    
    //the login handling
    app.post('/login', (req,res) =>{
        //the place for you to get xml data
        updateDB();
        //find the existence of the user
        User.findOne({UserName: req.body['UserName'], UserPwHash: req.body['PWHashed']})
        .then((error,user) => {
            if(error){
                res.status(400).json({
                    isLoggedin: false,
                    reason: error
                });
            }
            else if (user === null){
                res.status(401).json({
                    isLoggedin: false,
                    reason: "Wrong username or password"
                });
            }
            else{
                //https://usefulangle.com/post/187/nodejs-get-date-time
                let ts = Date.now();//to get real time

                let date_ob = new Date(ts);
                let date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                console.log(year + "-" + month + "-" + date);

                req.session.admin = user.Admin; //set user's admin right
                req.session.loggedIn = true;
                req.session.UserId = user.UserId;
                res.status(200).json({
                    isLoggedin: true,
                    reason: null,
                    UserId: user.UserId,
                    Admin: user.Admin,
                    lastUpdated: year + "-" + month + "-" + date //the last Updated data needed to retrieve from a library or from database
                })
            }
        });
    })

    //the logout handling
    app.get('/logout', (req,res,next) => {
        req.session.destroy((error,express) => {
            if(error){
                res.send(error);
            }
            else 
                res.redirect('/'); //back to index if logout is executed
        });
    });
    //For Admin CRUD
    //get venue(with the evenlist array) with venueID,e.g. http://localhost:3000/venue/50110014
    app.get('/venue/:venueID', (req, res) => {
    Venue.find({ venueID: {$eq:req.params.venueID} })
        .populate("eventlist")
        .then((p) => {
        if (!p.length) { 
            const message = `
        404 not found
        `;
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.send(message); }
            else{
        var text = JSON.stringify(p, null, " ");
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
            }
        })
        .catch(err => {
        console.log('Caught:', err.message)
        });
    });

    //get all venue, e.g. http://localhost:3000/venue
    app.get('/venue', (req, res) => {
    Venue.find({})
        .populate("eventlist")
        .then((p) => {
        //console.log(p);
        // if (!p.length) { 
        //   const message = `
        //   No Venue is found
        // `;
        //   res.setHeader('Content-Type', 'text/plain');
        //   res.statusCode = 404;
        //   res.send(message);
        // }
        var text = JSON.stringify(p, ['venueID', 'venue', 'latitude', 'longitude', 'eventlist','eventID','title',
        'description','presenter','price'], " ");
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
        }
        )
        .catch(err => console.log('Caught:', err.message));
    });



    //   //  // handle ALL requests
    //   //  app.all('/*', (req, res) => {
    //   //   // send this to client
    //   //   res.send('Hello World!');
    //   // });

    //////////////////////////////////////////////////////CRUD Event///////////////////////////////////////////////////

    //get event by eventID, e.g. http://localhost:3000/event/154936
    app.get('/event/:eventID', (req, res) => {
        Event.find({ eventID: { $eq: req.params.eventID}})
        .then((p) => {
            console.log(p);
            if (!p.length) { 
            const message = `
            No event with such eventID is found
            `;
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.send(message);
            }
            console.log(p[0].venueID);
            Venue.find({ venueID: p[0].venueID})
            .then((q)=>{
            var resultJSON = {
                "eventID": p[0].eventID,
                "title": p[0].title,
                "venueID": p[0].venueID,
                "venue":  q[0].venue,
                "latitude":q[0].latitude,
                "longitude":q[0].longitude,
                "date": p[0].date,
                "description": p[0].description,
                "price":p[0].price,
            }
            var text = JSON.stringify(resultJSON, null, " ");
            res.setHeader('Content-Type', 'text/plain');
            res.send(text);
            })  
        })
        .catch((error) => console.log(error));
        })





    //Create event or Update event
    app.post('/event', (req, res) => {

    const new_eventID = req.body.eventID;
    const new_title= req.body.title;
    const new_venueID = req.body.venueID;
    const new_date = req.body.date;
    const new_description = req.body.description;
    const new_price = req.body.price;
    Event.find({ eventID: { $eq: new_eventID } })
            .then((s) => {
                let newEvent = new Event({
                eventID: new_eventID,
                title: new_title,
                venueID: new_venueID,
                date: new_date,
                description: new_description,
                price:new_price
                });
            if (s.length>0) {  //event exist in db, just update it
                //console.log(s[0].venueID);
                //console.log();

                

                //update event
                Event.findOneAndUpdate({ eventID: { $eq: new_eventID } },
                {
                    title: new_title,
                    venueID: new_venueID,
                    date: new_date,
                    description: new_description,
                    price:new_price
                },{new: true}).then((q)=>{
                console.log(q);
                //update event's venue in venue collection
                Venue.findOneAndUpdate({ venueID: { $eq: new_venueID } }, { $addToSet: { eventlist: s[0]._id } },{new: true})
                .then((p)=>{
                const message = `
                    <p> Below is the event information you have updated </p>
                    <p>eventID: ${new_eventID}</p>
                    <p>title: ${new_title}</p>
                    <p>venueID: ${new_venueID}</p>
                    <p>venue: ${p.venue}</p>
                    <p>venue latitude: ${p.latitude}</p>
                    <p>venue longitude: ${p.longitude}</p>
                    <p>date: ${new_date}</p>
                    <p>description: ${new_description}</p>
                    <p>price: ${new_price}</p>
                `;
                    res.setHeader('Content-Type', 'text/plain');
                    res.statusCode = 202;
                    res.send(message);
                })
                console.log("a new event update successfully")
                
                }).catch((error) => {
                console.log(error);
                });
            } else { 
                //Saving this new event to database
                newEvent
                .save()
                .then(() => {
                Venue.find({venueID: { $eq: new_venueID }})
                .then((p)=>{
                    console.log("a new event created successfully");
                const message = `
                    <p> Below is the event information you have created </p>
                    <p>eventID: ${new_eventID}</p>
                    <p>title: ${new_title}</p>
                    <p>venueID: ${new_venueID}</p>
                    <p>venue: ${p[0].venue}</p>
                    <p>venue latitude: ${p[0].latitude}</p>
                    <p>venue longitude: ${p[0].longitude}</p>
                    <p>date: ${new_date}</p>
                    <p>description: ${new_description}</p>
                    <p>price: ${new_price}</p>
                    <p>price: ${new_price}</p>
                `;
                    res.setHeader('Content-Type', 'text/plain');
                    res.statusCode = 201;
                    res.send(message);
                })
                
                })
                .catch((error) => {
                    console.log("failed to save new event");
                });
            }
            })
            .catch((error) => console.log(error));
    });



    // Delete event by input eventID
    app.delete('/event', (req, res) => {
    //console.log(req.body.eventID);
    Event.findOneAndDelete({ eventID: { $eq: req.body.eventID } })
        .then((data) => {
        if (data != null) {
            //delete the old event in the old venue
            Venue.findOneAndUpdate({ venueID: { $eq: data.venueID} }, { $pull: { eventlist: data._id } })
            //console.log('the deleted data is:', data);
            // var text = JSON.stringify(data)
            const message = `
            <p>Deleted the following event:<p>
            <p>eventID: ${data.eventID}</p>
            <p>title: ${data.title}</p>
            <p>venueID: ${data.venueID}</p>
            <p>date: ${data.date}</p>
            <p>description: ${data.description}</p>
            <p>price: ${data.price}</p>
        `;
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 202;
            res.send(message);
        }
        else {
            const message = `
            No event with venueID ${req.body.eventID} is found
        `;
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.send(message);
        }
        })
        .catch((error) => {
        console.log(error)
        });
    });

    ///////////////////////////////////////////////////////Query//////////////////////////////////////////////////////////////


    // Find events whose price under a specific number. (e.g., ≤500) http://localhost:3000/event?price=500
    app.get('/event', (req, res) => {
    //console.log(req.query.price);
    const Lowprice = parseInt(req.query.price);
    Event.find({price: {$elemMatch: { $lte: Lowprice }}})
        .then((p) => {
        console.log(p.length);
        var text = JSON.stringify(p, null, " ");
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
        }
        )
        .catch((error) => {
            console.log(error)
        });
    });

    //Error handling
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