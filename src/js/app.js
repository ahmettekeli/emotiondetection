require("regenerator-runtime");
import initPieChart from "./chart";
const FaceDetection = require("./FaceDetectionManager");

const video = document.getElementById("video"),
  loadingText = document.getElementById("loadingText"),
  spinner = document.getElementById("spinner"),
  startBtn = document.getElementById("startBtn"),
  fdManager = new FaceDetection(faceapi),
  eventEmitter = fdManager.eventEmitter;

let isPlaying = false;

const captureEmotion = async () => {
    // // do something with emotion data
    // const emotion = await fdHelper.captureEmotionFromPic(video);
    // console.log('emotion:', emotion);

    //do something with emotion data
    fdManager.captureEmotionFromVideoContinuous(video, (emotions) => {
      // console.log("emotions:", emotions);
      initPieChart(emotions);
    });

    // //do something with emotion data
    // const emotion = await fdHelper.captureEmotionFromVideoOnce(video);
    // console.log('emotion:', emotion);
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
