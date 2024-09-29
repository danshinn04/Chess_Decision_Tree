import { Router } from "express";
import createGame from "../controllers/createGame.js";

const router = Router()

router.use('/', createGame.create);



export default router;