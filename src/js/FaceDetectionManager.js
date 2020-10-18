const EventEmitter = require("./EventManager");

class FaceDetectionManager {
  constructor(faceapi) {
    this.faceapi = faceapi;
    this._eventEmitter = new EventEmitter().eventEmitter;
  }

  get eventEmitter() {
    return this._eventEmitter;
  }

  startVideo() {
    const constraints = {
      audio: true,
      video: {},
    };
    if (typeof navigator.mediaDevices === "undefined") {
      navigator.mediaDevices = {};
    }
    if (typeof navigator.mediaDevices.getUserMedia === "undefined") {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(initSuccess)
      .catch(function (err) {
        console.log("medidevices error happened", err);
      });

    //Starting media stream (camera)
    function initSuccess(requestedStream) {
      // Older browsers may not have srcObject
      if ("srcObject" in video) {
        video.srcObject = requestedStream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = () => {
        video.play();
      };
    }
  }

  loadModels() {
    Promise.all([
      this.faceapi.nets.tinyFaceDetector.loadFromUri("../FaceAPI_Models"),
      this.faceapi.nets.faceLandmark68Net.loadFromUri("../FaceAPI_Models"),
      this.faceapi.nets.faceRecognitionNet.loadFromUri("../FaceAPI_Models"),
      this.faceapi.nets.faceExpressionNet.loadFromUri("../FaceAPI_Models"),
      this.faceapi.nets.ageGenderNet.loadFromUri("../FaceAPI_Models"),
    ]).then(() => {
      this.eventEmitter.emit("onModelLoad");
    });
  }

  async captureEmotionFromPic(video) {
    const detections = await this.faceapi
      .detectAllFaces(video, new this.faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    let emotions, emotion;
    if (detections.length > 0) {
      emotions = detections[0].expressions;
      emotion = Object.keys(emotions).reduce((a, b) => {
        return emotions[a] > emotions[b] ? a : b;
      });
    }
    return emotion;
  }

  async captureEmotionFromVideoOnce(video) {
    return this.captureEmotionFromPic(video);
  }

  async captureEmotionFromVideoContinuous(video, callback) {
    let detections, emotions /*, emotion*/;
    const displaySize = {
      width: video.offsetWidth,
      height: video.offsetHeight,
    };
    this.faceapi.matchDimensions(video, displaySize);

    async function startDetecting(faceapi) {
      detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      if (detections[0] !== undefined) {
        emotions = detections[0].expressions;
        /* 
        // returns only the dominant emotion
        emotion = Object.keys(emotions).reduce((a, b) => {
          return emotions[a] > emotions[b] ? a : b;
        });
        callback(emotion); 
        */
        callback(emotions);
      } else {
        cancelAnimationFrame(startDetecting.bind(this, faceapi));
      }
      requestAnimationFrame(startDetecting.bind(this, faceapi));
    }
    startDetecting(this.faceapi);
  }

  getOrientation() {
    // if (window.orientation === 90 || window.orientation === -90) {
    if (window.matchMedia("(orientation: landscape)").matches) {
      return "landscape";
    }
    return "portrait";
  }

  reloadPage() {
    window.location.reload();
  }

  hide(component) {
    component.style.display = "none";
    component.setAttribute("style", "display:none");
  }
  show(component) {
    component.style.display = "";
    component.setAttribute("style", "display:block");
  }
}
module.exports = FaceDetectionManager;
