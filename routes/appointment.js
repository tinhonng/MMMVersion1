/**
 * Created by tinhonng on 12/2/14.
 */
module.exports = function(app, AppointmentModel, io){
    var express = require('express');
    var router = express.Router();

    router.post('/schedule', function(req, res){
        console.log(req);
        var appointment_info = {sign_up_email: req.body.sign_up_email, time: req.body.dateScheduled, sign_up_first_name: req.body.sign_up_first_name,
                                sign_up_last_name: req.body.sign_up_last_name, status: "pending"};

        console.log(appointment_info);
        (new AppointmentModel(appointment_info)).save(function(innerErr, innerResults){
           if(innerErr){
               console.log(innerErr);
               res.status(500).json({message: 'input error', details: "appointment fails, try again please"});
           }
           else {
               io.emit('appointment request', appointment_info);
               console.log(innerResults);
               res.status(200).json({message: 'succeed', details: innerResults});
           }
        });
    });

    router.post('/delete', function(req, res){
        var sign_up_email = req.body.sign_up_email;
        console.log("this is " + sign_up_email);
        AppointmentModel.remove({sign_up_email: sign_up_email}, function(innerErr, innerResults){
            if(innerErr){
                console.log(innerErr);
                res.status(500).json({message: 'input error', details: "appointment fails, try again please"});
            }
            else {
                console.log(innerResults);
                res.status(200).json({message: 'succeed', details: innerResults});
            }
        });
    });



    app.use('/appointment', router);
}