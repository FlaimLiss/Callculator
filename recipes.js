document.addEventListener('DOMContentLoaded', () => {
  const recipesContainer = document.getElementById('recipes-container');

  fetch('recipe.json')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки рецептов');
      return response.json();
    })
    .then(data => {
      if (!data.recipes || !data.recipes.length) {
        throw new Error('Нет данных о рецептах');
      }
      
      data.recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        recipeCard.innerHTML = `
          <div class="recipe-header">
            <h3>${recipe.name}</h3>
          </div>
          <div class="recipe-content">
            <p class="recipe-calories">${recipe.calories} ккал</p>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-ingredients">
              <h4>Ингредиенты:</h4>
              <ul>
                ${recipe.ingredients.map(ing => `<li>${ing.name} - ${ing.amount}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
        
        recipesContainer.appendChild(recipeCard);
      });
    })
    .catch(error => {
      console.error('Ошибка:', error);
      recipesContainer.innerHTML = `
        <div class="error-message">
          <p>Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</p>
          <p>${error.message}</p>
        </div>
      `;
    });
});
