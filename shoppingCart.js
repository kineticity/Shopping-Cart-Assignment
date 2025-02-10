const axios = require("axios");

class ShoppingCart {
  constructor(baseUrl = "http://localhost:3001") {
    this.cart = [];
    this.taxRate = 0.125;
    this.baseUrl = baseUrl;
  }

  async addProduct(productName, quantity) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productName}`);
      if (!response.data || typeof response.data.price !== "number") {
        throw new Error(`Invalid product data for "${productName}"`);
      }
      const price = response.data.price;
      this.cart.push({ productName, quantity, price });
    } catch (error) {
      console.error(`Failed to add product "${productName}":`, error.message);
      throw new Error(`Error adding product "${productName}": ${error.response?.data || error.message}`);
    }
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => {
      if (isNaN(item.price) || isNaN(item.quantity)) {
        console.error(`Invalid cart entry:`, item);
        return sum;
      }
      return sum + item.price * item.quantity;
    }, 0);
  }

  getTax() {
    return parseFloat((this.getSubtotal() * this.taxRate).toFixed(2));
  }

  getTotal() {
    return parseFloat((this.getSubtotal() + this.getTax()).toFixed(2));
  }

  displayCart() {
    console.log("\nShopping Cart:");
    this.cart.forEach(item => {
      console.log(`${item.quantity} x ${item.productName} @ $${item.price.toFixed(2)} each`);
    });
    console.log(`Subtotal: $${this.getSubtotal().toFixed(2)}`);
    console.log(`Tax: $${this.getTax().toFixed(2)}`);
    console.log(`Total: $${this.getTotal().toFixed(2)}\n`);
  }
}



module.exports = ShoppingCart;

