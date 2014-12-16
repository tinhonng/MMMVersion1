/**
 * Created by tinhonng on 11/20/14.
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

/* GET home page. */



router.post('/upload', function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        res.end();
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        console.log(this.openedFiles);
        /* The file name of the uploaded file */
        var file_name = req.user.sign_up_email + ".jpg";
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");
            }
        });
    });
});

module.exports = router;


