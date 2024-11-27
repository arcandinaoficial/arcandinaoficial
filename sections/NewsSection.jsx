import React from 'react';

import noticias from '@/data/noticias/news-list.json';
import NewsSectionCarousel from '@/components/NewsSectionCarousel';

const NewsSection = ({ dict, lang }) => {
  return (
    <section className='news-section'>
      <NewsSectionCarousel slides={noticias[lang]}/>
    </section>
  );
};

export default NewsSection;
