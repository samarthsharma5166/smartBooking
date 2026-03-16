import * as googleCalendar from '../utils/googleCalendar.js';
import prisma from '../db/db.js';
import { combine } from '../utils/time.utils.js';
import AppError from '../utils/error.utils.js';
import { sendEmail } from '../utils/sendMail.js';

export const bookAppointment = async (req, res, next) => {
    const { date, startTime, endTime, email, name, sessionTypeId } = req.body;
    const doctorId = process.env.DOCTOR_ID;

    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email, name } });
        }
        const userId = user.id;

        const startDateTime = combine(date, startTime);
        const endDateTime = combine(date, endTime);

        // TODO: Implement a rollback mechanism for the Google Calendar event if the db transaction fails.
        

        const appointment =   await prisma.$transaction(async tx => {
            const blockConflict = await tx.doctorBlock.findFirst({
                where: {
                    doctorId,
                    date: new Date(date),
                    startTime: { lt: endTime },
                    endTime: { gt: startTime },
                },
            });

            if (blockConflict) {
                return next(new AppError(`Doctor unavailable at this time Please refresh the page and try again`, 400));
            }

            const bookingConflict = await tx.appointment.findFirst({
                where: {
                    doctorId,
                    date: new Date(date),
                    status: "CONFIRMED",
                    startTime: { lt: endTime },
                    endTime: { gt: startTime },
                },
            });

            if (bookingConflict) {
                return next(new AppError(`Slot already booked`, 400));

            }
            const appointment = await tx.appointment.create({
                data: {
                    userId,
                    doctorId,
                    date: new Date(date),
                    startTime,
                    endTime,
                    sessionTypeId,
                    status: "CONFIRMED",
                    // googleCalendarEventId: event.id,
                    // meetLink: event.hangoutLink,
                },
            });
            return appointment;
        });

        const event = await googleCalendar.createEvent(
            `Appointment with ${name}`,
            startDateTime.toISOString(),
            endDateTime.toISOString()
        );
        const updatedAppointment = await prisma.appointment.update({
            where: { 
                id: appointment.id,
             },
            data: {
                googleCalendarEventId: event.id,
                meetLink: event.hangoutLink,
            },
        });

        console.log(event.hangoutLink);

        const html = `Your meeting link: ${event.hangoutLink}`

        sendEmail(email,"Reminder for appointment",html);
        // sendEmail(drEmail,"Reminder for appointment",html);
        return res.status(201).json({ success:true, message: "Appointment booked successfully", data: updatedAppointment });
    } catch (err) {
        // TODO: Add logic to delete the Google Calendar event if the transaction fails
        console.error(err);
        return next(AppError(err.message, 500))
        // return res.status(400).json({ error: err.message });
    }
};


export const getAppointments = async (req, res, next) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where:{
                status:"CONFIRMED",
            },
            include:{
                sessionType:true,
                user:true,
                payment:true,
            }
        });
        return res.status(200).json({ success: true, data: appointments });
    } catch (err) {
        console.error(err);
        return next(new AppError(err.message, 500));
    }
}

export const updateAppointment = async (req, res, next) => {
    const { id } = req.params;
    const { date, startTime, endTime, sessionTypeId, userId, doctorId } = req.body;
    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                date: new Date(date),
                startTime,
                endTime,
                sessionTypeId,
                userId,
                doctorId,
            },
        });
        return res.status(200).json({ success: true, data: updatedAppointment });
    } catch (err) {
        console.error(err);
        return next(new AppError(err.message, 500));
    }
}

export const deleteAppointment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const appointment = await prisma.appointment.findUnique({ where: { id } });
        if (appointment.googleCalendarEventId) {
            await googleCalendar.deleteEvent(appointment.googleCalendarEventId);
        }
        await prisma.appointment.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
    } catch (err) {
        console.error(err);
        return next(new AppError(err.message, 500));
    }
}
