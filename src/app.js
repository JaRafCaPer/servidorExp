import express from "express";
import { ProductManager } from './ProductManager.js';

const app = express();
const manager = new ProductManager('products.json');

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await manager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await manager.getProductById(productId);

    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado. Intenta con otro producto' });
  }
});

app.listen(8080, () => {
  console.log('Servidor arriba en el puerto 8080');
});
