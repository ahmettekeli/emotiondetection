require("regenerator-runtime");
const initPieChart = require("./chart");
const helper = require("./helper");
const FaceDetection = require("./FaceDetectionManager");

const video = document.getElementById("video"),
  loadingText = document.getElementById("loadingText"),
  spinner = document.getElementById("spinner"),
  startBtn = document.getElementById("startBtn"),
  fdManager = new FaceDetection(faceapi),
  eventEmitter = fdManager.eventEmitter;

let isPlaying = false;

const captureEmotion = async () => {
    //do something with emotion data
    fdManager.captureEmotionFromVideoContinuous(video, (emotions) => {
      initPieChart(emotions);
      helper.setEmotionEmoji(emotions);
    });
  },
  init = () => {
    fdManager.startVideo();
    fdManager.loadModels();

    eventEmitter.on("onModelLoad", () => {
      onModelReady();
    });

    startBtn.onclick = () => {
      if (!isPlaying) {
        captureEmotion();
        isPlaying = true;
      }
    };
  },
  onModelReady = () => {
    fdManager.hide(loadingText);
    fdManager.hide(spinner);
    startBtn.disabled = false;
  };

init();

//TODO:

// github logo with the repo's url
// delete Jekyll config
// add fonts and some explanatory texts
// add title logo
//
