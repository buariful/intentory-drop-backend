const router = require('express').Router();

const dummyDrops = [
  {
    id: 1,
    name: 'Air Jordan 1 Retro',
    price: 250,
    stock: 5,
    recentPurchasers: [
      { id: 1, username: 'alice' },
      { id: 2, username: 'bob' },
      { id: 3, username: 'charlie' },
    ],
  },
  {
    id: 2,
    name: 'Nike Dunk Low',
    price: 180,
    stock: 0,
    recentPurchasers: [],
  },
  {
    id: 3,
    name: 'Yeezy Boost 350',
    price: 300,
    stock: 2,
    recentPurchasers: [
      { id: 4, username: 'david' },
      { id: 5, username: 'eva' },
    ],
  },
  {
    id: 4,
    name: 'Puma RS-X',
    price: 120,
    stock: 8,
    recentPurchasers: [{ id: 6, username: 'frank' }],
  },
];

router.post('/:id/reserve', async (req, res) => {
  const io = req.app.get('io');

  // simulate success
  io.emit('stock:update', {
    dropId: req.params.id,
    availableStock: Math.floor(Math.random() * 10),
  });

  res.json({ success: true });
});
router.post('/drops', async (req, res) => {
  res.json({ success: true, drops: dummyDrops });
});

module.exports = router;
