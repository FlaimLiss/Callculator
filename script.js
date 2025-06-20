document.addEventListener('DOMContentLoaded', () => {
  // DOM элементы
  const searchInput = document.getElementById('product-search');
  const searchResults = document.getElementById('search-results');
  const mealItemsList = document.getElementById('meal-items');
  const totalCaloriesElement = document.getElementById('total');
  const showAllButton = document.getElementById('show-all');
  const modal = document.getElementById('modal');
  const modalProducts = document.getElementById('modal-products');
  const closeModal = document.querySelector('.close');

  // Данные
  let products = [];
  let mealItems = [];

  // Загрузка продуктов
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка сети');
      return response.json();
    })
    .then(data => {
      products = data.products || [];
      console.log('Загружено продуктов:', products.length);
    })
    .catch(error => {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить продукты');
    });

  // Поиск продуктов
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    renderSearchResults(query);
  });

  // Показать все продукты
  showAllButton.addEventListener('click', () => {
    renderModalProducts();
    modal.style.display = 'block';
  });

  // Закрыть модальное окно
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Функции
  function renderSearchResults(query) {
    searchResults.innerHTML = '';
    if (!query) {
      searchResults.classList.remove('active');
      return;
    }

    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      searchResults.classList.add('active');
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <span>${product.name} (${product.calories} ккал)</span>
        <div>
          <input type="number" id="grams-${product.id}" placeholder="Граммы" min="1">
          <button onclick="addToMeal(${product.id})">+</button>
        </div>
      `;
      searchResults.appendChild(card);
    });
    searchResults.classList.add('active');
  }

  function renderModalProducts() {
    modalProducts.innerHTML = products.map(product => `
      <div class="modal-product">
        <strong>${product.name}</strong>: ${product.calories} ккал
      </div>
    `).join('');
  }

  window.addToMeal = function(productId) {
    const gramsInput = document.getElementById(`grams-${productId}`);
    const grams = parseInt(gramsInput.value);

    if (!grams || grams <= 0) {
      alert('Укажите граммовку!');
      return;
    }

    const product = products.find(p => p.id === productId);
    mealItems.push({
      name: product.name,
      grams,
      calories: Math.round((product.calories * grams) / 100)
    });

    renderMeal();
    calculateTotal();
    gramsInput.value = '';
  };

  function renderMeal() {
    mealItemsList.innerHTML = mealItems.map((item, index) => `
      <li>
        ${item.name}: ${item.grams} г = ${item.calories} ккал
        <button onclick="removeMealItem(${index})">×</button>
      </li>
    `).join('');
  }

  window.removeMealItem = function(index) {
    mealItems.splice(index, 1);
    renderMeal();
    calculateTotal();
  };

  function calculateTotal() {
    const total = mealItems.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesElement.textContent = total;
  }
});
