import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.js'

const port = 3399
const app = express()
app.use(cors())
app.use("/", router);
app.listen(port, () => console.log(`Listening on port ${port}`))