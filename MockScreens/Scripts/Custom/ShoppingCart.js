/// <reference path="../jquery-1.9.1.js" />
/// <reference path="../jquery.mobile-1.3.0.js" />
/// <reference path="../knockout-2.2.1.debug.js" />
/// <reference path="GroceryCart.js" />
/// <reference path="CartItem.js" />
/// <reference path="Category.js" />
/// <reference path="Measurement.js" />

$(function () {
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
    var GroceryCart = function (id, name, items) {
        var self = this;
        self.id = id;
        self.name = ko.observable(name);
        self.numberOfItems = items;

        self.addCartItem = function (name, category, numberOfPieces, size, measurement) {

        };
        //TODO: reminder
        //TODO: count cart items

        //TODO: this doesn't seem quite right...
        self.show = function () {
            shoppingCartViewModel.selectedCart = self;
            $.mobile.changePage("#cartItems");
        };

        return self;
    };

    // Class to represent an item in a cart
    var CartItem = function (parentCart, name, category, numberOfPieces, size, measurement) {
        var self = this;
        self.parentCart = parentCart;
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

        var
            carts = ko.observableArray([]),
            selectedCart = ko.observable(),
            availableCategories = ko.observableArray([]),
            availableMeasurements = ko.observableArray([]),

            getCarts = function () {
                carts.push(new GroceryCart(1, "Shopping Cart 1", 25));
                carts.push(new GroceryCart(2, "Shopping Cart 2", 4));
            }
            ,
            getCategories = function () {
                availableCategories.push(new Category("", "Choose One...", ""));
                availableCategories.push(new Category("P", "Produce", "TODO"));
                availableCategories.push(new Category("D", "Dairy", "TODO"));
                availableCategories.push(new Category("JF", "Junk Food", "TODO"));
            }
            ,
            getMeasurements = function () {
                availableMeasurements.push(new Measurement("", "Choose One...", ""));
                availableMeasurements.push(new Measurement("G", "Grams", "TODO"));
                availableMeasurements.push(new Measurement("KG", "KG", "TODO"));
                availableMeasurements.push(new Measurement("ML", "Milliliters", "TODO"));
                availableMeasurements.push(new Measurement("L", "Liters", "TODO"));
            }
        //            ,
        //            selectCart = function () {
        //                $.mobile.changePage("#cartItems");
        //            }
        ;

        getCarts();
        getCategories();
        getMeasurements();

        return {
            carts: carts
            , selectedCart: selectedCart
            , availableCategories: availableCategories
            , availableMeasurements: availableMeasurements
            //            , selectCart: selectCart
        };
    })();

    ko.applyBindings(shoppingCartViewModel);
});
