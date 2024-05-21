document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: document.getElementById('username').value.trim(), 
      password: document.getElementById('password').value.trim()
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.errorMessage) {
      document.getElementById('message').innerText = data.errorMessage;
    }
    else {
      document.getElementById('message').innerText = 'You are logged in';
      localStorage.setItem('token', data.token);
      // window.location.href = '/cards'
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
})

