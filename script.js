// Основной обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Получаем ссылки на DOM элементы
  const searchInput = document.getElementById('product-search'); // Поле поиска
  const searchResults = document.getElementById('search-results'); // Контейнер результатов поиска
  const mealItemsList = document.getElementById('meal-items'); // Список добавленных продуктов
  const totalCaloriesElement = document.getElementById('total'); // Элемент для отображения суммы калорий
  const showAllButton = document.getElementById('show-all'); // Кнопка показа всех продуктов
  const modal = document.getElementById('modal'); // Модальное окно
  const modalProducts = document.getElementById('modal-products'); // Контейнер продуктов в модалке
  const closeModal = document.querySelector('.close'); // Кнопка закрытия модалки

  // Хранилища данных
  let products = []; // Массив всех продуктов
  let mealItems = []; // Массив добавленных в блюдо продуктов

  // Загрузка данных о продуктах
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка сети'); // Проверка ответа сервера
      return response.json(); // Парсинг JSON
    })
    .then(data => {
      products = data.products || []; // Сохраняем продукты
      console.log('Загружено продуктов:', products.length); // Логируем количество
    })
    .catch(error => {
      console.error('Ошибка загрузки:', error); // Логируем ошибку
      alert('Не удалось загрузить продукты'); // Показываем пользователю
    });

  // Обработчик ввода в поиск
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim(); // Получаем поисковый запрос
    renderSearchResults(query); // Рендерим результаты
  });

  // Обработчик показа всех продуктов
  showAllButton.addEventListener('click', () => {
    renderModalProducts(); // Заполняем модалку продуктами
    modal.style.display = 'block'; // Показываем модалку
  });

  // Закрытие модального окна
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  // Закрытие по клику вне модалки
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Функция отображения результатов поиска
  function renderSearchResults(query) {
    searchResults.innerHTML = ''; // Очищаем предыдущие результаты
    
    // Если запрос пустой - скрываем результаты
    if (!query) {
      searchResults.classList.remove('active');
      return;
    }

    // Фильтруем продукты по запросу
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    // Если ничего не найдено
    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Ничего не найдено</div>';
      searchResults.classList.add('active');
      return;
    }

    // Рендерим найденные продукты
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

  // Функция заполнения модального окна продуктами
  function renderModalProducts() {
    modalProducts.innerHTML = products.map(product => `
      <div class="modal-product">
        <strong>${product.name}</strong>: ${product.calories} ккал
      </div>
    `).join('');
  }

  // Глобальная функция добавления продукта в блюдо
  window.addToMeal = function(productId) {
    const gramsInput = document.getElementById(`grams-${productId}`);
    const grams = parseInt(gramsInput.value);

    // Валидация ввода
    if (!grams || grams <= 0) {
      alert('Укажите граммовку!');
      return;
    }

    // Находим продукт и добавляем в блюдо
    const product = products.find(p => p.id === productId);
    mealItems.push({
      name: product.name,
      grams,
      calories: Math.round((product.calories * grams) / 100) // Расчет калорий
    });

    renderMeal(); // Обновляем список блюда
    calculateTotal(); // Пересчитываем сумму
    gramsInput.value = ''; // Очищаем поле ввода
  };

  // Функция отображения списка блюда
  function renderMeal() {
    mealItemsList.innerHTML = mealItems.map((item, index) => `
      <li>
        ${item.name}: ${item.grams} г = ${item.calories} ккал
        <button onclick="removeMealItem(${index})">×</button>
      </li>
    `).join('');
  }

  // Глобальная функция удаления продукта из блюда
  window.removeMealItem = function(index) {
    mealItems.splice(index, 1); // Удаляем продукт
    renderMeal(); // Обновляем список
    calculateTotal(); // Пересчитываем сумму
  };

  // Функция расчета общей калорийности
  function calculateTotal() {
    const total = mealItems.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesElement.textContent = total; // Выводим результат
  }
});
