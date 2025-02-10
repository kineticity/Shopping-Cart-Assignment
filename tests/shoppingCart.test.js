const ShoppingCart = require("../shoppingCart");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
jest.mock("axios");

describe("ShoppingCart with test data", () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  function loadTestData(productName) {
    const filePath = path.resolve(__dirname, `../test_data/${productName}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  it("should add products and calculate prices correctly using test data", async () => {
    const cheeriosData = loadTestData("cheerios");
    const cornflakesData = loadTestData("cornflakes");

    axios.get.mockImplementation(url => {
      if (url.includes("cheerios")) {
        return Promise.resolve({ data: cheeriosData });
      } else if (url.includes("cornflakes")) {
        return Promise.resolve({ data: cornflakesData });
      }
      return Promise.reject(new Error("Product not found"));
    });

    await cart.addProduct("cheerios", 2); 
    await cart.addProduct("cornflakes", 3); 

    const expectedSubtotal = cheeriosData.price * 2 + cornflakesData.price * 3;
    const expectedTax = parseFloat((expectedSubtotal * 0.125).toFixed(2));
    const expectedTotal = parseFloat((expectedSubtotal + expectedTax).toFixed(2));

    expect(cart.getSubtotal()).toBeCloseTo(expectedSubtotal);
    expect(cart.getTax()).toBeCloseTo(expectedTax);
    expect(cart.getTotal()).toBeCloseTo(expectedTotal);
  });

  it("should throw an error for a non-existent product", async () => {
    axios.get.mockRejectedValue(new Error("Product not found"));

    await expect(cart.addProduct("unknownProduct", 1)).rejects.toThrow(
      'Error adding product "unknownProduct": Product not found'
    );
  });

  it("should handle empty cart calculations correctly", () => {
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.getTax()).toBe(0);
    expect(cart.getTotal()).toBe(0);
  });
});

