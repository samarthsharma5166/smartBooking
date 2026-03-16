import * as googleCalendar from '../utils/googleCalendar.js';
import prisma from '../db/db.js';
import { combine } from '../utils/time.utils.js';
import AppError from '../utils/error.utils.js';
import { sendEmail } from '../utils/sendMail.js';
export const bookAppointment = async (date, startTime, endTime, email, name, appointmentId) => {
    const doctorId = process.env.DOCTOR_ID;
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email, name } });
        }
        const userId = user.id;

        const startDateTime = combine(date, startTime);
        const endDateTime = combine(date, endTime);

        const data = await prisma.$transaction(async tx=>{
            const event = await googleCalendar.createEvent(
                `Appointment with ${name}`,
                startDateTime.toISOString(),
                endDateTime.toISOString()
            );

            const appointment = await tx.appointment.update({
                where: {
                    id: appointmentId,
                },
                data: {
                    status: "CONFIRMED",
                    googleCalendarEventId: event.id,
                    meetLink: event.hangoutLink,
                },
            });
            
            return {
                appointment,
                event
            }
        })


        

        const html = `Your meeting link: ${data.event.hangoutLink}`

        sendEmail(email, "Reminder for appointment", html);
        // sendEmail(drEmail,"Reminder for appointment",html);
        return
    } catch (err) {
        // TODO: Add logic to delete the Google Calendar event if the transaction fails
        console.error(err);

    }
};