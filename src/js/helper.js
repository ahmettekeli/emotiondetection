const emojiHolder = document.getElementById("emojiHolder");
const emotion_states = Object.freeze({
  HAPPY: "&#128522",
  SAD: "&#128577",
  ANGRY: "&#128545",
  SURPRISED: "&#128559",
  DISGUSTED: "&#129314",
  NEUTRAL: "&#128528",
});

const setEmotionEmoji = (emotions) => {
    let dominantEmotion = Object.keys(emotions).reduce((a, b) => {
      return emotions[a] > emotions[b] ? a : b;
    });
    for (property in emotion_states) {
      if (property.toLowerCase() == dominantEmotion) {
        emojiHolder.innerHTML = emotion_states[property];
      }
    }
  },
  convertEmotionData = (data) => {
    let fixedData = [];
    for (let index = 0; index < Object.keys(data).length; index++) {
      fixedData.push({
        name: Object.keys(data)[index],
        value: Object.values(data)[index] * 100,
      });
    }
    return fixedData;
  };

module.exports = { setEmotionEmoji, convertEmotionData };
