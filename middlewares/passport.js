const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstretagy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const USER = require('../models/users-model')


/**
 * This is the local strategy to varify the username and passwords.
 * @function localStrategy 
 */
passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
},

/**
 * 
 * @param {string} username - Username of user.
 * @param {string} password - Password of user
 * @param {function} done - Varify callback
 * @returns {function}  call to next middlware function
 */
    async (username, password, done) => {
        try {
            const user = await USER.findOne({ username: username, isDeleted: false });
            if (!user) {
                return done(null, false, { message: "USER doesn't exist" });
            }
            const validate = await user.isValidPassword(password);
            if (!validate)
                return done(null, false, { message: 'Incorrect password' });
            return done(null, user, { message: "Logged In Successfull" });
        } catch (error) {
            done(error);
        }
    }
));


/**
 * This is the jwt strategy to varify the tokens.
 * @function jwtStrategy 
 */
passport.use(
    new JWTstretagy(
        {
            secretOrKey: process.env.TOKEN_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        /**
         * 
         * @param {*} token - jwt payload
         * @param {*} done - varify callback.
         * @returns {function}  call to next middlware function.
         */
        async (token, done) => {
                let user = await USER.findOne({ _id: token.user._id, isDeleted: false })
                            .populate({ path : 'role', select : { _id : 0, name : 1 }});
                
                if (user) { 
                    token.user.role = user.role.name;
                    return done(null, token.user);
                }   
                else return done(null, false, { message :" Invalid token"});
        }
    )
);