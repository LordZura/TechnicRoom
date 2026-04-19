export type Locale = 'en' | 'ka';

export type Product = {
  id: string;
  slug: string;
  brand: string;
  category: string | null;
  model: string;
  price: number | null;
  recommended_area: string | null;
  cooling_power: string | null;
  heating_power: string | null;
  cooling_consumption: string | null;
  heating_consumption: string | null;
  eer_cop: string | null;
  freon_type_amount: string | null;
  operating_temperature: string | null;
  indoor_unit_size: string | null;
  indoor_unit_weight: string | null;
  outdoor_unit_size: string | null;
  outdoor_unit_weight: string | null;
  noise_level: string | null;
  pipe_size: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProductTranslation = {
  product_id: string;
  locale: Locale;
  name: string;
  description: string | null;
  features: string | null;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
};

export type ProductWithRelations = Product & {
  translations: ProductTranslation[];
  images: ProductImage[];
};

export type UiDictionary = {
  nav: Record<string, string>;
  home: Record<string, string>;
  products: Record<string, string>;
  product: Record<string, string>;
  productSpecLabels: Record<string, string>;
  admin: Record<string, string>;
  about: Record<string, string>;
  contact: Record<string, string>;
  common: Record<string, string>;
};