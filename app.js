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
                throw new Error('Failed to fetch destinations');
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

// Add a new destination
if (window.location.pathname.endsWith('create.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('create-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const costValue = document.getElementById('cost').value.trim();

            if (!/^\$\d+(-\$\d+)?$/.test(costValue)) {
                alert("Cost must be in the format $5000 or $5000-$9000.");
                return;
            }

            const newDestination = {
                id: Date.now(),
                name: document.getElementById('name').value,
                country: document.getElementById('country').value,
                bestSeason: document.getElementById('bestSeason').value,
                attractions: document.getElementById('attractions').value,
                cost: costValue,
            };

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
                const costValue = document.getElementById('cost').value.trim();

                if (!/^\$\d+(-\$\d+)?$/.test(costValue)) {
                    alert("Cost must be in the format $5000 or $5000-$9000.");
                    return;
                }

                destination.name = document.getElementById('name').value;
                destination.country = document.getElementById('country').value;
                destination.bestSeason = document.getElementById('bestSeason').value;
                destination.attractions = document.getElementById('attractions').value;
                destination.cost = costValue;

                localStorage.setItem('destinations', JSON.stringify(destinations));
                window.location.href = 'index.html';
            });
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

// Fetch and display a single destination's details
async function fetchDestinationDetails() {
    const params = new URLSearchParams(window.location.search);
    const destinationId = parseInt(params.get('id'));

    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    const destination = destinations.find(d => d.id === destinationId);

    const detailsContainer = document.getElementById('destination-details');
    if (destination && detailsContainer) {
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
}

// Load destination details if on destination.html
if (window.location.pathname.endsWith('destination.html')) {
    document.addEventListener('DOMContentLoaded', fetchDestinationDetails);
}

// Fetch destinations on index.html load
if (window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', fetchDestinations);
}
