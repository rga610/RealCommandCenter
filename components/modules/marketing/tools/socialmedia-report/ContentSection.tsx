// components/ui/my_components/marketing/ContentSection.tsx

import { Card, CardContent } from '@/components/default/card';
import Image from 'next/image';
import { Pin, CheckCircle } from 'lucide-react';

import { BRANDING } from '@/public/images/branding/branding';

interface ContentSectionProps {
    title: string;
    subtitle?: string;
    highlights?: { 
        text: string;
        isBold?: boolean;
    }[];
    listItems?: string[];
    pdfMode?: boolean;
}

const ContentSection = ({ title, subtitle, highlights, listItems }: ContentSectionProps) => {
    return (
        <div className="px-32 py-12 space-y-10">
            
            {/* 🔹 Title & Subtitle */}
            <div className="text-center">
                <h2 className="text-5xl font-serif font-bold text-primary-dark mb-14 ">{title}</h2>
                {subtitle && <p className="text-xl text-primary-medium mt-4">{subtitle}</p>}
            </div>

            {/* 🔹 Highlighted Content (Gold Box) */}
            {highlights && (
                <Card className="bg-accent-gold text-primary-dark p-8 rounded-xl shadow-md">
                    <CardContent>
                        <ul className="space-y-2">
                            {highlights.map((highlight, index) => (
                                <li key={index} className="flex items-center gap-4">
                                    <Pin className="w-6 h-6 text-primary-dark" />
                                    <span className={`text-xl ${highlight.isBold ? "font-bold" : ""}`}>
                                        {highlight.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* 🔹 List Section (For Steps & Key Insights) */}
            {listItems && (
                <ul className="space-y-3">
                    {listItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-4 text-lg text-primary-dark">
                            <CheckCircle className="w-6 h-6 text-accent-gold" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContentSection;
