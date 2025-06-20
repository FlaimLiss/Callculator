document.addEventListener('DOMContentLoaded', () => {
  const recipesContainer = document.getElementById('recipes-container');

  fetch('recipe.json')
    .then(response => response.json())
    .then(data => {
      data.recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
          <h3>${recipe.name}</h3>
          <p class="recipe-calories">${recipe.calories} ккал</p>
          <p class="recipe-description">${recipe.description}</p>
          <h4>Ингредиенты:</h4>
          <ul class="recipe-ingredients">
            ${recipe.ingredients.map(ing => `<li>${ing.name} - ${ing.amount}</li>`).join('')}
          </ul>
        `;
        recipesContainer.appendChild(recipeCard);
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки рецептов:', error);
      recipesContainer.innerHTML = '<p>Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.</p>';
    });
});
