const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");
const alertSound = document.getElementById("alertSound");

const oldAgeLines = [
  "Estimated Age: 83.5 saal 😳",
  "👵 Dadi maa mode activated",
  "AI Result: Ye photo 1952 ki lagti hai",
  "Wrinkle Level: OVER 9000!",
  "Face Match: Rukhsana Dadi from PTV classics",
  "Suggested Activity: Knitting aur chai 🍵",
  "Detected: Missing dentures 😬",
  "Recommendation: Pension apply karo beta!",
  "Age Detected: Tareekh-e-Purani se bhi purani",
  "System Note: Walking stick ready kar lo",
  "Detected Background: Old Age Home 😭",
  "Baal Analysis: White detected x100 strands",
  "AI Confused: Kya ye Mughal era ki photo hai?",
  "Alert: Slow motion detected while blinking",
  "Retro Filter Removed: Still looks purani",
  "Memory Detected: Bhagat Singh ke zamane ki",
  "AI Result: Birthday guessed - 1921 🎂",
  "Emotion: Khud ko jawaan samajhne wali dadi 😎",
  "Face ID: Not found in post-2000 database",
  "Scan Result: Body 2025, soul 1925"
];

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (!file) return;

  const fileName = file.name.toLowerCase();

  // Check if it's sister.jpg
  if (fileName.includes("sister")) {
    // Play sound
    alertSound.play();

    // Pick a random line
    const randomIndex = Math.floor(Math.random() * oldAgeLines.length);
    const randomLine = oldAgeLines[randomIndex];

    resultDiv.textContent = randomLine;
  } else {
    resultDiv.textContent = "Scan successful. No age issues detected! ✅";
  }
});
