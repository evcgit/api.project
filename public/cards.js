document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to view this page');
    window.location.href = '/';
    return;
  }

	function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryArray = queryString.split('&');
    queryArray.forEach(param => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
  }

  const queryParams = getQueryParams();
  const queryString = new URLSearchParams(queryParams).toString();

  fetch(`/cards-data?${queryString}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
			'Accept': 'application/json'
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

