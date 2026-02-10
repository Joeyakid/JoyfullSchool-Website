'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        image: '/images/campus.png',
        title: 'Welcome to Joyfull Academics',
        description: 'Empowering the next generation of leaders with world-class education and innovation.',
        color: 'from-blue-900/80 to-slate-900/80',
        cta: 'Explore Courses',
        href: '#courses'
    },
    {
        id: 2,
        // Fallback gradient/pattern if image missing, or re-use image with different overlay
        image: '/images/campus.png',
        title: 'Excellence in Every Lesson',
        description: 'Our diverse curriculum and expert lecturers ensure a comprehensive learning experience.',
        color: 'from-purple-900/80 to-indigo-900/80',
        cta: 'Meet Our Lecturers',
        href: '/login/lecturer'
    },
    {
        id: 3,
        image: '/images/campus.png',
        title: 'A Unified Digital Campus',
        description: 'Seamlessly connect students, staff, and administrators in one intuitive platform.',
        color: 'from-emerald-900/80 to-teal-900/80',
        cta: 'Student Portal',
        href: '/login/student'
    }
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === current ? "opacity-100" : "opacity-0"
                    )}
                >
                    {/* Background Image with Parallax-like scale potentially (keep simple for now) */}
                    <div className="relative w-full h-full">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className={cn("object-cover", index !== 0 && "scale-105 filter blur-[1px]")}
                            // Creating variety: Blur other slides slightly or change scale to make them feel different if using same image
                            priority={index === 0}
                        />
                        {/* Overlay Gradient */}
                        <div className={cn("absolute inset-0 bg-gradient-to-r mix-blend-multiply", slide.color)} />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-sm">
                                {slide.description}
                            </p>
                            <div className="pt-4">
                                <Link
                                    href={slide.href}
                                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    {slide.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition z-10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            idx === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
