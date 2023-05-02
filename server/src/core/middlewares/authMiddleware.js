const jwt = require('jsonwebtoken');
const User = require('../../features/user/models/User');

const authMiddleware = async (req, res, next) => {
    if (req.path === '/register' || req.path === '/login' || req.path === '/check-username') {
        // Exclude the registration & login routes from authentication
        return next();
    }
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret-key');
        if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token expired' });
        }
        const user = await User.findOne({id : decodedToken.id});
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (user.accessToken !== token) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decodedToken.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;