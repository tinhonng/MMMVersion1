module.exports = function(app, UserModel) {
    var express = require('express');
    var router = express.Router();
    var bcrypt = require('bcrypt-nodejs');



    function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    /* GET users listing. */
    router.get('/index', function (req, res) {
        res.render('index', { title: 'Express' });
    });


    router.post('/sign_up', function (req, res) {
        var user_info = req.body;
        /*for(var ele in user_info){
         console.log(user_info[ele]);
         }*/
        var inputError = validate(user_info);
        for (var key in inputError) {
            if (inputError.hasOwnProperty(key)) {
                res.status(500).json({message: "input error", details: inputError});
                return;
            }// if there exists any error on the inputs, don't continue
        }

        UserModel.find({sign_up_email: user_info.sign_up_email}, function (outerErr, outerResults) {
            if (outerResults == undefined || outerResults.length === 0) { //which means the email doesn't exist so we will save it into the db
                user_info['sign_up_password'] = generateHash(user_info['sign_up_password']);
                (new UserModel(user_info)).save(function (innerErr, innerResults) {
                    if (innerErr) {
                        console.log(innerErr);
                        res.status(500).json({message: 'input error', details: "registration fails, try again please"});
                    }
                    else {
                        console.log(innerResults);
                        res.status(200).json({message: 'succeed', details: innerResults});
                    }
                });
            }
            else {
                res.status(500).json({message: 'input error', details: "email exists already"});
            }
        });


    });


    function validate(sign_up_info) {
        var inputError = {};
        for (var ele in sign_up_info) {
            if (sign_up_info[ele] === "") {
                inputError['empty field'] = "empty field is not allowed";
                return inputError;
            }
        }
        console.log(sign_up_info['sign_up_birthday_date']);
        if(validateDate(inputError, sign_up_info['sign_up_birthday_date'])){
            var parts = sign_up_info['sign_up_birthday_date'].split("/");
            var month = parseInt(parts[0], 10);
            var day = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);
            sign_up_info['sign_up_birthday_day'] = day;
            sign_up_info['sign_up_birthday_month'] = month;
            sign_up_info['sign_up_birthday_year'] = year;

        }
        if (sign_up_info['sign_up_password'] !== sign_up_info['sign_up_re_password']) {
            inputError['password error'] = "the confirmed password does not match the password!";
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(sign_up_info['sign_up_email'])) {
            inputError['email error'] = "the email is in invalid format";
        }

        return inputError;
    }

    function validateDate(inputError, dateString){
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)){
            inputError['invalid date format'] = "make sure the format is MM/DD/YYYY";
            console.log('here1');
            return false;
        }

        var parts = dateString.split("/");
        var month = parseInt(parts[0], 10);
        var day = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        if(year < 1000 || year > 3000 || month === 0 || month > 12){
            inputError['out of bound'] = "make sure the date range is correct";
            console.log('here2');
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if(year % 400 === 0 || (year % 100 !== 0 && year % 4 ===0))
            monthLength[1] = 29;

        if(!(day > 0 && day <= monthLength[month - 1])){
            inputError['out of bound'] = "make sure the date range is correct";
            console.log('here3');
            return false;
        }
        return true;

    }

    app.use('/users', router);
}