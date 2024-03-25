import express from 'express';
import routes from '../controllers/user';


// 라우터
const router = express.Router();

router.get('/', (req, res) => {
    routes.root(req, res);
});

router.get('/:id', (req, res) => {
    routes.getUserInfo(req, res);
});

module.exports = router;