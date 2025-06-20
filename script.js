document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('product-search');
  const searchResults = document.getElementById('search-results');
  const mealItemsList = document.getElementById('meal-items');
  const totalCaloriesElement = document.getElementById('total');
  const showAllButton = document.getElementById('show-all');
  const modal = document.getElementById('modal');
  const modalProducts = document.getElementById('modal-products');
  const closeModal = document.querySelector('.close');
  let products = [];
  let mealItems = [];

  // Загрузка продуктов из JSON
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      products = data.products;
      renderSearchResults('');
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

  // Поиск продуктов
  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // Открыть модальное окно со всеми продуктами
  showAllButton.addEventListener('click', () => {
    renderModalProducts();
    modal.style.display = 'block';
  });

  // Закрыть модальное окно
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // По клику вне модального окна — закрыть
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Отображение результатов поиска
  function renderSearchResults(query) {
  searchResults.innerHTML = '';
  
  if (query === '') {
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

  // Отображение всех продуктов в модальном окне
  function renderModalProducts() {
    modalProducts.innerHTML = '';
    products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'modal-product';
      item.innerHTML = `
        <strong>${product.name}</strong>: ${product.calories} ккал
      `;
      modalProducts.appendChild(item);
    });
  }

  // Добавление продукта в блюдо
  window.addToMeal = function(productId) {
    const gramsInput = document.getElementById(`grams-${productId}`);
    const grams = parseInt(gramsInput.value);

    if (!grams || grams <= 0) {
      alert('Укажите граммовку!');
      return;
    }

    const product = products.find(p => p.id === productId);
    const calories = Math.round((product.calories * grams) / 100);

    mealItems.push({
      name: product.name,
      grams,
      calories
    });

    renderMeal();
    calculateTotal();
    gramsInput.value = ''; // Очищаем поле ввода
  };

  // Отображение добавленных продуктов
  function renderMeal() {
    mealItemsList.innerHTML = '';
    mealItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.name}: ${item.grams} г = ${item.calories} ккал
        <button onclick="removeMealItem(${index})">×</button>
      `;
      mealItemsList.appendChild(li);
    });
  }

  // Удаление продукта из блюда
  window.removeMealItem = function(index) {
    mealItems.splice(index, 1);
    renderMeal();
    calculateTotal();
  };

  // Подсчёт общей калорийности
  function calculateTotal() {
    const total = mealItems.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesElement.textContent = total;
  }
});
