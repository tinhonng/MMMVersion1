/**
 * Created by tinhonng on 12/3/14.
 */
document.addEventListener('DOMContentLoaded', function(){
    var odb2codeset = JSON.parse(document.getElementById('odb2code').dataset.ddb2code);
    var appointmentset = JSON.parse(document.getElementById('appointment').dataset.appointment);
    var odb2hash = {}; //this is the one
    var appointmentsethash = {}; //this is the one

    for(var i = 0; i < odb2codeset.length; i++){
        odb2hash[odb2codeset[i].code] = odb2codeset[i].Description;
    }
    for(var i = 0; i < appointmentset.length; i++){
        appointmentsethash[appointmentset[i].sign_up_email] = appointmentset[i];
    }

    document.getElementById('generate_btn').addEventListener('click', function(event){
        event.preventDefault();

        var inputcodes = document.getElementsByClassName('inputcode');
        var codeValSelected = {};
        if(inputcodes[0].value && document.getElementById('client_name').innerHTML != ""){
            document.getElementById('reportarea').style.display = 'block';
            var table = document.getElementById('code_info');
            var thead = table.firstElementChild;
            var tbody = thead.nextElementSibling;
            tbody.innerHTML = "";

            for(var i = 0; i < inputcodes.length; i++){
                codeValSelected[inputcodes[i].value] =  odb2hash[inputcodes[i].value];
            }
            var counter = 1;
            for(var ele in codeValSelected){
                var tr = document.createElement('tr');
                var numNodetd = document.createElement('td');
                numNodetd.innerHTML = counter;
                var codeNodetd = document.createElement('td');
                codeNodetd.innerHTML = ele;
                var descriptionNodetd = document.createElement('td');
                descriptionNodetd.innerHTML = codeValSelected[ele];
                tr.appendChild(numNodetd);
                tr.appendChild(codeNodetd);
                tr.appendChild(descriptionNodetd);
                tbody.appendChild(tr);
            }
            document.getElementById('make').innerHTML = document.getElementById('inputmake').value;
            document.getElementById('model').innerHTML = document.getElementById('inputmodel').value;
            document.getElementById('year').innerHTML = document.getElementById('inputyear').value;
            document.getElementById('mileage').innerHTML = document.getElementById('inputmileage').value;
            document.getElementById('color').innerHTML = document.getElementById('inputcolor').value;
            document.getElementById('additional_comment').innerHTML = document.getElementById('commentinput').value;
            /*for(var a in codeValSelected){
             console.log(codeValSelected[a]);
             }*/
        }
    });
    var clientlist = document.getElementById('clientlist').children;
    for(var j = 0; j < clientlist.length; j++){
        clientlist[j].addEventListener('click', function(){
            var appointmentTarget = appointmentsethash[this.dataset.client_email];
            document.getElementById('owner').dataset.sign_up_email = appointmentTarget.sign_up_email;
            document.getElementById('client_name').innerHTML = appointmentTarget.sign_up_last_name + ", " + appointmentTarget.sign_up_first_name;
            document.getElementById('owner').innerHTML = appointmentTarget.sign_up_first_name + ", " + appointmentTarget.sign_up_last_name;
            document.getElementById('reportform').dataset.target = appointmentTarget.sign_up_email;
            document.getElementById('date').innerHTML = appointmentTarget.time;
        });

    }
    document.getElementById('send_report').addEventListener('click', function(event){
        var report = {};

        report['htmlcontent'] = document.getElementById('reportcontentplace').innerHTML;
        report['sign_up_email'] = document.getElementById('owner').dataset.sign_up_email;
        report['time'] = document.getElementById('date').innerHTML;
        console.log(report.sign_up_email);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/machanic/proceedAppointment' );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('readystatechange', function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                var obj = JSON.parse(xhr.responseText);
                console.log(obj);
            }
        });
        xhr.send(JSON.stringify(report));

    });

});
