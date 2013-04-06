/// <reference path="_references.js" />

var viewModel =
{
    products: ko.observableArray([]),
    selectedProduct: ko.observable(null),

    selectProduct: function (product) {
        viewModel.selectedProduct(this);
        $(".right-section").show();
    },
    newProduct: function () {
        this.products.push({
            Sku: ko.observable(this.products().length + 1),
            Name: ko.observable("New " + this.products().length),
            Description: ko.observable("Description " + this.products().length),
            IsNew: ko.observable(true)
        });
    }
}

$(document).ready(function () {
    $(".right-section").hide();
    $.ajax(
        {
            url: "/api/Products",
            contentType: "text/jsonp",
            type: "GET",
            success: function (data) {
                alert('success. products before load: ' + viewModel.products().length + ' data to load ' + data.length);
                $.each(data, function (index) {
                    viewModel.products.push(toProductKoObservable(data[index]));
                });
                alert('success. products after load: ' + viewModel.products().length + ' data to load ' + data.length);
                ko.applyBindings(viewModel);
            },
            error: function (data) {
                alert("ERROR");
            }
        });

    function toProductKoObservable(product) {
        return {
            Sku: ko.observable(product.Sku),
            Name: ko.observable(product.Name),
            Description: ko.observable(product.Description),
            IsDeleted: ko.observable(product.IsDeleted)
        };
    }

    $("#saveAll").click(function () {
        var saveData = ko.toJS(viewModel.products);
        $.each(saveData, function (index) {
            var current = saveData[index];
            var action = "PUT";
            var stringyF = JSON.stringify(current);
            var vUrl = "/api/Products?Sku=" + current.Sku;
            if (current.IsNew) {
                action = "POST";
                vUrl = "/api/Products";
            }
            $.ajax(
            {
                url: vUrl,
                contentType: "application/jsonp;charset=utf-8",
                type: action,
                data: JSON.stringify(current)
            });
        });

    });
});