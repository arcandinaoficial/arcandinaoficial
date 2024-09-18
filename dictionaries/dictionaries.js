const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
    // If locale is not supported, fallback to English
    return dictionaries[locale] ? dictionaries[locale]() : dictionaries['en']();
};
  