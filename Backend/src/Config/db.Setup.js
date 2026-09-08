import mongoose from "mongoose";

export async function connectdb(){
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log("Database connectedd");
       
      
    } catch (err) {
       console.log(err);
    console.log("Could Not Connect to the Database");
    process.exit(1);
    }
}

process.on("SIGINT", async () => { 
  await mongoose.disconnect();
  console.log("Client Disconnected!");
  process.exit(0);
});