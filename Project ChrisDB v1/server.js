//set up//
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Project'); // put your own database link here

const db = mongoose.connection;
const Schema = mongoose.Schema;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");
  // creating a mongoose model
  const EventSchema = Schema({
    eventID: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    venueID: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      //required: true,
    },
    description: {
      type: String,
      //required: true,
    },
    presenter: {
      type: String,
      //required: true,
    },
    price: [{ type: Number, required: true}]
  });
  const Event = mongoose.model("Event", EventSchema);

  const VenueSchema = Schema({
    venueID: {
      type: Number,
      required: true,
      unique: true,
    },
    venue: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    eventlist: [{ type: Schema.Types.ObjectId, ref: 'Event'}],
    comment: [{ type: String}]
  });
  const Venue = mongoose.model("Venue", VenueSchema);


  //ref:https://antrikshy.com/code/fetch-xml-url-convert-to-json-nodejs
  var https = require('https');
  //var http = require('http');
  var parseString = require('xml2js').parseString;
  var venuesURL = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml'
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
              if(/[(-)]/.test(eventsJSON[i].pricee[0])){  //data contain (03/05/2024) $420;$340;$260;$180;$50; (04/05/2024) $420;$340;$260;$180"
                const regex = /\$(\d+)/g;
                price = eventsJSON[i].pricee[0].match(regex).map(match => {
                  const numberString = match.substring(1);
                  return parseFloat(numberString);
                });
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

/////////////////////////////////////call this when user login//////////////////////////////////////////////////////////////////////////
  updateDB();


/////////////////////////////////////Venue get //////////////////////////////////////////////////////////////////////////

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
    let query;
  
    if (req.query.price) {
      const lowPrice = parseInt(req.query.price, 10);
      if (!isNaN(lowPrice)) {
        query = Event.find({ 
          price: { $lte: lowPrice }
        });
      } else {
        return res.status(400).send('Invalid price query parameter');
      }
    } else {
      query = Event.find({});
    }
  
    query.then((events) => {
        console.log(events.length);
        res.json(events); // It's more conventional to send JSON for API responses
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(error.message);
      });
  });


});



const server = app.listen(8000);

