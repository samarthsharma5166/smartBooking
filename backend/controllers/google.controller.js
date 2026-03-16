import * as googleCalendar from '../utils/googleCalendar.js';
import prisma from '../db/db.js';
import AppError from '../utils/error.utils.js'

export const getAuthUrl = (req, res) => {
  const url = googleCalendar.getAuthUrl();
  // res.send({ url });
  res.redirect(url);
};

export const handleCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const tokens = await googleCalendar.getToken(code);

    // For this example, we'll find or create a single doctor.
    // In a real application, you'd associate this with the logged-in user.
    let doctor = await prisma.doctor.findFirst({
      where: { email: 'samarths716@gmail.com' },
    });
    if (!doctor) {
      doctor = await prisma.doctor.create({
        data: {
          name: 'Samarth sharam',
          email: 'samarths716@gmail.com',
          fee: 100,
          minAdvanceMinutes: 60,
          maxAdvanceDays: 30,
        },
      });
    }

    if (!tokens.refresh_token) {
      return next(new AppError(`Refresh token not provided.`, 400));
    }
    else{
      await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        },
      })
    }
    // res.redirect("http://localhost:5173/admin")
    const frontend = process.env.FRONTEND_URL
    res.redirect(`${frontend}/admin`)
  } catch (error) {
    console.error('Error handling Google Calendar callback:', error);
    return next(new AppError(error.message, 500));
    // res.status(500).send('Error authenticating with Google Calendar');
  }
};
