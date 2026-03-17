import prisma from "../db/db.js";
import { combine, generateSlots, overlaps, startOfToday } from "../utils/time.utils.js";
import * as googleCalendar from '../utils/googleCalendar.js';
import AppError from "../utils/error.utils.js";



export const getAvailableSlots = async (req, res, next) => {
    try {
        const { date, sessionTypeId } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }
        if (!sessionTypeId) {
            return res.status(400).json({ error: "Session Type is required 🚦" });
        }

        const sessionType = await prisma.sessionType.findUnique({
            where: { id: sessionTypeId }
        });

        if (!sessionType) {
            return res.status(400).json({ error: "Invalid session type" });
        }

        const slotSize = parseInt(sessionType.duration);


        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return next(AppError("Past dates not allowed ⚠️", 400))
            // return res.status(400).json({ error: "Past dates not allowed ⚠️" });
        }

        const doctorId = process.env.DOCTOR_ID;

        let slots = generateSlots(slotSize);

        const blocks = await prisma.doctorBlock.findMany({
            where: {
                doctorId,
                date: selectedDate,
            },
            select: { startTime: true, endTime: true },
        });

        const normalizedBlocks = blocks.map(b => ({
            start: b.startTime,
            end: b.endTime
        }));

        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: selectedDate,
                status: "CONFIRMED",
            },
            select: { startTime: true, endTime: true },
        });

        const normalizedAppointments = appointments.map(a => ({
            start: a.startTime,
            end: a.endTime
        }));


        const busyTimes = await googleCalendar.getBusyTimes(req, res, next);
        const googleBusySlots = busyTimes.map(busy => {
            const start = new Date(busy.start);
            const end = new Date(busy.end);
            return {
                start: start.getHours() * 60 + start.getMinutes(),
                end: end.getHours() * 60 + end.getMinutes(),
            };
        }).filter(slot => {
            const slotDate = new Date(busyTimes[0].start);
            return slotDate.toDateString() === selectedDate.toDateString();
        });

        const normalizedGoogleBusySlots = googleBusySlots.map(slot => {
            return {
                start: slot.start,
                end: slot.end,
            };
        });

        // const unavailableSlots = [...blocks, ...appointments, ...googleBusySlots];
        const unavailableSlots = [...normalizedAppointments, ...normalizedBlocks, ...normalizedGoogleBusySlots];


        console.log("Unavaliable___________", unavailableSlots);

        let availableSlots = slots.map(slot => {
            let isAvailable = true;
            for (const unavailable of unavailableSlots) {
                if (overlaps(slot, unavailable)) {
                    isAvailable = false;
                    break;
                }
            }
            return { ...slot, isAvailable };
        });

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
        });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        availableSlots = availableSlots.map(slot => {
            if (!slot.isAvailable) return slot;

            const appointmentDateTime = combine(date, slot.start);
            const diffMinutes =
                (appointmentDateTime.getTime() - Date.now()) / 60000;

            if (diffMinutes < doctor.minAdvanceMinutes) return { ...slot, isAvailable: false };

            const daysAhead =
                Math.floor((appointmentDateTime - startOfToday()) / 86400000);

            if (daysAhead > doctor.maxAdvanceDays) return { ...slot, isAvailable: false };

            return slot;
        });

        // console.log(availableSlots)
        res.json(availableSlots);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getBlockSlots = async (req, res, next) => {
    try {
        const { start, end } = req.query;

        const doctorId = process.env.DOCTOR_ID;

        const startDate = new Date(start);
        const endDate = new Date(end);


        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);


        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
        });
        if (!doctor) {
            return next(new AppError("Doctor not found", 404));
        }
        const blocks = await prisma.doctorBlock.findMany({
            where: {
                doctorId,
            },
            select: { startTime: true, endTime: true },
        });


        // const blocksBusy = blocks.map(block => {
        //     return {

        //         date: block.date,
        //         start: block.startTime,
        //         end: block.endTime,
        //     };
        // });


        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                status: "CONFIRMED",
            },
            select: { startTime: true, endTime: true },
        });

        // const busyTimes = await googleCalendar.getBusyTimes(req, res, next);
        // const googleBusySlots = busyTimes.map(busy => {
        //     const start = new Date(busy.start);
        //     const end = new Date(busy.end);
        //     return {
        //         date:start.getDate(),
        //         start: start.getHours() * 60 + start.getMinutes(),
        //         end: end.getHours() * 60 + end.getMinutes(),
        //     };
        // })
        const event = await googleCalendar.eventList(start, end);
        const googleBusySlots = event.map(busy => {
            const start = new Date(busy.start.dateTime);
            const end = new Date(busy.end.dateTime);
            return {
                type: busy.summary,
                date: start.getDate(),
                start: start.getHours() * 60 + start.getMinutes(),
                end: end.getHours() * 60 + end.getMinutes(),
            };
        })

        const unavailableSlots = [...googleBusySlots];
        return res.status(200).json(unavailableSlots);
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
