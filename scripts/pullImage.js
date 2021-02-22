var database = firebase.database().ref('device1/');

// Init Canvas size and context to obtain properties and functions
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const percent = 0.4;
canvas.width = 640*percent;
canvas.height = 480*percent;


// Init scannedImage and scannedData used to have the base structure to
// modify it and rewrite the image on canvas.
const scannedImage = ctx.getImageData(0,0,canvas.width,canvas.height);
let scannedData = scannedImage.data;


// Obtains the firebase image
let imageBytes = [];


const updateImageBytes = (snapshot) => {
    //console.log("snapshot value:", snapshot.val());
    stringImage = snapshot.val().cam1.seg1.imageBytes;
    stringImage += snapshot.val().cam1.seg2.imageBytes;
    stringImage += snapshot.val().cam1.seg3.imageBytes;
    stringImage += snapshot.val().cam1.seg4.imageBytes;
    stringImage += snapshot.val().cam1.seg5.imageBytes;
    stringImage += snapshot.val().cam1.seg6.imageBytes;
    stringImage += snapshot.val().cam1.seg7.imageBytes;
    stringImage += snapshot.val().cam1.seg8.imageBytes;

    imageBytes = [...stringImage].map((charVal)=> charVal.charCodeAt(0));
    //console.log("ImageBytes new value:", imageBytes);

    // Loops though all the pixels asigning the value of the firebase image
    for(let i=0; i<scannedData.length; i+=4)
    {
        scannedData[i]=imageBytes[i/4];
        scannedData[i+1]=imageBytes[i/4];
        scannedData[i+2]=imageBytes[i/4];
        scannedData[i+3]=255;
    }
    //console.log(scannedData);
    scannedImage.data = scannedData;
    console.log(scannedImage);
    ctx.putImageData(scannedImage, 0, 0)
}

database.on('value', updateImageBytes);

    



function BlackWhiteContainerFill(){
    if(i < scannedData.length * (1 - 0.5) )
    {
        scannedData[i]=0;
        scannedData[i+1]=0;
        scannedData[i+2]=0;
        scannedData[i+3]=254;
    }
    else
    {
        const val = 254;
        scannedData[i]=val;
        scannedData[i+1]=val;
        scannedData[i+2]=val;
        scannedData[i+3]=254;
    }
}

console.log("FINISH");