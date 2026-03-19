import prisma  from "../db/db.js";

import { PayData } from "../config/payu.config.js";
import crypto from "crypto";
import AppError from "../utils/error.utils.js";
import { bookAppointment } from "../utils/bookAppointment.js";
import { combine } from "../utils/time.utils.js";

export const getPayment = async (req, res, next) => {
    try {
        const txn_id = 'PAYU_MONEY_' + Math.floor(Math.random() * 8888888)
        const { date, startTime, whatsapp, endTime, email, name, sessionTypeId } = req.body
        const appointmentDate = new Date(date);
        const doctorId = process.env.DOCTOR_ID;
        
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize 'today' to start of day

        const normalizedAppointmentDate = new Date(appointmentDate);
        normalizedAppointmentDate.setHours(0, 0, 0, 0); // Normalize appointment date to start of day

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } })
        const advanceBookingDays = doctor.advanceBookingDays;

        const maxDate = new Date(now);
        maxDate.setDate(now.getDate() + advanceBookingDays);

        if(normalizedAppointmentDate > maxDate){
            return next(new AppError(`Select a date within ${advanceBookingDays} days from today`, 401));
        }

        if(normalizedAppointmentDate < now){
            return next(new AppError(`Select a valid Date`, 401));
        }

        const session = await prisma.sessionType.findUnique({
            where: { id: sessionTypeId }
        })

        
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email, name } });
        }
        const userId = user.id;

        const startDateTime = combine(date, startTime);
        const endDateTime = combine(date, endTime);
        const amount = session.fee;

        const appointment = await prisma.$transaction(async tx => {
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
                    // googleCalendarEventId: event.id,
                    // meetLink: event.hangoutLink,
                },
            });
            return appointment;
        });

        const product = {
            product_info: "appointment",
            amount: session.fee,
        }
        let udf1 = ''
        let udf2 = ''
        let udf3 = ''
        let udf4 = ''
        let udf5 = ''

        const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${JSON.stringify(product)}|${name}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;
        // console.log(hashString);

        // Calculate the hash
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        await prisma.payment.create({
            data: {
                txnId: txn_id,
                amount,
                status: "PENDING",
                appointmentId: appointment.id
            }
        })

        const frontend = process.env.FRONTEND_URL
        const backend = process.env.BACKEND_URL
        const data = await PayData.payuClient.paymentInitiate({
            isAmountFilledByCustomer: false,
            txnid: txn_id,
            amount: amount,
            currency: 'INR',
            productinfo: JSON.stringify(product),
            firstname: name,
            email: email,
            phone: whatsapp,
            // surl: `http://localhost:3000/api/v1/payment/verify-payment/${txn_id}/${appointment.id}`,
            // furl: `http://localhost:5173/booking-success`,
            surl: `${backend}/api/v1/payment/verify-payment/${txn_id}/${appointment.id}`,
            furl: `${frontend}/booking-success`,
            hash
        })
        res.send(data)
    } catch (error) {
        console.log(error.message)
        return next(new AppError(error.message, 500));
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const txnid = req.params.txnid
        const appointmentId = req.params.appointmentId

        const verified_Data = await PayData.payuClient.verifyPayment(txnid);
        const data = verified_Data.transaction_details[txnid]

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        })

        if (!appointment) {
            return next(new AppError(`Appointment not found`, 404));
        }

        const user = await prisma.user.findUnique({
            where: { id: appointment.userId }
        })

        if (!user) {
            return next(new AppError(`User not found`, 404));
        }

        const email = user.email
        const name = user.name

        const status = data.status === "success" ? "SUCCESS" : "FAILED"

        await prisma.payment.update({
            where: { txnId: txnid },
            data: {
                status,
                method: data.mode,
                error: data.error_Message || null
            }
        })
        const date = new Date(appointment.date)

        await bookAppointment(date, appointment.startTime, appointment.endTime, email, name, appointmentId)

        // res.redirect('http://localhost:5173/booking-success');
        const frontend = process.env.FRONTEND_URL
        res.redirect(`${frontend}/booking-success`);
    } catch (error) {
        console.log(error.message)
        return next(new AppError(error.message, 500));
    }

}
