import express from 'express';
import { recentFreeBoard, recentQnaBoard } from '../controllers/recent';

const router = express.Router();

router.get('/free', recentFreeBoard);

router.get('/qna', recentQnaBoard);

module.exports = router;