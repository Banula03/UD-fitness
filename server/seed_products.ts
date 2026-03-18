import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';

dotenv.config();

const products = [
    // Supplements
    {
        name: "Premium Whey Protein",
        description: "24g of high-quality protein per serving to support muscle growth.",
        price: 59.99,
        category: "supplements",
        image_url: "https://images.unsplash.com/photo-1593092236211-17730eaee607?q=80&w=2070&auto=format&fit=crop",
        stock: 50
    },
    {
        name: "Pre-Workout Ignition",
        description: "Extreme energy and focus for your most intense training sessions.",
        price: 34.99,
        category: "supplements",
        image_url: "https://images.unsplash.com/photo-1546413411-cd9067ea7c23?q=80&w=2070&auto=format&fit=crop",
        stock: 40
    },
    {
        name: "BCAA Recovery",
        description: "Branched-chain amino acids to accelerate muscle recovery.",
        price: 29.99,
        category: "supplements",
        image_url: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2072&auto=format&fit=crop",
        stock: 100
    },
    // Equipment
    {
        name: "Adjustable Dumbbells",
        description: "Versatile weights ranging from 5 to 50 lbs.",
        price: 299.99,
        category: "equipment",
        image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2ae617?q=80&w=2070&auto=format&fit=crop",
        stock: 15
    },
    {
        name: "Resistance Band Set",
        description: "Set of 5 high-quality latex bands for full-body workouts.",
        price: 19.99,
        category: "equipment",
        image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
        stock: 60
    },
    {
        name: "Professional Yoga Mat",
        description: "Extra thick non-slip surface for ultimate comfort.",
        price: 39.99,
        category: "equipment",
        image_url: "https://images.unsplash.com/photo-1592432676556-3bc9589d31d7?q=80&w=1974&auto=format&fit=crop",
        stock: 30
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB Connected for seeding...");
        
        await Product.deleteMany({});
        console.log("Cleared existing products.");
        
        await Product.insertMany(products);
        console.log("Seeded " + products.length + " products successfully!");
        
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedProducts();
