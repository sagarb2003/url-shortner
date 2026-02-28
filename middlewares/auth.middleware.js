import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticationMiddleware(req, res, next) {
    const authHeader=req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({error:"Authorization header is missing"});
    }
    if(!authHeader.startsWith('Bearer ')){
        return res.status(400).json({error:"Invalid authorization header format"});
    }
    const [_,token]=authHeader.split(' ');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({error:"Invalid or expired token"});
    }
}