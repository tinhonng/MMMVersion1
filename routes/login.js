/*var express = require('express');
var router = express.Router();
router.post('/', function(req, res){
    res.redirect('http://localhost:3000/');
    //using render gives me a page without images, why?
});


module.exports = router;*/

module.exports = function(app, passport, AppointmentModel, ReportModel){
    var express = require('express');
    var router = express.Router();



    router.get('/profile', function (req, res) {
        if(req.isAuthenticated()) {
            var appointment_info = {};
            AppointmentModel.find({sign_up_email: req.user.sign_up_email}, function(error, results){
                if(error) {
                    appointment_info["message"] = "error";

                }
                else {
                    if(results.length){
                        appointment_info["message"] = "success";
                        appointment_info["info"] = results[0];
                    }
                    else{
                        appointment_info["message"] = "error";
                    }


                }
                ReportModel.find({sign_up_email: req.user.sign_up_email}, function(reportErr, reportResults){
                    if(reportErr){
                        res.render('profile', {user: req.user, appointment_info: appointment_info});
                    }
                    else{
                        res.render('profile', {user: req.user, appointment_info: appointment_info, report_info: reportResults});
                    }
                });
            });
        }
        else
            res.redirect('../');
    });

    router.get('/badlogin', function(req, res) {
        res.send('Bad login request ... Password/username did not work ... ');
    });

    router.get('/logout', function(req, res){
       req.logout();
       res.redirect('../');
    });
    router.post('/', passport.authenticate('local', {
        successRedirect: '/authenticate/profile',
        failureRedirect: '/authenticate/badlogin',
        failureFlash: false
    }));

    app.use('/authenticate', router);
}


