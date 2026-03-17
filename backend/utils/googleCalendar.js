import { google } from 'googleapis';
import dotenv from 'dotenv';
import prisma from '../db/db.js';
import AppError from './error.utils.js';
// import prisma from '../db/db.js';

dotenv.config();

const GOOGLE_CALENDAR_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID;
const GOOGLE_CALENDAR_CLIENT_SECRET = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
const GOOGLE_CALENDAR_REDIRECT_URI = process.env.GOOGLE_CALENDAR_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CALENDAR_CLIENT_ID,
  GOOGLE_CALENDAR_CLIENT_SECRET,
  GOOGLE_CALENDAR_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

export const getAuthUrl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes
  });
  return url;
};

export const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const getAuthenticatedClient = async () => {
 
  const doctorId = JSON.stringify(process.env.DOCTOR_ID);
  const doctor = await prisma.doctor.findFirst({
    where:{email:"samarths716@gmail.com"}
  });

  if (!doctor) {
    throw new Error("Doctor not found");
    // return next(new AppError(`email already exists`, 400));
  }

  // const googleCalendar = await prisma.googleCalendar.findUnique({
  //   where: { doctorId: doctor.id },
  // });

  if (!doctor.refreshToken) {
    throw new Error("Google Calendar not configured for this doctor");
    // return next(new AppError(`Google Calendar not configured for this doctor`, 500));
  }

   oauth2Client.setCredentials({
   refresh_token: doctor.refreshToken,
  });

  // oauth2Client.on('tokens', async (tokens) => {
  //   if (tokens.access_token) {
  //     await prisma.googleCalendar.update({
  //       where: { doctorId: doctor.id },
  //       data: {
  //         accessToken: tokens.access_token,
  //         expiryDate: tokens.expiry_date,
  //       },
  //     });
  //   }
  // });

  return oauth2Client;
}


export const getCalendar = (auth) => {
  return google.calendar({ version: 'v3', auth });
}

export const getBusyTimes = async (req,res,next) => {
  const auth = await getAuthenticatedClient(next);
  const calendar = getCalendar(auth);

  const doctor = await prisma.doctor.findFirst();
  const maxAdvanceDays = doctor.maxAdvanceDays || 30; // Default to 30 days if not set

  const timeMin = new Date();
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + maxAdvanceDays);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  return response.data.calendars.primary.busy;
}

// export const createEvent = async (summary, startTime, endTime) => {
 
//   // access_token and refresh_token were here
//   const auth = oauth2Client.setCredentials({
//       // access_token: googleCalendar.accessToken,
//       // refresh_token: googleCalendar.refreshToken,
      
//       access_token,
//       refresh_token,
//       // expiry_date: Number(googleCalendar.expiryDate),
//     });
//   // const auth = await getAuthenticatedClient();
//   const calendar = getCalendar(auth);

//   const event = {
//     summary,
//     start: {
//       dateTime: startTime,
//       timeZone: 'UTC',
//     },
//     end: {
//       dateTime: endTime,
//       timeZone: 'UTC',
//     },
//     conferenceData: {
//       createRequest: {
//         requestId: "some-random-string", // It's a good practice to use a unique ID here
//         conferenceSolutionKey: {
//           type: "hangoutsMeet"
//         }
//       }
//     }
//   };

//   const response = await calendar.events.insert({
//     calendarId: 'primary',
//     auth:auth,
//     resource: event,
//     conferenceDataVersion: 1,
//   });

//   return response.data;
// }


export const createEvent = async (summary, startTime, endTime,token) => {
  oauth2Client.setCredentials({
    // refresh_token previously here
    refresh_token: token,

  });

  const auth = await getAuthenticatedClient();

  const calendar = google.calendar({
    version: 'v3',
    auth,
  });

  const event = {
    summary,
    start: {
      dateTime: new Date(startTime).toISOString().replace('Z', '+05:30'),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(endTime).toISOString().replace('Z', '+05:30'),
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: Date.now().toString(),
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data;
};


export const eventList = async(timeMin,timeMax)=>{
  const auth = await getAuthenticatedClient()

  const calendar = await getCalendar(auth);
  const timemin = new Date(timeMin);
  const timemax = new Date(timeMax);

  const event = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timemin.toISOString(),
    timeMax: timemax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  })
  return event.data.items;
}

export const deleteEvent = async (eventId) =>{
  const auth = await getAuthenticatedClient();
  const calendar = getCalendar(auth);
  const response = await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
  
  return response.data;

}