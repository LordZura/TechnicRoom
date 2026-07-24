"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Check,
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

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function FieldShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="w-full rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
      <legend className="px-1 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function CheckOption({
  option,
  active,
  onToggle,
}: {
  option: FilterChoice;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex min-h-10 w-full cursor-pointer select-none items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[0.8125rem] font-semibold transition-all duration-300 ease-smooth ${
        active
          ? "bg-wine-50 text-wine-800"
          : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
      }`}
    >
      <input
        type="checkbox"
        checked={active}
        onChange={onToggle}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={`grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-md border transition-all duration-300 ease-smooth ${
          active
            ? "border-transparent bg-gradient-to-b from-wine-600 to-wine-800 text-white shadow-glow"
            : "border-ink-200 bg-white"
        }`}
      >
        <Check
          className={`h-3 w-3 transition-transform duration-300 ease-spring ${
            active ? "scale-100" : "scale-0"
          }`}
          strokeWidth={3}
        />
      </span>

      <span className="min-w-0 flex-1 truncate">{option.label}</span>

      <span
        className={`tr-badge ${
          active ? "bg-wine-100 text-wine-800" : "bg-ink-100 text-ink-500"
        }`}
      >
        {option.count}
      </span>
    </label>
  );
}

function MultiSelect({
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

  // A single choice reads better as a plain toggle than as a dropdown.
  if (options.length === 1) {
    const option = options[0];

    return (
      <FieldShell title={title}>
        <div className="mt-1.5">
          <CheckOption
            option={option}
            active={selected.includes(option.value)}
            onToggle={() => onToggle(option.value)}
          />
        </div>
      </FieldShell>
    );
  }

  const selectedLabel =
    selected.length === 0
      ? emptyLabel || title
      : selected.length === 1
        ? options.find((option) => option.value === selected[0])?.label || title
        : `${selected.length} · ${title}`;

  return (
    <FieldShell title={title}>
      <details className="group mt-1.5">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50/70 px-3 text-[0.8125rem] font-semibold text-ink-800 transition-all duration-300 ease-smooth hover:border-wine-200 hover:bg-white [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 truncate">{selectedLabel}</span>
          <span className="inline-flex shrink-0 items-center gap-2">
            {selected.length > 0 && (
              <span className="tr-badge bg-gradient-to-b from-wine-600 to-wine-800 text-white">
                {selected.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4 text-ink-400 transition-transform duration-400 ease-smooth group-open:rotate-180" />
          </span>
        </summary>

        <div className="mt-2 max-h-64 animate-slide-down space-y-0.5 overflow-y-auto rounded-xl border border-ink-100 bg-white p-1.5">
          {options.map((option) => (
            <CheckOption
              key={option.value}
              option={option}
              active={selected.includes(option.value)}
              onToggle={() => onToggle(option.value)}
            />
          ))}
        </div>
      </details>
    </FieldShell>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

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
    brands.length +
    advancedFilterCount +
    [minPrice, maxPrice].filter(Boolean).length;

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

  const panelVisibility = filtersOpen ? "block" : "hidden lg:block";

  return (
    <form onSubmit={applyFilters} className="space-y-2.5">
      {/* Search */}
      <label className="tr-field group">
        <Search className="h-4 w-4 shrink-0 text-ink-400 transition-colors duration-300 group-focus-within:text-wine-700" />
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.searchPlaceholder}
          className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={labels.reset}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-all duration-300 hover:bg-ink-100 hover:text-wine-700 active:scale-90"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        aria-expanded={filtersOpen}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white px-3.5 text-left text-sm font-semibold text-ink-800 shadow-soft transition-all duration-300 ease-smooth hover:border-wine-200 lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-wine-700" />
          {filtersOpen ? labels.hideFilters : labels.showFilters}
        </span>
        <span className="inline-flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="tr-badge h-6 min-w-6 bg-gradient-to-b from-wine-600 to-wine-800 px-2 text-[0.6875rem] text-white">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-ink-400 transition-transform duration-400 ease-smooth ${
              filtersOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Price */}
      <div
        className={`overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft ${panelVisibility}`}
      >
        <div className="px-3.5 pb-3 pt-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-ink-400">
              {labels.priceRange}
            </span>
            {hasPriceBounds && (
              <span className="rounded-full bg-wine-50 px-2.5 py-1 text-[0.6875rem] font-bold tabular-nums text-wine-800">
                ₾{formatPrice(selectedMinPrice)} – ₾{formatPrice(selectedMaxPrice)}
              </span>
            )}
          </div>

          {hasPriceBounds && (
            <div className="mt-3.5">
              <div className="relative h-6 w-full px-0.5">
                <div className="absolute left-0.5 right-0.5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink-100" />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-wine-600 to-wine-800"
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
                  className="tr-range-input"
                  aria-label={labels.minPrice}
                />
                <input
                  type="range"
                  min={priceFloor}
                  max={priceCeiling}
                  step="1"
                  value={selectedMaxPrice}
                  onChange={(event) => clampMaxPrice(event.target.value)}
                  className="tr-range-input"
                  aria-label={labels.maxPrice}
                />
              </div>

              <div className="mt-0.5 flex items-center justify-between text-[0.625rem] font-semibold tabular-nums text-ink-400">
                <span>₾{formatPrice(priceFloor)}</span>
                <span>₾{formatPrice(priceCeiling)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 border-t border-ink-100 bg-ink-50/50 p-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="tr-label">{labels.minPrice}</span>
            <input
              type="number"
              name="minPrice"
              min={hasPriceBounds ? priceFloor : 0}
              max={hasPriceBounds ? priceCeiling : undefined}
              step="1"
              value={minPrice}
              onChange={(event) => clampMinPrice(event.target.value)}
              placeholder={labels.minPrice}
              className="tr-input min-h-10 py-2 text-[0.8125rem] font-bold tabular-nums text-wine-800"
            />
          </label>

          <label className="space-y-1.5">
            <span className="tr-label">{labels.maxPrice}</span>
            <input
              type="number"
              name="maxPrice"
              min={hasPriceBounds ? priceFloor : 0}
              max={hasPriceBounds ? priceCeiling : undefined}
              step="1"
              value={maxPrice}
              onChange={(event) => clampMaxPrice(event.target.value)}
              placeholder={labels.maxPrice}
              className="tr-input min-h-10 py-2 text-[0.8125rem] font-bold tabular-nums text-wine-800"
            />
          </label>
        </div>
      </div>

      {/* Brand + advanced */}
      {hasAdvancedFilters && (
        <div className={`space-y-2.5 ${panelVisibility}`}>
          <MultiSelect
            title={labels.brand}
            emptyLabel={labels.allBrands}
            options={brandChoices}
            selected={brands}
            onToggle={(value) => setBrands((current) => toggleValue(current, value))}
          />

          <button
            type="button"
            onClick={() => setAdvancedOpen((open) => !open)}
            aria-expanded={advancedOpen}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white px-3.5 text-left text-sm font-semibold text-ink-800 shadow-soft transition-all duration-300 ease-smooth hover:border-wine-200"
          >
            <span>{advancedOpen ? labels.hideAdvanced : labels.showAdvanced}</span>
            <span className="inline-flex items-center gap-2">
              {advancedFilterCount > 0 && (
                <span className="tr-badge h-6 min-w-6 bg-gradient-to-b from-wine-600 to-wine-800 px-2 text-[0.6875rem] text-white">
                  {advancedFilterCount}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-ink-400 transition-transform duration-400 ease-smooth ${
                  advancedOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          <div className={`space-y-2.5 ${advancedOpen ? "block" : "hidden"}`}>
            <MultiSelect
              title={labels.function}
              options={functionChoices}
              selected={freshAir ? ["fresh-air-intake"] : []}
              onToggle={() => setFreshAir((current) => !current)}
            />

            <MultiSelect
              title={labels.type}
              emptyLabel={labels.allTypes}
              options={categoryChoices}
              selected={categories}
              onToggle={(value) =>
                setCategories((current) => toggleValue(current, value))
              }
            />

            <MultiSelect
              title={labels.recommendedArea}
              emptyLabel={labels.allAreas}
              options={recommendedAreaChoices}
              selected={recommendedAreas}
              onToggle={(value) =>
                setRecommendedAreas((current) => toggleValue(current, value))
              }
            />

            <MultiSelect
              title={labels.color}
              emptyLabel={labels.color}
              options={colorChoices}
              selected={colors}
              onToggle={(value) => setColors((current) => toggleValue(current, value))}
            />

            {/* BTU calculator */}
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
              <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-sea-600 to-sea-700 px-3.5 py-3 text-white">
                <h3 className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.16em] text-white/80">
                  <Calculator className="h-4 w-4" />
                  {labels.btuCalculator}
                </h3>
                <p className="font-display text-base font-extrabold tabular-nums">
                  {btuResult === null ? "—" : `${formatPrice(btuResult)}`}
                  {btuResult !== null && (
                    <span className="ml-1 text-[0.625rem] font-bold tracking-[0.1em] text-white/70">
                      BTU
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-1">
                <label className="space-y-1.5">
                  <span className="tr-label">{labels.btuArea}</span>
                  <input
                    type="number"
                    min="1"
                    value={btuArea}
                    onChange={(event) => setBtuArea(event.target.value)}
                    placeholder={labels.btuArea}
                    className="tr-input min-h-10 py-2 text-[0.8125rem]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="tr-label">{labels.btuPeople}</span>
                  <input
                    type="number"
                    min="0"
                    value={btuPeople}
                    onChange={(event) => setBtuPeople(event.target.value)}
                    placeholder={labels.btuPeople}
                    className="tr-input min-h-10 py-2 text-[0.8125rem]"
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <span className="tr-label">{labels.btuHeatLoad}</span>
                  <select
                    value={heatLoad}
                    onChange={(event) =>
                      setHeatLoad(event.target.value as HeatLoad)
                    }
                    className="tr-select min-h-10 py-2 text-[0.8125rem]"
                  >
                    <option value="low">{labels.btuLowLoad}</option>
                    <option value="normal">{labels.btuNormalLoad}</option>
                    <option value="high">{labels.btuHighLoad}</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={calculateBtu}
                  className="tr-btn-quiet min-h-10 sm:col-span-2 lg:col-span-1"
                >
                  {labels.calculateBtu}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className={`flex gap-2 pt-0.5 ${filtersOpen ? "flex" : "hidden lg:flex"}`}
      >
        <button className="tr-btn-primary flex-1" type="submit">
          {labels.apply}
        </button>

        <Link
          href="/products"
          className="tr-btn-ghost w-11 shrink-0 px-0"
          title={labels.reset}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">{labels.reset}</span>
        </Link>
      </div>
    </form>
  );
}
