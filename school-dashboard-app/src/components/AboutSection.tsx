'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutSection() {
    const [activeTab, setActiveTab] = useState<'vision' | 'what-we-do'>('vision');

    // Content Data
    const content = {
        vision: {
            title: "Our Vision for the Future",
            text: "At Joyfull Academy, we envision a world where every student is empowered to discover their unique potential. We strive to foster a nurturing environment that cultivates critical thinking, creativity, and compassionate leadership. Our goal is to shape not just successful scholars, but well-rounded individuals ready to make a positive impact on the global community.",
            points: ["Inclusive Learning", "Global Perspective", "Innovation Driven"],
            image: "/images/about_lady.jpg",
            imgAlt: "Principal smiling"
        },
        'what-we-do': {
            title: "What We Do Everyday",
            text: "We provide a holistic education that balances academic rigor with character development. Through cutting-edge curriculum, state-of-the-art facilities, and dedicated mentorship, we guide students through their formative years. From STEM programs to Arts and Humanities, we ensure a diverse range of opportunities for every learner to excel.",
            points: ["Expert Faculty", "Modern Facilities", "Personalized Mentorship"],
            image: "/images/about_male_books.png",
            imgAlt: "Student carrying books"
        }
    };

    const activeContent = content[activeTab];

    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-32 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Image (Circular Frame) */}
                    <div className="relative flex justify-center lg:justify-start">
                        {/* Decorative Circles */}
                        <div className="absolute w-[450px] h-[450px] border-2 border-blue-100 rounded-full animate-pulse-slow"></div>
                        <div className="absolute w-[420px] h-[420px] border-2 border-dashed border-blue-200 rounded-full"></div>

                        <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden shadow-2xl border-4 border-white z-10">
                            <Image
                                src={activeContent.image}
                                alt={activeContent.imgAlt}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute bottom-10 -right-4 lg:right-20 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-20 flex items-center gap-3 animate-bounce-slow">
                            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">15+</div>
                            <div className="text-xs text-gray-600 font-medium leading-tight">Years of<br />Excellence</div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div>
                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-semibold text-xs uppercase tracking-wide rounded-full mb-4">
                            About Joyfull Academy
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Start Your Journey <br />
                            <span className="text-blue-600">With Us Today</span>
                        </h2>

                        {/* Toggle Controls */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setActiveTab('vision')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'vision'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                Our Vision
                            </button>
                            <button
                                onClick={() => setActiveTab('what-we-do')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'what-we-do'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                What We Do
                            </button>
                        </div>

                        {/* Dynamic Text */}
                        <div className="min-h-[250px] transition-opacity duration-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{activeContent.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                {activeContent.text}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {activeContent.points.map((point, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            <button className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg">
                                Learn More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
