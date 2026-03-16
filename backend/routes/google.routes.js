import express from 'express';
import * as googleController from '../controllers/google.controller.js';
import { createEvent } from '../utils/googleCalendar.js';
import prisma from '../db/db.js';

const router = express.Router();

router.get('/auth', googleController.getAuthUrl);
router.get('/callback', googleController.handleCallback);
router.get('/create-event', async(req,res)=>{
    const doctor = await prisma.doctor.findFirst();

    const result = createEvent("test event",Date.now(),Date.now(),doctor.refreshToken);
    res.send(result);
    return;
})

export default router;
