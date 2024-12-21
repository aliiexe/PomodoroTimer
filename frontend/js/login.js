document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email,
      password,
    });

    if (response.status === 200) {
      window.location.href = '/dashboard.html'; // Redirect to the dashboard
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while logging in');
  }
});