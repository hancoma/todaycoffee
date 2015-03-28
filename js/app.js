





function successHandler (result) {
       
 //var div = document.getElementById('myDiv');
// div.innerHTML=result;

}

function errorHandler (error) {
   // var div = document.getElementById('myDiv');
 // div.innerHTML=error;
 alert("GCM error");
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    
}


function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}


function onNotificationGCM(e) {
    
    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
           
                   json_call(e.regid); //gcm 코드 저장
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
          
            var my_media = new Media("/android_asset/www/"+e.soundname);
            my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }
        }

        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}


function json_call(reg_id) {
      var reg_id=reg_id;
      var deviceid=device.uuid;
      // gcm reg_id 등록  
         $.post("http://m.rococophoto.net/gcm_reg_app.php",
   {
    reg_id:reg_id,
    deviceid:deviceid
   },
   function(data){
    var data;
    
   //  alert("ok");
   })
       } 


function left_menu() {
 
     $( document ).ready(function() {
                    $.post("http://m.rococophoto.net/left_menu.php",
               {
                   
                 
               },
               function(data){
                var data=data;
                 if (data) {
                        $("#menu").html(data);
                    }

                    
                      
                    
                });
     });
}

var deviceid;
var link;

function goHref(url) {
  var url=url;
  var uuid=device.uuid;
  url="http://m.rococophoto.net"+url+"&uuid="+uuid;
  var ref = window.open(url, '_blank', 'location=no');
  ref.addEventListener('loadstart', function(event) { 
    

        // 링크 주소 확인
        link=event.url;
        var result=link.indexOf('upload_file');
    
        // 파일 업로드 
        if(result>-1) {
            getImage_photo();
        }

        var result2=link.indexOf('goprofile');
          if(result2>-1) {
            var member=link.split("&");
            var cnt=member.length;
         
            var memberuid=member[cnt];

            ref.close();
            goprofile(memberuid);
        }

  });
}

function getpage(uuid,page) {
    // 외부 페이지 가져 오기 
        // uuid는 기기 번호 
    var uuid=uuid;
    var page=page;
    var url="http://m.rococophoto.net/"+page+".php";
 $.post(url,
   {
       
            uuid:uuid
   },
   function(data){
    var data=data;
     if (data) {
            $("#content").html(data);
        }

        
          
        
    });

}

function gopage (page) {
    var page=page;
    var uuid=device.uuid;  
    location.href=page+"&uuid="+uuid;
}


function goprofile (uid) {
      var uid=uid;
    var page=page;
    var uuid=device.uuid;  
    location.href="profile.html?uid="+uid+"&uuid="+uuid;
}

function check_uuid (deviceid) {
        var deviceid=deviceid;
                
        

                     $.post("http://m.rococophoto.net/check_uuid_app.php",
       {
                deviceid:deviceid
       },
       function(data){
        var data=data;
      
                if (data=='ok') {
                    gopage("around.html?ok=ok");
                } else {
                  
                show_login();
        
                }

        });


    
 }

  function logout() {
 
    navigator.notification.confirm(
    'Are you sure you want to log out?', // message
     onConfirm,            // callback to invoke with index of button pressed
    'Membership',           // title
    ['Logout','Cancel']     // buttonLabels
);
 }

function onConfirm(buttonIndex) {
    var uuid=device.uuid;
    var btn=buttonIndex;
    if (btn==1) {

      $.post("http://m.rococophoto.net/logout_app.php",
       {
                deviceid:uuid
       },
       function(data){
        var data=data;
           
              navigator.notification.alert(
                  'You have been signed out.',  // message
                  alertDismissed,         // callback
                  'Membership',            // title
                  'Done'                  // buttonName
              );
                
            }

        );
    }
}

 function alertDismissed() {
    // do something
    navigator.app.exitApp();
     // gopage("index.html?ok=ok");
}

function alert_msg(title,msg,btn) {
    // alert 대신 사용할 함수 
    var title=title;
    var msg=msg;
    var btn=btn;

      navigator.notification.alert(
                  msg,  // message
                  alertend,         // callback
                  title,            // title
                  btn                  // buttonName
              );


}
function alertend() {

}


function getImage_photo() {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(uploadPhoto_photo, function(message) {
alert('get picture failed');
},{
quality: 5,
destinationType: navigator.camera.DestinationType.FILE_URI,
sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
});}
    function uploadPhoto_photo(imageURI) {
      var deviceid=device.uuid;
        navigator.notification.activityStart("RococoPhoto", "uploading photo");
        var options = new FileUploadOptions();
        options.fileKey="profile_image";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        params.link=link;
        params.uuid=deviceid;

        options.params = params;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(imageURI, "http://m.rococophoto.net/upload_org.php", win_photo, fail, options);
    }

    function win_photo(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        navigator.notification.activityStop();
        alert(r.response);
    }
getLocation();
function getLocation()
  {

    if (navigator.geolocation)
    {

    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{
    alert("현 위치의 정보를 찾을수 없습니다.");
  }
  }
function showPosition(position)
  {

  var x=position.coords.latitude;
  var y=position.coords.longitude;
  var uuid=device.uuid;
 
  if (x) {
   $.post("http://m.rococophoto.net/gps_update_app.php",
   {
    y:y,
    x:x,
    uuid:uuid

      }, function(data){
    
      
   });
   }
  }
right_menu();

  function right_menu() {
     var deviceid=device.uuid;

 $( document ).ready(function() {

  $.post("http://m.rococophoto.net/right_menu_app.php",
   {
      deviceid:deviceid

      }, function(data){
        var data=data;
  
        var rightmenu_data=data.split('/');
        

        for ( var i in rightmenu_data ) {
          var right_m="rightmenu"+i;
          var contents= rightmenu_data[i];
        $("#"+right_m).html(contents);

      }


   });
 

   });

}


