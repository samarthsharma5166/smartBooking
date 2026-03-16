import catchAsync from '../utils/catchAsync.js';
import db from '../db/db.js';

export const createSessionType = catchAsync(async (req, res) => {
  const { name, duration, title, sub, note, fee } = req.body;
  const doctorId = process.env.DOCTOR_ID;
  const durationNum = parseInt(duration);
  const feeNum = parseInt(fee);
  const sessionType = await db.sessionType.create({
    data: {
      name,
      duration:durationNum,
      title,
      sub,
      note,
      fee:feeNum,
      doctorId,
    },
  });
  res.status(201).json({
    status: 'success',
    data: {
      sessionType,
    },
  });
});

export const getSessionTypes = catchAsync(async (req, res) => {
  const doctorId = process.env.DOCTOR_ID;
  const sessionTypes = await db.sessionType.findMany({
    where: {
      doctorId,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      sessionTypes,
    },
  });
});

export const getSessionType = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sessionType = await db.sessionType.findUnique({
    where: {
      id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      sessionType,
    },
  });
});

export const updateSessionType = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, duration, title, sub, note, fee } = req.body;
  const durationNum = parseInt(duration);
  const feeNum = parseInt(fee);
  const sessionType = await db.sessionType.update({
    where: {
      id,
    },
    data: {
      name,
      duration:durationNum,
      title,
      sub,
      note,
      fee:feeNum,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      sessionType,
    },
  });
});

export const deleteSessionType = catchAsync(async (req, res) => {
  const { id } = req.params;
  await db.sessionType.delete({
    where: {
      id,
    },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});


