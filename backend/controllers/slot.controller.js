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
            return next(new AppError("Past dates not allowed ⚠️", 400))
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

        // getBusyTimes returns ALL busy periods across maxAdvanceDays range.
        // We must filter to only keep events that fall on selectedDate (in IST).
        const selectedDateStr = date.substring(0, 10); // "YYYY-MM-DD"
        const IST_OFFSET = 5.5 * 60 * 60 * 1000;

        const busyTimes = await googleCalendar.getBusyTimes(req, res, next);
        const normalizedGoogleBusySlots = busyTimes
            .map(busy => {
                // Parse the ISO string and shift to IST to get correct local date/time
                const startUtc = new Date(busy.start);
                const endUtc = new Date(busy.end);

                const istStart = new Date(startUtc.getTime() + IST_OFFSET);
                const istEnd = new Date(endUtc.getTime() + IST_OFFSET);

                const eventDateStr = istStart.toISOString().substring(0, 10); // "YYYY-MM-DD" in IST

                return {
                    dateStr: eventDateStr,
                    start: istStart.getUTCHours() * 60 + istStart.getUTCMinutes(),
                    end: istEnd.getUTCHours() * 60 + istEnd.getUTCMinutes(),
                };
            })
            // Only keep events that belong to the selected date
            .filter(slot => slot.dateStr === selectedDateStr)
            .map(({ start, end }) => ({ start, end }));

        console.log("Unavaliable___________", normalizedGoogleBusySlots)

        // const unavailableSlots = [...blocks, ...appointments, ...googleBusySlots];
        const unavailableSlots = [...normalizedAppointments, ...normalizedBlocks, ...normalizedGoogleBusySlots];


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
        const event = await googleCalendar.eventList(start, end);
        // const googleBusySlots = event.map(busy => {
        //     // Full day events from Google Calendar only have `date` not `dateTime`
        //     if (!busy.start.dateTime) return null;

        //     const startStr = busy.start.dateTime; // e.g. "2023-10-25T09:00:00+05:30"
        //     const endStr = busy.end.dateTime;

        //     // Extract HH:mm directly from the ISO string safely, bypassing JS Date timezones
        //     const startHour = parseInt(startStr.substring(11, 13));
        //     const startMin = parseInt(startStr.substring(14, 16));
            
        //     const endHour = parseInt(endStr.substring(11, 13));
        //     const endMin = parseInt(endStr.substring(14, 16));

        //     return {
        //         type: busy.summary,
        //         date: parseInt(startStr.substring(8, 10)),
        //         start: startHour * 60 + startMin,
        //         end: endHour * 60 + endMin,
        //     };
        // }).filter(Boolean);

        const googleBusySlots = event.map(busy => {
            if (!busy.start.dateTime) return null;

            // Parse properly — handles both "Z" and "+05:30" formats
            const startDate = new Date(busy.start.dateTime)
            const endDate = new Date(busy.end.dateTime)

            // Manually shift to IST (UTC+5:30)
            const IST_OFFSET = 5.5 * 60 * 60 * 1000
            const istStart = new Date(startDate.getTime() + IST_OFFSET)
            const istEnd = new Date(endDate.getTime() + IST_OFFSET)

            // Use UTC getters on the shifted date — gives correct IST values
            return {
                type: busy.summary,
                date: istStart.toISOString().substring(0, 10),  // "YYYY-MM-DD" in IST
                start: istStart.getUTCHours() * 60 + istStart.getUTCMinutes(),
                end: istEnd.getUTCHours() * 60 + istEnd.getUTCMinutes(),
            }
        }).filter(Boolean)
        const unavailableSlots = [...googleBusySlots];
        return res.status(200).json(unavailableSlots);
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
