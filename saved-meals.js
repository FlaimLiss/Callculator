document.addEventListener('DOMContentLoaded', () => {
  const savedMealsList = document.getElementById('saved-meals-list');
  
  try {
    // Безопасное чтение из LocalStorage
    const savedData = localStorage.getItem('savedMeals');
    const savedMeals = savedData ? JSON.parse(savedData) : [];
    
    if (!Array.isArray(savedMeals)) {
      throw new Error("Данные не являются массивом");
    }

    if (savedMeals.length === 0) {
      savedMealsList.innerHTML = '<p class="no-meals">Нет сохранённых блюд</p>';
      return;
    }

    // Отрисовка сохранённых блюд
    savedMealsList.innerHTML = savedMeals.map((meal, index) => `
      <div class="saved-meal-card">
        <h3>${meal.name || 'Без названия'}</h3>
        <p class="meal-date">${meal.date || 'Дата не указана'}</p>
        <p class="meal-calories">${meal.total || 0} ккал</p>
        <ul class="meal-items">
          ${(meal.items || []).map(item => `
            <li>${item.name}: ${item.grams}г = ${item.calories} ккал</li>
          `).join('')}
        </ul>
        <button class="delete-meal" data-index="${index}">🗑 Удалить</button>
      </div>
    `).join('');

    // Обработчик удаления
    document.querySelectorAll('.delete-meal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const updatedMeals = JSON.parse(localStorage.getItem('savedMeals'));
        updatedMeals.splice(index, 1);
        localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
        location.reload();
      });
    });

  } catch (error) {
    console.error("Ошибка загрузки:", error);
    savedMealsList.innerHTML = `
      <div class="error-message">
        Ошибка загрузки сохранений. Попробуйте очистить данные:
        <button id="clear-storage">Очистить LocalStorage</button>
      </div>
    `;
    
    document.getElementById('clear-storage')?.addEventListener('click', () => {
      localStorage.removeItem('savedMeals');
      location.reload();
    });
  }
});
