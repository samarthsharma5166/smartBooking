import jwt from 'jsonwebtoken';
import AppError from '../utils/error.utils.js';

export const isLoggedIn = async (req, res, next) => {
  
    const { token } = req.cookies || req.cookies.token;

    if (!token) {
        return next(new AppError("Unauthanticated please login again", 401))
    }
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
}
