// js/card.js

import { getCard } from "./github.js";

// ==========================
// Elements
// ==========================

const backButton = document.getElementById("backButton");
const editButton = document.getElementById("editButton");

const frontImage = document.getElementById("frontImage");
const backImage = document.getElementById("backImage");

const cardName = document.getElementById("cardName");
const cardSet = document.getElementById("cardSet");
const cardNumber = document.getElementById("cardNumber");

const frontLR = document.getElementById("frontLR");
const frontTB = document.getElementById("frontTB");

const backLR = document.getElementById("backLR");
const backTB = document.getElementById("backTB");

const notes = document.getElementById("notes");

// ==========================
// Get Card ID
// ==========================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

if (!id) {

    alert("Missing card ID.");

    window.location.href = "index.html";

}

// ==========================
// Buttons
// ==========================

backButton.addEventListener("click", () => {

    window.location.href = "index.html";

});

editButton.addEventListener("click", () => {

    window.location.href = `upload.html?id=${id}`;

});

// ==========================
// Load Card
// ==========================

loadCard();

async function loadCard() {

    try {

        const card = await getCard(id);

        populateCard(card);

    }
    catch (error) {

        console.error(error);

        alert("Unable to load card.");

        window.location.href = "index.html";

    }

}

// ==========================
// Populate Page
// ==========================

function populateCard(card) {

    document.title = card.name;

    frontImage.src = card.frontImage;

    frontImage.alt = `${card.name} Front`;

    if (card.backImage) {

        backImage.src = card.backImage;

        backImage.alt = `${card.name} Back`;

    }
    else {

        backImage.style.display = "none";

    }

    cardName.textContent = card.name;

    cardSet.textContent = card.set;

    cardNumber.textContent = card.number;

    frontLR.textContent =
        card.frontCentering?.lr ?? "-";

    frontTB.textContent =
        card.frontCentering?.tb ?? "-";

    backLR.textContent =
        card.backCentering?.lr ?? "-";

    backTB.textContent =
        card.backCentering?.tb ?? "-";

    notes.textContent =
        card.notes || "No notes.";

}
