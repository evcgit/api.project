document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to view this page');
    window.location.href = '/';
    return;
  }

  fetch('/cards', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
		if (response.status === 401) {
			alert('You must be logged in to view this page');
			window.location.href = '/';
			throw new Error('Unauthorized');
		}
		return response.json();
	})
  .then(data => {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = data.map(card => `<div>${card.name}</div>`).join('');
  })
  .catch(err => {
    console.error('Error fetching cards:', err);
  });
});

