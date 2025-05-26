import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";
import router from './routes/routes';
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));

app.use(express.json());

app.use('/', router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
