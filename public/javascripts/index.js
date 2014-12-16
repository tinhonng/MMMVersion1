var addButton = document.getElementById('add-button');
document.getElementById("sign_up_btn").addEventListener('click', function(event){
   event.preventDefault();
   var errorTag = document.getElementById('errorTag');
   errorTag.innerHTML = "";
   var sign_up_info = getSignUpInfo();
    /*for(var ele in sign_up_info){
     console.log(ele);
     }*/
   var xhr = new XMLHttpRequest();
   xhr.open('post', '/users/sign_up');
   xhr.setRequestHeader('Content-Type', 'application/json');
   xhr.addEventListener('readystatechange', function(){
      if(xhr.status === 500 && xhr.readyState === 4){
          var data = JSON.parse(xhr.responseText);
          if(data.message === "input error") {
              var unorderList = document.createElement('ul');
              for(var ele in data.details){
                  var list = document.createElement('li');
                  list.innerHTML = data.details[ele];
                  unorderList.appendChild(list);
              }
              errorTag.appendChild(unorderList);
          }
      }
   });
   xhr.send(JSON.stringify(sign_up_info));


});


function getSignUpInfo(){
    var sign_up_info = {};
    sign_up_info["sign_up_form"] = document.getElementById('sign_up_form').value;
    sign_up_info["sign_up_first_name"] = document.getElementById('sign_up_first_name').value;
    sign_up_info["sign_up_last_name"] = document.getElementById('sign_up_last_name').value;
    sign_up_info["sign_up_email"] = document.getElementById('sign_up_email').value;
    sign_up_info["sign_up_password"] = document.getElementById('sign_up_password').value;
    sign_up_info["sign_up_re_password"] = document.getElementById('sign_up_re_password').value;
    sign_up_info["sign_up_birthday_date"] = document.getElementById('sign_up_birthday_date').value;
    var sexArr = document.getElementsByName('sex');
    sign_up_info["sign_up_gender"] = "";
    for(var i=0; i < sexArr.length; i++){
        if(sexArr[i].checked===true)
            sign_up_info["sign_up_gender"] = sexArr[i].value;
    }
    /*for(var ele in sign_up_info){
        console.log(ele);
    }*/
    document.getElementById('sign_up_form').reset();
    return sign_up_info;
}



