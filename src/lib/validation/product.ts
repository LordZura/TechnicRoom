import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(3),
  model: z.string().min(2),
  brand: z.string().min(1),
  category: z.string().optional().nullable(),
  price: z.coerce.number().nonnegative().optional().nullable(),
  recommended_area: z.string().optional().nullable(),
  cooling_power: z.string().optional().nullable(),
  heating_power: z.string().optional().nullable(),
  cooling_consumption: z.string().optional().nullable(),
  heating_consumption: z.string().optional().nullable(),
  eer_cop: z.string().optional().nullable(),
  freon_type_amount: z.string().optional().nullable(),
  operating_temperature: z.string().optional().nullable(),
  indoor_unit_size: z.string().optional().nullable(),
  indoor_unit_weight: z.string().optional().nullable(),
  outdoor_unit_size: z.string().optional().nullable(),
  outdoor_unit_weight: z.string().optional().nullable(),
  noise_level: z.string().optional().nullable(),
  pipe_size: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  translations: z.array(
    z.object({
      locale: z.enum(['en', 'ka']),
      name: z.string().min(1),
      description: z.string().optional().nullable(),
      features: z.string().optional().nullable()
    })
  )
});

export type ProductFormInput = z.infer<typeof productSchema>;
