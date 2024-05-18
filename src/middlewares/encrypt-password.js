import bcrypt from "bcrypt";

const encryptPassword = async (req, res, next) => {
    if (req.body !== undefined && req.body.password !== undefined) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    next();
}

export default encryptPassword;