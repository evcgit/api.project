document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  fetch('/cards', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(cards => {
    const cardList = document.getElementById('card-list');
    cards.forEach(card => {
      const listItem = document.createElement('li');
      listItem.textContent = card.name;
      cardList.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('Error fetching cards:', error);
  });
});
