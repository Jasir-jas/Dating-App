const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./Models/User")
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (token, tokenSecret, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id })
            if (!user) {
                let user = new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                })
                await user.save()
            }
            // You can use profile info (mainly profile id) to check if the user is registered in your db
            return done(null, user);
        }catch(err) {
            return done(err,null)
        }
    }));

// User session save in serialize function
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// After authentication passport will call the deserilization function
// Retrive users from the deserialization function
passport.deserializeUser (async(id, done) => {
    try {
        const user = await User.findOne(id)
        done(null,user)
    } catch (error) {
        done(err,null)
        
    }
});

