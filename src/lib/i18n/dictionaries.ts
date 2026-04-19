import { Locale, UiDictionary } from '@/types';

const en: UiDictionary = {
  nav: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact', admin: 'Admin' },
  home: {
    title: 'Premium Air Conditioner Catalog',
    subtitle: 'Find the right cooling system for homes and businesses.',
    cta: 'Browse Products'
  },
  products: {
    title: 'Air Conditioner Catalog',
    searchPlaceholder: 'Search by model, brand, type, feature, slug...',
    empty: 'No products found.'
  },
  product: {
    specs: 'Technical Specifications',
    features: 'Functions / Features',
    related: 'Related products',
    share: 'Copy product link',
    copied: 'Copied!'
  },
  admin: {
    title: 'Admin Dashboard',
    loginTitle: 'Admin Login',
    loginButton: 'Sign in',
    save: 'Save Product',
    create: 'Create Product'
  },
  about: { title: 'About Technic Room', body: 'Trusted partner for climate solutions, focused on quality and performance.' },
  contact: { title: 'Contact us', submit: 'Send message' },
  common: { language: 'Language', loading: 'Loading...', optional: 'Optional' }
};

const ka: UiDictionary = {
  nav: { home: 'მთავარი', products: 'პროდუქტები', about: 'ჩვენს შესახებ', contact: 'კონტაქტი', admin: 'ადმინი' },
  home: {
    title: 'კონდიციონერების პრემიუმ კატალოგი',
    subtitle: 'იპოვეთ შესაბამისი გამაგრილებელი სისტემა სახლისა და ბიზნესისთვის.',
    cta: 'პროდუქტების ნახვა'
  },
  products: {
    title: 'კონდიციონერების კატალოგი',
    searchPlaceholder: 'ძებნა მოდელით, ბრენდით, ტიპით, ფუნქციით, სლაგით...',
    empty: 'პროდუქტები ვერ მოიძებნა.'
  },
  product: {
    specs: 'ტექნიკური მახასიათებლები',
    features: 'ფუნქციები',
    related: 'მსგავსი პროდუქტები',
    share: 'ბმულის კოპირება',
    copied: 'დაკოპირებულია!'
  },
  admin: {
    title: 'ადმინისტრატორის პანელი',
    loginTitle: 'ადმინის ავტორიზაცია',
    loginButton: 'შესვლა',
    save: 'პროდუქტის შენახვა',
    create: 'პროდუქტის შექმნა'
  },
  about: { title: 'Technic Room-ის შესახებ', body: 'სანდო პარტნიორი კლიმატური სისტემებისთვის.' },
  contact: { title: 'დაგვიკავშირდით', submit: 'გაგზავნა' },
  common: { language: 'ენა', loading: 'იტვირთება...', optional: 'არასავალდებულო' }
};

export const dictionaries: Record<Locale, UiDictionary> = { en, ka };

export const getDictionary = (locale: Locale): UiDictionary => dictionaries[locale] || dictionaries.en;
