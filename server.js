const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressNunjucks = require('express-nunjucks');

// routes files
var apiRoutes = require('./routes/api.js');
var docRoutes = require('./routes/docs.js');
var routes = require('./routes/site.js');

const PORT = process.env.PORT || 3000;

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

// run the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});