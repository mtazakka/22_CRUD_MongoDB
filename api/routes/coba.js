const listItems = document.querySelectorAll('.list li');
const prevButton = document.querySelector('.button-prev');
const nextButton = document.querySelector('.button-next');
let current_page = 1;
let records_per_page = 10;

function addEventListeners() {
    prevButton.addEventListener('click', prevPage);
    nextButton.addEventListener('click', nextPage);
}

function changePage(page) {
    if (page < 1) {
        page = 1;
    }
    if (page > (numPages() - 1)) {
        page = numPages();
    }
    for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < listItems.length; i++) {
        listItems[i].setAttribute('data-page', page)
    }
    checkButtonAvailability()
    showCurrentPage(page)
}

function showCurrentPage(page) {
    Array.prototype.forEach.call(listItems, (item) => {
        if (Number(item.getAttribute('data-page')) === page) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}

function checkButtonAvailability() {
    current_page == 1 ? prevButton.classList.add('hidden') : prevButton.classList.remove('hidden');
    current_page == numPages() ? nextButton.classList.add('hidden') : nextButton.classList.remove('hidden');
}

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function numPages() {
    return Math.ceil(listItems.length / records_per_page);
}

changePage(1);
addEventListeners();