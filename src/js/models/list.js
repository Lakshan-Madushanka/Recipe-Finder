import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),  
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // console.log( this.items.find(el => el.id === id));
        // console.log( this.items.find(el => el.id === id).count);

       var a = this.items.find(el => el.id === id); 

       a.count = newCount;

    }
}

