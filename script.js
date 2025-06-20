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
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      return response.json();
    })
    .then(data => {
      products = data.products;
      console.log('Продукты загружены:', products.length); // Для отладки
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Не удалось загрузить продукты. Проверьте консоль.');
    });

  // Поиск продуктов
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    renderSearchResults(query);
  });

  // Открытие модального окна
  showAllButton.addEventListener('click', () => {
    if (products.length === 0) {
      alert('Продукты ещё не загружены. Подождите...');
      return;
    }
    renderModalProducts();
    modal.style.display = 'block';
  });

  // Закрытие модального окна
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Функция для добавления продукта в блюдо (исправленная)
  window.addToMeal = function(productId) {
    const gramsInput = document.getElementById(`grams-${productId}`);
    if (!gramsInput) {
      console.error('Поле для граммов не найдено');
      return;
    }
    
    const grams = parseInt(gramsInput.value);
    if (isNaN(grams)) {
      alert('Введите число!');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Продукт не найден');
      return;
    }

    mealItems.push({
      name: product.name,
      grams,
      calories: Math.round((product.calories * grams) / 100)
    });

    renderMeal();
    calculateTotal();
    gramsInput.value = ''; // Сброс поля
  };

  // Отрисовка результатов поиска
  function renderSearchResults(query) {
    searchResults.innerHTML = '';
    if (!query) return;

    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = '<p>Ничего не найдено</p>';
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <span>${product.name} (${product.calories} ккал)</span>
        <div>
          <input 
            type="number" 
            id="grams-${product.id}" 
            placeholder="Граммы" 
            min="1" 
            class="grams-input"
          >
          <button onclick="addToMeal(${product.id})">+</button>
        </div>
      `;
      searchResults.appendChild(card);
    });
  }

  // Отрисовка всех продуктов в модальном окне
  function renderModalProducts() {
    modalProducts.innerHTML = products
      .map(product => `
        <div class="modal-product">
          <strong>${product.name}</strong>: ${product.calories} ккал
        </div>
      `)
      .join('');
  }

  // Отрисовка блюда
  function renderMeal() {
    mealItemsList.innerHTML = mealItems
      .map((item, index) => `
        <li>
          ${item.name}: ${item.grams} г = ${item.calories} ккал
          <button onclick="removeMealItem(${index})">×</button>
        </li>
      `)
      .join('');
  }

  // Удаление продукта из блюда
  window.removeMealItem = function(index) {
    mealItems.splice(index, 1);
    renderMeal();
    calculateTotal();
  };
  // Обработчик для добавления готовых блюд
  document.querySelectorAll('.add-preset').forEach(button => {
    button.addEventListener('click', function() {
      const presetElement = this.closest('.preset');
      const productsData = JSON.parse(presetElement.dataset.products);
      
      // Очищаем текущее блюдо
      mealItems = [];
      
      // Добавляем все продукты из блюда
      productsData.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          mealItems.push({
            name: product.name,
            grams: item.grams,
            calories: Math.round((product.calories * item.grams) / 100)
          });
        }
      });
      
      renderMeal();
      calculateTotal();
      alert('Блюдо добавлено!');
    });
  });


  // Подсчёт калорий
  function calculateTotal() {
    const total = mealItems.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesElement.textContent = total;
  }
});
