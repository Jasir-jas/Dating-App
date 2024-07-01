const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const Authentication = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization');
        console.log('Authorization header:', authToken);

        if (!authToken) {
            return res.status(401).send('Access denied, No token provided');
        }

        const token = authToken.replace('Bearer ', '').trim();
        console.log('Token after replacing Bearer:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded);

        const user = await User.findOne({ _id: decoded._id, token: token });
        // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        console.log('User found in DB:', user);

        if (!user) {
            throw new Error('User Not Found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(401).send('Invalid token');
    }
};

module.exports = Authentication;

// const jwt = require('jsonwebtoken');
// const User = require('../Models/User');

// const Authentication = async (req, res, next) => {
//     try {
//         const authToken = req.header('Authorization');
//         console.log('Authorization header:', authToken);

//         if (!authToken) {
//             return res.status(401).json({ error: 'Access denied, no token provided' });
//         }

//         const token = authToken.replace('Bearer ', '').trim();
//         console.log('Token after replacing Bearer:', token);

//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log('Decoded token:', decoded);

//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
//         console.log('User found in DB:', user);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Error in authentication middleware:', error);
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };

// module.exports = Authentication;
