
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/product.model.js';

let mongoServer;

// Перед кожним тестом створюємо нову базу даних в пам'яті
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();  // Створюємо сервер MongoDB в пам'яті
  const uri = mongoServer.getUri();  // Отримуємо URI для підключення
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });  // Підключаємося
});

// Після всіх тестів зупиняємо сервер та очищаємо базу
afterAll(async () => {
  await mongoose.connection.dropDatabase();  // Видаляємо тестову базу
  await mongoose.connection.close();  // Закриваємо з'єднання
  await mongoServer.stop();  // Зупиняємо сервер
});

describe('Product Model Test', () => {
  
  // Тест для успішного створення та збереження продукту
  it('should create and save a product successfully', async () => {
    const productData = {
      name: 'Test Product',
      image: 'http://example.com/product.png',
      price: 99.99
    };

    const validProduct = new Product(productData);
    const savedProduct = await validProduct.save();

    // Перевіряємо, чи збережено продукт
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.image).toBe(productData.image);
    expect(savedProduct.price).toBe(productData.price);
  });

  // Тест на відсутність обов'язкових полів (наприклад, name)
  it('should fail when required fields are missing', async () => {
    const productData = {
      image: 'http://example.com/product.png',
      price: 99.99
    };

    const productWithoutName = new Product(productData);

    let err;
    try {
      await productWithoutName.save();  // Спробуємо зберегти продукт без name
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();  // Перевіряємо, що з'явилася помилка
    expect(err.errors.name).toBeDefined();  // Перевіряємо, що помилка пов'язана з відсутністю name
  });

});
