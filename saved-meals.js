document.addEventListener('DOMContentLoaded', () => {
  const savedMealsList = document.getElementById('saved-meals-list');
  const savedMeals = JSON.parse(localStorage.getItem('savedMeals') || []);

  if (savedMeals.length === 0) {
    savedMealsList.innerHTML = '<p>У вас пока нет сохранённых блюд.</p>';
    return;
  }

  savedMealsList.innerHTML = savedMeals
    .map(meal => `
      <div class="saved-meal-card">
        <h3>${meal.name}</h3>
        <p class="meal-date">${meal.date}</p>
        <p class="meal-calories">${meal.total} ккал</p>
        <ul class="meal-items">
          ${meal.items.map(item => `<li>${item.name}: ${item.grams} г = ${item.calories} ккал</li>`).join('')}
        </ul>
        <button class="delete-meal" data-id="${meal.name}">🗑 Удалить</button>
      </div>
    `)
    .join('');

  // Обработчик удаления блюда
  document.querySelectorAll('.delete-meal').forEach(button => {
    button.addEventListener('click', (e) => {
      const mealName = e.target.getAttribute('data-id');
      const updatedMeals = savedMeals.filter(meal => meal.name !== mealName);
      localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
      location.reload(); // Обновляем страницу
    });
  });
});
