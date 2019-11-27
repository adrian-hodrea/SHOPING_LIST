class ListItem {
    constructor (listItemData) {
        this.checked = listItemData.checked;
        this.description = listItemData.description;
        this.quantity = listItemData.quantity;
    }

    static nrOfItems = 0;
}

// export { ListItem };