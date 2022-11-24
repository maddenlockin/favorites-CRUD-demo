export function renderListItem(item) {
    const listItemEl = document.createElement('li');
    listItemEl.classList.add('list-item');

    listItemEl.textContent = `${item.item}: ${item.rating}/10`;

    return listItemEl;
}
