import * as googleCalendar from '../utils/googleCalendar.js';
import prisma from '../db/db.js';
import { combine } from '../utils/time.utils.js';
import AppError from '../utils/error.utils.js';
import { sendEmail } from '../utils/sendMail.js';

// Converts minutes from midnight to readable time e.g. 660 → "11:00 AM"
const minsToTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

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


        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });

        // Format date for email display
        const dateFormatted = new Date(date).toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const startFormatted = minsToTime(parseInt(startTime));
        const endFormatted = minsToTime(parseInt(endTime));

        // ── Patient email ────────────────────────────────────────────────────
        const patientHtml = `
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
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">✅ Appointment Confirmed</h1>
            <p style="margin:8px 0 0;color:#c4b5fd;font-size:14px;">Inspired Living</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Your appointment has been successfully booked. Here are your details:
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
              <a href="${data.event.hangoutLink}" target="_blank"
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

        // ── Doctor email ─────────────────────────────────────────────────────
        const doctorHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f766e,#0891b2);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:-0.5px;">📋 New Appointment Booked</h1>
            <p style="margin:8px 0 0;color:#a5f3fc;font-size:14px;">Inspired Living — Doctor Notification</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#374151;">A new appointment has been scheduled with you.</p>

            <!-- Details table -->
            <table width="100%" cellpadding="12" cellspacing="0" style="background:#f9fafb;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">👤 Patient</td>
                <td style="font-size:15px;color:#111827;font-weight:600;border-bottom:1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">📧 Email</td>
                <td style="font-size:15px;color:#111827;font-weight:600;border-bottom:1px solid #e5e7eb;">${email}</td>
              </tr>
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
            <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">Use the link below to start the session at the scheduled time:</p>
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="${data.event.hangoutLink}" target="_blank"
                style="display:inline-block;background:linear-gradient(135deg,#0f766e,#0891b2);color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                🎥 Start Meeting
              </a>
            </td></tr></table>
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

        sendEmail(email, "Your Appointment is Confirmed – Inspired Living", patientHtml);
        sendEmail(doctor.email, `New Appointment: ${name} on ${dateFormatted}`, doctorHtml);
        return
    } catch (err) {
        // TODO: Add logic to delete the Google Calendar event if the transaction fails
        console.error(err);

    }
};