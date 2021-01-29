//Create an account on Firebase, and use the credentials they give you in place of the following
var config = {
    apiKey: "AIzaSyAOEtQ39w34BmdgRkUuH9wlfbGLLgSQWUQ",
    authDomain: "vigilante-casa.firebaseapp.com",
    projectId: "vigilante-casa",
    storageBucket: "vigilante-casa.appspot.com",
    messagingSenderId: "371618449193",
    appId: "1:371618449193:web:8011780a478cf9da8e5938",
    measurementId: "G-GGMP4862L8"
};
firebase.initializeApp(config);
firebase.analytics();

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
console.log(yourVideo);
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
// var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'Glados101','username': 'vigilantecasas@gmail.com'}]};
// var pc = new RTCPeerConnection(servers);
// pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
// pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

// function sendMessage(senderId, data) {
//     var msg = database.push({ sender: senderId, message: data });
//     msg.remove();
// }

// function readMessage(data) {
//     var msg = JSON.parse(data.val().message);
//     var sender = data.val().sender;
//     if (sender != yourId) {
//         if (msg.ice != undefined)
//             pc.addIceCandidate(new RTCIceCandidate(msg.ice));
//         else if (msg.sdp.type == "offer")
//             pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
//               .then(() => pc.createAnswer())
//               .then(answer => pc.setLocalDescription(answer))
//               .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
//         else if (msg.sdp.type == "answer")
//             pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
//     }
// };

// database.on('child_added', readMessage);


function createVideoElement(count){
    var videoElement = document.createElement("video", {});
    videoElement.id = "camVideo"+count;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;

    return videoElement;
}


async function completeTransmisionProcess() {

    // Obtains all the available cameras of the device 
    const cameras = await getConnectedDevices("videoinput");

    // Gets the <p> element to display the lenght of the camera array and
    // later the deviceId of each camera.
    const cameraDebugText = document.getElementById("camerasResult");
    cameraDebugText.innerHTML = "Cameras Disponibles:" + cameras.length;

    // The array contains the <video> elements for each available camera
    // and the camera index is an aux variable to be used and modified only
    // inside the mediaDevices thread.
    let camerasDisplays = [];
    let cameraIndex = 0;

    if (cameras && cameras.length > 0) {
        // Goes through all cameras to stream them and display them in screen for debugging
      for(let i=0; i < cameras.length; i++){
        const ii=i;
        // Here the deviceId is added to the <p> element responsible of showing
        // camera debugg info.
        cameraDebugText.innerHTML += "<br/>Label " + i + ': ' + cameras[ii].deviceId;

        // Creates the <video> element to display the camera (just for debbuging porpouse)
        var tempVideoElement = createVideoElement(i);

        // Adds the video element to the container
        document.getElementById("videosContainer").appendChild(tempVideoElement);
        tempVideoElement = document.getElementById("camVideo"+i);
        camerasDisplays.push(tempVideoElement);
        
        // Start the mediaDevices thread in which the camera is selected through the deviceId
        // and is linked to the stream (for debugging it is also added to the screen display)
        navigator.mediaDevices.getUserMedia({audio:true, video:{'deviceId':cameras[ii].deviceId}})
        .then(stream => {camerasDisplays[cameraIndex].srcObject = stream; cameraIndex++;});
        //.then(stream => pc.addStream(stream));
      }


    }

}

// function showFriendsFace() {
//   pc.createOffer()
//     .then(offer => pc.setLocalDescription(offer) )
//     .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
// }

async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}
