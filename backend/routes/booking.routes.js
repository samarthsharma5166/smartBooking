import express from 'express';
// import {bookAppointment} from '../controllers/appointment.controller.js'
// import { blockDoctorTime } from '../controllers/doctorBlock.controller.js'
import { getAvailableSlots } from '../controllers/slot.controller.js'
import { bookAppointment, getAppointments, updateAppointment, deleteAppointment } from '../controllers/appointment.controller.js';


const router = express.Router();


router.get("/slots", getAvailableSlots);
router.post("/appointments", bookAppointment);
router.get("/appointments", getAppointments);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
// router.post("/admin/doctor/block", blockDoctorTime);


// router.get("/slots", getAvailableSlots);
// router.post("/appointments", authMiddleware, bookAppointment);
// router.post("/admin/doctor/block", adminAuth, blockDoctorTime);

export default router;