// Simple backend entry point for QuickBite Grocery
// Run: node backend.js
const { startServer } = require('./server.js');

startServer().catch(error => {
  console.error('Failed to start QuickBite server:', error);
  process.exit(1);
});
