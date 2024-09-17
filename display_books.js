let booklist = [];
let currentPage = 1;
let itemsPerPage = 5;

const fetchbookss = document.querySelector('#fetchbooks');
let mainContainer = document.querySelector('#books-container');
let paginationcontainer = document.querySelector('#pagination-container');
let searchingInput = document.querySelector('#search');
let sortingItem = document.querySelector('#sorting');
let priceFilter = document.querySelector('#price-filter');

// generate random price between 100 and 1000
function generateRandomPrice() {
    return (Math.random() * (1000 - 100) + 100).toFixed(2);
}

fetchbookss.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    const url = 'https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=t5Gt5GYEI1wYYs6RyiIJr6UVXnhiE3Av';

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            booklist = data.results.books.map(book => {
                // Modify the price to a random value
                return {
                    ...book,
                    price: generateRandomPrice()
                };
            });
            displayBooks();
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Failed to fetch books:', xhr.statusText);
        }
    };

    xhr.send();
});

function displayBooks() {
    mainContainer.innerHTML = "";
    let filteredBooks = booklist.filter(book => book.title.toLowerCase().includes(searchingInput.value.toLowerCase()));

    // sorting based on the title
    if (sortingItem.value === 'asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    }

    // price filtering
    const selectedPriceFilter = priceFilter.value;
    filteredBooks = filteredBooks.filter(book => {
        const price = parseFloat(book.price);  // Convert the string price to a number
        if (selectedPriceFilter === '200-500') {
            return price >= 200 && price <= 500;
        } else if (selectedPriceFilter === '500-800') {
            return price > 500 && price <= 800;
        } else if (selectedPriceFilter === 'over-800') {
            return price > 800;
        } else {
            return true; // "All Prices" selected
        }
    });

    let paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    for (let i = 0; i < paginatedBooks.length; i++) {
        let bookimg = document.createElement('img');
        bookimg.src = paginatedBooks[i].book_image;
        bookimg.height = 100;
        bookimg.width = 100;

        let title = document.createElement('div');
        title.textContent = paginatedBooks[i].title;

        let description = document.createElement('div');
        description.textContent = paginatedBooks[i].description;

        let price = document.createElement('div');
        price.textContent = `Price: ₹${paginatedBooks[i].price}`;

        let container = document.createElement('div');
        container.appendChild(bookimg);
        container.appendChild(title);
        container.appendChild(description);
        container.appendChild(price);
        mainContainer.appendChild(container);
    }
    displayPagination(filteredBooks.length);
}

// Update books whenever the search input or sorting is changed
searchingInput.addEventListener('input', () => {
    currentPage = 1;
    displayBooks();
});

sortingItem.addEventListener('change', () => {
    displayBooks();
});

// Update books when the price filter is changed
priceFilter.addEventListener('change', () => {
    displayBooks();
});

function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationcontainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationcontainer.appendChild(pageButton);
    }
}
