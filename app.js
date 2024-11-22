const apiUrl = 'https://travel-destinations.free.beeceptor.com/destinations'; // Your Beeceptor API endpoint

// Fetch and display all destinations
async function fetchDestinations() {
    let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    if (destinations.length === 0) {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                destinations = data.destinations;
                localStorage.setItem('destinations', JSON.stringify(destinations));
            } else {
                console.error('Failed to fetch destinations from API.');
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    }
    displayDestinations(destinations);
}

// Display destinations on index.html
function displayDestinations(destinations) {
    const destinationList = document.getElementById('destination-list');
    if (!destinationList) return;
    destinationList.innerHTML = destinations.map(destination => `
        <div class="destination-item" id="destination-${destination.id}">
            <a href="destination.html?id=${destination.id}">
                <h2>${destination.name}</h2>
                <p><strong>Country:</strong> ${destination.country}</p>
            </a>
            <button onclick="window.location.href='edit.html?id=${destination.id}'">Edit</button>
            <button onclick="deleteDestination(${destination.id})">Delete</button>
        </div>
    `).join('');
}

// Validate text inputs (letters, spaces, commas, and hyphens)
function validateTextInput(inputValue, fieldName) {
    if (!/^[A-Za-z\s,.-]+$/.test(inputValue)) {
        alert(`${fieldName} should only contain letters, spaces, commas, and hyphens.`);
        return false;
    }
    return true;
}

// Validate cost input
function validateCostInput(costValue) {
    if (!/^\$\d+(-\$\d+)?$/.test(costValue)) {
        alert('Cost must be in the format $5000 or $5000-$9000.');
        return false;
    }
    return true;
}

// Add a new destination
if (window.location.pathname.endsWith('create.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('create-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const country = document.getElementById('country').value.trim();
            const bestSeason = document.getElementById('bestSeason').value.trim();
            const attractions = document.getElementById('attractions').value.trim();
            const cost = document.getElementById('cost').value.trim();

            if (
                !validateTextInput(name, 'Name') ||
                !validateTextInput(country, 'Country') ||
                !validateTextInput(bestSeason, 'Best Season') ||
                !validateTextInput(attractions, 'Attractions') ||
                !validateCostInput(cost)
            ) {
                return;
            }

            const newDestination = { id: Date.now(), name, country, bestSeason, attractions, cost };
            let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
            destinations.push(newDestination);
            localStorage.setItem('destinations', JSON.stringify(destinations));
            window.location.href = 'index.html';
        });
    });
}

// Edit an existing destination
if (window.location.pathname.endsWith('edit.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const destinationId = parseInt(params.get('id'));
        const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
        const destination = destinations.find(d => d.id === destinationId);
        if (destination) {
            document.getElementById('name').value = destination.name;
            document.getElementById('country').value = destination.country;
            document.getElementById('bestSeason').value = destination.bestSeason;
            document.getElementById('attractions').value = destination.attractions;
            document.getElementById('cost').value = destination.cost;

            document.getElementById('edit-form').addEventListener('submit', (event) => {
                event.preventDefault();

                const name = document.getElementById('name').value.trim();
                const country = document.getElementById('country').value.trim();
                const bestSeason = document.getElementById('bestSeason').value.trim();
                const attractions = document.getElementById('attractions').value.trim();
                const cost = document.getElementById('cost').value.trim();

                if (
                    !validateTextInput(name, 'Name') ||
                    !validateTextInput(country, 'Country') ||
                    !validateTextInput(bestSeason, 'Best Season') ||
                    !validateTextInput(attractions, 'Attractions') ||
                    !validateCostInput(cost)
                ) {
                    return;
                }

                destination.name = name;
                destination.country = country;
                destination.bestSeason = bestSeason;
                destination.attractions = attractions;
                destination.cost = cost;

                localStorage.setItem('destinations', JSON.stringify(destinations));
                window.location.href = 'index.html';
            });
        } else {
            alert('Destination not found.');
            window.location.href = 'index.html';
        }
    });
}

// Delete a destination
function deleteDestination(destinationId) {
    let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    destinations = destinations.filter(destination => destination.id !== destinationId);
    localStorage.setItem('destinations', JSON.stringify(destinations));
    fetchDestinations();
}

// Fetch and display destination details
if (window.location.pathname.endsWith('destination.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const destinationId = parseInt(params.get('id'));
        const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
        const destination = destinations.find(d => d.id === destinationId);

        const detailsContainer = document.getElementById('destination-details');
        if (destination) {
            detailsContainer.innerHTML = `
                <h1>${destination.name}</h1>
                <p><strong>Country:</strong> ${destination.country}</p>
                <p><strong>Best Season to Visit:</strong> ${destination.bestSeason}</p>
                <p><strong>Top Attractions:</strong> ${destination.attractions}</p>
                <p><strong>Approximate Cost:</strong> ${destination.cost}</p>
                <button onclick="window.location.href='edit.html?id=${destination.id}'">Edit Destination</button>
            `;
        } else {
            detailsContainer.innerHTML = `<p>Destination not found.</p>`;
        }
    });
}

// Load all destinations on index.html
if (window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', fetchDestinations);
}
