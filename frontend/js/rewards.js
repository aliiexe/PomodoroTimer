function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// Get user data from localStorage
const user = JSON.parse(localStorage.getItem("user")) || {};
if (user._id) {
  console.log("User:", user._id);
} else {
  window.location.href = "index.html";
  console.log("User not logged in");
}

// Fetch user rewards and display them
document.addEventListener('DOMContentLoaded', async () => {
  const userId = user._id;

  try {
    const userResponse = await axios.get(`https://backend-psi-amber-81.vercel.app/api/users/${userId}`);
    let noBadges = document.getElementById('no-badges-message');
    const userData = userResponse.data;
    const badgesContainer = document.getElementById('badges-container');

    if (userData.rewards.length === 0) {
      noBadges.classList.remove('hidden');
    }

    const badgeDetails = {
      '67717d319594a1dae10556b1': { image: 'Badge1.png', title: 'First Session Badge' },
      '6771cbc74e7860685cb8a5e7': { image: 'Badge2.png', title: 'First 25 Mins Session Complete' },
      '6771cbde4e7860685cb8a5e9': { image: 'Badge3.png', title: '5 Sessions Completed' },
      '6771cbec4e7860685cb8a5eb': { image: 'Badge4.png', title: '10 Sessions Completed' },
    };

    // Display user badges in the DOM using the badgeDetails object
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