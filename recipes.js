// Ожидаем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', () => {
  // Получаем контейнер для вывода рецептов
  const recipesContainer = document.getElementById('recipes-container');

  // Загружаем данные рецептов из JSON-файла
  fetch('recipe.json')
    .then(response => {
      // Проверяем успешность запроса
      if (!response.ok) throw new Error('Ошибка загрузки рецептов');
      return response.json(); // Парсим JSON-ответ
    })
    .then(data => {
      // Проверяем наличие данных о рецептах
      if (!data.recipes || !data.recipes.length) {
        throw new Error('Нет данных о рецептах');
      }
      
      // Для каждого рецепта создаем карточку
      data.recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card'; // Добавляем CSS-класс
        
        // Формируем HTML-структуру карточки
        recipeCard.innerHTML = `
          <div class="recipe-header">
            <h3>${recipe.name}</h3> <!-- Название рецепта -->
          </div>
          <div class="recipe-content">
            <p class="recipe-calories">${recipe.calories} ккал</p> <!-- Калорийность -->
            <p class="recipe-description">${recipe.description}</p> <!-- Описание -->
            <div class="recipe-ingredients">
              <h4>Ингредиенты:</h4>
              <ul>
                ${recipe.ingredients.map(ing => 
                  `<li>${ing.name} - ${ing.amount}</li>` // Список ингредиентов
                ).join('')}
              </ul>
            </div>
          </div>
        `;
        
        // Добавляем готовую карточку в контейнер
        recipesContainer.appendChild(recipeCard);
      });
    })
    .catch(error => {
      // Обрабатываем возможные ошибки
      console.error('Ошибка:', error);
      // Выводим сообщение об ошибке в интерфейс
      recipesContainer.innerHTML = `
        <div class="error-message">
          <p>Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</p>
          <p>${error.message}</p> <!-- Детали ошибки -->
        </div>
      `;
    });
});
