import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", routes);


app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  connectDB();
});