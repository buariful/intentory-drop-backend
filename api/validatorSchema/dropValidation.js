const { z } = require('zod');

exports.bulkCreateDropsSchema = z.object({
  body: z
    .array(
      z.object({
        name: z.string().min(3),
        price: z.number().int().positive(),
        totalStock: z.number().int().positive(),
        startsAt: z.string().datetime(),
      })
    )
    .min(1),
});
