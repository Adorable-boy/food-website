// Storage key used for saving user-submitted restaurant entries
const PROFILE_STORAGE_KEY = 'userRestaurants';
// DOM references for the profile submission form and restaurant preview list
const restaurantForm = document.getElementById('restaurant-form');
const restaurantList = document.getElementById('submitted-restaurants');
const noResultsMessage = document.getElementById('profile-no-results');

// Load saved restaurants from localStorage for the profile page
function loadRestaurants() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save restaurants to localStorage and broadcast the update to other open pages
function saveRestaurants(restaurants) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(restaurants));
  window.dispatchEvent(new StorageEvent('storage', {
    key: PROFILE_STORAGE_KEY,
    newValue: JSON.stringify(restaurants)
  }));
}

// Return a default image URL if none was provided by the user
function getImageUrl(value) {
  if (!value) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
  return value;
}

// Build a card element for each restaurant submitted in the profile page
function createRestaurantCard(restaurant, index) {
  const card = document.createElement('div');
  card.className = 'submitted-card';

  const badge = document.createElement('span');
  badge.className = `card-badge ${restaurant.status.toLowerCase().replace(/\s+/g, '-')}`;
  badge.textContent = restaurant.status;

  const image = document.createElement('img');
  image.src = getImageUrl(restaurant.image);
  image.alt = restaurant.name;

  const content = document.createElement('div');
  content.className = 'submitted-content';

  const titleRow = document.createElement('div');
  titleRow.className = 'submitted-title-row';

  const title = document.createElement('h4');
  title.textContent = restaurant.name;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => removeRestaurant(index));

  titleRow.append(title, removeButton);

  const details = document.createElement('p');
  details.className = 'submitted-details';
  details.textContent = `${restaurant.cuisine} • ${restaurant.location}`;

  const meta = document.createElement('div');
  meta.className = 'submitted-meta';
  meta.innerHTML = `<span>★ ${restaurant.rating}</span><span>${restaurant.price}</span>`;

  content.append(titleRow, details, meta);
  card.append(badge, image, content);
  return card;
}

// Render the list of saved restaurants on the profile page
function renderRestaurants() {
  const restaurants = loadRestaurants();
  restaurantList.innerHTML = '';

  if (restaurants.length === 0) {
    noResultsMessage.style.display = 'block';
    return;
  }

  noResultsMessage.style.display = 'none';
  restaurants.forEach((restaurant, index) => {
    restaurantList.appendChild(createRestaurantCard(restaurant, index));
  });
}

// Remove a restaurant from saved data using its index and refresh the view
function removeRestaurant(index) {
  const restaurants = loadRestaurants();
  restaurants.splice(index, 1);
  saveRestaurants(restaurants);
  renderRestaurants();
}

// Handle user form submission and save a new restaurant entry
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(restaurantForm);

  const newRestaurant = {
    name: formData.get('name').trim(),
    cuisine: formData.get('cuisine').trim(),
    location: formData.get('location').trim(),
    price: formData.get('price'),
    rating: parseFloat(formData.get('rating')).toFixed(1),
    status: formData.get('status'),
    image: formData.get('image').trim(),
  };

  if (!newRestaurant.name || !newRestaurant.cuisine || !newRestaurant.location) {
    alert('Please complete the required fields.');
    return;
  }

  const restaurants = loadRestaurants();
  restaurants.unshift(newRestaurant);
  saveRestaurants(restaurants);
  restaurantForm.reset();
  renderRestaurants();
}

// Attach the submit listener if the form exists
if (restaurantForm) {
  restaurantForm.addEventListener('submit', handleSubmit);
}

// Render saved restaurants on page load
renderRestaurants();
