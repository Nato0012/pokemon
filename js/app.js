// js/app.js

const searchBox = document.getElementById("searchBox");
const addButton = document.getElementById("addButton");
const cardGrid = document.getElementById("cardGrid");
const cardTemplate = document.getElementById("cardTemplate");

let cards = [];
let filteredCards = [];

/* ---------------------------- */
/* Initialize */
/* ---------------------------- */

document.addEventListener("DOMContentLoaded", async () => {

    addButton.addEventListener("click", () => {
        window.location.href = "upload.html";
    });

    searchBox.addEventListener("input", searchCards);

    await loadCards();

});

/* ---------------------------- */
/* Load Cards */
/* ---------------------------- */

async function loadCards() {

    try {

        const response = await fetch("data/cards.json");

        if (!response.ok)
            throw new Error("Unable to load cards.");

        cards = await response.json();

        sortCards();

        filteredCards = [...cards];

        displayCards(filteredCards);

    }
    catch (error) {

        console.error(error);

        cardGrid.innerHTML = `
            <p style="font-size:18px;">
                Unable to load card database.
            </p>
        `;

    }

}

/* ---------------------------- */
/* Display Cards */
/* ---------------------------- */

function displayCards(cardList) {

    cardGrid.innerHTML = "";

    if (cardList.length === 0) {

        cardGrid.innerHTML = `
            <p style="font-size:18px;">
                No cards found.
            </p>
        `;

        return;

    }

    cardList.forEach(card => {

        const template = cardTemplate.content.cloneNode(true);

        const cardDiv = template.querySelector(".card");

        cardDiv.dataset.id = card.id;

        cardDiv.addEventListener("click", () => {

            window.location.href = `card.html?id=${card.id}`;

        });

        template.querySelector(".card-image").src =
            card.frontImage || "images/placeholder.png";

        template.querySelector(".card-image").alt =
            card.name;

        template.querySelector(".card-name").textContent =
            card.name;

        template.querySelector(".card-set").textContent =
            card.set;

        template.querySelector(".card-number").textContent =
            card.number;

        cardGrid.appendChild(template);

    });

}

/* ---------------------------- */
/* Search */
/* ---------------------------- */

function searchCards() {

    const text = searchBox.value
        .trim()
        .toLowerCase();

    if (text === "") {

        filteredCards = [...cards];

        displayCards(filteredCards);

        return;

    }

    filteredCards = cards.filter(card => {

        return (

            card.name.toLowerCase().includes(text) ||

            card.set.toLowerCase().includes(text) ||

            card.number.toLowerCase().includes(text)

        );

    });

    displayCards(filteredCards);

}

/* ---------------------------- */
/* Sort */
/* ---------------------------- */

function sortCards() {

    cards.sort((a, b) => {

        return a.name.localeCompare(b.name);

    });

}
