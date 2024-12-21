document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    // Send a POST request to the backend to create the user
    const response = await axios.post('http://localhost:5000/api/users', {
      username: name,
      email,
      password,
    });

    if (response.status === 201) {
      alert('User created successfully! Please login.');
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      alert('Sign up failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing up');
  }
});
