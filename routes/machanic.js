/**
 * Created by tinhonng on 12/3/14.
 */
module.exports = function(app, ODB2CodeModel, AppointmentModel, ReportModel){
    var express = require('express');
    var router = express.Router();
    var fs = require('fs');

    router.get('/', function(req, res){
        ODB2CodeModel.find({}, function(error, results){
            if(error){
                res.send('not ok');
            }
            else{
                if(results.length === 0){
                    res.send('not ok');
                }
                else{
                    AppointmentModel.find({status: 'success'}, function(error2, results2) {
                        if (error2) {
                            res.render('machanicPanel', {codeset: results});
                        }
                        else {
                            res.render('machanicPanel', {codeset: results, appointmentset: results2});
                        }
                    });
                }
            }
        });
    });


    router.post('/proceedAppointment', function(req, res){
       var report_info = req.body;
        var filecontent =   "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=480\"><title>Make Me Mobile Diagnostics</title>" +

            "<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css\"" + "><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css\"" +
            ">" + "<style>#deletepart{display:none;}</style>" + "<\/head><body style=\"padding:300px;padding-top:30px;\"" +  ">" +

            report_info.htmlcontent.replace('/images/chart.jpg', 'images/chart.jpg') + "<\/body></html>";
        var reporturl = "tmp/" + report_info.sign_up_email + report_info.time + ".html";
        fs.writeFile(reporturl, filecontent, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
                report_info.reporturl = reporturl;
                (new ReportModel(report_info)).save(function(error, results){
                    if(error){
                        res.status(500).json({message: 'input error', details: 'report fail to generate'});
                    }
                    else {
                        AppointmentModel.findOneAndRemove({sign_up_email: report_info.sign_up_email}, function(innerErr, innerResults){
                            if(innerErr){
                                res.status(500).json({message: 'delete error', details: 'appointment can not be proceed'});
                            }
                            else{
                                res.status(200).json({message: 'succeed', details: results});

                            }
                        });
                    }
                });

            }
        });

    });


    app.use('/machanic', router);
}
