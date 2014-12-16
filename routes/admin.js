/**
 * Created by tinhonng on 12/2/14.
 */
module.exports = function(app, AppointmentModel){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        AppointmentModel.find({status: 'pending'}, function(error, results){
            if(error){
                res.status(500).json({message: "error"});
            }
            else{
                res.render('admin', {message: "success", appointmentset: results});
            }
        });
    });
    router.post('/proceed', function(req, res){
       AppointmentModel.findOneAndUpdate({sign_up_email: req.body.sign_up_email}, {status: 'success'}, function(error, results){
          if(error){
              res.status(500).json({message: 'error'});
          } else{
              res.status(200).json({message: 'success'});
          }
       });
    });

    app.use('/admin', router);
}