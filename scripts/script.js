"use strict";

// toggles for table filters, to use you should on column name
var orderNumber, toggleName, toggleUnit, toggleQuantity, toggleTotal;

document.addEventListener("DOMContentLoaded", ordersPrint);
document.querySelector(".refresh").addEventListener("click", ordersPrint);
document.querySelector(".search").addEventListener("click", searchOrders);
document.querySelector(".searchinput").addEventListener("focusout", searchOrders);
document.querySelector(".searchinput").addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        searchOrders();
    }
});
document.querySelector(".deliver").addEventListener("click", function () {
    document.querySelector(".adress").style.display = "";
    document.querySelector(".lineitem").style.display = "";
    document.querySelector(".costumerinfo").style.display = "none";
    document.querySelector(".deliver").className += " selectedtab";
    document.querySelector(".person").classList.remove("selectedtab");
});

//list output
function ordersPrint() {
    var orderList = document.querySelector(".listorder ul"), statuscolor = "green", list;
    document.querySelector(".searchinput").value = "";
    while (orderList.firstChild) {      //clean the list
        orderList.removeChild(orderList.firstChild);
    }
    for (var i = 0; i < Orders.length; i++) {
        orderList.appendChild(document.createElement('li'));
        list = document.querySelectorAll(".listorder li");
        if (Orders[i].OrderInfo.status === "Urgent") { // to know what the color of status
            statuscolor = "red";
        }
        else if (Orders[i].OrderInfo.status === "Pending") {
            statuscolor = "orange";
        }
        list[i].innerHTML = '<div class="item" id="' + i + '"onmousedown="orderInfoPrint(id)">' +
            '<div class="iddate"><div class="ordernumber">Order ' + Orders[i].id + '</div>' +
            '<div class="orderdate">' + Orders[i].OrderInfo.createdAt + '</div></div>' +
            '<div class="costumerstatus"><div class="costumer">' + Orders[i].OrderInfo.customer + '</div>' +
            '<div class="term ' + statuscolor + '">' + Orders[i].OrderInfo.status + '</div></div>' +
            '<div class="arrivaldate">' + Orders[i].OrderInfo.shippedAt + '</div>' +
            '</div>';
    }

    document.querySelector(".ordercount").textContent = "Orders(" + Orders.length + ")";

    orderInfoPrint(orderNumber);
}

//output all information of selected item
function orderInfoPrint(i) {
    document.querySelector(".costumerinfo").style.display = "none";
    orderNumber = i;
    toggleName = false, toggleUnit = false, toggleQuantity = false, toggleTotal = false;
    //highlighting of selected order
    var list = document.querySelectorAll(".listorder li");
    var info = document.querySelector(".orderinfo"), adress = document.querySelector(".contactvalues"),
        products = document.querySelector(".itemstable"), allproducts;

    for (var c = 0; c < Orders.length; c++) {
        c === +i ? list[c].className += " selected" : list[c].className = "";
    }

    //check of orderNumber
    if (!i) {
        document.querySelector(".notselectedorder").style.display = "";
        document.querySelector(".maininfo").style.display = "none";
        document.querySelector(".adress").style.display = "none";
        document.querySelector(".lineitem").style.display = "none";
    }
    else {
        document.querySelector(".notselectedorder").style.display = "none";
        document.querySelector(".maininfo").style.display = "";
        document.querySelector(".adress").style.display = "";
        document.querySelector(".lineitem").style.display = "";

        //filling the main order information
        info.innerHTML = '<div class="mainnumber">Order ' + Orders[i].id + '</div>' +
            '<div class="totalprice">' + Orders[i].OrderInfo.totalPrice + '<br>' +
            '<span>' + Orders[i].OrderInfo.currency + '</span></div>' +
            '<div class="maincostumer">' + Orders[i].OrderInfo.customer + '</div>' +
            '<div class="maindate">Created: ' + Orders[i].OrderInfo.createdAt + '</div>' +
            '<div class="mainarrival">Shipped: ' + Orders[i].OrderInfo.shippedAt + '</div>';
        document.querySelector(".lineitemhead").innerHTML = 'Line Items (' + Orders[i].products.length + ')';

        //filling the adress
        adress.innerHTML = '<span>' + Orders[i].ShipTo.name + '</span><br>' +
            '<span>' + Orders[i].ShipTo.Address + '</span><br>' +
            '<span>' + Orders[i].ShipTo.ZIP + '</span><br>' +
            '<span>' + Orders[i].ShipTo.Region + '</span><br>' +
            '<span>' + Orders[i].ShipTo.Country + '</span>';
        //clean the table
        var myNode = document.querySelector(".itemstable");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        //filling the table
        for (var j = 0; j < Orders[i].products.length; j++) {
            products.appendChild(document.createElement('tr'));
            allproducts = document.querySelectorAll(".itemstable tr");
            allproducts[j].innerHTML = '<td><strong class="strong">' +
                Orders[i].products[j].name + '</strong><br>ID: ' + Orders[i].products[j].id + '</td>' +
                '<td><strong>' + Orders[i].products[j].price + '</strong> ' + Orders[i].products[j].currency + '</td>' +
                '<td>' + Orders[i].products[j].quantity + '</td>' +
                '<td>' +
                '<strong>' + Orders[i].products[j].totalPrice + '</strong> ' + Orders[i].products[j].currency + '</td>';
        }
    }
    //implement product search if we know number of selected order
    if (orderNumber) {
        document.querySelector(".person").addEventListener("click", function () {
            document.querySelector(".adress").style.display = "none";
            document.querySelector(".lineitem").style.display = "none";
            document.querySelector(".costumerinfo").style.display = "";
            document.querySelector(".person").className += " selectedtab";
            document.querySelector(".deliver").classList.remove("selectedtab");
            document.querySelector(".costumercontactvalues").innerHTML = '<span>' + Orders[i].CustomerInfo.firstName + '</span><br>' +
                '<span>' + Orders[i].CustomerInfo.lastName + '</span><br>' +
                '<span>' + Orders[i].CustomerInfo.address + '</span><br>' +
                '<span>' + Orders[i].CustomerInfo.phone + '</span><br>' +
                '<span>' + Orders[i].CustomerInfo.email + '</span>';
        });

        //filters by name, unit price, quantity, total price
        document.querySelector(".itemstablehead").getElementsByTagName("td")[0].addEventListener("click", function () {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.querySelector(".itemstable");
            switching = true;
            if (toggleName) {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[0];
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleName ? toggleName = false : toggleName = true;
            }
            else {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[0];
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleName ? toggleName = false : toggleName = true;
            }
        });
        document.querySelector(".itemstablehead").getElementsByTagName("td")[1].addEventListener("click", function () {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.querySelector(".itemstable");
            switching = true;
            if (toggleUnit) {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[1].getElementsByTagName("strong")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[1].getElementsByTagName("strong")[0];
                        if (+x.innerHTML.toLowerCase() < +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleUnit ? toggleUnit = false : toggleUnit = true;
            }
            else {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[1].getElementsByTagName("strong")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[1].getElementsByTagName("strong")[0];
                        if (+x.innerHTML.toLowerCase() > +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleUnit ? toggleUnit = false : toggleUnit = true;
            }
        });
        document.querySelector(".itemstablehead").getElementsByTagName("td")[2].addEventListener("click", function () {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.querySelector(".itemstable");
            switching = true;
            if (toggleQuantity) {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[2];
                        y = rows[i + 1].getElementsByTagName("TD")[2];
                        if (+x.innerHTML.toLowerCase() < +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleQuantity ? toggleQuantity = false : toggleQuantity = true;
            }
            else {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[2];
                        y = rows[i + 1].getElementsByTagName("TD")[2];
                        if (+x.innerHTML.toLowerCase() > +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleQuantity ? toggleQuantity = false : toggleQuantity = true;
            }
        });
        document.querySelector(".itemstablehead").getElementsByTagName("td")[3].addEventListener("click", function () {
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.querySelector(".itemstable");
            switching = true;
            if (toggleTotal) {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[3].getElementsByTagName("strong")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[3].getElementsByTagName("strong")[0];
                        if (+x.innerHTML.toLowerCase() < +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleTotal ? toggleTotal = false : toggleTotal = true;
            }
            else {
                while (switching) {
                    switching = false;
                    rows = table.getElementsByTagName("TR");
                    for (i = 0; i < (rows.length - 1); i++) {
                        shouldSwitch = false;
                        x = rows[i].getElementsByTagName("TD")[3].getElementsByTagName("strong")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[3].getElementsByTagName("strong")[0];
                        if (+x.innerHTML.toLowerCase() > +y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    if (shouldSwitch) {
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
                toggleTotal ? toggleTotal = false : toggleTotal = true;
            }
        });
        // document.querySelector(".refreshproduct").addEventListener("click", ordersPrint);
        // document.querySelector(".searchproducts").addEventListener("click", searchProducts(orderNumber));
        // document.querySelector(".searchinputproduct").addEventListener("focusout", searchProducts(orderNumber));
        document.querySelector(".searchinputproduct").addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                searchProducts(orderNumber);
            }
        });
    }
}

//searching by ordernumber, status, costumer, datacreate, shippingdata
function searchOrders() {
    var inputValue, li, ordernumber, licount = 0;
    inputValue = document.querySelector(".searchinput").value.toUpperCase();
    li = document.querySelector(".listorder").getElementsByTagName('li');

    for (var i = 0; i < Orders.length; i++) {
        ordernumber = li[i].querySelector(".ordernumber").innerHTML;
        if (ordernumber.toUpperCase().indexOf(inputValue) > -1 ||
            Orders[i].OrderInfo.customer.toUpperCase().indexOf(inputValue) > -1 ||
            Orders[i].OrderInfo.status.toUpperCase().indexOf(inputValue) > -1 ||
            Orders[i].OrderInfo.createdAt.toUpperCase().indexOf(inputValue) > -1 ||
            Orders[i].OrderInfo.shippedAt.toUpperCase().indexOf(inputValue) > -1) {
            li[i].style.display = "";
            licount++;
        } else {
            li[i].style.display = "none";
        }
    }

    document.querySelector(".ordercount").textContent = "Orders(" + licount + ")";
}

//searching products by name, unit price, quantity, total
function searchProducts(orderNumber) {
    var inputValue, tr, products, licount = 0;
    inputValue = document.querySelector(".searchinputproduct").value.toUpperCase();
    tr = document.querySelector(".itemstable").getElementsByTagName('tr');
    products = Orders[orderNumber].products;

    for (var i = 0; i < Orders[orderNumber].products.length; i++) {
        if (products[i].name.toUpperCase().indexOf(inputValue) > -1 ||
            products[i].price.toUpperCase().indexOf(inputValue) > -1 ||
            products[i].quantity.toUpperCase().indexOf(inputValue) > -1 ||
            products[i].totalPrice.toUpperCase().indexOf(inputValue) > -1) {
            tr[i].style.display = "";
            licount++;
        } else {
            tr[i].style.display = "none";
        }
    }
}

// function sortProductsByName(table, col, reverse) {
//     console.log(table);
//     var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
//         tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
//         i;
//     reverse = -((+reverse) || -1);
//     tr = tr.sort(function (a, b) { // sort rows
//         return reverse // `-1 *` if want opposite order
//             * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
//                     .localeCompare(b.cells[col].textContent.trim())
//             );
//     });
//     for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
// }

// alert(Orders[orderNumber].products);
// Orders[orderNumber].products.name.sort();
// searchProducts(orderNumber);







