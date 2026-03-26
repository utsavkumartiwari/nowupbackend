const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) return res.status(401).json({ message: "Access Denied: No Token" });

    try {
        // 'Bearer ' prefix ko handle karna
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader;

        // FIX: Login route ki tarah yahan bhi fallback secret add karein
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = verified;
        next();
    } catch (err) {
        // Agar yahan error aata hai toh "Invalid Token" response jayega
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = { verifyAdmin };