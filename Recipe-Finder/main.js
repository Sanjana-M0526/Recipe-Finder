const API_KEY = "";
const API_BASE = "https://api.spoonacular.com/recipes";

const content = document.getElementById("content");
const loader = document.getElementById("loader");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const welcomeScreen = document.getElementById("welcomeScreen");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchMeals(query);
});

async function searchMeals(query) {
  content.innerHTML = "";
  loader.classList.remove("hidden");
  welcomeScreen.style.display = "none";

  try {
    const res = await fetch(`${API_BASE}/complexSearch?query=${encodeURIComponent(query)}&number=12&apiKey=${API_KEY}`);
    // console.log(res)
    const data = await res.json();
    loader.classList.add("hidden");

    if (!data.results || data.results.length === 0) {
      content.innerHTML = `<p>No results found for "<strong>${query}</strong>".</p>`;
    } else {
      displayMeals(data.results);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    loader.classList.add("hidden");
    content.innerHTML = "<p>Error fetching meals.</p>";
  }
}

function displayMeals(meals) {
  const grid = document.createElement("div");
  grid.className = "meal-grid";

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <img src="${meal.image}" alt="${meal.title}" />
      <div class="meal-info">
        <h3>${meal.title}</h3>
      </div>
    `;
    card.addEventListener("click", () => loadMealDetail(meal.id));
    grid.appendChild(card);
  });

  content.innerHTML = "";
  content.appendChild(grid);
}

async function loadMealDetail(id) {
  content.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    const res = await fetch(`${API_BASE}/${id}/information?apiKey=${API_KEY}`);
    const meal = await res.json();
    loader.classList.add("hidden");

    showMealDetail(meal);
  } catch (err) {
    console.error("Detail fetch error:", err);
    loader.classList.add("hidden");
    content.innerHTML = "<p>Failed to load meal details.</p>";
  }
}

function showMealDetail(meal) {
  const div = document.createElement("div");
  div.className = "detail-view";

  const ingredients = meal.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("");
  const instructions = meal.instructions
    ? meal.instructions.split(". ").map(step => `<li>${step.trim()}.</li>`).join("")
    : "<li>No instructions available.</li>";

  div.innerHTML = `
    <img src="${meal.image}" alt="${meal.title}" />
    <h2>${meal.title}</h2>
    <div class="ingredients">
      <h4>Ingredients:</h4>
      <ul>${ingredients}</ul>
    </div>
    <div class="instructions">
      <h4>Instructions:</h4>
      <ol>${instructions}</ol>
    </div>
    <div class="back-btn" onclick="location.reload()">← Back</div>
  `;

  content.innerHTML = "";
  content.appendChild(div);

}
