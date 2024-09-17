
        async function fetchHostels() {
            const response = await fetch('https://raw.githubusercontent.com/malavika920/wsdlab7/main/hostel.json');
            const data = await response.json();
            populateHostels(data);
        }

        function populateHostels(data) {
            const gridContainer = document.getElementById('hostelGrid');
            gridContainer.innerHTML = ''; // Clear existing data

            data.forEach(hostel => {
                const card = document.createElement('div');
                card.classList.add('hostel-card');
                card.innerHTML = `
                    <img src="${hostel.imageUrl}" alt="${hostel.hostelName}">
                    <h3>${hostel.hostelName}</h3>
                    <p>${hostel.description}</p>
                    <p>Room Type: ${hostel.roomType}</p>
                    <p>Price per Night: ${hostel.pricePerNight}</p>
                    <p>Rating: ${hostel.rating}</p>
                    <p>Location: ${hostel.location}</p>
                `;
                gridContainer.appendChild(card);
            });
        }

        function filterHostels() {
            const searchQuery = document.getElementById('search').value.toLowerCase();
            const cards = document.querySelectorAll('.hostel-card');
            cards.forEach(card => {
                const hostelName = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = hostelName.includes(searchQuery) ? '' : 'none';
            });
        }

        window.onload = fetchHostels;

