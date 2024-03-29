import express from "express";
import apiRouter from "./router/router.js";

const app = express();
app.use(express.json())

app.use('/api/v1', apiRouter)

app.listen(3000, () => {
    console.log(`Server is running on port: 3000`);
});