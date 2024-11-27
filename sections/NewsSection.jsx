'use client'

import React, { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import noticias from '@/data/noticias/news-list.json';
import NewsSectionCarousel from '@/components/NewsSectionCarousel';

const NewsSection = ({ lang }) => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const sectionRef = useRef();
    const newId = searchParams.get('new');

    const easeInOutCubic = (t) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    const handleScroll = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const startY = window.scrollY;
        const targetY = targetElement.getBoundingClientRect().top + startY;
        const distance = targetY - startY;
        const duration = 2000; // 1 second scroll duration
        let startTime = null;

        const scrollAnimation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * easedProgress);

            if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
            }
        };

        requestAnimationFrame(scrollAnimation);
    };

    useEffect(() => {
        // Check if the newId exists in the noticias list
        const isValidNewId = noticias[lang]?.some((news) => news.id === parseInt(newId, 10));

        // If the newId is invalid, remove it from the URL
        if (newId && !isValidNewId) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.delete('new');
            router.replace(`${window.location.pathname}?${currentParams.toString()}`, { shallow: true });
        }

        // If the newId is valid, scroll to the news section
        if (newId && isValidNewId && sectionRef.current) {
            handleScroll('news-section');
        }
    }, [newId, lang, router]);

    return (
        <section id='news-section' className="news-section" ref={sectionRef}>
            <NewsSectionCarousel slides={noticias[lang]} newId={newId} />
        </section>
    );
};

export default NewsSection;
