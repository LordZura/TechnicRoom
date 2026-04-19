import { z } from 'zod';

const translationSchema = z.object({
  locale: z.enum(['en', 'ka']),
  name: z.string().trim().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.string().optional().nullable()
});

export const productSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: z.string().trim().min(1, 'Slug is required'),
    model: z.string().trim().min(2, 'Model is required'),
    brand: z.string().trim().min(1, 'Brand is required'),
    category: z.string().trim().min(1, 'Category is required'),
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
    translations: z.array(translationSchema).length(2)
  })
  .superRefine((value, ctx) => {
    const enName = value.translations.find((item) => item.locale === 'en')?.name?.trim();
    const kaName = value.translations.find((item) => item.locale === 'ka')?.name?.trim();

    if (!enName && !kaName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least English Name or Georgian Name',
        path: ['translations']
      });
    }
  });

export type ProductFormInput = z.infer<typeof productSchema>;
