import jwt from 'jsonwebtoken'
import httpError from '../utils/httpError.js';

const jwtDecoder = (req, res, next) => {
    const token = req.header('Authorization').split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        next(new httpError(401, "Invalid token. You need to authenticate first."));
    }
}

export default jwtDecoder;