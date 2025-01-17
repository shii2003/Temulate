"use client"
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

const Tagline: React.FC = () => {

    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.5 }
        )
    })

    return (
        <h1
            ref={textRef}
            className='p-6 text-4xl sm:text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-neutral-500 via-indigo-300 to-neutral-500 bg-clip-text text-transparent'
        >
            Build. Share. Collaborate.
        </h1>
    )
}
export default Tagline;