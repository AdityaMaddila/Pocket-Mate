"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

const Herosection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, []);

    return (
        <div className="pb-30 px-5 pt-25">
            <div className="container mx-auto text-center">
                <h1 className="text-8xl md:text-8xl lg:text-7xl pb-8 gradient-title bold">Smart Finance, Smarter you.</h1> 
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">An intelligent way to manage your finances—because your money should work as smart as you do!</p>
                <div className="flex justify-center gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                </div>
                <div>
                    <div 
                        ref={imageRef}
                        className="hero-image-wrapper mt-16"
                    >
                        <Image 
                            src="/banner.jpeg" 
                            alt="Banner" 
                            width={800} 
                            height={800} 
                            className={`rounded-lg shadow-2xl border mx-auto transition-all duration-1000 ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 translate-y-10 scale-95'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Herosection;