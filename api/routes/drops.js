const router = require('express').Router();

router.post('/:id/reserve', async (req, res) => {
  const io = req.app.get('io');

  // simulate success
  io.emit('stock:update', {
    dropId: req.params.id,
    availableStock: Math.floor(Math.random() * 10),
  });

  res.json({ success: true });
});

module.exports = router;
