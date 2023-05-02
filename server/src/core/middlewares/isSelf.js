const logger = require('../utils/logger');
const isSelf = (req, res, next) => {
    // Check if the user ID in the request path matches the ID in the JWT token
    const userId = req.params.id;

    if (userId !== req.userId.toString()) {
        logger.info('isSelf middleware: user is not self');
        return res.status(403).json({ message: 'Forbidden' });
    }
    logger.info('isSelf middleware: user is self');

    // Call the next middleware if the user is making a request about themselves
    next();
};
module.exports = isSelf;