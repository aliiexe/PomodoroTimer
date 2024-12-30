function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

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
    const productivityResponse = await axios.get(`http://localhost:5000/api/productivity?userId=${userId}`);
    const productivityData = productivityResponse.data;

    const totalStudyTime = productivityData.reduce((acc, entry) => acc + entry.totalStudyTime, 0);
    const totalBreakTime = productivityData.reduce((acc, entry) => acc + entry.totalRestTime, 0);
    const sessionsCompleted = productivityData.reduce((acc, entry) => acc + entry.sessionsCompleted, 0);
    const sessionsAbandoned = productivityData.reduce((acc, entry) => acc + entry.sessionsAbandoned, 0);
    const currentStreak = productivityData.reduce((acc, entry) => Math.max(acc, entry.streak), 0);
    const bestStreak = productivityData.reduce((acc, entry) => Math.max(acc, entry.bestStreak), 0);

    // Convert time to appropriate units
    const formatTime = (timeInSeconds) => {
      const timeInMinutes = timeInSeconds / 60;
      if (timeInMinutes < 60) {
        return `${Math.floor(timeInMinutes)} mins`;
      } else {
        return `${(timeInMinutes / 60).toFixed(2)} hrs`;
      }
    };

    document.getElementById('total-study-time').textContent = formatTime(totalStudyTime);
    document.getElementById('total-break-time').textContent = formatTime(totalBreakTime);
    document.getElementById('sessions-completed').textContent = sessionsCompleted;
    document.getElementById('sessions-abandoned').textContent = sessionsAbandoned;
    document.getElementById('current-streak').textContent = `${currentStreak} days`;
    document.getElementById('best-streak').textContent = `${bestStreak} days`;

    // Example chart for goals progress
    const goalsResponse = await axios.get(`http://localhost:5000/api/goals?userId=${userId}`);
    const goalsData = goalsResponse.data;
    const goalsProgress = goalsData.map(goal => ({
      title: goal.title,
      progress: (goal.progress / goal.targetStudyTime) * 100,
    }));

    const goalsProgressChart = new ApexCharts(document.querySelector("#goals-progress"), {
      chart: {
        type: 'bar',
        height: 350
      },
      series: [{
        name: 'Progress',
        data: goalsProgress.map(goal => goal.progress.toFixed(2))
      }],
      xaxis: {
        categories: goalsProgress.map(goal => goal.title)
      },
      colors: ['#7b61ff']
    });

    goalsProgressChart.render();

    // Example chart for daily productivity
    const dailyProductivityChart = new ApexCharts(document.querySelector("#daily-productivity-chart"), {
      chart: {
        type: 'line',
        height: 350
      },
      series: [{
        name: 'Study Time (hrs)',
        data: productivityData.map(entry => (entry.totalStudyTime / 3600).toFixed(2))
      }],
      xaxis: {
        categories: productivityData.map(entry => new Date(entry.createdAt).toLocaleDateString())
      },
      colors: ['#7b61ff']
    });

    dailyProductivityChart.render();

  } catch (error) {
    console.error('Error fetching productivity data:', error);
  }
});