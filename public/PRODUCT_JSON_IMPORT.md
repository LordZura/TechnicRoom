# Product JSON Import Guide

Use the admin dashboard JSON importer to create products without uploading images first. Images are not part of the JSON file. After import, open the product in admin and upload images normally.

The importer accepts either one product object, an array of product objects, or an object with a `products` array.

## Required Fields

Every product must include:

- `model`: product model, at least 2 characters.
- `brand`: manufacturer name.
- `category`: product type.
- `price`: product price. Use a number, not text.
- `translations`: English and Georgian product text. At least one product name must be filled.

The importer can generate `slug` automatically from `model`, English name, or Georgian name. You may also provide `slug` yourself. If a slug already exists, the importer adds a numeric suffix like `model-name-2`.

## Complete Product Example

```json
{
  "slug": "samsung-windfree-12000",
  "model": "AR12TXHQASIN",
  "brand": "Samsung",
  "category": "Inverter",
  "price": 1299,
  "color": "White",
  "has_fresh_air_intake": false,
  "recommended_area": "20-35 m²",
  "cooling_power": "12000 BTU",
  "heating_power": "13000 BTU",
  "cooling_consumption": "1.05 kW",
  "heating_consumption": "1.10 kW",
  "eer_cop": "3.21 / 3.61",
  "freon_type_amount": "R32 / 0.55 kg",
  "operating_temperature": "-15°C to 43°C",
  "indoor_unit_size": "820 x 299 x 215 mm",
  "indoor_unit_weight": "8.5 kg",
  "outdoor_unit_size": "720 x 495 x 270 mm",
  "outdoor_unit_weight": "23 kg",
  "noise_level": "22-40 dB",
  "pipe_size": "1/4 + 3/8",
  "custom_specs": [
    {
      "name": "Warranty",
      "value": "3 years"
    },
    {
      "name": "Compressor",
      "value": "Twin Rotary"
    }
  ],
  "is_active": true,
  "translations": {
    "en": {
      "name": "Samsung WindFree 12000 BTU",
      "description": "Efficient inverter air conditioner for small and medium rooms.",
      "features": "WindFree cooling\nEco mode\nQuiet operation"
    },
    "ka": {
      "name": "Samsung WindFree 12000 BTU",
      "description": "ინვერტორული კონდიციონერი მცირე და საშუალო ოთახებისთვის.",
      "features": "WindFree გაგრილება\nეკო რეჟიმი\nჩუმი მუშაობა"
    }
  }
}
```

## Bulk Import Example

```json
{
  "products": [
    {
      "model": "AR12TXHQASIN",
      "brand": "Samsung",
      "category": "Inverter",
      "price": 1299,
      "translations": {
        "en": { "name": "Samsung WindFree 12000 BTU" },
        "ka": { "name": "Samsung WindFree 12000 BTU" }
      }
    },
    {
      "model": "AS-12HR4SYDDC5",
      "brand": "Hisense",
      "category": "Inverter",
      "price": 1099,
      "translations": {
        "en": { "name": "Hisense 12000 BTU Inverter" },
        "ka": { "name": "Hisense 12000 BTU ინვერტერი" }
      }
    }
  ]
}
```

You can also upload a raw array:

```json
[
  {
    "model": "AS-12HR4SYDDC5",
    "brand": "Hisense",
    "category": "Inverter",
    "price": 1099,
    "translations": {
      "en": { "name": "Hisense 12000 BTU Inverter" },
      "ka": { "name": "Hisense 12000 BTU ინვერტერი" }
    }
  }
]
```

## Field Reference

Core fields:

- `id`: optional UUID. If provided and it matches an existing product, that product is updated.
- `slug`: optional URL slug. If empty, it is generated automatically.
- `model`: required text.
- `brand`: required text.
- `category`: required text. Common values: `Inverter`, `On-off`, `Column`, `Portable`.
- `price`: required number. Decimals are allowed.
- `is_active`: optional boolean. Default is `true`. Set to `false` to keep the product hidden.

Filter fields:

- `color`: optional text. Common values: `White`, `Black`, `Silver`.
- `has_fresh_air_intake`: optional boolean. Default is `false`.
- `recommended_area`: optional text. Common values: `20-35 m²`, `35-45 m²`, `45-65 m²`, `70-80 m²`, `80+ m²`.

Technical spec fields:

- `cooling_power`
- `heating_power`
- `cooling_consumption`
- `heating_consumption`
- `eer_cop`
- `freon_type_amount`
- `operating_temperature`
- `indoor_unit_size`
- `indoor_unit_weight`
- `outdoor_unit_size`
- `outdoor_unit_weight`
- `noise_level`
- `pipe_size`

Custom specs:

- `custom_specs` is optional.
- Use it for extra product rows that should appear on the product page.
- Custom specs are not included in filters.
- Each item must have `name` and `value`.

```json
"custom_specs": [
  { "name": "Warranty", "value": "3 years" },
  { "name": "Compressor", "value": "Twin Rotary" }
]
```

Translations:

Use the object format:

```json
"translations": {
  "en": {
    "name": "English product name",
    "description": "English description",
    "features": "Feature one\nFeature two"
  },
  "ka": {
    "name": "Georgian product name",
    "description": "Georgian description",
    "features": "Feature one\nFeature two"
  }
}
```

The importer also supports the array format used internally:

```json
"translations": [
  {
    "locale": "en",
    "name": "English product name",
    "description": "English description",
    "features": "Feature one\nFeature two"
  },
  {
    "locale": "ka",
    "name": "Georgian product name",
    "description": "Georgian description",
    "features": "Feature one\nFeature two"
  }
]
```

## Images

Do not include images in the JSON. The product can be created with no cover image and no gallery images. After import:

1. Open the product in the admin product list.
2. Save or confirm the product.
3. Use the Images section to upload gallery images.
4. Set a cover image if needed.

## Common Errors

- `Price is required`: add a numeric `price`.
- `Model is required`: add a `model` with at least 2 characters.
- `Provide at least English Name or Georgian Name`: fill `translations.en.name` or `translations.ka.name`.
- `Custom spec name is required`: every custom spec row needs a non-empty `name`.
- `Custom spec value is required`: every custom spec row needs a non-empty `value`.
- `Slug could not be generated`: provide `slug`, `model`, or a translated product name.
