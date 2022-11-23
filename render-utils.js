export function renderListItem(item) {
    const listItemEl = document.createElement('li');
    listItemEl.classList.add('list-item');

    listItemEl.textContent = `${item.item}: ${item.rating}/10`;

    if (item.cross_out) {
        listItemEl.classList.add('cross-out-true');
    }

    return listItemEl;
}
