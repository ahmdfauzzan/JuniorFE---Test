import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseManager {
    private static instance: Database.Database;

    static getInstance(): Database.Database {
        if (!this.instance) {
            this.instance = new Database('database.db');
            this.initializeTables();
            this.insertSampleData();
        }
        return this.instance;
    }

    private static initializeTables() {
        const db = this.instance;

        // Users table
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(255) PRIMARY KEY,
                user_name VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) UNIQUE,
                created_timestamp TIMESTAMP DEFAULT (datetime('now', 'localtime')),
                updated_timestamp TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );
        `);

        // Products table
        db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                product_id VARCHAR(255) PRIMARY KEY,
                product_title VARCHAR(255) NOT NULL,
                product_price INTEGER NOT NULL,
                product_description TEXT,
                product_image VARCHAR(500),
                product_category VARCHAR(255),
                created_timestamp TIMESTAMP DEFAULT (datetime('now', 'localtime')),
                updated_timestamp TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );
        `);
    }

    private static insertSampleData() {
        const db = this.instance;

        // Check if products already exist
        const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

        if (count.count === 0) {
            // Sample data
            const sampleProducts = [
                {
                    product_id: uuidv4(),
                    product_title: "Comfortable Office Chair",
                    product_price: 120,
                    product_description: "Ergonomic chair designed for long hours of comfortable sitting",
                    product_image: "https://loremflickr.com/640/480/furniture",
                    product_category: "category 3",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Stylish Laptop Bag",
                    product_price: 80,
                    product_description: "Durable laptop bag with modern design and plenty of storage",
                    product_image: "https://loremflickr.com/640/480/bag",
                    product_category: "category 5",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Smartphone Stand",
                    product_price: 25,
                    product_description: "Adjustable stand for smartphones, perfect for video calls and watching movies",
                    product_image: "https://loremflickr.com/640/480/gadget",
                    product_category: "category 7",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Gourmet Coffee Beans",
                    product_price: 30,
                    product_description: "Premium coffee beans roasted to perfection for rich flavor",
                    product_image: "https://loremflickr.com/640/480/coffee",
                    product_category: "category 2",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Fitness Tracker",
                    product_price: 90,
                    product_description: "Advanced fitness tracker with heart rate monitor and GPS",
                    product_image: "https://loremflickr.com/640/480/sport",
                    product_category: "category 6",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Organic Facial Cleanser",
                    product_price: 35,
                    product_description: "Gentle facial cleanser made from natural ingredients",
                    product_image: "https://loremflickr.com/640/480/skincare",
                    product_category: "category 4",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Portable Bluetooth Speaker",
                    product_price: 55,
                    product_description: "Compact speaker with powerful sound quality and wireless connectivity",
                    product_image: "https://loremflickr.com/640/480/electronics",
                    product_category: "category 8",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Designer Sunglasses",
                    product_price: 180,
                    product_description: "Fashionable sunglasses with UV protection lenses",
                    product_image: "https://loremflickr.com/640/480/accessories",
                    product_category: "category 10",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Luxury Watch",
                    product_price: 250,
                    product_description: "Elegant watch with Swiss movement and stainless steel strap",
                    product_image: "https://loremflickr.com/640/480/watch",
                    product_category: "category 11",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Digital Camera",
                    product_price: 320,
                    product_description: "High-resolution digital camera with multiple shooting modes",
                    product_image: "https://loremflickr.com/640/480/camera",
                    product_category: "category 12",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Artisanal Handbag",
                    product_price: 150,
                    product_description: "Handcrafted leather handbag with intricate design",
                    product_image: "https://loremflickr.com/640/480/handbag",
                    product_category: "category 5",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Wireless Gaming Mouse",
                    product_price: 70,
                    product_description: "Responsive mouse designed for gamers, with customizable buttons",
                    product_image: "https://loremflickr.com/640/480/gaming",
                    product_category: "category 7",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Classic Fountain Pen",
                    product_price: 45,
                    product_description: "Elegant fountain pen with gold-plated nib, perfect for writing enthusiasts",
                    product_image: "https://loremflickr.com/640/480/stationery",
                    product_category: "category 13",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Fitness Yoga Mat",
                    product_price: 40,
                    product_description: "Non-slip yoga mat with eco-friendly materials",
                    product_image: "https://loremflickr.com/640/480/yoga",
                    product_category: "category 6",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Smart Home Thermostat",
                    product_price: 120,
                    product_description: "Wi-Fi enabled thermostat for smart home automation",
                    product_image: "https://loremflickr.com/640/480/smart-home",
                    product_category: "category 14",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Travel Backpack",
                    product_price: 65,
                    product_description: "Durable backpack with multiple compartments for travel convenience",
                    product_image: "https://loremflickr.com/640/480/backpack",
                    product_category: "category 5",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Wireless Earbuds",
                    product_price: 95,
                    product_description: "High-fidelity wireless earbuds with noise-cancellation technology",
                    product_image: "https://loremflickr.com/640/480/earbuds",
                    product_category: "category 8",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Organic Tea Sampler",
                    product_price: 28,
                    product_description: "Selection of organic teas from around the world, ideal for tea enthusiasts",
                    product_image: "https://loremflickr.com/640/480/tea",
                    product_category: "category 2",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                },
                {
                    product_id: uuidv4(),
                    product_title: "Designer Hand Watch",
                    product_price: 180,
                    product_description: "Men's fashion watch with leather strap and water resistance",
                    product_image: "https://loremflickr.com/640/480/watch",
                    product_category: "category 11",
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                }
            ];

            const insertProduct = db.prepare(`
                INSERT INTO products (
                    product_id, product_title, product_price,
                    product_description, product_image, product_category,
                    created_timestamp, updated_timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            sampleProducts.forEach(product => {
                insertProduct.run(
                    product.product_id,
                    product.product_title,
                    product.product_price,
                    product.product_description,
                    product.product_image,
                    product.product_category,
                    product.created_timestamp,
                    product.updated_timestamp
                );
            });
        }
    }
}