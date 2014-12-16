/**
 * Created by tinhonng on 12/5/14.
 */
document.addEventListener('DOMContentLoaded', function(){
    var schedulebtns = document.querySelectorAll('.schedule');
    Array.prototype.map.call(schedulebtns, function(ele){
       ele.addEventListener('click', function(){
           var target = {};
           var trow = this.parentElement.parentElement;
           target['sign_up_email'] = trow.dataset.sign_up_email;
           var xhr = new XMLHttpRequest();
              xhr.open('POST', '/admin/proceed');
              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.addEventListener('readystatechange', function(){
                  if(xhr.readyState === 4 && xhr.status === 200){
                    document.getElementById('tbody').removeChild(trow);
                  }
              });
              xhr.send(JSON.stringify(target));
        });
    });
});