/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createListItem, deleteList, editListItem, getListItems } from './fetch-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.create-form');
const deleteButton = document.querySelector('#delete-button');
const listEl = document.querySelector('.list');

/* Events */
window.addEventListener('load', async () => {
    await fetchAndDisplayList();
});

deleteButton.addEventListener('click', async () => {
    await deleteList();
    await fetchAndDisplayList();
});

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
        const listItemEl = document.createElement('li');

        listItemEl.classList.add('list-item');

        listItemEl.textContent = `${item.item}: ${item.rating}/10`;

        if (item.cross_out) {
            listItemEl.classList.add('cross-out-true');
        } else {
            listItemEl.classList.remove('cross-out-true');
            listItemEl.addEventListener('click', async () => {
                // change the boolean to true
                await editListItem(item.id);

                // after we update the data, let's fetch and render it again
                fetchAndDisplayList();
            });
        }

        listEl.append(listItemEl);
    }
}
