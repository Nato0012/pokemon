// js/upload.js

import {
    getCard,
    getNextCardID,
    saveCard
} from "./github.js";

/* ==========================
   Elements
========================== */

const pageTitle = document.getElementById("pageTitle");

const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

const cardName = document.getElementById("cardName");
const cardSet = document.getElementById("cardSet");
const cardNumber = document.getElementById("cardNumber");

const frontImage = document.getElementById("frontImage");
const backImage = document.getElementById("backImage");

const frontPreview = document.getElementById("frontPreview");
const backPreview = document.getElementById("backPreview");

const frontLR = document.getElementById("frontLR");
const frontTB = document.getElementById("frontTB");

const backLR = document.getElementById("backLR");
const backTB = document.getElementById("backTB");

const notes = document.getElementById("notes");

/* ==========================
   Variables
========================== */

const params = new URLSearchParams(window.location.search);

const editID = params.get("id");

let isEditing = editID !== null;

let currentCard = null;

/* ==========================
   Initialize
========================== */

document.addEventListener("DOMContentLoaded", async () => {

    cancelButton.addEventListener("click", () => {

        history.back();

    });

    saveButton.addEventListener("click", saveCurrentCard);

    frontImage.addEventListener("change", previewFrontImage);

    backImage.addEventListener("change", previewBackImage);

    if (isEditing) {

        pageTitle.textContent = "Edit Card";

        await loadExistingCard();

    }

});

/* ==========================
   Load Existing Card
========================== */

async function loadExistingCard() {

    try {

        currentCard = await getCard(editID);

        populateForm(currentCard);

    }
    catch (error) {

        console.error(error);

        alert("Unable to load card.");

        window.location.href = "index.html";

    }

}

/* ==========================
   Populate Form
========================== */

function populateForm(card) {

    cardName.value = card.name;

    cardSet.value = card.set;

    cardNumber.value = card.number;

    frontLR.value = card.frontCentering?.lr ?? "";

    frontTB.value = card.frontCentering?.tb ?? "";

    backLR.value = card.backCentering?.lr ?? "";

    backTB.value = card.backCentering?.tb ?? "";

    notes.value = card.notes ?? "";

    if (card.frontImage) {

        frontPreview.src = card.frontImage;

        frontPreview.style.display = "block";

    }

    if (card.backImage) {

        backPreview.src = card.backImage;

        backPreview.style.display = "block";

    }

}

/* ==========================
   Image Preview
========================== */

function previewFrontImage() {

    const file = frontImage.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        frontPreview.src = e.target.result;

        frontPreview.style.display = "block";

    };

    reader.readAsDataURL(file);

}

function previewBackImage() {

    const file = backImage.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        backPreview.src = e.target.result;

        backPreview.style.display = "block";

    };

    reader.readAsDataURL(file);

}
/* ==========================
   Save Card
========================== */

async function saveCurrentCard() {

    if (!validateForm()) {
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {

        let id;

        if (isEditing) {

            id = editID;

        } else {

            id = await getNextCardID();

        }

        const card = {

            id,

            name: cardName.value.trim(),

            set: cardSet.value.trim(),

            number: cardNumber.value.trim(),

            frontImage: `images/front/${id}.jpg`,

            backImage: backImage.files.length
                ? `images/back/${id}.jpg`
                : currentCard?.backImage || "",

            frontCentering: {

                lr: frontLR.value.trim(),

                tb: frontTB.value.trim()

            },

            backCentering: {

                lr: backLR.value.trim(),

                tb: backTB.value.trim()

            },

            notes: notes.value.trim(),

            images: {

                front: frontImage.files[0] || null,

                back: backImage.files[0] || null

            }

        };

        await saveCard(card);

        alert("Card saved successfully!");

        window.location.href = `card.html?id=${id}`;

    }
    catch (error) {

        console.error(error);

        alert("Unable to save card.");

    }
    finally {

        saveButton.disabled = false;

        saveButton.textContent = "Save";

    }

}

/* ==========================
   Validation
========================== */

function validateForm() {

    if (cardName.value.trim() === "") {

        alert("Please enter a card name.");

        cardName.focus();

        return false;

    }

    if (cardSet.value.trim() === "") {

        alert("Please enter a set.");

        cardSet.focus();

        return false;

    }

    if (cardNumber.value.trim() === "") {

        alert("Please enter a card number.");

        cardNumber.focus();

        return false;

    }

    if (!isEditing && frontImage.files.length === 0) {

        alert("Please select a front image.");

        frontImage.focus();

        return false;

    }

    return true;

}
