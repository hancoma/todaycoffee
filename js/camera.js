
 function getImage() {

        // Retrieve image file location from specified source
        navigator.camera.getPicture(uploadPhoto, function(message) {

alert('get picture failed');
},{
quality: 50,
destinationType: navigator.camera.DestinationType.FILE_URI,
sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
});
}
    function uploadPhoto(imageURI) {
    
        var options = new FileUploadOptions();
        options.fileKey="profile_image";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";
 var uuid = device.uuid;
        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        params.uuid = uuid;
        params.link=link;
        

        options.params = params;
        options.chunkedMode = false;
   
        var ft = new FileTransfer();
        navigator.notification.activityStart("RococoPhoto", "Uploading...");
        ft.upload(imageURI, "http://m.rococophoto.net/upload.php", win, fail, options);
    }

    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
   
        navigator.notification.activityStop();
    }

    function fail(error) {
        navigator.notification.activityStop();

    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
