import { Router } from "express";
import createGame from './createGame.js'

const router = Router()
router.use('/create-game', createGame)


export default router;
