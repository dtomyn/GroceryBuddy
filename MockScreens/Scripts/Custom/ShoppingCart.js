/// <reference path="_references.js" />

$(function () {

    //NOTE: The below 2 "focus" functions could have been put in the applicable "navigate" methods... done below
    //just to show an alternative method

    /// When the add cart page shows, set focus to the name field
    $("#addCartPage").on("pageshow", function (e) {
        $('#currentCartName').focus();
    });

    // When the add item page shows, set focus on the name field
    $("#addCartItemPage").on("pageshow", function (e) {
        $('#itemName').focus();
    });

    /// Class to represent a category
    var Category = function (value, name, icon) {
        var self = this;

// #region Properties
        self.value = value;
        self.name = name;
        self.icon = icon;
// #endregion Properties

        return self;
    };

    /// Class to represent a measurement
    var Measurement = function (value, name, icon) {
        var self = this;

// #region Properties
        self.value = value;
        self.name = name;
        self.icon = icon;
// #endregion Properties

        return self;
    };

    /// Class to represent a grocery cart
    var GroceryCart = function ( name) {
        var self = this;

// #region Properties
        /// Cart has a name...
        self.name = ko.observable(name).extend({ minLength: 2, maxLength: 10 });
        /// Cart has items...
        self.cartItems = ko.observableArray([]);
        //TODO: reminder?? use this for validation .extend({ date: true });

        //self.dirtyFlag = new ko.DirtyFlag([
        //    self.name)];
// #endregion Properties

// #region Computed properties
        /// Make english wording better for number of items in a cart
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
            //NOTE: the below shows how could have used a "foreach" method too
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
            self.cartItems.destroy(item);
            //self.cartItems.remove(item);
        };
// #endregion Operations

        return self;
    };

    /// Class to represent an item in a cart
    var CartItem = function (name, category, numberOfPieces, size, measurement) {
        var self = this;

// #region Properties
        self.name = ko.observable(name).extend({ minLength: 2, maxLength: 10 });
        //self.name = ko.observable(name).extend({ required: true });
        self.category = ko.observable(category).extend({ required: true });
        self.numberOfPieces = ko.observable(numberOfPieces).extend({ min: 1 });
        //.extend({ number: true });
        //.extend({ digit: true });
        self.size = ko.observable(size).extend({ min: 1 });
        self.measurement = ko.observable(measurement).extend({ required: true });
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

    /// Overall view model for the application
    var ShoppingCartViewModel = function () {
        var self = this;

        var
// #region Properties
            /// Main carts collection
            carts = ko.observableArray([])
            /// Used to store the currently selected shopping cart
            , selectedCart = ko.observable()
            /// A list of all available categories that may be selected when entering an item
            , availableCategories = ko.observableArray([])
            /// A list of all available measurements that may be selected when entering an item
            , availableMeasurements = ko.observableArray([])
// #endregion Properties

// #region Operations
            /// Loads up carts collection with a couple of sample grocery carts
            , getCarts = function () {
                carts.push(new GroceryCart("Shopping Cart 1"));
                carts.push(new GroceryCart("Shopping Cart 2"));
            }
            /// Loads up availableCategories collection with a few category types
            , getCategories = function () {
                //availableCategories.push(new Category("", "Choose One...", ""));
                availableCategories.push(new Category("Produce", "Produce", "TODO"));
                availableCategories.push(new Category("Dairy", "Dairy", "TODO"));
                availableCategories.push(new Category("Junk Food", "Junk Food", "TODO"));
            }
            /// Loads up availableMeasurements collection with a few measurement types
            , getMeasurements = function () {
                //availableMeasurements.push(new Measurement("", "Choose One...", ""));
                availableMeasurements.push(new Measurement("Grams", "Grams", "TODO"));
                availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
                availableMeasurements.push(new Measurement("ML", "ML", "TODO"));
                availableMeasurements.push(new Measurement("L", "L", "TODO"));
            }
            /// Called when want to start adding a new cart
            , addCartBegin = function () {
                $('#currentCartName').val('');
                navigateToAddCartPage();
            }
            /// Cancels the save cart operation and navigates back to the main carts page
            , addCartCancel = function () {
                $('#currentCartName').val('');
                navigateToCartsPage();
            }
            /// Saves a cart to the carts collection and then navigates back to the main carts page
            , addCartSave = function () {
                var gc = new GroceryCart($('#currentCartName').val());
                //TODO: need to figure out a way to get validation to work... I made a reference to knockout validation but not sure how to use properly yet
                //gc.errors = ko.validation.group(gc);
                //if (gc.errors().length == 0) {
                //    alert('Thank you.');
                //} else {
                //    alert('Please check your submission.');
                //    gc.errors.showAllMessages();
                //}
                carts.push(gc);
                $('#currentCartName').val('');
                navigateToCartsPage();
            }

            /// Called when want to start adding a new item into a cart
            , addCartItemBegin = function () {
                $('#itemName').val('');
                $('#itemCategory').val('');
                $('#itemNumberOfPieces').val('');
                $('#itemSize').val('');
                $('#itemMeasurement').val('');
                navigateToAddCartItemPage();
            }
            /// Saves a cart items to the currently selected cart
            , addCartItemSave = function () {
                //TODO: better way to do this is to have an observable item on this page... for now using standard jQuery to get values
                var ci = new CartItem($('#itemName').val(), $('#itemCategory').val(), $('#itemNumberOfPieces').val(), $('#itemSize').val(), $('#itemMeasurement').val());
                if (selectedCart() != null) {
                    selectedCart().addItem(ci);
                }
                navigateToCartItemsPage();
            }
            /// Removes the currently selected cart from the collection after confirming that want to delete it
            , removeCartItem = function (cartItem) {
                //TODO... better confirm needed!... look at split listview
                //TODO... this does not work yet... must have syntax incorrect
                if (confirm('Are you sure you want to remove this item?')) {
                    selectedCart.removeItem(cartItem);
                    $('#cartItemsListView').listview('refresh');
                }
            }

            /// Removes the currently selected cart from the collection after confirming that want to delete it
            , removeCart = function (cart) {
                //TODO... better confirm needed!... look at split listview
                if (confirm('Are you sure you want to remove the following cart: ' + cart.name() + ' that currently has ' + cart.numberOfItems() + ' number of items?')) {
                    carts.destroy(cart);
                    //carts.remove(cart);
                    $('#theCartList').listview("refresh");
                }
            }
            /// Shows the contents of the cart
            , viewCartBegin = function (cart) {
                selectedCart(cart);
                navigateToCartItemsPage();
            }

// #region NAVIGATION operations
            ///Navigates to the "cartsPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToCartsPage = function () {
                $.mobile.changePage("#cartsPage");
                $('#cartsPage').trigger('pagecreate');
                $('#theCartList').listview('refresh');
            }

            ///Navigates to the "addCartPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToAddCartPage = function () {
                $.mobile.changePage("#addCartPage");
                $('#addCartPage').trigger('pagecreate');
            }

            ///Navigates to the "cartItemsPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToCartItemsPage = function () {
                $.mobile.changePage("#cartItemsPage");
                $('#cartItemsPage').trigger('pagecreate');
                $('#cartItemsListView').listview('refresh');
            }

            ///Navigates to the "addCartItemPage". Wrapped to ensure jQuery mobile "redraws" screen correctly
            , navigateToAddCartItemPage = function () {
                $.mobile.changePage("#addCartItemPage");
                $('#addCartItemPage').trigger('pagecreate');
            }
// #endregion NAVIGATION operations

// #endregion Operations
        ;

        /// Make the call to initialize the carts
        getCarts();
        /// Make the call to initialize the categories
        getCategories();
        /// Make the call to initialize the measurements
        getMeasurements();

        /* NOTE: if want to do the "best practice" of selectively determining what to expose, would do the below */
        return {
            carts: carts
            , availableCategories: availableCategories
            , availableMeasurements: availableMeasurements

            , getCarts: getCarts
            , getCategories: getCategories
            , getMeasurements: getMeasurements

            , addCartBegin: addCartBegin
            , addCartCancel: addCartCancel
            , addCartSave: addCartSave

            , viewCartBegin: viewCartBegin

            , addCartItemBegin: addCartItemBegin
            , addCartItemSave: addCartItemSave

            , selectedCart: selectedCart

            , removeCart: removeCart

            , removeCartItem: removeCartItem

            , navigateToCartsPage: navigateToCartsPage
            , navigateToAddCartPage: navigateToAddCartPage
            , navigateToCartItemsPage: navigateToCartItemsPage
            , navigateToAddCartItemPage: navigateToAddCartItemPage
        };
    };

    var shoppingCartViewModel = new ShoppingCartViewModel();

    ko.validation.rules.pattern.message = 'Invalid.';

    shoppingCartViewModel.errors = ko.validation.group(shoppingCartViewModel);

    ko.validation.configure({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    });

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