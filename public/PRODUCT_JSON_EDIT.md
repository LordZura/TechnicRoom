# Product JSON Edit Guide

Use JSON Product Edit when you want to update existing products from a JSON file or from the admin editor. This is separate from JSON Product Import:

- Import creates new products.
- Edit updates existing products only.
- Edit never creates a missing product.
- Images are not included and are not changed by JSON edit.

## How To Identify The Product

Every edited product must include one of these:

- `id`: best and safest option.
- `slug`: edits the product with that current slug.
- `current_slug`: use this when you want to change the product slug.

If you download or copy a product JSON from the admin list, it already includes `id`, so it is ready for editing.

## Single Product Edit

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "slug": "samsung-windfree-12000",
  "model": "AR12TXHQASIN",
  "brand": "Samsung",
  "category": "Inverter",
  "price": 1249,
  "color": "White",
  "has_fresh_air_intake": false,
  "recommended_area": "20-35 m²",
  "cooling_power": "12000 BTU",
  "heating_power": "13000 BTU",
  "custom_specs": [
    {
      "name": "Warranty",
      "value": "5 years",
      "name_ka": "გარანტია",
      "value_ka": "5 წელი"
    }
  ],
  "is_active": true,
  "translations": {
    "en": {
      "name": "Samsung WindFree 12000 BTU",
      "description": "Updated English description.",
      "features": "WindFree cooling\nEco mode\nQuiet operation"
    },
    "ka": {
      "name": "Samsung WindFree 12000 BTU",
      "description": "განახლებული ქართული აღწერა.",
      "features": "WindFree გაგრილება\nეკო რეჟიმი\nჩუმი მუშაობა"
    }
  }
}
```

## Multiple Product Edit

The edit tool accepts the same multi-product shapes as import. Recommended format:

```json
{
  "products": [
    {
      "id": "00000000-0000-0000-0000-000000000000",
      "slug": "samsung-windfree-12000",
      "model": "AR12TXHQASIN",
      "brand": "Samsung",
      "category": "Inverter",
      "price": 1249,
      "translations": {
        "en": { "name": "Samsung WindFree 12000 BTU" },
        "ka": { "name": "Samsung WindFree 12000 BTU" }
      }
    },
    {
      "slug": "hisense-12000-btu-inverter",
      "model": "AS-12HR4SYDDC5",
      "brand": "Hisense",
      "category": "Inverter",
      "price": 1049,
      "translations": {
        "en": { "name": "Hisense 12000 BTU Inverter" },
        "ka": { "name": "Hisense 12000 BTU ინვერტერი" }
      }
    }
  ]
}
```

Raw array format is also accepted:

```json
[
  {
    "slug": "hisense-12000-btu-inverter",
    "model": "AS-12HR4SYDDC5",
    "brand": "Hisense",
    "category": "Inverter",
    "price": 1049,
    "translations": {
      "en": { "name": "Hisense 12000 BTU Inverter" },
      "ka": { "name": "Hisense 12000 BTU ინვერტერი" }
    }
  }
]
```

## Changing A Slug

If you identify the product by `id`, you can just change `slug`:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "slug": "new-product-slug",
  "model": "AR12TXHQASIN",
  "brand": "Samsung",
  "category": "Inverter",
  "price": 1249,
  "translations": {
    "en": { "name": "Samsung WindFree 12000 BTU" },
    "ka": { "name": "Samsung WindFree 12000 BTU" }
  }
}
```

If you do not have the `id`, use `current_slug` to find the existing product and `slug` for the new URL:

```json
{
  "current_slug": "old-product-slug",
  "slug": "new-product-slug",
  "model": "AR12TXHQASIN",
  "brand": "Samsung",
  "category": "Inverter",
  "price": 1249,
  "translations": {
    "en": { "name": "Samsung WindFree 12000 BTU" },
    "ka": { "name": "Samsung WindFree 12000 BTU" }
  }
}
```

## Important Rules

- JSON edit uses the full product shape. Include all required fields: `model`, `brand`, `category`, `price`, and `translations`.
- At least one translated product name is required.
- `custom_specs` can include optional Georgian fields: `name_ka` and `value_ka`.
- If an edit file has multiple products and some fail, valid products are still updated and the editor reports which product numbers failed.
- All-products JSON export is download-only in the admin UI. It does not include images.

## Recommended Workflow

1. In admin, click `Copy JSON`, `JSON`, or `Edit JSON` on a product.
2. Change the JSON values.
3. Paste the JSON into the JSON Product Edit editor or upload a `.json` file.
4. Click `Apply JSON Edit`.
5. Upload or adjust images separately if needed.
