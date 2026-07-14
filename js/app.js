// js/app.js

const searchBox = document.getElementById("searchBox");
const addButton = document.getElementById("addButton");
const cardGrid = document.getElementById("cardGrid");
const cardTemplate = document.getElementById("cardTemplate");

let cards = [];
let filteredCards = [];

/* ===========================
   Initialize
=========================== */

document.addEventListener("DOMContentLoaded", async () => {

    addButton.addEventListener("click", () => {
        window.location.href = "upload.html";
    });

    searchBox.addEventListener("input", searchCards);

    await loadCards();

});

/* ===========================
   Load Homepage Card List
=========================== */

async function loadCards() {

    try {

        const response = await fetch("data/cards.json");

        if (!response.ok) {
            throw new Error("Unable to load cards.");
        }

        cards = await response.json();

        sortCards();

        filteredCards = [...cards];

        displayCards(filteredCards);

    }
    catch (err) {

        console.error(err);

        cardGrid.innerHTML = `
            <p class="message">
                Unable to load cards.
            </p>
        `;

    }

}

/* ===========================
   Display Cards
=========================== */

function displayCards(cardList) {

    cardGrid.innerHTML = "";

    if (cardList.length === 0) {

        cardGrid.innerHTML = `
            <p class="message">
                No cards found.
            </p>
        `;

        return;

    }

    cardList.forEach(card => {

        const template = cardTemplate.content.cloneNode(true);

        const cardElement = template.querySelector(".card");

        cardElement.dataset.id = card.id;

        cardElement.addEventListener("click", () => {

            window.location.href = `card.html?id=${card.id}`;

        });

        const image = template.querySelector(".card-image");

        image.src = card.frontImage;

        image.alt = card.name;

        template.querySelector(".card-name").textContent =
            card.name;

        template.querySelector(".card-set").textContent =
            card.set;

        template.querySelector(".card-number").textContent =
            card.number;

        cardGrid.appendChild(template);

    });

}

/* ===========================
   Search
=========================== */

function searchCards() {

    const text = searchBox.value
        .trim()
        .toLowerCase();

    if (text === "") {

        filteredCards = [...cards];

        displayCards(filteredCards);

        return;

    }

    filteredCards = cards.filter(card =>

        card.name.toLowerCase().includes(text) ||

        card.set.toLowerCase().includes(text) ||

        card.number.toLowerCase().includes(text)

    );

    displayCards(filteredCards);

}

/* ===========================
   Sort Alphabetically
=========================== */

function sortCards() {

    cards.sort((a, b) => {

        if (a.name !== b.name) {

            return a.name.localeCompare(b.name);

        }

        if (a.set !== b.set) {

            return a.set.localeCompare(b.set);

        }

        return a.number.localeCompare(b.number);

    });

}
