/// <reference path="_references.js" />

$(function () {
    // When the add cart page shows, set focus to the name field
    $("#addCartPage").on("pageshow", function (e) {
        $('#currentCartName').focus();
    });

    // When the add item page shows, set focus on the name field
    $("#addCartItem").on("pageshow", function (e) {
        $('#itemName').focus();
    });

    // Class to represent a category
    var Category = function (value, name, icon) {
        var self = this;

// #region Properties
        self.value = value;
        self.name = name;
        self.icon = icon;
// #endregion Properties

        return self;
    };

    // Class to represent a measurement
    var Measurement = function (value, name, icon) {
        var self = this;

// #region Properties
        self.value = value;
        self.name = name;
        self.icon = icon;
// #endregion Properties

        return self;
    };

    // Class to represent a grocery cart
    var GroceryCart = function ( name) {
        var self = this;

// #region Properties
        // Cart has a name...
        self.name = ko.observable(name);
        // Cart has items...
        self.cartItems = ko.observableArray([]);
        //TODO: reminder??
// #endregion Properties

// #region Computed properties
        // Make english wording better for number of items in a cart
        self.numberOfItemsDisplay = ko.computed(function () {
            if (self.cartItems().length == 0) {
                return 'There are no items in the cart';
            } else {
                if (self.cartItems().length == 1) {
                    return 'There is 1 item in the cart';
                } else {
                    return 'There are ' + self.cartItems().length + ' in this cart';
                }
            }
        });

        // Simply returns the number of items
        self.numberOfItems = ko.computed(function () {
            return self.cartItems().length;
            //var total = 0;
            //$.each(self.cartItems(), function () { total += 1; })
            //return total;
        });
// #endregion Computed properties

// #region Operations
        self.addItem = function (item) {
            self.cartItems.push(item);
        };

        self.removeItem = function (item) {
            self.cartItems.remove(item);
        };
// #endregion Operations

        return self;
    };

    // Class to represent an item in a cart
    var CartItem = function (name, category, numberOfPieces, size, measurement) {
        var self = this;

// #region Properties
        self.name = ko.observable(name);
        self.category = ko.observable(category);
        self.numberOfPieces = ko.observable(numberOfPieces);
        self.size = ko.observable(size);
        self.measurement = ko.observable(measurement);
// #endregion Properties

// #region Computed properties
        self.displayValue = ko.computed(function () {
            return self.name() + ' (' + self.category() + ') ' + self.numberOfPieces() + ' x ' + self.size() + ' @ ' + self.measurement();
            //var total = 0;
            //$.each(self.cartItems(), function () { total += 1; })
            //return total;
        });
// #endregion Computed properties

        return self;
    };

    // Overall view model for the application
    var ShoppingCartViewModel = function () {
        var self = this;

        var
// #region Properties
            // Main carts collection
            carts = ko.observableArray([])
            // Which shopping cart is currently selected
            , selectedCart = ko.observable()
            // A list of all available categories that may be selected when entering an item
            , availableCategories = ko.observableArray([])
            // A list of all available measurements that may be selected when entering an item
            , availableMeasurements = ko.observableArray([])
// #endregion Properties

// #region Operations
            // Loads up carts collection with a couple of sample grocery carts
            , getCarts = function () {
                carts.push(new GroceryCart("Shopping Cart 1"));
                carts.push(new GroceryCart("Shopping Cart 2"));
            }
            // Loads up availableCategories collection with a few category types
            , getCategories = function () {
                availableCategories.push(new Category("", "Choose One...", ""));
                availableCategories.push(new Category("Produce", "Produce", "TODO"));
                availableCategories.push(new Category("Dairy", "Dairy", "TODO"));
                availableCategories.push(new Category("Junk Food", "Junk Food", "TODO"));
            }
            // Loads up availableMeasurements collection with a few measurement types
            , getMeasurements = function () {
                availableMeasurements.push(new Measurement("", "Choose One...", ""));
                availableMeasurements.push(new Measurement("Grams", "Grams", "TODO"));
                availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
                availableMeasurements.push(new Measurement("ML", "ML", "TODO"));
                availableMeasurements.push(new Measurement("L", "L", "TODO"));
            }
            // Called when want to start adding a new cart
            , startAddCart = function () {
                $('#currentCartName').val('');
                $.mobile.changePage("#addCartPage");
                $('#addCartPage').trigger('pagecreate');
                $('#currentCartName').removeAttr("disabled").focus();
            }
            // Saves a cart to the carts collection and then navigates back to the main carts page
            , saveCart = function () {
                var gc = new GroceryCart($('#currentCartName').val());
                carts.push(gc);
                $('#currentCartName').val('');
                $.mobile.changePage("#carts");
                $('#carts').trigger('pagecreate');
                $('#theCartList').listview('refresh');
            }
            // Cancels the save cart operation and navigates back to the main carts page
            , cancelSaveCart = function () {
                $('#currentCartName').val('');
                $.mobile.changePage("#carts");
                $('#carts').trigger('pagecreate');
            }
            // Saves a cart items to the currently selected cart
            , saveCartItem = function () {
                var ci = new CartItem($('#itemName').val(), $('#itemCategory').val(), $('#itemNumberOfPieces').val(), $('#itemSize').val(), $('#itemMeasurement').val());
                alert('want to add ' + ci.category());
                if (selectedCart() != null) {
                    selectedCart().addItem(ci);
                }
                $.mobile.changePage("#cartItems");
                $('#cartItems').trigger('pagecreate');
            }
            // Removes the currently selected cart from the collection after confirming that want to delete it
            , removeCart = function (cart) {
                //TODO... better confirm needed!
                if (confirm('Are you sure you want to remove the following cart: ' + cart.name() + ' that currently has ' + cart.numberOfItems() + ' number of items?')) {
                    carts.remove(cart);
                    $('#theCartList').listview("refresh");
                }
            }
            // Shows the contents of the cart
            , showCart = function (cart) {
                selectedCart(cart);
                $.mobile.changePage("#cartItems");
                $('#cartItems').trigger('pagecreate');
            }
            // Called when want to start adding a new item into a cart
            , startAddingCartItem = function () {
                $('#itemName').val('');
                $('#itemCategory').val('');
                $('#itemNumberOfPieces').val('');
                $('#itemSize').val('');
                $('#itemMeasurement').val('');
                $.mobile.changePage("#addCartItem");
                $('#addCartItem').trigger('pagecreate');
            }
// #endregion Operations
        ;

        // Make the call to initialize the carts
        getCarts();
        // Make the call to initialize the categories
        getCategories();
        // Make the call to initialize the measurements
        getMeasurements();

        /* NOTE: if want to do the "best practice" of selectively determining what to expose, would do the below */
        return {
            carts: carts
            , availableCategories: availableCategories
            , availableMeasurements: availableMeasurements
            , getCarts: getCarts
            , getCategories: getCategories
            , getMeasurements: getMeasurements
            , startAddCart: startAddCart
            , startAddCart: startAddCart
            , saveCart: saveCart
            , saveCartItem: saveCartItem
            , selectedCart: selectedCart
            , removeCart: removeCart
            , showCart: showCart
            , startAddingCartItem: startAddingCartItem
            , cancelSaveCart: cancelSaveCart
        };
    };

    var shoppingCartViewModel = new ShoppingCartViewModel();

    ko.applyBindings(shoppingCartViewModel);

    $.mobile.defaultPageTransition = "slide";
});

//var viewSaveID;
//function saveThisViewModel() {
//    // check to see if jStorage has items
//    // if not, assign 0 to key otherwise assign count number 
//    // as items are save chronologically and not overwritten
//    if ($.jStorage.index().length === 0) {
//        viewSaveID = 0;
//    }
//    viewSaveID = $.jStorage.index().length;
//    // increment counter for key to localStorage
//    viewSaveID = viewSaveID + 1;
//    // Set data to JS format could also be ko.toJSON for a JSON object
//    var data = ko.toJS(myViewModel);
//    // on the dollar save via jStorage
//    $.jStorage.set(viewSaveID, data);
//    // return true to keep default behavior in app
//    return true;
//}

///* Get Data From Storage and save it to Array */
//function getDataStore() {
//    // assign the keys of the jStorage index to an observable array
//    myViewModel.myDataStoreIndex($.jStorage.index());

//    // check to see if there are items in the data store array
//    // if yes, remove them 
//    if (myViewModel.myDataStore().length > 0) {
//        // This may not scale well, but for localStorage, we don't need it too.
//        // the problem is overwriting and double entries, this little diddy solves both
//        myViewModel.myDataStore.removeAll();
//        console.log("removeAll fired")
//    }
//    //create a temp object to hold objects that are saved in storage
//    var savedData = {};
//    // iterate through the array of keys
//    for (var i = 0; i < myViewModel.myDataStoreIndex().length; i++) {
//        // pull the objects from storage based on the keys stored in the array
//        savedData = $.jStorage.get(myViewModel.myDataStoreIndex()[i]);
//        // push the saved object to the observable array
//        myViewModel.myDataStore.push(savedData);
//        console.log("Data has been pushed to vacDataStore " + i + " times.");
//        // when you iterate on a list view item in jQuery Mobile 
//        // you have refresh the list. Otherwise it displays incorrectly
//        $('#myListView').listview('refresh');
//    }
//}