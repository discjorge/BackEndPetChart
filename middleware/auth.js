import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export function verifyUserToken (req, res, next){
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = decoded
    next();

}

export function verifyVetToken (req, res, next){
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET)

    req.vet = decoded
    next();

}
