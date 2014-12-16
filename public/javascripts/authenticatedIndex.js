/**
 * Created by tinhonng on 11/20/14.
 */

document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('profilePic').onerror = function(){
        this.src = "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg";
    }
    document.getElementById('profilePic').addEventListener('click', function(){
        document.getElementById('file').click();

    });
    document.getElementById('file').addEventListener('change', function(){
        document.getElementById('submit_btn').click();
        var reader = new FileReader();
        reader.addEventListener('loadend', function(){
            document.getElementById('profilePic').src = reader.result;
        });
        reader.readAsDataURL(document.getElementById('file').files[0]);
    });

    document.getElementById('appointment_btn').addEventListener('click', function(){
        if(document.getElementById('dtp_input1').value) {
            var dateInput = document.getElementById('dtp_input1').getAttribute('value');
            var sign_up_email = document.getElementById('sign_up_email').dataset.sign_up_email;
            var sign_up_first_name = document.getElementById('sign_up_first_name').dataset.sign_up_first_name;
            var sign_up_last_name = document.getElementById('sign_up_last_name').dataset.sign_up_last_name;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/appointment/schedule');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var obj = JSON.parse(xhr.responseText);
                    if (obj.message === "succeed") {

                        document.getElementById('pendingMode').innerHTML = "<div id='delete_btn'  >x</div>" + "<strong>Appointment Pending</strong>" + " Appointment " +
                        document.getElementById('dtp_input1').getAttribute('value') + " is being processed, and please come back and check";

                        document.getElementById('pendingMode').style.display = "block";
                        document.getElementById('appointment_btn').style.visibility = "hidden";
                        document.getElementById('date_form').style.display = "none";
                        document.getElementById('delete_btn').addEventListener('click', function(){
                            var sign_up_email = document.getElementById('sign_up_email').dataset.sign_up_email;

                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', '/appointment/delete');
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.addEventListener('readystatechange', function(){
                                if(xhr.readyState === 4 && xhr.status === 200){
                                    document.getElementById('date_form').style.display = 'block';
                                    document.getElementById('appointment_btn').style.visibility = "visible";
                                    document.getElementById('pendingMode').style.display = "none";
                                }
                            });
                            xhr.send(JSON.stringify({sign_up_email: sign_up_email}));

                        });
                    }
                }
            });
            xhr.send(JSON.stringify({sign_up_email: sign_up_email, sign_up_first_name: sign_up_first_name, sign_up_last_name: sign_up_last_name, dateScheduled: dateInput}));
        }
    });

//<input class="form-control" size="16" type="text" value="" readonly />
    document.getElementById('remove_date').addEventListener('click', function(){
        document.getElementById('dateFieldHolder').innerHTML = "";
        document.getElementById('dateFieldHolder').appendChild(getDateInputTag());
        document.getElementById('appointment_btn').style.visibility = "visible";


        console.log('done');
    });


    function getDateInputTag(){
        var inputtag = document.createElement('input');
        inputtag.className = 'form-control';
        inputtag.setAttribute('size', "16");
        inputtag.setAttribute('type', "text");
        inputtag.setAttribute('value', "");
        inputtag.readOnly = true;
        return inputtag;
    }

    if(document.getElementById('delete_btn')) {
        document.getElementById('delete_btn').addEventListener('click', function () {
            var sign_up_email = document.getElementById('sign_up_email').dataset.sign_up_email;

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/appointment/delete');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    document.getElementById('date_form').style.display = 'block';
                    document.getElementById('appointment_btn').style.visibility = "visible";
                    document.getElementById('pendingMode').style.display = "none";
                }
            });
            xhr.send(JSON.stringify({sign_up_email: sign_up_email}));

        });
    }
    console.log('ok');
    Array.prototype.map.call(document.getElementById('reportlist').getElementsByTagName('a'), function(ele){
       console.log('ok');
       ele.addEventListener('click', function(event){
            console.log('here');
            document.getElementById('modal-body').innerHTML = this.dataset.content;
            document.getElementById('myModalLabel').innerHTML = "Report " + this.innerHTML;
            document.getElementById('address').innerHTML = "http://localhost:63342/MMMProjectVerion1/" + this.dataset.address;
            document.getElementById('address').setAttribute('href', "http://localhost:63342/MMMProjectVerion1/" + this.dataset.address);
       });
    });
});




//<button class="btn btn-primary" type="button" id="appointment_btn">schedule</button><br/><br/>


