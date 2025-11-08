import mongoose from "mongoose";
import BlogPost from "./models/blogspot.mjs";
import connectDB from "./db.mjs";

// Connect to database
await connectDB();

// Clear existing posts
await BlogPost.deleteMany({});
console.log("✅ Cleared existing posts");

// Create two educational posts
const posts = [
  {
    title: "Virtual Properties",
    body: "A virtual property in Mongoose is a property that is NOT stored in MongoDB. It is computed on-the-fly when you access it. Virtuals are great for derived data that you don't want to save in your database. For example, if you have firstName and lastName fields, you can create a fullName virtual. Or in this demo, we use a 'url' virtual that generates the post URL from the _id field. The key advantage is that virtuals save database space and are always up-to-date since they're calculated in real-time. Remember: virtuals are defined in the schema but never appear in the actual MongoDB documents!",
  },
  {
    title: "Instance Methods",
    body: "Instance methods in Mongoose are custom functions that you can call on individual document instances. Unlike virtuals, methods can accept parameters and perform complex operations. They have access to 'this', which refers to the document itself. In this demo, we have a getSummary() method that truncates text to a specified length. You can call it like post.getSummary(50) to get the first 50 characters. Methods are perfect for encapsulating document-specific logic, keeping your code clean and reusable. They help you avoid repeating the same operations throughout your application. Use methods when you need parameters or complex logic, and use virtuals for simple derived properties!",
  },
];

const createdPosts = await BlogPost.insertMany(posts);
console.log(`✅ Created ${createdPosts.length} posts:`);
createdPosts.forEach((post) => {
  console.log(`   - ${post.title}`);
  console.log(`     Virtual URL: ${post.url}`);
  console.log(`     Summary: ${post.getSummary(50)}`);
});

// Close connection
await mongoose.connection.close();
console.log("\n✅ Database populated successfully!");
