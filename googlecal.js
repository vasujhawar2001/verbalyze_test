const { google } = require('googleapis'); 

require('dotenv').config();

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'; 
const GOOGLE_PRIVATE_KEY= process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
  
const jwtClient = new google.auth.JWT( 
  GOOGLE_CLIENT_EMAIL, 
  null, 
  GOOGLE_PRIVATE_KEY, 
  SCOPES 
); 
  
const calendar = google.calendar({ 
  version: 'v3', 
  project: GOOGLE_PROJECT_NUMBER, 
  auth: jwtClient 
}); 

const auth = new google.auth.GoogleAuth({ 
    keyFile: 'credentials.json', 
    scopes: 'https://www.googleapis.com/auth/calendar', 
  }); 

const calendarId = GOOGLE_CALENDAR_ID;
const gst = "+5:30";
const resource = {
  start: { dateTime: "2023-10-07T11:30:00.000+05:30" },
  end: { dateTime: "2023-10-07T12:30:00.000+05:30" },
//   attendees: [{ email: "vasujhwr@gmail.com" }], ERROR -> There was an error contacting the Calendar service: Error: Service accounts cannot invite attendees without Domain-Wide Delegation of Authority.
  // meet logic
  conferenceData: {
    createRequest: {
      requestId: "sample123",
      conferenceSolutionKey: { type: "hangoutsMeet" },
    },
  },
  summary: "VERBALYZE Event with Meet link",
  description: "Meet with Verbalyze",
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 30 },
    ],
  },
};

auth.getClient().then(a=>{ 
    calendar.events.insert({ 
      auth:a, 
      calendarId: "dd1bc78a76621664839381f659513cdbd42f871b85ad9de99640f6b8be15c919@group.calendar.google.com", 
      resource: resource,
      // conferenceDataVersion: 1, // not able to add conference data
    }, function(err, event) { 
      if (err) { 
        console.log('There was an error contacting the Calendar service: ' + err); 
        return; 
      } 
      console.log('Event created: %s', event.data);
    }); 
  })