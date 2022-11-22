/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createListItem, getListItems } from './fetch-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.create-form');
// const deleteButton = document.querySelector('.delete');
const listEl = document.querySelector('.list');

fetchAndDisplayList();

/* Events */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const item = data.get('item');
    const rating = data.get('rating');

    // - send the new item to supabase and create a new row
    await createListItem(item, rating);

    form.reset();

    await fetchAndDisplayList();
});

/* Display Functions */
async function fetchAndDisplayList() {
    // - call supabase to fetch all shopping items for this user
    const list = await getListItems();

    // - loop through those items, create DOM elements, and append -- render items differently if "bought: true"
    listEl.textContent = '';
    for (let item of list) {
        const listItemEl = document.createElement('p');

        listItemEl.classList.add('list-item');

        listItemEl.textContent = `${item.item}: ${item.rating}/10`;

        listEl.append(listItemEl);
    }
}
