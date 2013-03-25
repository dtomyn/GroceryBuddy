/// <reference path="../jquery-1.9.1.js" />
/// <reference path="../jquery.mobile-1.3.0.js" />
/// <reference path="../knockout-2.2.1.debug.js" />
$(function () {

    // Overall view model for the application

    // Class to represent a grocery cart
    var GroceryCart = function (name, items) {
//    function GroceryCart(name, items) {
        var self = this;
        self.name = ko.observable(name);
        self.numberOfItems = items;

        self.addCartItem = function (name, category, numberOfPieces, size, measurement) {

        };
        //TODO: reminder
        //TODO: count cart items

        return self;
    };
//    }

    var CartItem = function (parentCart, name, category, numberOfPieces, size, measurement) {
//    function CartItem(parentCart, name, category, numberOfPieces, size, measurement) {
        var self = this;
        self.parentCart = parentCart;
        self.name = ko.observable(name);
        self.category = ko.observable(category);
        self.numberOfPieces = ko.observable(numberOfPieces);
        self.size = ko.observable(size);
        self.measurement = ko.observable(measurement);
    };
//    }

    var shoppingCartViewModel = (function () {
//    function ShoppingCartViewModel() {
        var self = this;

        // Non-editable category data - would come from the server
        self.availableCategories = [
            { categoryName: "Standard (sandwich)", icon: "TODO" },
            { categoryName: "Premium (lobster)", icon: "TODO" },
            { categoryName: "Ultimate (whole zebra)", icon: "TODO" }
        ];

        //getCategories();

        // Editable data
        self.carts = ko.observableArray([
            new GroceryCart("Shopping Cart 1", 25),
            new GroceryCart("Shopping Cart 2", 4)
        ]);
    })();
//    }

    ko.applyBindings(shoppingCartViewModel);
//    ko.applyBindings(new ShoppingCartViewModel());
});
