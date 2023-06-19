import fs from 'fs';

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const id = this.getNextId(products);
    const newProduct = { id, ...product };
    products.push(newProduct);
    this.saveProducts(products);
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields, id };
      products[productIndex] = updatedProduct;
      this.saveProducts(products);
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      this.saveProducts(products);
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  saveProducts(products) {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  getNextId(products) {
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
  }
}
