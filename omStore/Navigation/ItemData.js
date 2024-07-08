export default class Product {
    constructor(productName, productId, productDescription, productPrice, productDiscount, productUrl) {
        this._productName = productName;
        this._productId = productId;
        this._productDescription = productDescription;
        this._productPrice = productPrice;
        this._productDiscount = productDiscount;
        this._productUrl = productUrl;
    }

    get productName() {
        return this._productName;
    }

    set productName(name) {
        this._productName = name;
    }

    get productId() {
        return this._productId;
    }

    set productId(id) {
        this._productId = id;
    }

    get productDescription() {
        return this._productDescription;
    }

    set productDescription(description) {
        this._productDescription = description;
    }

    get productPrice() {
        return this._productPrice;
    }

    set productPrice(price) {
        this._productPrice = price;
    }

    get productDiscount() {
        return this._productDiscount;
    }

    set productDiscount(discount) {
        this._productDiscount = discount;
    }

    get productUrl() {
        return this._productUrl;
    }

    set productUrl(url) {
        this._productUrl = url;
    }

    getProductMRP() {
        return this._productPrice - this._productDiscount;
    }
}
