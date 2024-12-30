document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Check if email is in a valid format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast('Invalid email format', 'error');
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  // Check if password meets criteria (e.g., minimum length)
  if (password.length < 8) {
    showToast('Password must be at least 8 characters long', 'error');
    return;
  }

  try {
    // Check if username or email already exists
    const userCheckResponse = await axios.get(`http://localhost:5000/api/users/check?username=${name}&email=${email}`);
    if (userCheckResponse.data.usernameExists) {
      showToast('Username already exists', 'error');
      return;
    }
    if (userCheckResponse.data.emailExists) {
      showToast('Email already exists', 'error');
      return;
    }

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
    if (error.response && error.response.data && error.response.data.message) {
      showToast(error.response.data.message, 'error');
    } else {
      showToast('An error occurred while signing up. Please try again.', 'error');
    }
  }
});

// Toast notification function
function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow ${
    type === 'success' ? 'bg-green-500' : 'bg-[#782EFF]'
  }`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}