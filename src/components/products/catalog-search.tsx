"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calculator,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import {
  getProductOptionLabel,
  FRESH_AIR_INTAKE_LABELS,
} from "@/lib/product-options";
import type {
  ProductFilterOptions,
  ProductFilters,
} from "@/lib/supabase/queries";
import type { Locale } from "@/types";

type CatalogSearchLabels = {
  searchPlaceholder: string;
  brand: string;
  allBrands: string;
  type: string;
  allTypes: string;
  recommendedArea: string;
  allAreas: string;
  color: string;
  function: string;
  freshAir: string;
  minPrice: string;
  maxPrice: string;
  priceRange: string;
  btuCalculator: string;
  btuArea: string;
  btuPeople: string;
  btuHeatLoad: string;
  btuLowLoad: string;
  btuNormalLoad: string;
  btuHighLoad: string;
  calculateBtu: string;
  apply: string;
  reset: string;
  showFilters: string;
  hideFilters: string;
  showAdvanced: string;
  hideAdvanced: string;
  activeFilters: string;
};

type HeatLoad = "low" | "normal" | "high";

const heatLoadFactors: Record<HeatLoad, number> = {
  low: 280,
  normal: 300,
  high: 305,
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function toPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function appendValues(params: URLSearchParams, key: string, values: string[]) {
  values.forEach((value) => {
    if (value.trim()) params.append(key, value.trim());
  });
}

function stripTrailingCount(label: string) {
  return label.replace(/\s*\(\d+\)\s*$/, "").trim();
}

type FilterChoice = {
  value: string;
  label: string;
  count: number;
};

function buildCountedChoices(
  values: string[],
  getLabel: (value: string) => string,
) {
  const counts = new Map<
    string,
    { value: string; count: number; label: string }
  >();

  for (const rawValue of values) {
    const value = rawValue.trim();
    if (!value) continue;

    const key = value.toLowerCase();
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(key, {
      value,
      count: 1,
      label: stripTrailingCount(getLabel(value)),
    });
  }

  return Array.from(counts.values());
}

function OptionGroup({
  title,
  emptyLabel,
  options,
  selected,
  onToggle,
}: {
  title: string;
  emptyLabel?: string;
  options: FilterChoice[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;

  const useDropdown = options.length > 1;
  const selectedLabel =
    selected.length === 0
      ? emptyLabel || title
      : selected.length === 1
        ? options.find((option) => option.value === selected[0])?.label || title
        : title;

  const choices = (
    <>
      {options.map((option) => {
        const active = selected.includes(option.value);

        return (
          <label
            key={option.value}
            className={`${
              useDropdown ? "flex w-full items-center justify-between" : "inline-flex"
            } min-h-9 cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition sm:text-[13px] ${
              active
                ? "border-brand-brown bg-brand-brown text-brand-ivory shadow-soft"
                : "border-brand-line bg-brand-cream text-brand-700/90 hover:border-brand-brown hover:bg-brand-ivory"
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(option.value)}
              className="sr-only"
            />

            <span className="truncate">{option.label}</span>

            <span
              className={`ml-3 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[10px] font-bold ${
                active
                  ? "border-brand-ivory bg-brand-ivory text-brand-brown"
                  : "border-brand-400 text-brand-600"
              }`}
            >
              {option.count}
            </span>
          </label>
        );
      })}
    </>
  );

  if (useDropdown) {
    return (
      <fieldset className="rounded-xl border border-brand-line bg-brand-ivory p-3">
        <legend className="px-1 text-[11px] font-semibold uppercase text-brand-700/75">
          {title}
        </legend>

        <details className="group mt-2">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-brand-line bg-brand-cream px-3 text-sm font-semibold text-brand-espresso transition hover:border-brand-brown hover:bg-brand-ivory [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 truncate">{selectedLabel}</span>
            <span className="inline-flex items-center gap-2">
              {selected.length > 0 && (
                <span className="rounded-full bg-brand-brown px-2 py-0.5 text-[11px] font-semibold text-brand-ivory">
                  {selected.length}
                </span>
              )}
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </span>
          </summary>

          <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-xl border border-brand-line bg-brand-ivory p-2 shadow-soft">
            {choices}
          </div>
        </details>
      </fieldset>
    );
  }

  return (
    <fieldset className="rounded-xl border border-brand-line bg-brand-ivory p-3">
      <legend className="px-1 text-[11px] font-semibold uppercase text-brand-700/75">
        {title}
      </legend>

      <div className="mt-2 flex flex-wrap gap-1.5">{choices}</div>
    </fieldset>
  );
}

function CompactMultiSelect({
  title,
  emptyLabel,
  options,
  selected,
  onToggle,
}: {
  title: string;
  emptyLabel: string;
  options: FilterChoice[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;

  if (options.length === 1) {
    const option = options[0];
    const active = selected.includes(option.value);

    return (
      <fieldset className="w-full rounded-xl border border-brand-line bg-brand-ivory p-3">
        <legend className="px-1 text-[11px] font-semibold uppercase text-brand-700/75">
          {title}
        </legend>

        <label
          className={`mt-2 flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            active
              ? "border-brand-brown bg-brand-brown text-brand-ivory shadow-soft"
              : "border-brand-line bg-brand-cream text-brand-700/90 hover:border-brand-brown hover:bg-brand-ivory"
          }`}
        >
          <input
            type="checkbox"
            checked={active}
            onChange={() => onToggle(option.value)}
            className="sr-only"
          />
          <span className="truncate">{option.label}</span>
          <span
            className={`ml-3 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[10px] font-bold ${
              active
                ? "border-brand-ivory bg-brand-ivory text-brand-brown"
                : "border-brand-400 text-brand-600"
            }`}
          >
            {option.count}
          </span>
        </label>
      </fieldset>
    );
  }

  const selectedLabel =
    selected.length === 0
      ? emptyLabel
      : selected.length === 1
        ? options.find((option) => option.value === selected[0])?.label || title
        : title;

  return (
    <fieldset className="w-full rounded-xl border border-brand-line bg-brand-ivory p-3">
      <legend className="px-1 text-[11px] font-semibold uppercase text-brand-700/75">
        {title}
      </legend>

      <details className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-brand-line bg-brand-cream px-3 py-2 text-sm font-semibold text-brand-espresso transition hover:border-brand-brown hover:bg-brand-ivory [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 truncate">{selectedLabel}</span>
          <span className="inline-flex items-center gap-2">
            {selected.length > 0 && (
              <span className="rounded-full bg-brand-brown px-2 py-0.5 text-[11px] font-semibold text-brand-ivory">
                {selected.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </span>
        </summary>

        <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-xl border border-brand-line bg-brand-ivory p-2 shadow-soft">
          {options.map((option) => {
            const active = selected.includes(option.value);

            return (
              <label
                key={option.value}
                className={`flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition sm:text-[13px] ${
                  active
                    ? "border-brand-brown bg-brand-brown text-brand-ivory shadow-soft"
                    : "border-brand-line bg-brand-cream text-brand-700/90 hover:border-brand-brown hover:bg-brand-ivory"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(option.value)}
                  className="sr-only"
                />
                <span className="truncate">{option.label}</span>
                <span
                  className={`ml-3 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-[10px] font-bold ${
                    active
                      ? "border-brand-ivory bg-brand-ivory text-brand-brown"
                      : "border-brand-400 text-brand-600"
                  }`}
                >
                  {option.count}
                </span>
              </label>
            );
          })}
        </div>
      </details>
    </fieldset>
  );
}

export function CatalogSearch({
  locale,
  filters,
  options,
  labels,
}: {
  locale: Locale;
  filters: ProductFilters;
  options: ProductFilterOptions;
  labels: CatalogSearchLabels;
}) {
  const router = useRouter();
  const hasPriceBounds = options.minPrice !== null && options.maxPrice !== null;
  const priceFloor = options.minPrice ?? 0;
  const priceCeiling = options.maxPrice ?? Math.max(priceFloor, 0);

  const [query, setQuery] = useState(filters.q || "");
  const [brands, setBrands] = useState(filters.brand || []);
  const [categories, setCategories] = useState(filters.category || []);
  const [recommendedAreas, setRecommendedAreas] = useState(
    filters.recommendedArea || [],
  );
  const [colors, setColors] = useState(filters.color || []);
  const [freshAir, setFreshAir] = useState(Boolean(filters.freshAir));
  const [minPrice, setMinPrice] = useState(
    filters.minPrice !== undefined ? String(filters.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : "",
  );

  const [btuArea, setBtuArea] = useState("8");
  const [btuPeople, setBtuPeople] = useState("1");
  const [heatLoad, setHeatLoad] = useState<HeatLoad>("normal");
  const [btuResult, setBtuResult] = useState<number | null>(2497);

  const categoryChoices = buildCountedChoices(options.categories, (value) =>
    getProductOptionLabel("category", value, locale),
  );

  const recommendedAreaChoices = buildCountedChoices(
    options.recommendedAreas,
    (value) => getProductOptionLabel("recommendedArea", value, locale),
  );

  const colorChoices = buildCountedChoices(options.colors, (value) =>
    getProductOptionLabel("color", value, locale),
  );

  const brandChoices = buildCountedChoices(options.brands, (value) => value);

  const functionChoices = options.hasFreshAirIntake
    ? [
        {
          value: "fresh-air-intake",
          label: FRESH_AIR_INTAKE_LABELS[locale],
          count: options.freshAirIntakeCount,
        },
      ]
    : [];

  const hasAdvancedFilters = Boolean(
    functionChoices.length ||
      categoryChoices.length ||
      recommendedAreaChoices.length ||
      colorChoices.length,
  );

  const advancedFilterCount =
    categories.length +
    recommendedAreas.length +
    colors.length +
    (freshAir ? 1 : 0);

  const activeFilterCount =
    brands.length + advancedFilterCount + [minPrice, maxPrice].filter(Boolean).length;

  const [filtersOpen, setFiltersOpen] = useState(activeFilterCount > 0);
  const [advancedOpen, setAdvancedOpen] = useState(advancedFilterCount > 0);

  const selectedMinPrice = minPrice === "" ? priceFloor : Number(minPrice);
  const selectedMaxPrice = maxPrice === "" ? priceCeiling : Number(maxPrice);
  const minPercent = toPercent(selectedMinPrice, priceFloor, priceCeiling);
  const maxPercent = toPercent(selectedMaxPrice, priceFloor, priceCeiling);

  const clampMinPrice = (value: string) => {
    if (value === "") {
      setMinPrice("");
      return;
    }

    const next = Number(value);
    const currentMax = maxPrice === "" ? undefined : Number(maxPrice);
    setMinPrice(
      String(currentMax !== undefined && next > currentMax ? currentMax : next),
    );
  };

  const clampMaxPrice = (value: string) => {
    if (value === "") {
      setMaxPrice("");
      return;
    }

    const next = Number(value);
    const currentMin = minPrice === "" ? undefined : Number(minPrice);
    setMaxPrice(
      String(currentMin !== undefined && next < currentMin ? currentMin : next),
    );
  };

  const calculateBtu = () => {
    const area = Number(btuArea);
    const people = Number(btuPeople);

    if (!Number.isFinite(area) || area <= 0) {
      setBtuResult(null);
      return;
    }

    const additionalPeople =
      Number.isFinite(people) && people > 1 ? people - 1 : 0;

    const peopleLoad = additionalPeople * 600;
    const rawBtu = area * heatLoadFactors[heatLoad] + peopleLoad;

    // 5% sizing margin to avoid undersizing
    const finalBtu = Math.round(rawBtu * 1.05);

    setBtuResult(finalBtu);
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    appendValues(params, "brand", brands);
    appendValues(params, "category", categories);
    appendValues(params, "recommendedArea", recommendedAreas);
    appendValues(params, "color", colors);
    if (freshAir) params.set("freshAir", "1");
    if (minPrice !== "") params.set("minPrice", minPrice);
    if (maxPrice !== "") params.set("maxPrice", maxPrice);

    const next = params.toString();
    router.push(next ? `/products?${next}` : "/products");
  };

  return (
    <form onSubmit={applyFilters} className="mt-4 max-w-6xl lg:max-w-none">
      <div className="grid items-start gap-2.5 rounded-2xl border border-brand-line/90 bg-brand-cream/70 p-2.5 lg:flex lg:flex-col lg:items-stretch lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
        <label className="group order-1 flex min-h-11 items-center gap-2 rounded-xl border border-brand-line bg-brand-ivory px-3 transition focus-within:border-brand-brown focus-within:ring-2 focus-within:ring-brand-gold/40 lg:order-1">
          <Search className="h-4 w-4 shrink-0 text-brand-600/80 transition group-focus-within:text-brand-brown" />
          <input
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-brand-500/70"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand-600/80 transition hover:bg-brand-cream hover:text-brand-brown"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="order-2 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-brand-line bg-brand-ivory px-3 text-left text-sm font-semibold text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-brown" />
            {filtersOpen ? labels.hideFilters : labels.showFilters}
          </span>
          <span className="inline-flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-brand-brown px-2 py-0.5 text-[11px] font-semibold text-brand-ivory">
                {activeFilterCount} {labels.activeFilters}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <div
          className={`order-4 overflow-hidden rounded-xl border border-brand-line bg-brand-ivory lg:order-3 lg:w-full ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-gradient-to-br from-brand-brown via-brand-espresso to-brand-700 px-3 py-3 text-brand-ivory">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase text-brand-ivory/80">
                {labels.priceRange}
              </span>
              {hasPriceBounds && (
                <span className="rounded-full bg-brand-ivory/12 px-2 py-0.5 text-[10px] font-semibold text-brand-ivory ring-1 ring-brand-ivory/18">
                  ₾{formatPrice(selectedMinPrice)} - ₾{formatPrice(selectedMaxPrice)}
                </span>
              )}
            </div>

            {hasPriceBounds && (
              <div className="mt-4">
                <div className="relative h-8 w-full px-1">
                  <div className="absolute left-1 right-1 top-1/2 h-2 -translate-y-1/2 rounded-full bg-brand-ivory/18 shadow-inner" />
                  <div
                    className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-gold via-brand-cream to-brand-gold shadow-[0_0_18px_rgba(238,197,122,0.45)]"
                    style={{
                      left: `${Math.min(minPercent, maxPercent)}%`,
                      right: `${100 - Math.max(minPercent, maxPercent)}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={priceFloor}
                    max={priceCeiling}
                    step="1"
                    value={selectedMinPrice}
                    onChange={(event) => clampMinPrice(event.target.value)}
                    className="tr-range-input tr-range-input-fancy"
                    aria-label={labels.minPrice}
                  />
                  <input
                    type="range"
                    min={priceFloor}
                    max={priceCeiling}
                    step="1"
                    value={selectedMaxPrice}
                    onChange={(event) => clampMaxPrice(event.target.value)}
                    className="tr-range-input tr-range-input-fancy"
                    aria-label={labels.maxPrice}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-brand-ivory/72">
                  <span>₾{formatPrice(priceFloor)}</span>
                  <span>₾{formatPrice(priceCeiling)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 p-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-brand-700/75">
                {labels.minPrice}
              </span>
              <input
                type="number"
                name="minPrice"
                min={hasPriceBounds ? priceFloor : 0}
                max={hasPriceBounds ? priceCeiling : undefined}
                step="1"
                value={minPrice}
                onChange={(event) => clampMinPrice(event.target.value)}
                placeholder={labels.minPrice}
                className="h-10 w-full rounded-lg border border-brand-line bg-brand-cream px-2 text-sm font-semibold text-brand-brown outline-none transition placeholder:text-brand-500/70 focus:border-brand-brown focus:ring-2 focus:ring-brand-gold/35"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-brand-700/75">
                {labels.maxPrice}
              </span>
              <input
                type="number"
                name="maxPrice"
                min={hasPriceBounds ? priceFloor : 0}
                max={hasPriceBounds ? priceCeiling : undefined}
                step="1"
                value={maxPrice}
                onChange={(event) => clampMaxPrice(event.target.value)}
                placeholder={labels.maxPrice}
                className="h-10 w-full rounded-lg border border-brand-line bg-brand-cream px-2 text-sm font-semibold text-brand-brown outline-none transition placeholder:text-brand-500/70 focus:border-brand-brown focus:ring-2 focus:ring-brand-gold/35"
              />
            </label>
          </div>
        </div>

        {hasAdvancedFilters && (
          <div
            className={`order-5 lg:order-4 lg:w-full ${
              filtersOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="space-y-3">
              <CompactMultiSelect
                title={labels.brand}
                emptyLabel={labels.allBrands}
                options={brandChoices}
                selected={brands}
                onToggle={(value) =>
                  setBrands((current) => toggleValue(current, value))
                }
              />

              <button
                type="button"
                onClick={() => setAdvancedOpen((open) => !open)}
                aria-expanded={advancedOpen}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-brand-line bg-brand-ivory px-3 text-left text-sm font-semibold text-brand-espresso transition hover:border-brand-brown hover:bg-brand-cream"
              >
                <span>{advancedOpen ? labels.hideAdvanced : labels.showAdvanced}</span>
                <span className="inline-flex items-center gap-2">
                  {advancedFilterCount > 0 && (
                    <span className="rounded-full bg-brand-brown px-2 py-0.5 text-[11px] font-semibold text-brand-ivory">
                      {advancedFilterCount} {labels.activeFilters}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      advancedOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              <div
                className={`grid gap-2 ${
                  advancedOpen ? "grid" : "hidden"
                } lg:grid-cols-1`}
              >
                <OptionGroup
                  title={labels.function}
                  options={functionChoices}
                  selected={freshAir ? ["fresh-air-intake"] : []}
                  onToggle={() => setFreshAir((current) => !current)}
                />

                <OptionGroup
                  title={labels.type}
                  emptyLabel={labels.allTypes}
                  options={categoryChoices}
                  selected={categories}
                  onToggle={(value) =>
                    setCategories((current) => toggleValue(current, value))
                  }
                />

                <OptionGroup
                  title={labels.recommendedArea}
                  emptyLabel={labels.allAreas}
                  options={recommendedAreaChoices}
                  selected={recommendedAreas}
                  onToggle={(value) =>
                    setRecommendedAreas((current) => toggleValue(current, value))
                  }
                />

                <OptionGroup
                  title={labels.color}
                  emptyLabel={labels.color}
                  options={colorChoices}
                  selected={colors}
                  onToggle={(value) =>
                    setColors((current) => toggleValue(current, value))
                  }
                />

                <div className="rounded-xl border border-brand-line bg-brand-ivory p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-brand-700/75">
                      <Calculator className="h-4 w-4 text-brand-brown" />
                      {labels.btuCalculator}
                    </h3>
                    <p className="text-base font-bold text-brand-brown">
                      {btuResult === null ? "-" : `${formatPrice(btuResult)} BTU`}
                    </p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <label className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase text-brand-700/75">
                        {labels.btuArea}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={btuArea}
                        onChange={(event) => setBtuArea(event.target.value)}
                        placeholder={labels.btuArea}
                        className="tr-input"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase text-brand-700/75">
                        {labels.btuPeople}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={btuPeople}
                        onChange={(event) => setBtuPeople(event.target.value)}
                        placeholder={labels.btuPeople}
                        className="tr-input"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase text-brand-700/75">
                        {labels.btuHeatLoad}
                      </span>
                      <select
                        value={heatLoad}
                        onChange={(event) =>
                          setHeatLoad(event.target.value as HeatLoad)
                        }
                        className="tr-input"
                      >
                        <option value="low">{labels.btuLowLoad}</option>
                        <option value="normal">{labels.btuNormalLoad}</option>
                        <option value="high">{labels.btuHighLoad}</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={calculateBtu}
                      className="tr-btn-ghost min-h-11 px-4 xl:self-end"
                    >
                      {labels.calculateBtu}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`order-6 grid-cols-[1fr_auto] gap-2 lg:order-5 lg:flex lg:w-full lg:self-start ${
            filtersOpen ? "grid" : "hidden lg:flex"
          }`}
        >
          <button
            className="tr-btn-primary min-h-11 px-4 lg:flex-1 lg:px-5"
            type="submit"
          >
            {labels.apply}
          </button>
          <Link
            href="/products"
            className="tr-btn-ghost min-h-11 px-3 lg:min-w-11"
            title={labels.reset}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">{labels.reset}</span>
          </Link>
        </div>
      </div>
    </form>
  );
}