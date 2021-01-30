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
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
let cameraIndex = 0;

//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'Glados101','username': 'vigilantecasas@gmail.com'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => {cameraIndex++; doCompleteTransmisionProcess(event.stream, cameraIndex-1);} /*friendsVideo.srcObject = event.stream*/);

function sendMessage(senderId, data) {
    var msg = database.push({ sender: senderId, message: data });
    msg.remove();
}

function readMessage(data) {
    console.log("Recived change");
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    console.log(sender);
    if (sender != yourId && sender != "call") {
        if (msg.ice != undefined){
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
            console.log("Undefined ice");}
        else if (msg.sdp.type == "offer"){
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
              .then(() => pc.createAnswer())
              .then(answer => pc.setLocalDescription(answer))
              .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
              console.log("Type equal to offer");}
        else if (msg.sdp.type == "answer"){
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            console.log("Type equal to answer");
        }
    }
};

database.on('child_added', readMessage);


function createVideoElement(count){
    var videoElement = document.createElement("video", {});
    videoElement.id = "camVideo"+count;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;

    return videoElement;
}


async function doCompleteTransmisionProcess(stream, cameraIndex) {
    console.log("Si entre champ");

    var tempVideoElement = createVideoElement(cameraIndex);
    document.getElementById("videosContainer").appendChild(tempVideoElement);
    tempVideoElement = document.getElementById("camVideo"+cameraIndex);

    tempVideoElement.srcObject = stream;

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

function askForConnection(){
    sendMessage("call", JSON.stringify({'dummy': 0}))
}