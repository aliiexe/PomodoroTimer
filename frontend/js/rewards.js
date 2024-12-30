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
  const userId = user._id;

  try {
    const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
    const userData = userResponse.data;
    const badgesContainer = document.getElementById('badges-container');

    const badgeDetails = {
      '67717d319594a1dae10556b1': { image: 'badge1.png', title: 'First Session Badge' },
      '6771cbc74e7860685cb8a5e7': { image: 'badge2.png', title: 'First 25 Mins Session Complete' },
      '6771cbde4e7860685cb8a5e9': { image: 'badge3.png', title: '5 Sessions Completed' },
      '6771cbec4e7860685cb8a5eb': { image: 'badge4.png', title: '10 Sessions Completed' },
    };

    userData.rewards.forEach(rewardId => {
      const badge = badgeDetails[rewardId];
      if (badge) {
        const badgeCard = document.createElement('div');
        badgeCard.className = 'badge-card bg-white shadow-md rounded-lg p-6 text-center';
        badgeCard.innerHTML = `
          <img src="assets/images/${badge.image}" alt="${badge.title}" class="w-24 h-24 mx-auto mb-4">
          <h2 class="text-lg font-semibold">${badge.title}</h2>
        `;
        badgesContainer.appendChild(badgeCard);
      }
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
  }
});