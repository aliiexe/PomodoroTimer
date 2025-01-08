document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user._id) {
    window.location.href = 'timer.html';
  }
});
document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Check if passwords match
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/users', {
      username: name,
      email,
      password,
    });

    if (response.status === 201) {
      showToast('User created successfully! Redirecting to login...', 'success');

      setTimeout(() => {
        window.location.href = 'login.html'; // Redirect to login page
      }, 1500);
    } else {
      showToast('Sign up failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred while signing up. Please try again.', 'error');
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