// components/ui/my_components/marketing/EmailMarketing.tsx
import { Card, CardContent } from '@/components/default/card';
import { Pin, Mail, BarChart, MousePointerClick } from 'lucide-react';
import ImageWrapper from '@/components/modules/marketing/tools/socialmedia-report/ImageWrapper';
import { LISTINGS } from '@/public/images/listings/listings';
import { PLACEHOLDERS } from '@/public/images/placeholders/placeholders';

export interface EmailMarketingProps {
  title: string;
  stats: {
    icon: JSX.Element;
    label: string;
    value: string;
  }[];
  highlight: string;
  insights: string[];
  images?: string[];
  pdfMode?: boolean;
}

const EmailMarketing = ({
  title,
  stats,
  highlight,
  insights,
  images = [],
  pdfMode = false,
}: EmailMarketingProps) => {
  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-5xl font-serif font-bold text-primary-dark mb-14">
          Newsletter Reach Summary
        </h2>
        <p className="text-xl text-primary-medium mt-4">
          Your property posts have been effective in reaching potential buyers and generating engagement.
          Here’s a look at how well your property performed:
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
          <Card className="bg-accent-gold text-primary-dark p-8 rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-3xl font-bold mb-4">{title}</h3>
              <div className="grid gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 border-b border-primary-medium pb-4 last:border-none"
                  >
                    <div className="text-4xl">{stat.icon}</div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-lg text-primary-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xl font-semibold">{highlight}</p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col items-center space-y-4">
          {[
            LISTINGS["20639"]?.imageA,
            LISTINGS["20639"]?.imageB,
          ]
            .filter(Boolean)
            .length > 0
            ? [LISTINGS["20639"]?.imageA, LISTINGS["20639"]?.imageB]
                .filter(Boolean)
                .map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`relative w-full h-[250px] ${index === 0 ? 'mt-2' : ''}`}
                  >
                    <ImageWrapper
                      src={imgSrc}
                      alt={`Newsletter Preview ${index + 1}`}
                      pdfMode={pdfMode}
                      fill={true}
                      width={500}
                      height={250}
                    />
                  </div>
                ))
            : [PLACEHOLDERS.square, PLACEHOLDERS.square].map((placeholder, index) => (
                <div
                  key={index}
                  className={`relative w-full h-[250px] ${index === 0 ? 'mt-2' : ''}`}
                >
                  <ImageWrapper
                    src={placeholder}
                    alt={`Placeholder ${index + 1}`}
                    pdfMode={pdfMode}
                    fill={true}
                    width={500}
                    height={250}
                  />
                </div>
              ))}
        </div>
      </div>

      <div className="mt-10 p-8 bg-gray-100 rounded-lg space-x-2 pb-8">
        <h3 className="text-3xl font-semibold text-primary-dark mb-4">Key Insights</h3>
        <ul className="list-disc list-inside text-lg text-primary-medium space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-center gap-4">
              <Pin className="w-6 h-6 text-primary-dark" />
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center items-center">
        <div className="relative">
          <ImageWrapper
            src={LISTINGS["20639"].imageA || PLACEHOLDERS.square}
            alt="Luxury Property Highlight"
            pdfMode={pdfMode}
            fill={true}
            width={350}
            height={250}
            className="rounded-lg shadow-md border-4 border-accent-gold"
            // When in PDF mode, adjust the style to make the image smaller
            style={pdfMode ? { width: 300, height: 225, objectFit: 'cover', display: 'block' } : {}}
          />
          <div className="absolute -top-6 -left-8 transform rotate-[-10deg] bg-accent-gold text-primary-dark px-4 py-2 rounded-lg text-lg font-semibold shadow-lg">
            ⭐ Most Engaging Property
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailMarketing;
