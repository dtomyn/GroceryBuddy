/// <reference path="../jquery-1.9.1.js" />
/// <reference path="../jquery.mobile-1.3.0.js" />
/// <reference path="../knockout-2.2.1.debug.js" />
/// <reference path="GroceryCart.js" />
/// <reference path="CartItem.js" />
/// <reference path="Category.js" />
/// <reference path="Measurement.js" />

$(function () {
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
//        self.numberOfItems = numberOfItems;

        self.cartItems = ko.observableArray([]);

        ////TODO... I realize there is probably a MUCH more efficient way of doing this!
        self.numberOfItems = ko.computed(function () {
            var total = 0;
            $.each(self.cartItems(), function () { total += 1 })
            return total;
        });

        //self.addLine = function () { self.cartItems.push(new CartItem()) };
        //self.removeLine = function (item) { self.cartItems.remove(item) };

        //TODO: reminder

        //TODO: this doesn't seem quite right...
        //self.show = function () {
        //    shoppingCartViewModel.selectedCart = self;
        //    $.mobile.changePage("#cartItems");
        //};

        return self;
    };

    // Class to represent an item in a cart
    var CartItem = function ( name, category, numberOfPieces, size, measurement) {
        var self = this;
        self.name = ko.observable(name);
        self.category = ko.observable(category);
        self.numberOfPieces = ko.observable(numberOfPieces);
        self.size = ko.observable(size);
        self.measurement = ko.observable(measurement);

        return self;
    };

    // Overall view model for the application
    var shoppingCartViewModel = (function () {
        var self = this;

        self.carts = ko.observableArray([]);
        
        //TODO... the whole "selectedCart" thing was buggy for me so now resort to individual field
        self.currentCartId = ko.observable();
        self.currentCartName = ko.observable();

        self.availableCategories = ko.observableArray([]);
        self.availableMeasurements = ko.observableArray([]);
        
        self.getCarts = function () {
            carts.push(new GroceryCart(++shoppingCartId, "Shopping Cart 1"));
            carts.push(new GroceryCart(++shoppingCartId, "Shopping Cart 2"));
        };

        self.getCategories = function () {
            availableCategories.push(new Category("", "Choose One...", ""));
            availableCategories.push(new Category("P", "Produce", "TODO"));
            availableCategories.push(new Category("D", "Dairy", "TODO"));
            availableCategories.push(new Category("JF", "Junk Food", "TODO"));
        };

        self.getMeasurements = function () {
            availableMeasurements.push(new Measurement("", "Choose One...", ""));
            availableMeasurements.push(new Measurement("G", "Grams", "TODO"));
            availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
            availableMeasurements.push(new Measurement("ML", "Milliliters", "TODO"));
            availableMeasurements.push(new Measurement("L", "Liters", "TODO"));
        };

        self.startAddCart = function () {
            currentCartId(++shoppingCartId);
            currentCartName("");
            $.mobile.changePage("#addCartPage");
        };

        self.saveCart = function () {
            var gc = new GroceryCart(currentCartId(), currentCartName());
            carts.push(gc);
            currentCartId("");
            currentCartName("");
            //$('#theCartList').listview('refresh');
            $.mobile.changePage("#carts");
        };

        // Operations
        //self.addCart = function () { self.carts.push(new GroceryCart()) };
        //self.removeCart = function (cart) { self.carts.remove(cart) };

        self.getCarts();
        self.getCategories();
        self.getMeasurements();
    })();

    ko.applyBindings(shoppingCartViewModel);

    $.mobile.defaultPageTransition = "slide";
});
