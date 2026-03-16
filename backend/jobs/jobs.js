import cron from "node-cron";
import prisma from "../db/db.js";
import { sendEmail } from "../utils/sendMail.js";
import { combine } from "../utils/time.utils.js";

cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
        where: {
            status: "CONFIRMED"
        },
        include: { user: true }
    });

    for (const appointment of upcomingAppointments) {
        const appointmentDateTime = combine(
            appointment.date,
            appointment.startTime
        );

        const diff = appointmentDateTime - now;

        // 2 hour reminder
        if (
            diff <= 2 * 60 * 60 * 1000 &&
            diff > 0 &&
            !(await alreadySent(appointment.id, "TWO_HOURS_BEFORE"))
        ) {

            const html = `Your meeting link: ${appointment.meetLink}`
            await sendEmail(appointment.user.email, "Reminder for appointment", html);
            await logNotification(appointment.id, "TWO_HOURS_BEFORE");
        }

        // 1 day reminder
        if (
            diff <= 24 * 60 * 60 * 1000 &&
            diff > 23 * 60 * 60 * 1000 &&
            !(await alreadySent(appointment.id, "ONE_DAY_BEFORE"))
        ) {
            const html = `Your meeting link: ${appointment.meetLink}`
            await sendEmail(appointment.user.email, "Reminder for appointment", html);
            await logNotification(appointment.id, "ONE_DAY_BEFORE");
        }
    }
});

async function alreadySent(appointmentId, type) {
    const record = await prisma.notificationLog.findFirst({
        where: { appointmentId, type }
    });
    return !!record;
}

async function logNotification(appointmentId, type) {
    await prisma.notificationLog.create({
        data: { appointmentId, type }
    });
}

// Hourly cron job to delete expired/past appointments
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        // Fetch appointments that are on or before today
        const appointmentsToCheck = await prisma.appointment.findMany({
            where: {
                date: { lte: today }
            },
            select: { id: true, date: true, endTime: true }
        });

        const toDeleteIds = [];
        for (const appt of appointmentsToCheck) {
            const endDateTime = combine(appt.date, appt.endTime);
            if (endDateTime < now) {
                toDeleteIds.push(appt.id);
            }
        }

        if (toDeleteIds.length > 0) {
            // Delete related records first to avoid foreign key constraints
            await prisma.payment.deleteMany({
                where: { appointmentId: { in: toDeleteIds } }
            });
            await prisma.notificationLog.deleteMany({
                where: { appointmentId: { in: toDeleteIds } }
            });
            await prisma.appointment.deleteMany({
                where: { id: { in: toDeleteIds } }
            });
            console.log(`Cleaned up ${toDeleteIds.length} expired appointments.`);
        }
    } catch (error) {
        console.error("Error in expired appointments cron:", error);
    }
});