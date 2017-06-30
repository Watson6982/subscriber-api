var express = require('express');
var router = express.Router();
var PubSub = require('@google-cloud/pubsub')({
  projectId: 'nationwise-171613',
  keyFilename: 'Nationwise-61ad9f68cc95.json'
});

// home page
router.get('/', (req, res) => {
    res.send('API.');
});

router.post('/message', (req, res) => {
    var postdata = req.body;
    const topic = PubSub.topic('standardservice');
    //Write message to console before publishing
    console.log(req.body);
    // Publish message to topic
	topic.publish(postdata).then((results) => {
      const messageIds = results[0];
      //write message id to console
      console.log(`Message ${messageIds[0]} published.`);
      //Create object 
      var resmsg = {
          success: true,
          messages: messageIds
      }
      //Publish to console
	  res.json(200, resmsg);
    });
});

module.exports = router;