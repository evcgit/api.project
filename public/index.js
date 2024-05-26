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
			console.log('Token stored in local storage');
      

			fetch('/cards', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Failed to load cards';
      });
    }
  })
  .catch((err) => {
    console.error('Error:', err);
  });
})

