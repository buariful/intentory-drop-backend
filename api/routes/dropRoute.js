const {
  insertDrops,
  reserveDrop,
  getDropList,
  purchaseReservedDrop,
} = require('../controllers/dropController');
const AuthMiddleware = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', AuthMiddleware, getDropList);
router.post('/', insertDrops); // public
router.post('/:dropId/reserve', AuthMiddleware, reserveDrop);
router.post('/:dropId/purchase', AuthMiddleware, purchaseReservedDrop);

module.exports = router;
