const event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2015-05-28T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2015-05-28T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  


  // mongo db trigger example
  
  exports = async function(changeEvent) {
    // A Database Trigger will always call a function with a changeEvent.
    // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/
  
    // This sample function will listen for events and replicate them to a collection in a different Database
  
    // Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;
  
    // Get the MongoDB service you want to use (see "Linked Data Sources" tab)
    // Note: In Atlas Triggers, the service name is defaulted to the cluster name.
    const serviceName = "mongodb-atlas";
    const database = "EmailClient";
    // const collection = context.services.get(serviceName).db(database).collection(changeEvent.ns.coll)
    const collection = "UsersMeet";
  
    // Get the "FullDocument" present in the Insert/Replace/Update ChangeEvents
    try {
      // If this is a "delete" event, delete the document in the other collection
      if (changeEvent.operationType === "delete") {
        await collection.deleteOne({"_id": docId});
      }
  
      // If this is an "insert" event, insert the document into the other collection
      else if (changeEvent.operationType === "insert") {
        await collection.insertOne(changeEvent.fullDocument);
      }
  
      // If this is an "update" or "replace" event, then replace the document in the other collection
      else if (changeEvent.operationType === "update" || changeEvent.operationType === "replace") {
        await collection.replaceOne({"_id": docId}, changeEvent.fullDocument);
      }
    } catch(err) {
      console.log("error performing mongodb write: ", err.message);
    }
  };
  