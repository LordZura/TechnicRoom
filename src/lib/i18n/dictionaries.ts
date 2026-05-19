import { Locale, UiDictionary } from '@/types';

const en: UiDictionary = {
  nav: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact', admin: 'Admin' },
  home: {
    title: 'Air Conditioner Catalog',
    subtitle: 'Find the right cooling system for homes and businesses.',
    cta: 'Browse Products'
  },
  products: {
    title: 'Air Conditioner Catalog',
    searchPlaceholder: 'Search by model, brand, type, feature, slug...',
    empty: 'No products found.',
    intro: 'Browse dependable heating and cooling systems tailored for residential and commercial spaces.',
    loadError: 'Failed to load products.',
    brandFilter: 'Brand',
    allBrands: 'All brands',
    typeFilter: 'Type',
    allTypes: 'All types',
    recommendedAreaFilter: 'Area',
    allAreas: 'All areas',
    colorFilter: 'Color',
    functionFilter: 'Function',
    freshAirFunction: 'Fresh air intake',
    priceRange: 'Price range',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    btuCalculator: 'BTU calculator',
    btuArea: 'Area (m²)',
    btuPeople: 'People',
    btuHeatLoad: 'Room heat load',
    btuLowLoad: 'Low',
    btuNormalLoad: 'Normal',
    btuHighLoad: 'High',
    calculateBtu: 'Calculate',
    applyFilters: 'Apply filters',
    resetFilters: 'Clear filters',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters',
    showAdvancedFilters: 'Advanced filters',
    hideAdvancedFilters: 'Hide advanced filters',
    activeFilters: 'active'
  },
  product: {
    specs: 'Technical Specifications',
    features: 'Functions / Features',
    related: 'Related products',
    share: 'Copy product link',
    copied: 'Copied!',
    modelLabel: 'Model',
    contactAdvisor: 'Contact advisor',
    noImage: 'No image',
    closeGallery: 'Close gallery',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    viewImage: 'View image',
    tapToZoom: 'Tap to zoom'
  },
  productSpecLabels: {
    color: 'Color',
    has_fresh_air_intake: 'Fresh air intake',
    recommended_area: 'Recommended area',
    cooling_power: 'Cooling power',
    heating_power: 'Heating power',
    cooling_consumption: 'Cooling consumption',
    heating_consumption: 'Heating consumption',
    eer_cop: 'EER/COP',
    freon_type_amount: 'Freon type / amount',
    operating_temperature: 'Operating temperature',
    indoor_unit_size: 'Indoor unit size',
    indoor_unit_weight: 'Indoor unit weight',
    outdoor_unit_size: 'Outdoor unit size',
    outdoor_unit_weight: 'Outdoor unit weight',
    noise_level: 'Noise level',
    pipe_size: 'Pipe size'
  },
  admin: {
    title: 'Admin Dashboard',
    loginTitle: 'Admin Login',
    loginButton: 'Sign in',
    save: 'Save Product',
    create: 'Create Product',
    dashboardSubtitle: 'Manage catalog data, translations, and gallery images in one place.',
    existingProducts: 'Existing products',
    deleting: 'Deleting...',
    delete: 'Delete'
  },
  about: {
    title: 'About Technic Room',
    body: 'Trusted partner for climate solutions, focused on quality and performance.',
    card1Title: 'Trusted Guidance',
    card1Body: 'Clear recommendations based on room size, budget, and long-term usage.',
    card2Title: 'Verified Specs',
    card2Body: 'Transparent technical data to help clients compare products confidently.',
    card3Title: 'After-Sales Support',
    card3Body: 'From installation planning to maintenance follow-up.'
  },
  contact: {
    title: 'Contact us',
    submit: 'Send message',
    subtitle: "Reach our team directly. We'll help you choose the right climate solution for your space.",
    phone: 'Phone',
    email: 'Email',
    facebook: 'Facebook',
    facebookLabel: 'Technic Room on Facebook'
  },
    btuCalculator: {
    title: 'BTU calculator',
    area: 'Area',
    people: 'Number of people',
    thermalLoad: 'Room thermal load',
    thermalLoadSmall: 'Small',
    thermalLoadMedium: 'Medium',
    thermalLoadLarge: 'Large',
    estimate: 'Estimated BTU',
    note: 'This is an approximate value only.'
  },
  footer: {
    tagline: 'Reliable climate solutions with clear technical guidance.',
    quickLinks: 'Quick links',
    copyright: 'All rights reserved.',
    contactTitle: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  },
  common: { language: 'Language', loading: 'Loading...', optional: 'Optional' }
};

const ka: UiDictionary = {
  nav: { home: 'მთავარი', products: 'პროდუქტები', about: 'ჩვენს შესახებ', contact: 'კონტაქტი', admin: 'ადმინი' },
  home: {
    title: 'კონდიციონერების კატალოგი',
    subtitle: 'იპოვეთ შესაბამისი გამაგრილებელი სისტემა სახლისა და ბიზნესისთვის.',
    cta: 'პროდუქტების ნახვა'
  },
  products: {
    title: 'კონდიციონერების კატალოგი',
    searchPlaceholder: 'ძებნა მოდელით, ბრენდით, ტიპით, ფუნქციით, სლაგით...',
    empty: 'პროდუქტები ვერ მოიძებნა.',
    intro: 'დაათვალიერეთ საიმედო გათბობისა და გაგრილების სისტემები საცხოვრებელი და კომერციული სივრცეებისთვის.',
    loadError: 'პროდუქტების ჩატვირთვა ვერ მოხერხდა.',
    brandFilter: 'ბრენდი',
    allBrands: 'ყველა ბრენდი',
    typeFilter: 'ტიპი',
    allTypes: 'ყველა ტიპი',
    recommendedAreaFilter: 'ფართი',
    allAreas: 'ყველა ფართი',
    colorFilter: 'ფერი',
    functionFilter: 'ფუნქცია',
    freshAirFunction: 'ჰაერის გარედან შემოტანის ფუნქცია',
    priceRange: 'ფასის დიაპაზონი',
    minPrice: 'მინ. ფასი',
    maxPrice: 'მაქს. ფასი',
    btuCalculator: 'BTU კალკულატორი',
    btuArea: 'ფართი (მ²)',
    btuPeople: 'ადამიანების რაოდენობა',
    btuHeatLoad: 'ოთახის სითბური დატვირთვა',
    btuLowLoad: 'დაბალი',
    btuNormalLoad: 'საშუალო',
    btuHighLoad: 'მაღალი',
    calculateBtu: 'დათვლა',
    applyFilters: 'ფილტრაცია',
    resetFilters: 'გასუფთავება',
    showFilters: 'ფილტრების ჩვენება',
    hideFilters: 'ფილტრების დამალვა',
    showAdvancedFilters: 'დამატებითი ფილტრები',
    hideAdvancedFilters: 'დამატებითის დამალვა',
    activeFilters: 'აქტიური'
  },
  product: {
    specs: 'ტექნიკური მახასიათებლები',
    features: 'ფუნქციები',
    related: 'მსგავსი პროდუქტები',
    share: 'ბმულის კოპირება',
    copied: 'დაკოპირებულია!',
    modelLabel: 'მოდელი',
    contactAdvisor: 'კონსულტანტთან დაკავშირება',
    noImage: 'სურათი არ არის',
    closeGallery: 'გალერეის დახურვა',
    previousImage: 'წინა სურათი',
    nextImage: 'შემდეგი სურათი',
    viewImage: 'სურათის ნახვა',
    tapToZoom: 'გასადიდებლად შეეხეთ'
  },
  productSpecLabels: {
    color: 'ფერი',
    has_fresh_air_intake: 'ჰაერის გარედან შემოტანა',
    recommended_area: 'რეკომენდებული ფართობი',
    cooling_power: 'გაგრილების სიმძლავრე',
    heating_power: 'გათბობის სიმძლავრე',
    cooling_consumption: 'გაგრილების ხარჯი',
    heating_consumption: 'გათბობის ხარჯი',
    eer_cop: 'EER/COP',
    freon_type_amount: 'ფრეონის ტიპი / მოცულობა',
    operating_temperature: 'სამუშაო ტემპერატურა',
    indoor_unit_size: 'შიდა ბლოკის ზომა',
    indoor_unit_weight: 'შიდა ბლოკის წონა',
    outdoor_unit_size: 'გარე ბლოკის ზომა',
    outdoor_unit_weight: 'გარე ბლოკის წონა',
    noise_level: 'ხმაურის დონე',
    pipe_size: 'მილების ზომა'
  },
  admin: {
    title: 'ადმინისტრატორის პანელი',
    loginTitle: 'ადმინის ავტორიზაცია',
    loginButton: 'შესვლა',
    save: 'პროდუქტის შენახვა',
    create: 'პროდუქტის შექმნა',
    dashboardSubtitle: 'მართეთ კატალოგის მონაცემები, თარგმანები და გალერეის სურათები ერთ სივრცეში.',
    existingProducts: 'არსებული პროდუქტები',
    deleting: 'იშლება...',
    delete: 'წაშლა'
  },
  about: {
    title: 'Technic Room-ის შესახებ',
    body: 'სანდო პარტნიორი კლიმატური სისტემებისთვის.',
    card1Title: 'სანდო კონსულტაცია',
    card1Body: 'მკაფიო რეკომენდაციები ოთახის ზომის, ბიუჯეტის და გრძელვადიანი გამოყენების მიხედვით.',
    card2Title: 'დადასტურებული მახასიათებლები',
    card2Body: 'გამჭვირვალე ტექნიკური მონაცემები პროდუქციის თავდაჯერებული შედარებისთვის.',
    card3Title: 'გაყიდვის შემდგომი მხარდაჭერა',
    card3Body: 'ინსტალაციის დაგეგმვიდან ტექნიკურ მომსახურებამდე.'
  },
    btuCalculator: {
    title: 'BTU კალკულატორი',
    area: 'ფართობი',
    people: 'ადამიანების რაოდენობა',
    thermalLoad: 'ოთახის სითბური დატვირთვა',
    thermalLoadSmall: 'პატარა',
    thermalLoadMedium: 'საშუალო',
    thermalLoadLarge: 'დიდი',
    estimate: 'სავარაუდო BTU',
    note: 'ეს მხოლოდ მიახლოებითი შეფასებაა.'
  },
  contact: {
    title: 'დაგვიკავშირდით',
    submit: 'გაგზავნა',
    subtitle: 'დაუკავშირდით ჩვენს გუნდს პირდაპირ — დაგეხმარებით თქვენთვის სწორი კლიმატური გადაწყვეტის შერჩევაში.',
    phone: 'ტელეფონი',
    email: 'ელ-ფოსტა',
    facebook: 'ფეისბუქი',
    facebookLabel: 'Technic Room ფეისბუქზე'
  },
  footer: {
    tagline: 'საიმედო კლიმატური გადაწყვეტილებები მკაფიო ტექნიკური რჩევებით.',
    quickLinks: 'სწრაფი ბმულები',
    copyright: 'ყველა უფლება დაცულია.',
    contactTitle: 'კონტაქტი',
    openMenu: 'მენიუს გახსნა',
    closeMenu: 'მენიუს დახურვა'
  },
  common: { language: 'ენა', loading: 'იტვირთება...', optional: 'არასავალდებულო' }
};

export const dictionaries: Record<Locale, UiDictionary> = { en, ka };

const runtimeTranslationCache = new Map<string, string>();
const translationRequestsInFlight = new Set<string>();

async function translateTextAtRuntime(text: string, locale: Locale): Promise<string | null> {
  if (!text || locale === 'en') return text;

  const serviceUrl = process.env.NEXT_PUBLIC_TRANSLATION_FALLBACK_URL;
  if (!serviceUrl) return null;

  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: locale, format: 'text' }),
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { translatedText?: string };
    return typeof data.translatedText === 'string' && data.translatedText.trim()
      ? data.translatedText
      : null;
  } catch {
    return null;
  }
}

function ensureRuntimeTranslation(path: string, locale: Locale, fallbackText: string) {
  const cacheKey = `${locale}:${path}`;
  if (runtimeTranslationCache.has(cacheKey) || translationRequestsInFlight.has(cacheKey)) return;

  translationRequestsInFlight.add(cacheKey);
  void translateTextAtRuntime(fallbackText, locale)
    .then((translated) => {
      if (translated) runtimeTranslationCache.set(cacheKey, translated);
    })
    .finally(() => {
      translationRequestsInFlight.delete(cacheKey);
    });
}

function withFallbackLayer<T extends Record<string, unknown>>(
  locale: Locale,
  target: T,
  fallback: T,
  parentPath = ''
): T {
  return new Proxy(target, {
    get(obj, prop: string | symbol) {
      if (typeof prop !== 'string') return Reflect.get(obj, prop);

      const targetValue = (obj as Record<string, unknown>)[prop];
      const fallbackValue = (fallback as Record<string, unknown>)?.[prop];
      const currentPath = parentPath ? `${parentPath}.${prop}` : prop;

      if (targetValue !== undefined) {
        if (
          targetValue &&
          typeof targetValue === 'object' &&
          fallbackValue &&
          typeof fallbackValue === 'object'
        ) {
          return withFallbackLayer(locale, targetValue as Record<string, unknown>, fallbackValue as Record<string, unknown>, currentPath);
        }
        return targetValue;
      }

      if (typeof fallbackValue === 'string') {
        const cacheKey = `${locale}:${currentPath}`;
        const translated = runtimeTranslationCache.get(cacheKey);

        if (translated) return translated;

        ensureRuntimeTranslation(currentPath, locale, fallbackValue);
        return fallbackValue;
      }

      if (fallbackValue && typeof fallbackValue === 'object') {
        return withFallbackLayer(locale, {}, fallbackValue as Record<string, unknown>, currentPath);
      }

      return undefined;
    }
  }) as T;
}

export const getDictionary = (locale: Locale): UiDictionary => {
  const dict = dictionaries[locale] || dictionaries.en;
  if (locale === 'en') return dict;
  return withFallbackLayer(locale, dict as Record<string, unknown>, dictionaries.en as Record<string, unknown>) as UiDictionary;
};
