import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || '';

    const conn = await mongoose.connect(mongoURI);

    console.log(`📡 MongoDB Connected`);
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;