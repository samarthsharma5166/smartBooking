import prisma from "../db/db.js";
import AppError from "../utils/error.utils.js";
import { getDay, getMonth, getYear, lastDayOfWeek, startOfWeek } from "date-fns";

export const getStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id;

    const today = new Date();
    const startOfWeekDate = startOfWeek(today);
    const endOfWeekDate = lastDayOfWeek(today);

    // 1. Today's appointments
    const todaysAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        status: "CONFIRMED",
        date: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });

    // 2. Blocked Today
    const blockedToday = await prisma.doctorBlock.count({
        where: {
            doctorId,
            date: {
                gte: new Date(today.setHours(0, 0, 0, 0)),
                lt: new Date(today.setHours(23, 59, 59, 999)),
              },
        }
    })

    // 3. Next Appointment
    const nextAppointment = await prisma.appointment.findFirst({
        where:{
            doctorId,
            date: {
                gte: new Date(today.setHours(0, 0, 0, 0)),
                lt: new Date(today.setHours(23, 59, 59, 999)),
              },
              startTime:{
                gte: today.getHours() * 60 + today.getMinutes()
              }
        },
        orderBy:{
            startTime:'asc'
        }
    })

    // 4. This week's bookings
    const thisWeekBookings = await prisma.appointment.count({
        where:{
            doctorId,
            date: {
                gte: startOfWeekDate,
                lte: endOfWeekDate,
              },
        }
    })

    res.status(200).json({
      success: true,
      stats: {
        todaysAppointments,
        blockedToday,
        nextAppointment,
        thisWeekBookings,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
