'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import noticias from '@/data/noticias/news-list.json';
import NewsSectionCarousel from '@/components/NewsSectionCarousel';

const NewsSection = ({ lang, dict }) => {
    const router = useRouter();
    const sectionRef = useRef();
    const [newId, setNewId] = useState(null);

    const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const handleScroll = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const startY = window.scrollY;
        const targetY = targetElement.getBoundingClientRect().top + startY;
        const distance = targetY - startY;
        const duration = 2000; // 2 seconds scroll duration
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
        const params = new URLSearchParams(window.location.search);
        const newKey = params.get('new');
        const isValidNewKey = noticias[lang]?.some(
            (news) => news.id === newKey
        );

        if (newKey && isValidNewKey) {
            setNewId(newKey); // Assuming `setNewId` now handles keys
            handleScroll('news-section');
        } else if (newKey) {
            params.delete('new');
            router.replace(`${window.location.pathname}?${params.toString()}`, {
                shallow: true,
            });
        }
    }, [lang, router]);

    return (
        <section id="news-section" className="news-section" ref={sectionRef}>
            <NewsSectionCarousel slides={noticias[lang]} newId={newId} dict={dict} lang={lang}/>
        </section>
    );
};

export default NewsSection;
