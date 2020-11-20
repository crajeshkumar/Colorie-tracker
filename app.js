// Storage Controller
const StorageCtrl = (function(){

    return{
        storeItem: function(item){
            let items = [];
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item);
            localStorage.setItem('items',JSON.stringify(items));
        },
        getItemsFromStorage: function(){
            let items = [];
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateStorageItem: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(item.id === updatedItem.id){
                    items.splice(index, 1, updatedItem)
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        deleteStorageItem: function(currentItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(item.id === currentItem.id){
                    items.splice(index, 1)
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(StorageCtrl){
    const Item = function(id,name,colories){
        this.id = id;
        this.name = name;
        this.colories = colories;
    }

    // Data structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalColories: 0
    }

    
    return{
        getItem: function(){
            return data.items;
        },
        addItem: function(name, colories){
            let ID;
            if(data.items.length>0){
                ID = data.items[data.items.length - 1].id + 1;
            }
            else{
                ID = 0;
            }
            colories = parseInt(colories);
            const newItem = new Item(ID, name, colories);
            data.items.push(newItem);
            return newItem;
        },
        getTotalColories: function(){
            let totalColories = 0;
            data.items.forEach(function(item){
                totalColories += item.colories;
            });
            data.totalColories = totalColories;
            return totalColories;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        updateItem: function(changedItem){
            const name = changedItem.name;
            const colories = parseInt(changedItem.colories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === ItemCtrl.getCurrentItem().id){
                    item.name = name;
                    item.colories = colories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);
            
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        logData: function(){
            return data;
        }
    }

})(StorageCtrl);
// UI controller
const UICtrl = (function(ItemCtrl){
    const UISelector = {
        itemName: '#item-name',
        itemColories: '#item-colories',
        listGroup : '.list-group',
        listItem: '.list-group-item',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearAllBtn: '.clear-btn',
        totalColories: '.total-colories',
        editItemClass: 'edit-item'
    }

    return {
        displayItems: function(items){
            let list = '';
            items.forEach(function(item){
                list += `
                <li class="list-group-item my-2" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.colories} Colories</em>
                    <a href="#" class="float-right text-dark">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`
            });
            document.querySelector(UISelector.listGroup).innerHTML = list;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelector.itemName).value,
                colories: document.querySelector(UISelector.itemColories).value
            }
        },
        addListItem: function(item){
            // Enable list item
            document.querySelector(UISelector.listGroup).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'list-group-item my-2';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.colories} Colories</em>
                <a href="#" class="float-right text-dark">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            document.querySelector(UISelector.listGroup).insertAdjacentElement('beforeend',li);
        },
        clearInput: function(){
            document.querySelector(UISelector.itemName).value = '';
            document.querySelector(UISelector.itemColories).value = '';
        },
        clearList: function(){
            document.querySelector(UISelector.listGroup).style.display = 'none';
        },
        setTotalColories: function(totalColories){
            document.querySelector(UISelector.totalColories).textContent = totalColories;
        },
        clearEditState: function(){
            document.querySelector(UISelector.addBtn).style.display = 'inline';
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            UICtrl.clearInput();
        },
        setEditState: function(){
            document.querySelector(UISelector.addBtn).style.display = 'none';
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
        },
        addItemToForm: function(){
            document.querySelector(UISelector.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemColories).value = ItemCtrl.getCurrentItem().colories;
        },
        updateUI: function(item){
            const lis = document.querySelectorAll(UISelector.listItem);
            lis.forEach(function(li){
                if(li.id === `item-${item.id}`)
                {
                    li.innerHTML = `
                    <strong>${item.name}: </strong><em>${item.colories} Colories</em>
                    <a href="#" class="float-right text-dark">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteItem: function(id){
            const lis = document.querySelectorAll(UISelector.listItem);
            if(lis.length === 1){
                UICtrl.clearList();
            }
            const ID = `#item-${id}`;
            document.querySelector(ID).remove();
        },
        clearAllItems: function(){
            const lis = document.querySelectorAll(UISelector.listItem);
            lis.forEach(function(li){
                li.remove();
            });
            UICtrl.clearList();
        },
        getSelector: function(){
            return UISelector
        }
    }
   

})(ItemCtrl);


// App controller
const AppCtrl = (function(ItemCtrl,UICtrl,StorageCtrl){
   
    //Events Manager
    const loadEventListener = function(){
        const UISelector = UICtrl.getSelector();

        // Disable ENTER key
        document.addEventListener('keydown',function(e){
            if(e.code === 'Enter' || e.code === 'Space'){
                e.preventDefault();
                return false;
            }
        })
        
        //Add Item
        document.querySelector(UISelector.addBtn).addEventListener('click',itemAddClick);

        // Set Edit state
        document.querySelector(UISelector.listGroup).addEventListener('click',itemEditClick);

        // Update state
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateClick);

        // Delete state
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteClick);

        // Back state
        document.querySelector(UISelector.backBtn).addEventListener('click', backClick);
        
        // ClearAll state
        document.querySelector(UISelector.clearAllBtn).addEventListener('click', clearAllClick);

    }
    const itemAddClick = function(e){
        const input = UICtrl.getItemInput();
        if( (input.name !== '') && (input.colories !== '')){
            const newItem = ItemCtrl.addItem(input.name, input.colories);

            // Add to UI
            UICtrl.addListItem(newItem);

            // Clear input fields
            UICtrl.clearInput();

            // Add Colories
            const totalColories = ItemCtrl.getTotalColories();

            UICtrl.setTotalColories(totalColories);
            
            // Store in local Storage
            StorageCtrl.storeItem(newItem);
        }
        e.preventDefault();
    }
    const itemEditClick = function(e){
        const UISelector = UICtrl.getSelector();

        if(e.target.classList.contains(UISelector.editItemClass)){
            // Get id of selected list
            const listId = e.target.parentNode.parentNode.id;
            // Split to array
            const listIdArray = listId.split('-');
            
            // Get item's id
            const id = parseInt(listIdArray[1]);

            // Get item in datastructure by id
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set item as currentState
            ItemCtrl.setCurrentItem(itemToEdit);

            // UICtrl.setEditState();
            UICtrl.addItemToForm();
            UICtrl.setEditState();
        }

        e.preventDefault();
    }
    const itemUpdateClick = function(e){
        
        //Get current Item
        const item = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(item);

        // Update UI
        UICtrl.updateUI(updatedItem);

        // Update Colories
        const totalColories = ItemCtrl.getTotalColories();
        UICtrl.setTotalColories(totalColories);

        StorageCtrl.updateStorageItem(updatedItem)

        // Clear Edit state
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const itemDeleteClick = function(e){
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteItem(currentItem.id);
        // Update Colories
        const totalColories = ItemCtrl.getTotalColories();
        UICtrl.setTotalColories(totalColories);

        StorageCtrl.deleteStorageItem(currentItem);

        // Clear Edit state
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const backClick = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const clearAllClick = function(e){
        ItemCtrl.clearAllItems();
        UICtrl.clearAllItems();

        const totalColories = ItemCtrl.getTotalColories();
        UICtrl.setTotalColories(totalColories);

        StorageCtrl.clearStorage();
        e.preventDefault();
    }
    return{
        init:function(){

            UICtrl.clearEditState();

            //Getting items from ItemController
            const items = ItemCtrl.getItem();

            if(items.length === 0){
                UICtrl.clearList();
            }
            else{
                UICtrl.displayItems(items);                         
            }
            
            //Call event
            loadEventListener();
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl);
AppCtrl.init()

