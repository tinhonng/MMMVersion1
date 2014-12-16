/**
 * Created by tinhonng on 11/15/14.
 */
module.exports = function(app, passport, UserModel){
    passport = require('passport');
    LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require('bcrypt-nodejs');

    function validPassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }

    passport.use(new LocalStrategy(
        function(username, password, done) {

            UserModel.findOne({'sign_up_email': username}, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false);

                if(!validPassword(password, user.sign_up_password)){
                    return done(null, false);
                }
                return done(null, user);

            });
        }

    ));

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        UserModel.findById(id, function(err, user){
            done(err, user);
        });
    });

};