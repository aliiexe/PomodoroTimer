document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user._id) {
    window.location.href = 'timer.html';
  }
});
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const emailOrUsername = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      emailOrUsername,
      password,
    });

    if (response.status === 200) {
      // Save user data to localStorage
      const userData = response.data.user; // Ensure the backend sends the user info (e.g., id, token, etc.)
      localStorage.setItem('user', JSON.stringify(userData));
      showToast('Login successful! Redirecting...', 'success');

      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = 'timer.html';
      }, 1500);
    } else {
      showToast('Login failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred while logging in. Please try again.', 'error');
  }
});

// Toast notification function
function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `fixed text-white bottom-4 right-4 px-4 py-2 rounded shadow ${
    type === 'success' ? 'bg-green-500' : 'bg-[#782EFF]'
  }`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}