const {
  insertDrops,
  reserveDrop,
  getDropList,
  purchaseReservedDrop,
} = require('../controllers/dropController');
const AuthMiddleware = require('../middlewares/auth');
const { bulkCreateDropsSchema } = require('../validatorSchema/dropValidation');
const validate = require('../middlewares/validator');

const router = require('express').Router();

router.get('/', AuthMiddleware, getDropList);
router.post('/', validate(bulkCreateDropsSchema), insertDrops); // public
router.post('/:dropId/reserve', AuthMiddleware, reserveDrop);
router.post('/:reserveId/purchase', AuthMiddleware, purchaseReservedDrop);

module.exports = router;
