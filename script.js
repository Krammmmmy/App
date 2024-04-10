function toggleMenu() {
    var menuOptions = document.getElementById("menuOptions");
    menuOptions.style.display = (menuOptions.style.display === "none") ? "flex" : "none";

    var searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = (searchContainer.style.display === "flex") ? "none" : "flex";
}
document.addEventListener("DOMContentLoaded", function () {
    // Check if the current page is recipe-details.html
    if (window.location.pathname.includes("recipe-details.html")) {
        displayRecipeDetails();
    }
});

function redirectToSearch() {
    window.location.href = 'search-results.html';
}
function search() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchInput !== "") {
        const bmiCategory = localStorage.getItem('bmiResult');
        if (bmiCategory) {
            const bmiResult = JSON.parse(bmiCategory);
            // Load the appropriate JSON file based on BMI category
            const jsonFile = `${bmiResult.category}_recipes.json`;

            // Fetch recipes from JSON file
            fetch(jsonFile)
                .then(response => response.json())
                .then(recipes => {
                    // Filter recipes based on search input
                    const matchingRecipes = recipes.filter(recipe =>
                        recipe.ingredients.some(ingredient => searchInput.includes(ingredient.toLowerCase())));

                    // Redirect to the search results page and pass the filtered recipes as a query parameter
                    window.location.href = `search-results.html?recipes=${encodeURIComponent(JSON.stringify(matchingRecipes))}`;
                })
                .catch(error => console.error('Error loading recipes:', error));
        } else {
            // Handle case where BMI category is not available
        }
    } else {
        // Handle case where no search term is entered
    }
}



function findRecipesByQuery(recipes, searchQuery) {
    return recipes.filter(recipe => recipe.ingredients.some(ingredient => searchQuery.includes(ingredient)));
}

// Function to retrieve and display search results on the search-results.html page
// Function to retrieve and display search results on the search-results.html page
function displayResultsOnSearchResultsPage() {
    const searchResultsContainer = document.getElementById("results-container");
    const recipesParam = new URLSearchParams(window.location.search).get("recipes");

    if (recipesParam) {
        const recipes = JSON.parse(decodeURIComponent(recipesParam));

        // Sort recipes by name
        recipes.sort((a, b) => a.name.localeCompare(b.name));

        const ul = document.createElement("ul");

        recipes.forEach(recipe => {
            const li = document.createElement("li");
            // Make the recipe name clickable with corresponding image and ingredients
            li.innerHTML = `
                <div class="recipe-card">
                    <img src="${recipe.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${recipe.name} Image" class="recipe-image">
                    <div class="recipe-details">
                        <a href="recipe-details.html?recipe=${encodeURIComponent(JSON.stringify(recipe))}"><strong>${recipe.name}</strong></a>
                        <p class="recipe-ingredients">${recipe.ingredients.join(', ')}</p>
                    </div>
                </div>`;
            ul.appendChild(li);
        });

        searchResultsContainer.appendChild(ul);
    } else {
        // Handle case where no recipes are provided
        searchResultsContainer.innerHTML = "<p>No matching recipes found.</p>";
    }
}

// Call the displayResultsOnSearchResultsPage function when the search-results.html page loads
document.addEventListener("DOMContentLoaded", displayResultsOnSearchResultsPage);

// Function to display recipe details on the recipe-details.html page
function displayRecipeDetails() {
    const recipeDetailsContainer = document.getElementById("recipe-details-container");
    const recipeParam = new URLSearchParams(window.location.search).get("recipe");

    // Check if recipe details container is empty
    if (recipeParam && !recipeDetailsContainer.innerHTML.trim()) {
        const recipe = JSON.parse(decodeURIComponent(recipeParam));

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("recipe-details");

        // Add the image to the right
        detailsDiv.innerHTML = `<div class="recipe-image">
                    <img src="${recipe.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${recipe.name} Image">
                                </div>`;

        // Add recipe name and other details
        detailsDiv.innerHTML += `
            <div class="recipe-info">
                <h2>${recipe.name}</h2>
                <p><strong>Ingredients:</strong></p>
                <ul>${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                <p><strong>Instructions:</strong></p>
                <ol>${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>
                <p><strong>Calories: ${recipe.calories}</strong></p>
            </div>`;

        recipeDetailsContainer.appendChild(detailsDiv);
    } else if (!recipeParam) {
        // Handle case where no recipe details are provided
        recipeDetailsContainer.innerHTML = "<p>No recipe details found.</p>";
    }
}

// Call the displayRecipeDetails function when the recipe-details.html page loads
document.addEventListener("DOMContentLoaded", displayRecipeDetails);


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("horizontalScrollContainer");
    const bottomContainer = document.getElementById("bottomHorizontalScrollContainer");

    container.addEventListener("wheel", handleScroll);
    bottomContainer.addEventListener("wheel", handleScroll);

    function handleScroll(event) {
        event.preventDefault();
        const scrollAmount = event.deltaY || event.deltaX;
        const containerScrollLeft = container.scrollLeft;
        const boxWidth = container.querySelector(".placeholder-box").offsetWidth;
        const newPosition = Math.round(containerScrollLeft / boxWidth) * boxWidth + scrollAmount;
        container.scrollTo({
            left: newPosition,
            behavior: "smooth",
        });
    }
});
// Function to increase font size
function increaseFontSize() {
    const html = document.documentElement;
    const currentSize = window.getComputedStyle(html, null).getPropertyValue('font-size');
    const newSize = parseInt(currentSize) + 1 + 'px';
    html.style.fontSize = newSize;

    // Save the font size to local storage
    localStorage.setItem('fontSize', newSize);
}

// Function to decrease font size
function decreaseFontSize() {
    const html = document.documentElement;
    const currentSize = window.getComputedStyle(html, null).getPropertyValue('font-size');
    const newSize = parseInt(currentSize) - 1 + 'px';
    html.style.fontSize = newSize;

    // Save the font size to local storage
    localStorage.setItem('fontSize', newSize);
}

// Function to apply font size based on local storage
function applyFontSizeFromLocalStorage() {
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        const html = document.documentElement;
        html.style.fontSize = fontSize;
    }
}

// Call the function to apply font size when the page loads
document.addEventListener('DOMContentLoaded', applyFontSizeFromLocalStorage);


function redirectToHome() {
    window.location.href = 'index.html';
}

function redirectToHealthCare() {
    window.location.href = 'health-care-results.html';
}

function redirectToSettings() {
    window.location.href = 'settings.html';
}

function calculateBMI() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultElement = document.getElementById('result');

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value) / 100; // Convert height to meters

    if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
        resultElement.textContent = 'Please enter valid weight and height values.';
    } else {
        const bmi = weight / (height * height);
        resultElement.textContent = `Your BMI is: ${bmi.toFixed(2)}`;

        // Determine BMI category
        let category = '';
        if (bmi < 18.5) {
            category = 'underweight';
        } else if (bmi < 25) {
            category = 'normal';
        } else {
            category = 'overweight';
        }

        // Notify the user with the BMI category
        const notification = `Your BMI category is: ${category.toUpperCase()}`;
        alert(notification);

        // Save BMI result and category to local storage
        localStorage.setItem('bmiResult', JSON.stringify({ bmi: bmi.toFixed(2), category }));
    }
}


// Function to save target calorie intake to local storage
function saveTargetCalories() {
    const targetCaloriesInput = document.getElementById('targetCaloriesInput').value;
    localStorage.setItem('targetCalories', targetCaloriesInput);
    alert("Target calorie intake saved!");
    displaySavedCalories(); // Display the saved target calorie intake
    resetRemainingCalories(); // Reset remaining calories
}

// Function to reset remaining calories to target calorie intake
function resetRemainingCalories() {
    const targetCalories = parseInt(localStorage.getItem('targetCalories')) || 0;
    localStorage.setItem('remainingCalories', targetCalories);
    updateRemainingCaloriesDisplay(); // Update the display of remaining target calories
}

// Function to display the saved target calorie intake
function displaySavedCalories() {
    const savedCalorieDisplay = document.getElementById('savedCalorieValue');
    const savedCalories = localStorage.getItem('targetCalories');
    savedCalorieDisplay.textContent = savedCalories || 'Not set';
}

// Function to subtract consumed calories from the target and update remaining calories display
// Function to subtract consumed calories from the target and update remaining calories display
function subtractConsumedCalories() {
    const consumedCaloriesInput = document.getElementById('consumedCaloriesInput').value;
    const targetCalories = parseInt(localStorage.getItem('targetCalories')) || 0;
    let remainingCalories = parseInt(localStorage.getItem('remainingCalories')) || targetCalories;

    if (consumedCaloriesInput && !isNaN(consumedCaloriesInput)) {
        const consumedCalories = parseInt(consumedCaloriesInput);
        remainingCalories -= consumedCalories;
        if (remainingCalories < 0) {
            remainingCalories = 0; // Ensure remaining calories doesn't go below 0
        }
        localStorage.setItem('remainingCalories', remainingCalories);
        updateRemainingCaloriesDisplay(); // Update the display of remaining target calories
    } else {
        alert("Please enter a valid number for consumed calories.");
    }
}

// Function to update remaining calories display
function updateRemainingCaloriesDisplay() {
    const remainingCalories = parseInt(localStorage.getItem('remainingCalories')) || 0;

    const remainingCalorieDisplay = document.getElementById('remainingCalorieValue');
    remainingCalorieDisplay.textContent = remainingCalories;

    //if (remainingCalories === 0) {alert("You have reached your target calorie intake!");}
}


// Function to display saved target calorie intake when the settings page loads
function displayTargetCalories() {
    displaySavedCalories();
    updateRemainingCaloriesDisplay();
}

// Call the displayTargetCalories function when the settings page loads
document.addEventListener('DOMContentLoaded', displayTargetCalories);




function saveTargetWaterIntake() {
    const targetWaterInput = document.getElementById('targetWaterInput').value;
    localStorage.setItem('targetWaterIntake', targetWaterInput);
    alert("Target water intake saved!");
    updateRemainingWaterDisplay(); // Update the display of remaining target water intake
}

// Function to display saved target water intake when the settings page loads
function displayTargetWaterIntake() {
    const targetWaterIntake = localStorage.getItem('targetWaterIntake');
    if (targetWaterIntake) {
        document.getElementById('targetWaterInput').value = targetWaterIntake;
    }
}

// Call the displayTargetWaterIntake function when the settings page loads
document.addEventListener('DOMContentLoaded', displayTargetWaterIntake);

// Function to subtract consumed water from the target intake
function drinkWater() {
    let consumedWater = parseInt(localStorage.getItem('consumedWater')) || 0;
    const cupSize = 250; // Assuming 1 cup = 250ml

    consumedWater += cupSize;
    localStorage.setItem('consumedWater', consumedWater);

    updateRemainingWaterDisplay(); // Update the display
}

// Function to reset consumed water at the start of each day// Function to reset consumed water after 24 hours
function resetConsumedWater() {
    const lastResetTime = localStorage.getItem('lastWaterResetTime');
    if (lastResetTime) {
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        const currentTime = new Date().getTime();
        if (currentTime - parseInt(lastResetTime) >= twentyFourHoursInMs) {
            // Reset consumed water by removing it from local storage
            localStorage.removeItem('consumedWater');
            // Update the last reset time
            localStorage.setItem('lastWaterResetTime', currentTime.toString());
        }
    } else {
        // If no last reset time exists, set it to the current time
        const currentTime = new Date().getTime();
        localStorage.setItem('lastWaterResetTime', currentTime.toString());
    }
}

// Call the resetConsumedWater function to reset consumed water after 24 hours
resetConsumedWater();

// Function to update the remaining target water intake display
function updateRemainingWaterDisplay() {
    const targetWaterIntake = parseInt(localStorage.getItem('targetWaterIntake')) || 0;
    let consumedWater = parseInt(localStorage.getItem('consumedWater')) || 0;
    
    const remainingWater = targetWaterIntake - consumedWater;

    const remainingWaterDisplay = document.getElementById('remainingWater');
    remainingWaterDisplay.textContent = `Remaining target water intake: ${remainingWater > 0 ? remainingWater : 0}ml`;
}

// Call the function to update the remaining water display when the page loads
updateRemainingWaterDisplay();

