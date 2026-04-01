import cron from "node-cron";
import prisma from "../db/db.js";
import { sendEmail } from "../utils/sendMail.js";
import { combine } from "../utils/time.utils.js";

// Converts minutes from midnight to readable time e.g. 660 → "11:00 AM"
const minsToTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

const buildReminderHtml = (appointment, label) => {
    const name = appointment.user?.name ?? 'Patient';
    const dateFormatted = new Date(appointment.date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const startFormatted = minsToTime(parseInt(appointment.startTime));
    const endFormatted = minsToTime(parseInt(appointment.endTime));
    const meetLink = appointment.meetLink;

    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">⏰ Appointment Reminder</h1>
            <p style="margin:8px 0 0;color:#c4b5fd;font-size:14px;">Inspired Living — ${label}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              This is a reminder for your upcoming appointment. Here are your details:
            </p>

            <!-- Details table -->
            <table width="100%" cellpadding="12" cellspacing="0" style="background:#f9fafb;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">📅 Date</td>
                <td style="font-size:15px;color:#111827;font-weight:600;border-bottom:1px solid #e5e7eb;">${dateFormatted}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">🕐 Time</td>
                <td style="font-size:15px;color:#111827;font-weight:600;border-bottom:1px solid #e5e7eb;">${startFormatted} – ${endFormatted} IST</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">🎥 Platform</td>
                <td style="font-size:15px;color:#111827;font-weight:600;">Google Meet</td>
              </tr>
            </table>

            <!-- Join button -->
            <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">Click the button below at your appointment time to join the video call:</p>
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="${meetLink}" target="_blank"
                style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                🎥 Join Meeting
              </a>
            </td></tr></table>

            <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;">
              If you need to reschedule or cancel, please contact us in advance. We look forward to seeing you!
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Inspired Living. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

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
            const html = buildReminderHtml(appointment, "Your appointment is in 2 hours");
            await sendEmail(appointment.user.email, "⏰ Reminder: Your appointment is in 2 hours – Inspired Living", html);
            await logNotification(appointment.id, "TWO_HOURS_BEFORE");
        }

        // 1 day reminder
        if (
            diff <= 24 * 60 * 60 * 1000 &&
            diff > 23 * 60 * 60 * 1000 &&
            !(await alreadySent(appointment.id, "ONE_DAY_BEFORE"))
        ) {
            const html = buildReminderHtml(appointment, "Your appointment is tomorrow");
            await sendEmail(appointment.user.email, "📅 Reminder: Your appointment is tomorrow – Inspired Living", html);
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