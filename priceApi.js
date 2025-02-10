
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const DB_FILE = path.join(__dirname, "db.json");

// Helper function to read all product data from db.json
function getAllProducts() {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data).products || [];
  }
  return [];
}

// Helper function to find product by id from allproducts
function getProductData(productName) {
  const products = getAllProducts();
  return products.find(
    (product) => product.id.toLowerCase() === productName.toLowerCase()
  );
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/products/") && req.method === "GET") {
    const productName = url.pathname.split("/products/")[1];

    const productData = getProductData(productName);

    if (productData) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(productData.price));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Product not found." }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found." }));
  }
});

server.listen(PORT, () => {
  console.log(`Price API server running at http://localhost:${PORT}`);
});

module.exports = server;
