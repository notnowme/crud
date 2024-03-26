import express from "express";
import { 
    getAllUsers,
    getUserInfo
} from '../controllers/users';


// 라우터
const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', (req, res) => {
    getUserInfo(req, res);
});

module.exports = router;