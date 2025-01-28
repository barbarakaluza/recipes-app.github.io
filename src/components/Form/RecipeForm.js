import React, { useState } from "react";

const RecipeForm = React.memo(({ onClose, onAddRecipe }) => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    steps: "",
    preparationTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lazy loading dla funkcji `addRecipeToAirtable`
    const { addRecipeToAirtable } = await import("../../api/airtable"); 

    // Przygotowanie danych
    const recipeData = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      preparationTime: recipe.preparationTime,
    };

    // Wysłanie przepisu do Airtable
    const savedRecipe = await addRecipeToAirtable(recipeData);

    // Wywołanie funkcji onAddRecipe, aby przekazać dane do głównej aplikacji
    onAddRecipe(savedRecipe);

    alert("Przepis został zapisany!");

    // Resetowanie formularza
    setRecipe({ title: "", ingredients: "", steps: "", preparationTime: "" });
    onClose(); // Zamknięcie formularza po zapisaniu
  };

  return (
    <div className="recipe-form-container">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <form onSubmit={handleSubmit} className="recipe-form">
        <h2>Dodaj nowy przepis</h2>

        <div>
          <label htmlFor="title">Nazwa przepisu:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            placeholder="Wpisz nazwę przepisu"
            required
          />
        </div>

        <div>
          <label htmlFor="ingredients">Składniki:</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            placeholder="Wpisz składniki, każdy w osobnej linii"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="steps">Kroki przygotowania:</label>
          <textarea
            id="steps"
            name="steps"
            value={recipe.steps}
            onChange={handleChange}
            placeholder="Opisz kroki przygotowania"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="preparationTime">Czas przygotowania (minuty):</label>
          <input
            type="number"
            id="preparationTime"
            name="preparationTime"
            value={recipe.preparationTime}
            onChange={handleChange}
            placeholder="Wpisz czas w minutach"
            required
          />
        </div>

        <button className="button" type="submit">Zapisz przepis</button>
      </form>
    </div>
  );
});

export default RecipeForm;
