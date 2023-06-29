import fs from 'fs';
export class productManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const id = this.getNextId(products);
    const newProduct = { id, ...product };
    products.push(newProduct);
    await this.saveProducts(products);
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading products file:', error);
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields, id };
      products[productIndex] = updatedProduct;
      await this.saveProducts(products);
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await this.saveProducts(products);
    } else {
      throw new Error('Not found: Producto no existe');
    }
  }

  async saveProducts(products) {
    try {
      const data = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.path, data);
    } catch (error) {
      console.error('Error writing products file:', error);
    }
  }

  getNextId(products) {
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
  }
}