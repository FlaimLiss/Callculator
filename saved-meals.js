document.addEventListener('DOMContentLoaded', () => {
  const savedMealsList = document.getElementById('saved-meals-list');
  
  try {
    const savedMeals = JSON.parse(localStorage.getItem('savedMeals')) || [];

    if (savedMeals.length === 0) {
      savedMealsList.innerHTML = '<p class="no-meals">У вас пока нет сохранённых блюд.</p>';
      return;
    }

    savedMealsList.innerHTML = savedMeals.map((meal, index) => `
      <div class="saved-meal-card">
        <h3>${meal.name || 'Без названия'}</h3>
        <p class="meal-date">${meal.date || 'Дата не указана'}</p>
        <p class="meal-calories">${meal.total || 0} ккал</p>
        <ul class="meal-items">
          ${meal.items?.map(item => `
            <li>${item.name}: ${item.grams}г = ${item.calories} ккал</li>
          `).join('') || '<li>Продукты не указаны</li>'}
        </ul>
        <button class="delete-meal" data-index="${index}">🗑 Удалить</button>
      </div>
    `).join('');

    // Обработчик удаления
    document.querySelectorAll('.delete-meal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const updatedMeals = JSON.parse(localStorage.getItem('savedMeals'));
        updatedMeals.splice(index, 1);
        localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
        location.reload();
      });
    });

  } catch (error) {
    console.error("Ошибка загрузки сохранений:", error);
    savedMealsList.innerHTML = `
      <p class="error-message">
        Ошибка загрузки сохраненных блюд. Попробуйте позже.
      </p>
    `;
  }
});
