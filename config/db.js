import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://suyogluitel235:FUpX1KZpJCxqKjAl@cluster0.phebp.mongodb.net/staymandu"
    )
    .then(() => console.log("DB Connected"));
};
