import { google } from 'googleapis';
import * as googleCalendar from './utils/googleCalendar.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const startStr = "2026-03-18T11:10:00+05:30";
        const endStr = "2026-03-18T12:00:00+05:30";
        const auth = await googleCalendar.getAuthenticatedClient();
        const calendar = google.calendar({ version: 'v3', auth });

        const event = {
            summary: "Test 11:10 AM Event",
            start: {
                dateTime: startStr,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endStr,
                timeZone: 'Asia/Kolkata',
            },
        };
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        console.log("Created event:", response.data.start);
    } catch (e) {
        console.error(e);
    }
}
test();
