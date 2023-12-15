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
mongoose.connect('mongodb://127.0.0.1:27017/Project'); // put your own database link here

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
    location: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Venue'}
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
comment: [{ type: String, ref: 'Comment'}]
},{
    versionKey: false
});


const User = mongoose.model("User", UserSchema); 
const Comment = mongoose.model("Comment", CommentSchema); 
const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);
//The declaration of Schemas are completed

//ref:https://antrikshy.com/code/fetch-xml-url-convert-to-json-nodejs
var https = require('https');
//var http = require('http');
var parseString = require('xml2js').parseString;
const venuesURL = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml'
async function getAllvenue(){
https.get(venuesURL, (response) => {

    let xmlData = '';
    response.on('data', (chunk) => {
    xmlData += chunk;
    });

    response.on('end', () => {
    parseString(xmlData, (error, result) => {
        if (error) {
        console.error('Error parsing XML:', error);
        return;
        }

        // Process the parsed XML data here
        venuesJSON = result.venues.venue;
        //console.log(venuesJSON[0].venuee[0]);

        for (let i = 0; i < venuesJSON.length; i++) {
        // //Creating a new Venue or update Venue
        let newloc = new Venue({
            venueID: venuesJSON[i].$.id,
            venue: venuesJSON[i].venuee[0],
            latitude: venuesJSON[i].latitude[0],
            longitude: venuesJSON[i].longitude[0],
            eventlist: [],
            comment: []
        });
        Venue.find({ locID: { $eq: venuesJSON[i].$.id } })
            .then((data) => {
            if (!data.length) {
                newloc
                .save()
                .then(() => {
                    //console.log("a new Venue created successfully");
                })
                .catch((error) => {
                    //console.log("failed to save new Venue");
                });
            } else {
                Venue.findOneAndUpdate({ locID: { $eq: venuesJSON[i].$.id } },
                {
                    venueID: venuesJSON[i].$.id,
                    venue: venuesJSON[i].venuee[0],
                    latitude: venuesJSON[i].latitude[0],
                    longitude: venuesJSON[i].longitude[0]
                })
                .then(() => {
                    //console.log("Updated a Venue")
                })
            }
            })
        }
    });
    });
}).on('error', (error) => {
    console.error('Error fetching XML:', error);
});
await new Promise(resolve => setTimeout(resolve, 500));
}
var eventsURL = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml'
async function getAllevent(){ 
https.get(eventsURL, (response) => {

    let xmlData = '';
    response.on('data', (chunk) => {
    xmlData += chunk;
    });

    response.on('end', () => {
    parseString(xmlData, (error, result) => {
        if (error) {
        console.error('Error parsing XML:', error);
        return;
        }

        // Process the parsed XML data here
        eventsJSON = result.events.event;
        //console.log(price.type);

        for (let i = 0; i < eventsJSON.length; i++) {
        // //Creating a new event           
        Event.find({ eventID: { $eq: eventsJSON[i].$.id } })
            .then((data) => {
            //form a price array
        //ref: https://stackoverflow.com/questions/42827884/split-a-number-from-a-string-in-javascript
        //ref: https://regexr.com/
        //console.log(eventsJSON[0]);
        //eventsJSON[i].venueid[0]

        var price;  //progress some special case
        if (/[0-9]/.test(eventsJSON[i].pricee[0])) {  
          if(/\)/.test(eventsJSON[i].pricee[0])){  //data contain (03/05/2024) $420;$340;$260;$180;$50; (04/05/2024) $420;$340;$260;$180"
            price = "string place holder such that this event will not be saved";
            //console.log(eventsJSON[i].$.id);
            //console.log(price);
          }else{
            price = parseFloat(eventsJSON[i].pricee[0].match(/\d+/g));
            //console.log(eventsJSON[i].$.id);
            //console.log(price);
          }
        } else if(/free/i.test(eventsJSON[i].pricee[0])){ // the price data is string only
        price = [0];
        }else{
          price = "string place holder such that this event will not be saved";
        }

        //console.log(price);
        let newEvent = new Event({
            eventID: eventsJSON[i].$.id,
            title: eventsJSON[i].titlee[0],
            venueID: eventsJSON[i].venueid[0],
            date: eventsJSON[i].predateE[0],
            description: eventsJSON[i].desce[0],
            presenter: eventsJSON[i].presenterorge[0],
            price: price
        });
        //console.log(eventsJSON[i].venueid[0]);
            if (!data.length) {
                newEvent
                .save()
                .then(() => {
                    //console.log("a new event created successfully");
                    Venue.findOneAndUpdate({ venueID: { $eq: eventsJSON[i].venueid[0] } }, { $addToSet: { eventlist: newEvent._id } })
                    .then((data) => {
                    //console.log(data);
                    })
                    .catch((error) => {
                    //console.log(error);
                    });
                })
                .catch((error) => {
                    //console.log(error);
                });
                
            }else{
                Event.findOneAndUpdate({  eventID: { $eq: eventsJSON[i].$.id } },
                {
                    eventID: eventsJSON[i].$.id,
                    title: eventsJSON[i].titlee[0],
                    venueID: eventsJSON[i].venueid[0],
                    date: eventsJSON[i].predateE[0],
                    description: eventsJSON[i].desce[0],
                    presenter: eventsJSON[i].presenterorge[0],
                    price: price
                })
                .then((data) => {
                    Venue.findOneAndUpdate({ venueID: { $eq: eventsJSON[i].venueid[0] } }, { $addToSet: { eventlist: eventsJSON[i]._id } })
                    .then((data) => {
                    //console.log(data);
                    
                    })
                    .catch((error) => {
                    //console.log(error);
                    });
                    //console.log("Updated an Event")
                })
                
            }
            })

        }; 
        
    })
    });
}).on('error', (error) => {
    console.error('Error fetching XML:', error);
});
await new Promise(resolve => setTimeout(resolve, 4000));
}

async function only10venue(){
Venue.aggregate([{
    $project: {
    venueID: '$venueID', 
    eventlist: { $size: '$eventlist' }
    }
    },
    {
    $sort: { eventlist: -1 }
    },
    {
    $limit: 10
    }
    ]).then((result)=> {
    const top10venue = result.map(result => result.venueID);
    //console.log(top10venue);
    Venue.deleteMany({ venueID: { $nin: top10venue }})
    .then((p)=>{
    console.log(p);
    Event.deleteMany({ venueID: { $nin: top10venue }})
    .then((p)=>{
    console.log(p);
    console.log("Finished update Database");
    })
    .catch((error) => {
    console.log(error);
    });  
})
.catch((error) => {
    console.log(error);
    });
});
await new Promise(resolve => setTimeout(resolve, 1000));
}

async function updateDB(){
await getAllvenue();
await getAllevent();
await only10venue();
}

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

//-------------------connect to database--------------------------------------------------------------------------------------------------------------
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
        .then((user,error) => {
            if(error){
                res.status(400).json({
                    isLoggedin: false,
                    reason: error
                });
                //console.log(error);
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
                let hour = date_ob.getHours();
                let minute = date_ob.getMinutes();
                let second = date_ob.getSeconds();
                console.log(year + "-" + month + "-" + date + "," + hour + ":" + minute + ":" + second);

                req.session.admin = user.Admin; //set user's admin right
                req.session.loggedIn = true;
                req.session.UserId = user.UserId;
                res.status(200).json({
                    isLoggedin: true,
                    reason: null,
                    UserId: user.UserId,
                    Admin: user.Admin,
                    lastUpdated: year + "-" + month + "-" + date + "," + hour + ":" + minute + ":" + second //the last Updated data needed to retrieve from a library or from database
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

    //For Event and Venue CRUD for admin
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

  // Find venue whose name which contain keywords in the name. (e.g., Hong) http://localhost:8000/query/venue/?keywords=Hong
  app.get('/query/venue/', (req, res) => {
    
    const keyword =  req.query.keywords;
    console.log(keyword);
    Venue.find({venue: {$regex: keyword, $options: "i" } })
    .populate("eventlist")
    .then((p) => {
        //console.log(p.length);
        var text = JSON.stringify(p, ['venueID', 'venue', 'latitude', 'longitude', 'eventlist','eventID','title',
        'description','presenter','price'], " ");
        res.setHeader('Content-Type', 'text/plain');
        res.send(text);
      }
      )
      .catch((error) => {
         console.log(error)
      });
  });

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
    if (req.query.price ==null){
        Event.find({})
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
    }
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
    // Find venue whose name which contain keywords in the name. (e.g., Hong) http://localhost:8000/query/venue/?keywords=Hong
    app.get('/query/venue/', (req, res) => {
        
        const keyword =  req.query.keywords;
        console.log(keyword);
        Venue.find({venue: {$regex: keyword, $options: "i" } })
        .populate("eventlist")
        .then((p) => {
            //console.log(p.length);
            var text = JSON.stringify(p, ['venueID', 'venue', 'latitude', 'longitude', 'eventlist','eventID','title',
            'description','presenter','price'], " ");
            res.setHeader('Content-Type', 'text/plain');
            res.send(text);
        }
        )
        .catch((error) => {
            console.log(error)
        });
    });
    
    //--------------------------------For Comments Data CRUD access------------------------------------------------
    //Create the Comments Data 
    app.post('/comment', (req, res) => {
        console.log(req.body);
        Comment.findOne().sort({commentId: -1 }).populate(['User','location'])
        .then((result) => {
            console.log('comment');
            console.log(result.commentId);
            let newCommentId = result.commentId;
            User.findOne({UserId: req.body.User}).then((result2) => {  
                console.log('user');
                console.log(result2.UserId);
                Venue.findOne({venueID: req.body.location}).then((result3) => {
                    console.log(result3.venueID);
                    if (result === null) {
                        newCommentId = 1;
                        let newComment = new Comment({
                            commentId: newCommentId,
                            content: req.body['content'],
                            User: result2._id,
                            location: result3._id
                        });
                        Comment.create(Comment)
                        .then(() => {
                            res.status(201);
                            res.redirect('/comment/' + newCommentId);
                            //res.send('<a href="http://localhost:3000/comment/' + newcommentId + '" target="_blank">http://localhost:3000/comment/' + newcommentId + '</a>');
                        })
                        return;
                    }
                    newCommentId = result.commentId + 1;
                    console.log(newCommentId);
                    let newcomment = new Comment({
                        commentId: newCommentId,
                        content: req.body['content'],
                        User: result2._id,
                        location: result3._id
                    });
                    Comment.create(newcomment)
                })
            })

            .then(() => {
                res.status(201);
                res.redirect('/comment/' + newCommentId);
                //res.send('<a href="http://localhost:3000/comment/' + newCommentId + '" target="_blank">http://localhost:3000/comment/' + newCommentId + '</a>');
            })
            .catch((error) => console.log(error));
        });
    });

    //Read the Comments Data by ID
    app.get('/comment/:commentId', (req,res) => {
        Comment.findOne({commentId: req.params['commentId']})
        .populate(['User','location'])
        .then((data) => {
            console.log(data);
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
                        '"commentId": ' + data.commentId + ',\n' +
                        '"content": "' + data.content + '",\n' +
                        '"User": ' + data.User.UserId + ',\n' +
                        '"location": "' + data.location.venueID + '"\n' +
                    '}' 
                );
                return;
            }
        })
        .catch((error) => console.log(error));
    });
    
    // //Read the Comments Data by UserId
    // app.get('/comment2/:UserId', (req,res) => {
    //     User.findOne({UserId: req.body['UserId']})
    //     .then((result) => {})
    // });

    //Update the Comments Data
    app.put('/comment/:commentId', (req,res) =>{
        Comment.findOne({commentId: req.body['commentId']})
        .then((comment) => {
            comment.commentId = req.body['commentId'];
            comment.content = req.body['content'];
            comment.User = req.body['User'];
            comment.location = req.body['location'];
            comment.save();
        
            res.status(200);
            res.set('Content-Type', 'text/html');
            res.send(
                '{\n' +
                '"commentId": ' + comment.commentId + ',\n' +
                '"content": "' + comment.content + '",\n' +
                '"locId": ' + comment.User + ',\n' +
                '"name": "' + comment.location + '"\n' +
                '}' 
            );
        });
    });

    //Delete the comments Data
    app.delete('/comment/:commentId', (req,res) =>{
        Comment.deleteOne({commentId: req.params['commentId']})
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

    //--------------------------For Pinned location Data CRUD access---------------------------
    //Create the Pinned location
    app.post('/pinned/:UserId', (req,res) =>{
        User.findOne({UserId: req.params['UserId']})
        .populate('Pinned')
        .then((result) => {
            console.log(result);
            if(result === null){
                res.status(406);
                res.set('Content-Type', 'text/plain');
                res.send('Status: 406 Pinned couldn\t create (user not found)');
                return;
            }
            else{
                if(result.Pinned === null){
                    result.Pinned[0] = req.params['Pinned']
                    result.save();
                }
                else{
                    console.log(result.Pinned.length);
                }
            }
            res.status(201);
            res.redirect('/pinned/' + newcommentId);
            //res.send('<a href="http://localhost:3000/pinned/' + UserId + '" target="_blank">http://localhost:3000/pinned/' + UserId + '</a>');
        })
        .catch((error) => console.log(error))
    });

    //Read the Pinned location????



    // For Users Data CRUD access for admin role
    //Create the users data (admin) //work
    app.post('/user', (req, res) => {
        const UserName = req.body.UserName;
        const UserPwHash = req.body.UserPwHash;
        const Admin = req.body.Admin;
        console.log(UserName,UserPwHash,Admin);
        const Comments = null;// append in later Comments CRUD
        const Pinned = null;//append in later Pinned CRUD
        User.findOne().sort({UserId: -1 })
        .populate(['Comments','Pinned'])
        .then((result) => {
            console.log(result.UserId);
            if(result === null){
                res.status(406);
                res.set('Content-Type', 'text-plain');
                res.send('Status: 406 User couldn\'t create (an unknown issue occurs)');
                return;
            }
            else{
                let newUserId = result.UserId + 1;
                let newUser = new User({
                    UserId: newUserId,
                    UserName: UserName,
                    UserPwHash: UserPwHash,
                    Admin: Admin,
                    Comments: [],
                    Pinned: []
                });
                console.log(newUser);
                User.create(newUser)
                .then(() => {
                    res.status(201);
                    //res.redirect('/user'+newUserId);
                    res.send('<a href="http://localhost:3000/user/' + newUserId + '" target="_blank">http://localhost:3000/user/' + newUserId + '</a>');
                })
                .catch((error) => console.log(error));
            }
        });
    });

    //Read the users data (admin) //work
    app.get('/user/:UserId', (req, res) => {
        User.findOne({ UserId: { $eq: req.params.UserId}})
        .populate(['Comments','Pinned'])
        .then((p) => {
            console.log(p);
            if (p === null) { 
            const message = 'No user with such userID is found';
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.send(message);
            return;
            };
            Comment.find({ UserId: { $eq: p._id}})
            .then((q) => {
            console.log(q);
                Venue.find({ UserId: {$eq: p._id}})
                .then((r) => {
                    console.log(r);
                    var resultJSON = {
                        "UserId": p.UserId,
                        "UserName": p.UserName,
                        "UserPwHash": p.UserPwHash,
                        "Admin":  p.Admin,
                        "Comments": p.Comments,
                        "Pinned": p.Pinned,
                    }            
                    var text = JSON.stringify(resultJSON, null, " ");
                    res.status(200);
                    res.setHeader('Content-Type', 'text/plain');
                    res.send(text);
                });
            });
        })
        .catch((error) => console.log(error));
    });

    //Read ALL the users data (admin) //work
    app.get('/user', (req, res) => {
        User.find().sort({ UserId: 1})
        .populate('Comments','Pinned')
        .then((p) => {
            
            console.log(p.length);
            var text = JSON.stringify(p, null, " ");
            res.setHeader('Content-Type', 'text/plain');
            res.send(text);
            console.log(p);
            // if (p === null) { 
            // const message = 'No user with such userID is found';
            // res.setHeader('Content-Type', 'text/plain');
            // res.statusCode = 404;
            // res.send(message);
            // return;
            // };
            // let output = '[\n';
            // let LastUser = p[p.length - 1];
            // for(let one of p){            
            //     output+=
            //     '{'+                        
            //         '"UserId": ' + one.UserId + ',' +
            //         '"UserName": "' + one.UserName + '",' +
            //         '"UserPwHash": "' + one.UserPwHash + '",' +
            //         '"Admin": ' + one.Admin + ',' +
            //         '"Comments": ' + one.Comments + ',' +
            //         '"Pinned": ' + one.Pinned +
            //     ((one != LastUser) ? '},\n' : '}\n');
            // }
            // output += ']';
            // res.status(200);
            // res.setHeader('Content-Type', 'text/plain');
            // res.send(output);
        })
        .catch((error) => console.log(error));
    });

    //Update the users data (admin)
    app.put('/user/:UserId', (req,res) => {
        console.log(req.body);
        User.findOneAndUpdate({UserId: req.params['UserId']})
        .populate(['Pinned', 'Comments'])
        .then((result) => {
            console.log(result);
            if (result === null){
                const message = 'No user with such UserID is found';
                res.status(404);
                res.set('Content-Type', 'text/plain');
                res.send(message);
                return;
            }                
            //console.log(User.Comments);
            Comment.find({ User: { $eq: result._id}})
            .then((q) => {
                console.log(q);
                Venue.find({ User: {$eq: result._id}})
                .then((r) => {
                    let buffer = '[';
                    let buffer2 = '[';
                    console.log(r);
                    if(q === undefined){
                        result.Comments = [];
                    }
                    else{
                        //to refresh data linker
                        //q.push(req.body.Comments);
                        result.Comments = q;
                    }
                    if(r === undefined){
                        result.Pinned = [];
                    }
                    else{
                        //to refresh data linker
                        //r.push(req.body.Pinned);
                        result.Pinned = r;
                    }
                    
                    result.UserPwHash = req.body.UserPwHash;
                    result.Admin = req.body.Admin;
                    //check the refreshed data
                    console.log(result.Comments);
                    console.log(result.Pinned);
                    let LastEvent = q[q.length - 1];
                    for (let one of q){
                        buffer += 
                        '"_id":{"$oid":' + one._id.oid+
                        ((one != LastEvent) ? '},' : '}');
                    }
                    buffer += ']';
                    let LastEvent2 = r[r.length - 1];
                    for (let one of r){
                        buffer2 += 
                        '"_id":{"$oid":' + one._id.oid+
                        ((one != LastEvent2) ? '},' : '}');
                    }
                    buffer2 += ']';
                    console.log("finished");
                    console.log(buffer);
                    console.log(buffer2);
                    
                    var resultJSON = {
                        "UserId": result.UserId,
                        "UserName": req.body.UserName,
                        "UserPwHash": req.body.UserPwHash,
                        "Admin": req.body.Admin,
                        "Comments": result.Comments,
                        "Pinned": result.Pinned
                    }
                    var text = JSON.stringify(resultJSON,null, " ");
                    res.status(200);
                    res.setHeader('Content-Type', 'text/plain');
                    res.send(text);
                });
            });
        });

    });

    //Delete the users data (admin)
    app.delete('/user/:UserId', (req,res) =>{
        User.deleteOne({UserId: req.params['UserId']})
        .then((data) => {
            if(data.deleteCount == 0){
                res.status(404);
                res.set('Content-Type','text/plain');
                res.send('404 No such UserId');
                return;
            }
            else{
                res.status(204);
                //res.set('Content-Type','text/plain');
                //res.send('Status: 204 (Event deleted)');
            }
        })
        .catch((error) => console.log(error));
    });

})

// listen to port 3000
const server = app.listen(8000);