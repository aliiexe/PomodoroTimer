
// Handle login form submission
// document.getElementById('login-form').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   try {
//     const response = await axios.post('http://localhost:5000/api/users/login', {
//       email,
//       password,
//     });

//     if (response.status === 200) {
//       window.location.href = '/dashboard.html'; // Redirect to the dashboard
//     } else {
//       alert('Login failed');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     alert('An error occurred');
//   }
// });

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        name,
        email,
        password,
      });
  
      if (response.status === 200) {
        window.location.href = '/login.html'; // Redirect to the login page
      } else {
        alert('Sign up failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  });  