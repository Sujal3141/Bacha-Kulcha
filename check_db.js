import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ override: true });

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MongoDB URI");
    return;
  }
  await mongoose.connect(uri);
  const ListingSchema = new mongoose.Schema({}, { strict: false });
  const ListingModel = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
  const docs = await ListingModel.find({ name: /litti/i });
  for (const doc of docs) {
    console.log("Found:", doc.name);
    console.log("Image starts with:", doc.image ? doc.image.substring(0, 50) : "NO IMAGE");
  }
  process.exit(0);
}
check();
