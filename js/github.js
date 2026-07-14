```javascript
// js/github.js

const API_URL = "/api/github";

/**
 * Internal helper for making requests to the API.
 */
async function request(action, method = "GET", body = null) {

    let url = `${API_URL}?action=${encodeURIComponent(action)}`;

    const options = {
        method
    };

    if (method === "POST") {

        options.headers = {
            "Content-Type": "application/json"
        };

        options.body = JSON.stringify(body);

    }
    else if (body) {

        const params = new URLSearchParams(body);

        url += "&" + params.toString();

    }

    const response = await fetch(url, options);

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.error || "Request failed.");

    }

    return data;

}

/* ============================
   Homepage
============================ */

export async function getCardIndex() {

    return await request("index");

}

/* ============================
   Load One Card
============================ */

export async function getCard(id) {

    return await request("card", "GET", {
        id
    });

}

/* ============================
   Save Card
============================ */

export async function saveCard(card) {

    return await request("save", "POST", card);

}

/* ============================
   Delete Card
============================ */

export async function deleteCard(id) {

    return await request("delete", "POST", {
        id
    });

}

/* ============================
   Next Available ID
============================ */

export async function getNextCardID() {

    return await request("nextid");

}

/* ============================
   Upload Image
============================ */

export async function uploadImage(file, id, side) {

    const formData = new FormData();

    formData.append("image", file);
    formData.append("id", id);
    formData.append("side", side);

    const response = await fetch(
        `${API_URL}?action=upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.error || "Image upload failed.");

    }

    return data;

}
```
