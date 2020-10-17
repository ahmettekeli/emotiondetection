require("regenerator-runtime");
const FaceDetection = require("./FaceDetectionManager");

const video = document.getElementById("video"),
  fdManager = new FaceDetection(faceapi),
  eventEmitter = fdManager.eventEmitter,
  loadingText = document.getElementById("loadingText"),
  spinner = document.getElementById("spinner"),
  startBtn = document.getElementById("startBtn");

const captureEmotion = async () => {
    // // do something with emotion data
    // const emotion = await fdHelper.captureEmotionFromPic(video);
    // console.log('emotion:', emotion);

    //do something with emotion data
    fdManager.captureEmotionFromVideoContinuous(video, (emotions) => {
      console.log("current emotion logs from index:", emotions);
    });

    // //do something with emotion data
    // const emotion = await fdHelper.captureEmotionFromVideoOnce(video);
    // console.log('emotion:', emotion);
  },
  onModelReady = () => {
    fdManager.hide(loadingText);
    fdManager.hide(spinner);
    startBtn.disabled = false;
  },
  init = () => {
    fdManager.loadModels();

    eventEmitter.on("onModelLoad", () => {
      onModelReady();
    });

    startBtn.onclick = () => {
      fdManager.startVideo(captureEmotion);
    };
  };

init();
