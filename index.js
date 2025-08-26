const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔹 Dummy Orders
const orders = [
  { orderId: "1234", status: "Shipped", delivery: "2 days" },
  { orderId: "5678", status: "Processing", delivery: "5 days" }
];

// 🔹 Dummy Products
const products = [
  { name: "Nike Air Max", category: "shoes", price: 120 },
  { name: "Adidas Runner", category: "shoes", price: 100 },
  { name: "Puma Flex", category: "shoes", price: 90 }
];

// 🔹 Dummy FAQs
const faqs = {
  delivery: "We deliver within 3–5 business days 🚚",
  payment: "We accept COD, Credit Card, and PayPal 💳",
  return: "You can return products within 7 days 🔄"
};

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Chatbot Backend is Running 🚀");
});

// ✅ Order Check (API-style)
app.get("/check-order/:id", (req, res) => {
  const order = orders.find(o => o.orderId === req.params.id);
  if (order) {
    res.json({ message: `📦 Order ${order.orderId} is ${order.status}, delivery in ${order.delivery}` });
  } else {
    res.json({ message: "❌ Order not found" });
  }
});

// ✅ Get Products by Category (API-style)
app.get("/products/:category", (req, res) => {
  const result = products.filter(
    p => p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  if (result.length > 0) {
    res.json({ products: result });
  } else {
    res.json({ message: "❌ No products found in this category" });
  }
});

// ✅ Chatbot POST Endpoint (direct responses)
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "⚠️ Please send a message" });
  }

  let reply = "🤔 I didn’t understand. Try asking about 'order 1234', 'products', 'delivery', or 'payment'.";

  // 🔹 Product Search
  if (message.toLowerCase().includes("product") || message.toLowerCase().includes("shoes")) {
    reply = "🛍 Available products:\n";
    products.forEach(p => {
      reply += `- ${p.name} ($${p.price})\n`;
    });
  }

  // 🔹 Order Tracking
  else if (message.toLowerCase().includes("order")) {
    const orderId = message.match(/\d+/)?.[0]; // extract order number
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      reply = `📦 Order ${order.orderId} is ${order.status}, delivery in ${order.delivery}`;
    } else {
      reply = "❌ Sorry, I couldn’t find that order. Try order 1234 or 5678.";
    }
  }

  // 🔹 FAQs
  else if (message.toLowerCase().includes("delivery")) reply = faqs.delivery;
  else if (message.toLowerCase().includes("payment")) reply = faqs.payment;
  else if (message.toLowerCase().includes("return")) reply = faqs.return;

  res.json({ reply });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Chatbot backend running on http://localhost:${PORT}`);
});
