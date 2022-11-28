/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createListItem, deleteList, editListItem, getListItems } from './fetch-utils.js';
import { renderListItem } from './render-utils.js';

/* Get DOM Elements */
const form = document.querySelector('.create-form');
const deleteButton = document.querySelector('#delete-button');
const listEl = document.querySelector('.list');
const error = document.querySelector('#error');

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
    form.reset();

    // - send the new item to supabase and create a new row
    const newItem = await createListItem(item, rating);
    if (newItem) {
        await fetchAndDisplayList();
    } else {
        error.textContent = 'Something went wrong while adding your favorite';
    }
});

/* Display Functions */
async function fetchAndDisplayList() {
    listEl.textContent = '';
    // - call supabase to fetch all shopping items for this user
    const list = await getListItems();
    if (list) {
        // - loop through those items, create DOM elements, and append -- render items differently if "bought: true"
        for (let item of list) {
            const listItemEl = renderListItem(item);

            listItemEl.addEventListener('click', async () => {
                // change the boolean
                await editListItem(item);

                // after we update the data, let's fetch and render it again
                fetchAndDisplayList();
            });

            if (item.cross_out) {
                listItemEl.classList.add('cross-out-true');
            }

            listEl.append(listItemEl);
        }
    } else {
        error.textContent = 'Something went wrong getting your favorites';
    }
}
