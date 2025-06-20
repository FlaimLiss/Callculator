document.addEventListener('DOMContentLoaded', () => {
  const productsTable = document.getElementById('products-list');
  const productSelect = document.getElementById('product-select');
  const mealItemsList = document.getElementById('meal-items');
  const totalCaloriesElement = document.getElementById('total');
  let products = [];
  let mealItems = [];

  // Загрузка продуктов из JSON
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      products = data.products;
      renderProducts();
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

  // Отображение продуктов в таблице и select
  function renderProducts() {
    productsTable.innerHTML = '';
    productSelect.innerHTML = '<option value="">Выберите продукт</option>';

    products.forEach(product => {
      // Добавление в таблицу
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.calories}</td>
      `;
      productsTable.appendChild(row);

      // Добавление в выпадающий список
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = `${product.name} (${product.calories} ккал)`;
      productSelect.appendChild(option);
    });
  }

  // Добавление продукта в блюдо
  document.getElementById('add-to-meal').addEventListener('click', () => {
    const productId = parseInt(productSelect.value);
    const grams = parseInt(document.getElementById('product-grams').value);

    if (!productId || !grams) {
      alert('Выберите продукт и укажите граммовку!');
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
  });

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
