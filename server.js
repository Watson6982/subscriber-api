const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressNunjucks = require('express-nunjucks');

// routes files
var apiRoutes = require('./routes/api.js');
var docRoutes = require('./routes/docs.js');
var routes = require('./routes/site.js');

//database
var mongoose = require('mongoose');
var Message = require('./models/message');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nationwise_db');

//webpage
const PORT = process.env.PORT || 3001;

var app = express();
app.set('views', __dirname + '/views');

const isDev = app.get('env') === 'development';
const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev,
    autoescape: true,
    throwOnUndefined: isDev 
});

// Imports the Google Cloud client library
var PubSub = require('@google-cloud/pubsub')({
  projectId: 'nationwise-171613',
  keyFilename: 'Nationwise-61ad9f68cc95.json'
});

// middlewares
app.use(express.static('public'))
app.use(helmet()); // security stuffs
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set up separate routes files for easier management
app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/docs', docRoutes);

const subscription = PubSub.subscription('josh-watson'); // References an existing subscription, e.g. "my-subscription"
// Pulls messages. Set returnImmediately to false to block until messages are received.
setInterval(function(){
  subscription.pull()
  .then((results) => {
    const messages = results[0];
    
    console.log(`Received ${messages.length} messages.`);
    
    messages.forEach((message) => {
      console.log(`* %d %j %j`, message.id, message.data, message.attributes);
    
      // Save each pub sub message to the mongo db
      var message = new Message ({
        	messageId: message.id,
        	message: JSON.stringify(message.data)
        }).save();
    });

    // Acknowledges received messages. If you do not acknowledge, Pub/Sub will
    // redeliver the message.
    if (messages.length > 0) {
      return subscription.ack(messages.map((message) => message.ackId)); // Acknowledges received messages. If you do not acknowledge, Pub/Sub will redeliver the message.
    } else {
      return;
    }
  });
}, 60 * 100);

// run the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});