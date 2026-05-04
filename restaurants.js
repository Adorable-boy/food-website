// Get DOM references for restaurant search and list display
const searchInput = document.getElementById('restaurant-search');
const restaurantList = document.getElementById('restaurant-list');
const noResults = document.getElementById('no-results');
// Storage key used for user-submitted restaurants shared with profile page
const PROFILE_STORAGE_KEY = 'userRestaurants';

// Load user-created restaurant entries from localStorage
function loadUserRestaurants() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Create a restaurant card element for the listing page
function createRestaurantCard(restaurant, isUserCreated = false) {
  const card = document.createElement('div');
  card.className = 'resturant';
  card.dataset.name = restaurant.name;
  card.dataset.cuisine = restaurant.cuisine;
  card.dataset.location = restaurant.location;

  // Use provided image or fallback to a default food image
  const image = document.createElement('img');
  image.src = restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  image.alt = restaurant.name;

  const content = document.createElement('div');
  content.className = 'resturant-content';

  const topRow = document.createElement('div');
  topRow.className = 'resturant-top';

  const title = document.createElement('h3');
  title.textContent = restaurant.name;

  const badge = document.createElement('span');
  badge.className = `badge ${getBadgeClass(restaurant.status || 'Open now')}`;
  badge.textContent = restaurant.status || 'Open now';

  topRow.append(title, badge);

  const cuisine = document.createElement('p');
  cuisine.className = 'cuisine';
  cuisine.textContent = `${restaurant.cuisine} • ${restaurant.location}`;

  const meta = document.createElement('div');
  meta.className = 'meta';

  const rating = document.createElement('span');
  rating.className = 'rating';
  rating.textContent = `★ ${restaurant.rating || '4.5'}`;

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = restaurant.price || '$$';

  meta.append(rating, price);
  content.append(topRow, cuisine, meta);
  card.append(image, content);

  return card;
}

// Select CSS class for restaurant status badges
function getBadgeClass(status) {
  const classMap = {
    'Open now': 'open',
    'Delivery': 'delivery',
    'Healthy': 'healthy',
    'Chef Special': 'chef',
    'Dessert': 'dessert'
  };
  return classMap[status] || 'open';
}

// Render both hardcoded and user-created restaurants on the page
function renderAllRestaurants() {
  // Load saved restaurant entries from localStorage
  const userRestaurants = loadUserRestaurants();

  // Remove any previously appended user-created cards first
  const userCards = restaurantList.querySelectorAll('.user-created');
  userCards.forEach(card => card.remove());

  // Append each saved restaurant as a card element
  userRestaurants.forEach(restaurant => {
    const card = createRestaurantCard(restaurant, true);
    card.classList.add('user-created');
    restaurantList.appendChild(card);
  });

  // Keep a reference to all visible restaurant cards for filtering
  window.restaurantCards = Array.from(document.querySelectorAll('.resturant'));
}

// Filter restaurant cards based on the search input value
function filterRestaurants() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  window.restaurantCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const cuisine = card.dataset.cuisine.toLowerCase();
    const location = (card.dataset.location || '').toLowerCase();
    const matches = !query || name.includes(query) || cuisine.includes(query) || location.includes(query);

    card.style.display = matches ? '' : 'none';
    if (matches) visibleCount += 1;
  });

  // Show a no-results message when nothing matches the search
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Set up event listeners when the search input exists
if (searchInput) {
  searchInput.addEventListener('input', filterRestaurants);
  document.addEventListener('DOMContentLoaded', () => {
    renderAllRestaurants();
    filterRestaurants();
  });
}

// Listen for storage changes (when user adds restaurants in profile page)
// Listen for changes to localStorage so the restaurant page updates when new entries are added from the profile page
window.addEventListener('storage', (e) => {
  if (e.key === PROFILE_STORAGE_KEY) {
    renderAllRestaurants();
    filterRestaurants();
  }
});

// Initial render of stored user restaurants when the script loads
renderAllRestaurants();
