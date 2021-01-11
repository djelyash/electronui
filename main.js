const { nanoid } = require("nanoid");
var frameRate = 30;
var currentImage = undefined;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

var fileNameCounter=0;
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
var nextFrameTime = 0;

let win

function writeImage() {
  if(currentImage && nextFrameTime <= Date.now()) {
    console.log("write new file " + Date.now());
    //fs.writeFileSync( 'img.' + (fileNameCounter%4000).pad(4) + '.png', currentImage);
    //fileNameCounter++;
    //nextFrameTime+=33;
  }
}

//app.disableHardwareAcceleration();
app.whenReady().then(() => {
  win = new BrowserWindow({width: 1080,height: 720, webPreferences: { offscreen: true,contextIsolation: true } })
  win.webContents.on('paint', (event, dirty, image) => {
    if(!currentImage){
        nextFrameTime = Date.now();
    } 
    currentImage = image.toPNG();
    console.log("get new image")
    fs.writeFileSync( 'img.' + (fileNameCounter%4000).pad(4) + '.png', currentImage);
    fileNameCounter++;
    nextFrameTime+=33;

  })
  win.webContents.setFrameRate(frameRate);
  setInterval(writeImage, 10);
  win.loadURL("https://www.kan.org.il/live/tv.aspx?stationid=2");
}) 


