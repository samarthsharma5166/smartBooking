
import prisma  from '../db/db.js';
import AppError from '../utils/error.utils.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createEvent } from '../utils/googleCalendar.js';
import { combine } from '../utils/time.utils.js';

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

export const register = async(req,res,next) =>{
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return next(new AppError(`All field are required`, 400));
        }
        const userExists = await prisma.doctor.findFirst({
            where: { email }
        })
        if (userExists) {
            return next(new AppError(`email already exists`, 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Doctor = await prisma.doctor.create({
            data:{
            name:fullName,
            fee:100,      // consultation fee
            email:email,
            password:hashedPassword,
            minAdvanceMinutes: 60,
            maxAdvanceDays: 30,  // e.g. 120 = must book at least 2 hours before
            }
           
        });

        if (!Doctor) {
            return next(new AppError(`something went wrong`, 500));
        }
        
        return res.status(201).json({
            success:true,
            Doctor,
            message:"Doctor created successfully"
        });
    } catch (error) {
        return next(
            new AppError(error || 'File not uploaded , please try again later', 500)
        )
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError("All fields are required", 400));
        }
        const user = await prisma.doctor.findFirst({
            where: { email }
        })


        const comparePasswrod = await bcrypt.compare(password,user.password)
        if (!user || !comparePasswrod) {
            return next(new AppError("Email or Password does not match", 400));
        }

        const token = await jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
        },process.env.JWT_SECRET)
        
        user.password = undefined;

        res.cookie('token', token, cookieOptions);
        
        return res.status(200).json({
            success: true,
            message: 'user login succesfully',
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                refreshToken:user.refreshToken,
                accessToken:user.accessToken,
                fee:user.fee,
                minAdvanceMinutes:user.minAdvanceMinutes,
                maxAdvanceDays:user.maxAdvanceDays
            }
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export const getMe = async (req, res, next) => {
    try {
     
        const doctor = await prisma.doctor.findFirst({
            where: { id: req.user.id }
        });
        if (!doctor) {
            return next(new AppError("User not found", 404));
        }
        doctor.expiryDate = undefined;
        doctor.password = undefined;
        res.status(200).json({
            success: true,
            doctor,
            message: 'User fetched successfully'
        });
    }
    catch (error) {
        console.log(error.message)
        return next(new AppError(error.message, 500));
    }
}

export const logout = (req, res) => {
    res.cookie("token", null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logout successfully'
    })
}

export const markBlock = async (req, res, next) => {
    try{
        const { date, startTimeInMinutes, endTimeInMinutes } = req.body;
        const doctorId = req.user.id;
     
        const dateInFormat = new Date(date);

        const block = await prisma.doctorBlock.create({
            data: {
                doctorId,
                date: dateInFormat,
                startTime:startTimeInMinutes,
                endTime:endTimeInMinutes,
                reason:"BLOCK"
            },
        });

        const event = await createEvent("BLOCK",combine(date,startTimeInMinutes),combine(date,endTimeInMinutes))
        
        return res.status(201).json({
            success: true,
            block,
            message: 'Block created successfully'
        });
    }
    catch(error){
        return next(new AppError(error.message, 500));
    }

}