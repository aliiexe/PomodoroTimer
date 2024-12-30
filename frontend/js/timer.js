const user = JSON.parse(localStorage.getItem("user")) || {};
if (user._id) {
  console.log("User:", user._id);
} else {
  window.location.href = "index.html";
  console.log("User not logged in");
}

const API_BASE_URL = "http://localhost:5000/api";

let timerInterval;
let isRunning = false;
let studyTime = 25;
let restTime = 5;
let cyclesPlanned = 1;
let cyclesCompleted = 0;
let breakAfter = 0;
let currentSessionType = "focus";
let remainingTime = studyTime * 60;
let notificationsEnabled = false;
let goalId = null;

const timerDisplay = document.getElementById("timer-display");
const cycleInfo = document.getElementById("cycle-info");
const startPauseButton = document.getElementById("start-pause-btn");
const quitButton = document.getElementById("quit-btn");
const goalDisplay = document.getElementById("goal-display");
const notificationsOnButton = document.getElementById("notifications-on");
const notificationsOffButton = document.getElementById("notifications-off");
const quitModal = document.getElementById("quit-modal");
const cancelQuitButton = document.getElementById("cancel-quit");
const confirmQuitButton = document.getElementById("confirm-quit");

function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startPauseButton.textContent = "Start";
  console.log("Timer paused");
}

function toggleStartPause() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

async function startTimer() {
  if (isRunning) return;
  isRunning = true;

  console.log("Timer started");

  goalDisplay.classList.remove("hidden");
  cycleInfo.classList.remove("hidden");

  startPauseButton.textContent = "Pause";

  const goalName = document.getElementById("goal-name").value;
  let goal = document.getElementById("goal-name");
  goal.value = "";
  if (goalName && !goalId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/goals`, {
        userId: user._id,
        title: goalName,
        targetStudyTime: studyTime * cyclesPlanned * 60,
      });
      goalId = response.data._id;
      goalDisplay.textContent = goalName;
      console.log("Goal created:", goalName);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  }

  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      handleSessionCompletion();
    }
  }, 1000);
}

async function quitTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingTime = studyTime * 60;
  updateTimerDisplay();
  cyclesCompleted = 0;
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;
  goalDisplay.classList.add("hidden");
  cycleInfo.classList.add("hidden");
  quitModal.classList.add("hidden");

  console.log("Timer quit");

  try {
    await axios.post(`${API_BASE_URL}/productivity`, {
      userId: user._id,
      totalStudyTime: cyclesCompleted * studyTime * 60,
      totalRestTime: cyclesCompleted * restTime * 60,
      sessionsCompleted: 0,
      sessionsAbandoned: 1,
      streak: 0,
      bestStreak: 0,
      createdAt: new Date(),
    });
    console.log("Productivity stats updated");
  } catch (error) {
    console.error("Error updating productivity:", error);
  }
}

// async function handleSessionCompletion() {
//   if (notificationsEnabled) {
//     playNotificationSound();
//   }

//   if (currentSessionType === "focus") {
//     console.log(`Focus session completed. Cycles completed: ${cyclesCompleted}`);
//     if (cyclesCompleted % breakAfter === 0 && cyclesCompleted !== cyclesPlanned) {
//       currentSessionType = "break";
//       remainingTime = restTime * 60;
//       console.log("Starting short break");
//     } else {
//       currentSessionType = "break";
//       remainingTime = restTime * 60;
//       console.log("Starting short break");
//     }
//   } else {
//     cyclesCompleted++;
//     currentSessionType = "focus";
//     remainingTime = studyTime * 60;
//     console.log("Starting focus session");
//   }

//   // Update cycle info at the beginning of each cycle
//   cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

//   if (cyclesCompleted >= cyclesPlanned) {
//     try {
//       const userResponse = await axios.get(`${API_BASE_URL}/users/${user._id}`);
//       const userData = userResponse.data; // Use a different variable name
//       const lastSessionDate = userData.lastSessionDate ? new Date(userData.lastSessionDate) : null;
//       const currentDate = new Date();
//       const isConsecutiveDay = lastSessionDate && (currentDate - lastSessionDate) / (1000 * 60 * 60 * 24) === 1;

//       let streak = userData.streak;
//       let bestStreak = userData.bestStreak;

//       if (isConsecutiveDay) {
//         streak++;
//       } else {
//         streak = 1;
//       }

//       if (streak > bestStreak) {
//         bestStreak = streak;
//       }

//       await axios.post(`${API_BASE_URL}/productivity`, {
//         userId: user._id,
//         totalStudyTime: cyclesCompleted * studyTime * 60,
//         totalRestTime: cyclesCompleted * restTime * 60,
//         sessionsCompleted: 1,
//         sessionsAbandoned: 0,
//         streak,
//         bestStreak,
//       });
//       console.log("Productivity stats updated");

//       await axios.put(`${API_BASE_URL}/users/${user._id}`, {
//         lastSessionDate: currentDate,
//         streak,
//         bestStreak,
//       });

//       if (goalId) {
//         await axios.put(`${API_BASE_URL}/goals/${goalId}`, {
//           progress: cyclesCompleted * studyTime * 60,
//           status: "completed",
//         });
//         console.log("Goal progress updated");
//       }

//       const productivityResponse = await axios.get(`${API_BASE_URL}/productivity?userId=${user._id}`);
//       const productivityEntries = productivityResponse.data;
//       const isFirstSession = productivityEntries.length === 1;

//       let rewardId;
//       if (isFirstSession) {
//         rewardId = '67717d319594a1dae10556b1';
//       } else if (productivityEntries.length === 25) {
//         rewardId = '6771cbc74e7860685cb8a5e7';
//       } else if (productivityEntries.length === 5) {
//         rewardId = '6771cbde4e7860685cb8a5e9';
//       } else if (productivityEntries.length === 10) {
//         rewardId = '6771cbec4e7860685cb8a5eb';
//       } else {
//         rewardId = null;
//       }

//       if (rewardId) {
//         await axios.put(`${API_BASE_URL}/users/${user._id}/rewards/${rewardId}`);
//         console.log("Reward assigned:", rewardId);
//       } else {
//         console.log("No reward assigned for this session count.");
//       }

//       // Reset and hide elements
//       resetTimer();
//     } catch (error) {
//       console.error("Error updating productivity or goal:", error);
//     }
//   } else {
//     updateTimerDisplay();
//     startTimer();
//   }
// }

async function handleSessionCompletion() {
  if (notificationsEnabled) {
    playNotificationSound();
  }

  if (currentSessionType === "focus") {
    console.log(`Focus session completed. Cycles completed: ${cyclesCompleted}`);
    if (cyclesCompleted % breakAfter === 0 && cyclesCompleted !== cyclesPlanned) {
      currentSessionType = "break";
      remainingTime = restTime * 60;
      console.log("Starting short break");
    } else {
      currentSessionType = "break";
      remainingTime = restTime * 60;
      console.log("Starting short break");
    }
  } else {
    cyclesCompleted++;
    currentSessionType = "focus";
    remainingTime = studyTime * 60;
    console.log("Starting focus session");
  }

  // Update cycle info at the beginning of each cycle
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

  if (cyclesCompleted >= cyclesPlanned) {
    try {
      const userResponse = await axios.get(`${API_BASE_URL}/users/${user._id}`);
      const userData = userResponse.data; // Use a different variable name
      const lastSessionDate = userData.lastSessionDate ? new Date(userData.lastSessionDate) : null;
      const currentDate = new Date();
      const isConsecutiveDay = lastSessionDate && (currentDate - lastSessionDate) / (1000 * 60 * 60 * 24) === 1;

      let streak = userData.streak || 0;
      let bestStreak = userData.bestStreak || 0;

      if (isConsecutiveDay) {
        streak++;
      } else {
        streak = 1;
      }

      if (streak > bestStreak) {
        bestStreak = streak;
      }

      await axios.post(`${API_BASE_URL}/productivity`, {
        userId: user._id,
        totalStudyTime: cyclesCompleted * studyTime * 60,
        totalRestTime: cyclesCompleted * restTime * 60,
        sessionsCompleted: 1,
        sessionsAbandoned: 0,
        streak,
        bestStreak,
      });
      console.log("Productivity stats updated");

      await axios.put(`${API_BASE_URL}/users/${user._id}`, {
        lastSessionDate: currentDate,
        streak,
        bestStreak,
      });

      if (goalId) {
        await axios.put(`${API_BASE_URL}/goals/${goalId}`, {
          progress: cyclesCompleted * studyTime * 60,
          status: "completed",
        });
        console.log("Goal progress updated");
      }

      const productivityResponse = await axios.get(`${API_BASE_URL}/productivity?userId=${user._id}`);
      const productivityEntries = productivityResponse.data;
      const isFirstSession = productivityEntries.length === 1;

      let rewardId;
      let rewardMessage = "You completed your focus session and goal!";
      let rewardImage = "";

      if (isFirstSession) {
        rewardId = '67717d319594a1dae10556b1';
        rewardMessage = "First Session Badge";
        rewardImage = "assets/images/badge1.png";
      } else if (productivityEntries.length === 25) {
        rewardId = '6771cbc74e7860685cb8a5e7';
        rewardMessage = "First 25 Mins Session Complete";
        rewardImage = "assets/images/badge2.png";
      } else if (productivityEntries.length === 5) {
        rewardId = '6771cbde4e7860685cb8a5e9';
        rewardMessage = "5 Sessions Completed";
        rewardImage = "assets/images/badge3.png";
      } else if (productivityEntries.length === 10) {
        rewardId = '6771cbec4e7860685cb8a5eb';
        rewardMessage = "10 Sessions Completed";
        rewardImage = "assets/images/badge4.png";
      } else {
        rewardId = null;
      }

      if (rewardId) {
        await axios.put(`${API_BASE_URL}/users/${user._id}/rewards/${rewardId}`);
        console.log("Reward assigned:", rewardId);
        showToast(rewardMessage, rewardImage);
      } else {
        showToast("You completed your focus session and goal!", "assets/images/check.gif");
        console.log("No reward assigned for this session count.");
      }

      // Reset and hide elements
      resetTimer();
    } catch (error) {
      console.error("Error updating productivity or goal:", error);
      showToast("An error occurred while updating productivity or goal.", "assets/images/error.png");
    }
  } else {
    updateTimerDisplay();
    startTimer();
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  studyTime = 25;
  restTime = 5;
  cyclesPlanned = 1;
  cyclesCompleted = 0;
  breakAfter = 0;
  currentSessionType = "focus";
  remainingTime = studyTime * 60;
  notificationsEnabled = false;
  goalId = null;

  goalDisplay.classList.add("hidden");
  cycleInfo.classList.add("hidden");
  startPauseButton.textContent = "Start";
  updateTimerDisplay();
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;
}

function adjustValue(type, operation) {
  let element, value;
  switch (type) {
    case "focus":
      element = document.getElementById("focus-time");
      value = studyTime;
      break;
    case "break":
      element = document.getElementById("break-time");
      value = restTime;
      break;
    case "cycles":
      element = document.getElementById("cycles");
      value = cyclesPlanned;
      break;
    case "breakAfter":
      element = document.getElementById("break-after");
      value = breakAfter;
      break;
  }

  if (operation === "+") {
    value++;
  } else if (operation === "-") {
    value = value > 1 ? value - 1 : 1;
  }

  element.textContent = value;

  switch (type) {
    case "focus":
      studyTime = value;
      remainingTime = studyTime * 60;
      break;
    case "break":
      restTime = value;
      break;
    case "cycles":
      cyclesPlanned = value;
      break;
    case "breakAfter":
      breakAfter = value;
      break;
  }
}

function playNotificationSound() {
  const audio = new Audio("../assets/sounds/notif.mp3");
  audio.play();
  console.log("Notification sound played");
}

startPauseButton.addEventListener("click", toggleStartPause);
quitButton.addEventListener("click", () => quitModal.classList.remove("hidden"));
cancelQuitButton.addEventListener("click", () => quitModal.classList.add("hidden"));
confirmQuitButton.addEventListener("click", quitTimer);
notificationsOnButton.addEventListener("click", () => {
  notificationsEnabled = true;
  notificationsOnButton.classList.add("btn-purple");
  notificationsOnButton.classList.remove("bg-gray-200", "text-gray-600");
  notificationsOffButton.classList.add("bg-gray-200", "text-gray-600");
  notificationsOffButton.classList.remove("btn-purple");
  console.log("Notifications enabled");
});
notificationsOffButton.addEventListener("click", () => {
  notificationsEnabled = false;
  notificationsOffButton.classList.add("btn-purple");
  notificationsOffButton.classList.remove("bg-gray-200", "text-gray-600");
  notificationsOnButton.classList.add("bg-gray-200", "text-gray-600");
  notificationsOnButton.classList.remove("btn-purple");
  console.log("Notifications disabled");
});

updateTimerDisplay();
cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function showToast(message, imageUrl) {
  const toast = document.getElementById('toast');
  const toastImage = document.getElementById('toast-image');
  const toastMessage = document.getElementById('toast-message');

  toastMessage.textContent = message;
  toastImage.src = imageUrl;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000); // Show the toast for 5 seconds
}