(function () { // Wrap in function to prevent accidental globals

    // Overall view model for the application

    // Class to represent a grocery cart
    function GroceryCart(name, items) {
        var self = this;
        self.name = ko.observable(name);
        self.numberOfItems = items;
        //TODO: reminder
        //TODO: count cart items
    }

    function ShoppingCartViewModel() {
        var self = this;

        // Non-editable category data - would come from the server
        self.availableCategories = [
            { categoryName: "Standard (sandwich)", icon: "TODO" },
            { categoryName: "Premium (lobster)", icon: "TODO" },
            { categoryName: "Ultimate (whole zebra)", icon: "TODO" }
        ];

        // Editable data
        self.carts = ko.observableArray([
            new GroceryCart("Shopping Cart 1", 25),
            new GroceryCart("Shopping Cart 2", 4)
        ]);
    }

    ko.applyBindings(new ShoppingCartViewModel());
})();
