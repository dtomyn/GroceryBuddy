/// <reference path="../jquery-1.9.1.js" />
/// <reference path="../jquery.mobile-1.3.0.js" />
/// <reference path="../knockout-2.2.1.debug.js" />
/// <reference path="GroceryCart.js" />
/// <reference path="CartItem.js" />
/// <reference path="Category.js" />
/// <reference path="Measurement.js" />

$(function () {
    $("#addCartPage").on("pageshow", function (e) {
        $('#currentCartName').focus();
    });

    $("#addCartItem").on("pageshow", function (e) {
        $('#itemName').focus();
    });

    var shoppingCartId = 0;

    // Class to represent a category
    var Category = function (value, name, icon) {
        var self = this;
        self.value = value;
        self.name = name;
        self.icon = icon;

        return self;
    };

    // Class to represent a measurement
    var Measurement = function (value, name, icon) {
        var self = this;
        self.value = value;
        self.name = name;
        self.icon = icon;

        return self;
    };

    // Class to represent a grocery cart
    var GroceryCart = function (id, name) {
        var self = this;
        self.id = id;
        self.name = ko.observable(name);

        self.cartItems = ko.observableArray([]);

        ////TODO... I realize there is probably a MUCH more efficient way of doing this!
        self.numberOfItems = ko.computed(function () {
            var total = 0;
            $.each(self.cartItems(), function () { total += 1; })
            return total;
        });

        self.addItem = function (item) {
            self.cartItems.push(item)
        };

        self.removeItem = function (item) {
            self.cartItems.remove(item)
        };

        //TODO: reminder

        return self;
    };

    // Class to represent an item in a cart
    var CartItem = function (name, category, numberOfPieces, size, measurement) {
        var self = this;
        self.name = ko.observable(name);
        self.category = ko.observable(category);
        self.numberOfPieces = ko.observable(numberOfPieces);
        self.size = ko.observable(size);
        self.measurement = ko.observable(measurement);

        return self;
    };

    // Overall view model for the application
    var ShoppingCartViewModel = function () {
        var self = this;

        var
            carts = ko.observableArray([])
            , selectedCart = ko.observable()
            //, currentCartId = ko.observable();
            //, currentCartName = ko.observable();
            , availableCategories = ko.observableArray([])
            , availableMeasurements = ko.observableArray([])
            , getCarts = function () {
                carts.push(new GroceryCart(++shoppingCartId, "Shopping Cart 1"));
                carts.push(new GroceryCart(++shoppingCartId, "Shopping Cart 2"));
            }
            , getCategories = function () {
                availableCategories.push(new Category("", "Choose One...", ""));
                availableCategories.push(new Category("Produce", "Produce", "TODO"));
                availableCategories.push(new Category("Dairy", "Dairy", "TODO"));
                availableCategories.push(new Category("Junk Food", "Junk Food", "TODO"));
            }
            , getMeasurements = function () {
                availableMeasurements.push(new Measurement("", "Choose One...", ""));
                availableMeasurements.push(new Measurement("Grams", "Grams", "TODO"));
                availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
                availableMeasurements.push(new Measurement("ML", "ML", "TODO"));
                availableMeasurements.push(new Measurement("L", "L", "TODO"));
            }
            , startAddCart = function () {
                shoppingCartId++;
                $('#currentCartId').val(shoppingCartId);
                $('#currentCartName').val('Cart ' + shoppingCartId.toString());
                $.mobile.changePage("#addCartPage");
                $('#addCartPage').trigger('pagecreate');
                $('#currentCartName').removeAttr("disabled").focus();
            }
            , saveCart = function () {
                var gc = new GroceryCart($('#currentCartId').val(), $('#currentCartName').val());
                carts.push(gc);
                $('#currentCartName').val('');
                $('#currentCartId').val('');
                $('#theCartList').listview("refresh");
                $.mobile.changePage("#carts");
            }
            , saveCartItem = function () {
                var ci = new CartItem($('#itemName').val(), $('#itemCategory').val(), $('#itemNumberOfPieces').val(), $('#itemSize').val(), $('#itemMeasurement').val());
                console.log('want to add ' + ci.category());
                $.mobile.changePage("#cartItems");
            }
            , removeCart = function (cart) {
                //TODO... better confirm needed!
                if (confirm('Are you sure you want to remove the following cart: ' + cart.name() + ' that currently has ' + cart.numberOfItems() + ' number of items?')) {
                    carts.remove(cart);
                    $('#theCartList').listview("refresh");
                }
            }
            , showCart = function (cart) {
                selectedCart(cart);
                $.mobile.changePage("#cartItems");
                $('#cartItems').trigger('pagecreate');
            }
        ;

        getCarts();
        getCategories();
        getMeasurements();

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