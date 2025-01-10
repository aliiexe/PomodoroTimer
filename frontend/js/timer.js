// Get user data from localStorage
const user = JSON.parse(localStorage.getItem("user")) || {};
if (user._id) {
  console.log("User:", user._id);
} else {
  window.location.href = "index.html";
  console.log("User not logged in");
}

document.addEventListener('DOMContentLoaded', async () => {
  const userId = user._id;
  try {
    await updateStreak(userId);
  } catch (error) {
    console.error("Error initializing app:", error);
  }
});

// Define the base URL for the API
const API_BASE_URL = "http://localhost:5000/api";

// Define variables for the timer
let timerInterval;
let isRunning = false;
let studyTime = 25;
let restTime = 5;
let cyclesPlanned = 1;
let cyclesCompleted = 0;
let breakAfter = 0;
let currentSessionType = "focus";
let remainingTime = studyTime * 60;
let notificationsEnabled = true;
let goalId = null;

// Get DOM elements
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

// Update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startPauseButton.textContent = "Start";
  console.log("Timer paused");
}

// Toggle between starting and pausing the timer
function toggleStartPause() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

// Function to update the timer status display
const timerStatus = document.getElementById('timer-status');
function updateTimerStatus() {
  if (currentSessionType === "focus") {
    timerStatus.textContent = 'Focus Time 📖';
  } else if (currentSessionType === "break") {
    timerStatus.textContent = 'Break Time ☕';
  } else {
    timerStatus.textContent = `Session ${cyclesCompleted + 1}`;
  }
}

// Start the timer
async function startTimer() {
  if (isRunning) return;

  // Get the goal name from the input field
  const goalName = document.getElementById("goal-name").value;
  let goal = document.getElementById("goal-name");
  goal.value = "";
  if (!goalName && !goalId) {
    showToast("Please set a goal first.", "assets/images/no.gif");
    return;
  }

  // Start the timer
  isRunning = true;
  console.log("Timer started");

  // Show the goal name and cycle info
  goalDisplay.classList.remove("hidden");
  cycleInfo.classList.remove("hidden");
  timerStatus.classList.remove("hidden");

  // Update the start/pause button text
  startPauseButton.textContent = "Pause";

  // Create a new goal if the goal name is set and there is no goal ID
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

  // Update the cycle info at the beginning of each cycle
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

  // Update the timer status
  updateTimerStatus();

  // Start the timer interval
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

// Quit the timer
async function quitTimer() {
  // Reset the timer and hide elements
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

  // Update productivity stats
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

// Play notification sound
function playNotificationSound() {
  if (notificationsEnabled === true) {
    const audio = new Audio("assets/sounds/notif.mp3");
    audio.play();
    console.log("Notification sound played");
  }
}

// Play achievement sound
function playAchievementSound() {
  if (notificationsEnabled === true) {
    const audio = new Audio("assets/sounds/achievement.mp3");
    audio.play().then(() => {
      console.log("Achievement sound played");
    }).catch(error => {
      console.error("Error playing achievement sound:", error);
    });
  }else{
    console.log("Notifications are disabled");
  }
}

// Handle session completion
// async function handleSessionCompletion() {
  
//   // Check if the current session is a focus session
//   if (currentSessionType === "focus") {
//     console.log(`Focus session completed. Cycles completed: ${cyclesCompleted}`);
//     if (cyclesPlanned === 1) {
//       // Skip rest time if only one cycle is planned
//       cyclesCompleted++;
//       currentSessionType = "focus";
//       remainingTime = studyTime * 60;
//       restTime = 0;
//       console.log("Single cycle completed, skipping rest time");
//     } else if (cyclesCompleted % breakAfter === 0 && cyclesCompleted !== cyclesPlanned - 1) {
//       // Start a short break after the specified number of cycles, but not if it's the last cycle
//       currentSessionType = "break";
//       remainingTime = restTime * 60;
//       console.log("Starting short break");
//     } else {
//       // Start a short break after each focus session, but not if it's the last cycle
//       if (cyclesCompleted !== cyclesPlanned - 1) {
//         currentSessionType = "break";
//         remainingTime = restTime * 60;
//         console.log("Starting short break");
//       } else {
//         cyclesCompleted++;
//         currentSessionType = "focus";
//         remainingTime = studyTime * 60;
//         console.log("Starting focus session");
//       }
//     }
//   } else {
//     // Start a focus session after each break
//     cyclesCompleted++;
//     currentSessionType = "focus";
//     remainingTime = studyTime * 60;
//     console.log("Starting focus session");
//   }

//   // Update cycle info at the beginning of each cycle
//   cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

//   // Update productivity stats and goal progress after completing all cycles
//   if (cyclesCompleted >= cyclesPlanned) { // Check if all cycles are completed
//     try {
//       // Update productivity stats
//       const userResponse = await axios.get(`${API_BASE_URL}/users/${user._id}`);
//       const userData = userResponse.data; // Use a different variable name
//       const lastSessionDate = userData.lastSessionDate ? new Date(userData.lastSessionDate) : null;
//       const currentDate = new Date();
//       const isConsecutiveDay = lastSessionDate && (currentDate - lastSessionDate) / (1000 * 60 * 60 * 24) === 1;

//       // Update streak and best streak
//       let streak = userData.streak || 0;
//       let bestStreak = userData.bestStreak || 0;

//       if (isConsecutiveDay) {
//         streak++;
//       } else {
//         streak = 1;
//       }

//       if (streak > bestStreak) {
//         bestStreak = streak;
//       }

//       // Update productivity stats
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

//       // Update user data
//       await axios.put(`${API_BASE_URL}/users/${user._id}`, {
//         lastSessionDate: currentDate,
//         streak,
//         bestStreak,
//       });

//       // Update goal progress and status
//       if (goalId) {
//         await axios.put(`${API_BASE_URL}/goals/${goalId}`, {
//           progress: cyclesCompleted * studyTime * 60,
//           status: "completed",
//         });
//         console.log("Goal progress updated");
//       }

//       // Assign rewards based on productivity stats
//       const productivityResponse = await axios.get(`${API_BASE_URL}/productivity?userId=${user._id}`);
//       const productivityEntries = productivityResponse.data;
//       const isFirstSession = productivityEntries.length === 1;

//       // Define rewards based on productivity stats
//       let rewards = [];
//       // if it's the user's first session ever (no productivity entries exist) and 
//       // all cycles are completed as planned (no abandoned sessions) he gets a badge for the first session
//       if (isFirstSession) {
//         rewards.push({
//           id: '67717d319594a1dae10556b1',
//           message: "First Session Badge",
//           image: "assets/images/Badge1.png"
//         });
//       }
//       // if the user has completed 25 minutes of focus time and all cycles are completed as planned
//       // he gets a badge for completing the first 25 minutes session
//       if (productivityEntries.length === 25 && cyclesCompleted >= cyclesPlanned) {
//         rewards.push({
//           id: '6771cbc74e7860685cb8a5e7',
//           message: "First 25 Mins Session Complete",
//           image: "assets/images/Badge2.png"
//         });
//       }
//       // if the user has completed 5 sessions and all cycles are completed as planned
//       // he gets a badge for completing 5 sessions
//       if (productivityEntries.length === 5 && cyclesCompleted >= cyclesPlanned) {
//         rewards.push({
//           id: '6771cbde4e7860685cb8a5e9',
//           message: "5 Sessions Completed",
//           image: "assets/images/Badge3.png"
//         });
//       }
//       // if the user has completed 10 sessions and all cycles are completed as planned
//       // he gets a badge for completing 10 sessions
//       if (productivityEntries.length === 10 && cyclesCompleted >= cyclesPlanned) {
//         rewards.push({
//           id: '6771cbec4e7860685cb8a5eb',
//           message: "10 Sessions Completed",
//           image: "assets/images/Badge4.png"
//         });
//       }

//       // Reset the timer
//       resetTimer();

//       // Assign rewards to the user
//       for (const reward of rewards) {
//         try {
//           await axios.put(`${API_BASE_URL}/users/${user._id}/rewards/${reward.id}`);
//           playAchievementSound();
//           console.log("Reward assigned:", reward.id);
//           await showToastSequentially(reward.message, reward.image);
//         } catch (error) {
//           console.error("Error assigning reward:", error);
//         }
//       }

//       // If no rewards are assigned, show a message to the user saying that he completed his focus session and goal
//       if (rewards.length === 0) {
//         playNotificationSound();
//         showToast("You completed your focus session and goal!", "assets/images/check.gif");
//         console.log("No reward assigned for this session count.");
//       }

//     } catch (error) {
//       // if there's an error, log it to the console and show an error message to the user
//       console.error("Error updating productivity or goal:", error);
//       showToast("An error occurred while updating productivity or goal.", "assets/images/no.gif");
//     }
//   } else {
//     // If all cycles are not completed, update the timer display and start the timer again
//     playNotificationSound();
//     updateTimerDisplay();
//     startTimer();
//   }
// }

async function updateStreak(userId) {
  try {
    const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
    const userData = userResponse.data;
    const lastSessionDate = userData.lastSessionDate ? new Date(userData.lastSessionDate) : null;
    const currentDate = new Date();
    const isConsecutiveDay = lastSessionDate && (currentDate - lastSessionDate) / (1000 * 60 * 60 * 24) === 1;

    let streak = userData.streak || 0;
    let bestStreak = userData.bestStreak || 0;

    if (isConsecutiveDay) {
      streak++;
    } else {
      streak = 0;
    }

    if (streak > bestStreak) {
      bestStreak = streak;
    }

    await axios.put(`${API_BASE_URL}/users/${userId}`, {
      lastSessionDate: currentDate,
      streak,
      bestStreak,
    });

    console.log("Streak updated:", { streak, bestStreak });
    return { streak, bestStreak };
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
}

async function handleSessionCompletion() {
  // Check if the current session is a focus session
  if (currentSessionType === "focus") {
    console.log(`Focus session completed. Cycles completed: ${cyclesCompleted}`);
    if (cyclesPlanned === 1) {
      // Skip rest time if only one cycle is planned
      cyclesCompleted++;
      currentSessionType = "focus";
      remainingTime = studyTime * 60;
      restTime = 0;
      console.log("Single cycle completed, skipping rest time");
    } else if (cyclesCompleted % breakAfter === 0 && cyclesCompleted !== cyclesPlanned - 1) {
      // Start a short break after the specified number of cycles, but not if it's the last cycle
      currentSessionType = "break";
      remainingTime = restTime * 60;
      console.log("Starting short break");
    } else {
      // Start a short break after each focus session, but not if it's the last cycle
      if (cyclesCompleted !== cyclesPlanned - 1) {
        currentSessionType = "break";
        remainingTime = restTime * 60;
        console.log("Starting short break");
      } else {
        cyclesCompleted++;
        currentSessionType = "focus";
        remainingTime = studyTime * 60;
        console.log("Starting focus session");
      }
    }
  } else {
    // Start a focus session after each break
    cyclesCompleted++;
    currentSessionType = "focus";
    remainingTime = studyTime * 60;
    console.log("Starting focus session");
  }

  // Update cycle info at the beginning of each cycle
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;

  // Update productivity stats and goal progress after completing all cycles
  if (cyclesCompleted >= cyclesPlanned) { // Check if all cycles are completed
    try {
      // Update productivity stats
      const { streak, bestStreak } = await updateStreak(user._id);

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

      // Update goal progress and status
      if (goalId) {
        await axios.put(`${API_BASE_URL}/goals/${goalId}`, {
          progress: cyclesCompleted * studyTime * 60,
          status: "completed",
        });
        console.log("Goal progress updated");
      }

      // Assign rewards based on productivity stats
      const productivityResponse = await axios.get(`${API_BASE_URL}/productivity?userId=${user._id}`);
      const productivityEntries = productivityResponse.data;
      const isFirstSession = productivityEntries.length === 1;

      // Fetch user data to check existing rewards
      const userResponse = await axios.get(`${API_BASE_URL}/users/${user._id}`);
      const userData = userResponse.data;

      // Define rewards based on productivity stats
      let rewards = [];
      // if it's the user's first session ever (no productivity entries exist) and 
      // all cycles are completed as planned (no abandoned sessions) he gets a badge for the first session
      if (isFirstSession) {
        rewards.push({
          id: '67717d319594a1dae10556b1',
          message: "First Session Badge",
          image: "assets/images/Badge1.png"
        });
      }
      // if the user has completed 25 minutes of focus time and all cycles are completed as planned
      // he gets a badge for completing the first 25 minutes session
      const totalFocusTime = productivityEntries.reduce((acc, entry) => acc + entry.totalStudyTime, 0);
      const hasFirst25MinsReward = userData.rewards.includes('6771cbc74e7860685cb8a5e7');
      if (totalFocusTime >= 25 * 60 && cyclesCompleted >= cyclesPlanned && !hasFirst25MinsReward) {
        rewards.push({
          id: '6771cbc74e7860685cb8a5e7',
          message: "First 25 Mins Session Complete",
          image: "assets/images/Badge2.png"
        });
      }
      // if the user has completed 5 sessions and all cycles are completed as planned
      // he gets a badge for completing 5 sessions
      if (productivityEntries.length === 5 && cyclesCompleted >= cyclesPlanned) {
        rewards.push({
          id: '6771cbde4e7860685cb8a5e9',
          message: "5 Sessions Completed",
          image: "assets/images/Badge3.png"
        });
      }
      // if the user has completed 10 sessions and all cycles are completed as planned
      // he gets a badge for completing 10 sessions
      if (productivityEntries.length === 10 && cyclesCompleted >= cyclesPlanned) {
        rewards.push({
          id: '6771cbec4e7860685cb8a5eb',
          message: "10 Sessions Completed",
          image: "assets/images/Badge4.png"
        });
      }

      // Reset the timer
      resetTimer();

      // Assign rewards to the user
      for (const reward of rewards) {
        try {
          await axios.put(`${API_BASE_URL}/users/${user._id}/rewards/${reward.id}`);
          playAchievementSound();
          console.log("Reward assigned:", reward.id);
          await showToastSequentially(reward.message, reward.image);
        } catch (error) {
          console.error("Error assigning reward:", error);
        }
      }

      // If no rewards are assigned, show a message to the user saying that he completed his focus session and goal
      if (rewards.length === 0) {
        playNotificationSound();
        showToast("You completed your focus session and goal!", "assets/images/check.gif");
        console.log("No reward assigned for this session count.");
      }

    } catch (error) {
      // if there's an error, log it to the console and show an error message to the user
      console.error("Error updating productivity or goal:", error);
      showToast("An error occurred while updating productivity or goal.", "assets/images/no.gif");
    }
  } else {
    // If all cycles are not completed, update the timer display and start the timer again
    playNotificationSound();
    updateTimerDisplay();
    startTimer();
  }
}

// Show a toast notification with a message and an image
function showToastSequentially(message, imageUrl) {
  return new Promise((resolve) => {
    showToast(message, imageUrl);
    setTimeout(resolve, 5000); // Show the toast for 5 seconds before resolving the promise
  });
}

function showToastSequentially(message, imageUrl) {
  return new Promise((resolve) => {
    showToast(message, imageUrl);
    setTimeout(resolve, 5000); // Show the toast for 5 seconds before resolving the promise
  });
}

function showToastSequentially(message, imageUrl) {
  return new Promise((resolve) => {
    showToast(message, imageUrl);
    setTimeout(resolve, 5000); // Show the toast for 5 seconds before resolving the promise
  });
}

// Reset the timer
function resetTimer() {
  // Reset the timer variables
  clearInterval(timerInterval);
  isRunning = false;
  studyTime = 25;
  restTime = 5;
  cyclesPlanned = 1;
  cyclesCompleted = 0;
  breakAfter = 0;
  currentSessionType = "focus";
  remainingTime = studyTime * 60;
  goalId = null;

  goalDisplay.classList.add("hidden");
  cycleInfo.classList.add("hidden");
  timerStatus.classList.add("hidden");
  startPauseButton.textContent = "Start";
  updateTimerDisplay();
  cycleInfo.textContent = `Cycle ${cyclesCompleted + 1} out of ${cyclesPlanned}`;
}

// Adjust the value of the focus time, break time, cycles, or break after
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

  // increase or decrease the value based on the operation
  if (operation === "+") {
    value++;
  } else if (operation === "-") {
    value = value > 1 ? value - 1 : 1;
  }

  // update the value in the input field and the timer variables
  element.textContent = value;

  // update the timer variables based on the type
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

// Event listeners
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

// Logout the user and redirect to the login page after clearing the user data from localStorage
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

  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => 
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      })
    );
  });