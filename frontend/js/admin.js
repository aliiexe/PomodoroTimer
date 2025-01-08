function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

const user = JSON.parse(localStorage.getItem("user")) || {};
if (user._id) {
  console.log("User:", user._id);
} else {
  window.location.href = "index.html";
  console.log("User not logged in");
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch total users
    const usersResponse = await axios.get('https://backend-psi-amber-81.vercel.app/api/users');
    const totalUsers = usersResponse.data.length;
    document.getElementById('total-users').textContent = totalUsers;
    const userList = document.getElementById('user-list');
    usersResponse.data.forEach(user => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `<td class="p-3">${user.username}</td><td class="p-3">${user.email}</td>`;
      userList.appendChild(listItem);
    });

    // Fetch total goals
    const goalsResponse = await axios.get('https://backend-psi-amber-81.vercel.app/api/goals');
    const totalGoals = goalsResponse.data.length;
    document.getElementById('total-goals').textContent = totalGoals;
    const goalList = document.getElementById('goal-list');
    goalsResponse.data.forEach(goal => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `<td class="p-3">${goal.userId}</td><td class="p-3">${goal.title}</td>`;
      goalList.appendChild(listItem);
    });

    // Fetch total rewards
    const rewardsResponse = await axios.get('https://backend-psi-amber-81.vercel.app/api/rewards');
    const totalRewards = rewardsResponse.data.length;
    document.getElementById('total-rewards').textContent = totalRewards;
    const rewardList = document.getElementById('reward-list');
    rewardsResponse.data.forEach(reward => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `<td class="p-3">${reward.name}</td><td class="p-3">${reward.rewardType}</td>`;
      rewardList.appendChild(listItem);
    });

    // Fetch total productivity entries
    const productivityResponse = await axios.get('https://backend-psi-amber-81.vercel.app/api/productivity');
    const totalProductivityEntries = productivityResponse.data.length;
    document.getElementById('total-productivity-entries').textContent = totalProductivityEntries;
    const productivityList = document.getElementById('productivity-list');
    productivityResponse.data.forEach(entry => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `<td class="p-3">${entry.userId}</td><td class="p-3">${entry.totalStudyTime}</td>`;
      productivityList.appendChild(listItem);
    });

    // Create charts
    const userStatsChart = new ApexCharts(document.querySelector("#user-stats-chart"), {
      chart: {
        type: 'bar',
        height: 350
      },
      series: [{
        name: 'Count',
        data: [totalUsers, totalGoals, totalRewards, totalProductivityEntries]
      }],
      xaxis: {
        categories: ['Users', 'Goals', 'Rewards', 'Productivity Entries']
      },
      colors: ['#8C4DFE']
    });

    userStatsChart.render();

  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
});

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