'use client'

import React, {useEffect} from 'react';
import { motion, useAnimate } from "framer-motion";

const LoadingScreen = () => {

    const text = "ARCANDINA • ARCANDINA •";
    const characters = text.split("");

    const radius = 70;
    const fontSize = "18px";
    const letterSpacing = 15;

    const [scope, animate] = useAnimate();

    useEffect(() => {
        const animateLoader = async () => {
          const letterAnimation = [];
          characters.forEach((_, i) => {
            letterAnimation.push([
              `.letter-${i}`,
              { opacity: 0 },
              { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" }
            ]);
          });
          characters.forEach((_, i) => {
            letterAnimation.push([
              `.letter-${i}`,
              { opacity: 1 },
              { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" }
            ]);
          });
          animate(letterAnimation, {
            ease: "linear",
            repeat: Infinity
          });
          animate(
            scope.current,
            { rotate: 360 },
            { duration: 4, ease: "linear", repeat: Infinity }
          );
        };
        animateLoader();
    }, []);


    return (
        <div className='loading-screen'>
            <motion.div ref={scope} className="loading-screen__circle" style={{ width: radius * 2 }}>
                <p aria-label={text} />
                <p aria-hidden="true" className="loading-screen__text">
                    {characters.map((ch, i) => (
                        <motion.span
                            key={i}
                            className={`loading-screen__letter letter-${i}`}
                            style={{
                            transformOrigin: `0 ${radius}px`,
                            transform: `rotate(${i * letterSpacing}deg)`,
                            fontSize
                            }}
                        >
                            {ch}
                        </motion.span>
                    ))}
                </p>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
