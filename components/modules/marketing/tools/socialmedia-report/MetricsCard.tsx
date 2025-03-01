// components/ui/my_components/marketing/MetricsCard.tsx
import { Card, CardContent } from '@/components/default/card';
import ImageWrapper from '@/components/modules/marketing/tools/socialmedia-report/ImageWrapper';
import { PLACEHOLDERS } from '@/public/images/placeholders/placeholders';

interface Metric {
  icon: JSX.Element;
  label: string;
  value: string;
}

export interface MetricsCardProps {
  title: string;
  metrics: Metric[];
  images?: string[];
  pdfMode?: boolean;
}

const MetricsCard = ({
  title,
  metrics,
  images = [PLACEHOLDERS.vertical, PLACEHOLDERS.vertical],
  pdfMode = false,
}: MetricsCardProps) => {
  return (
    <div>
      <h2 className="text-5xl font-serif text-primary-dark mb-14 text-center">
        Organic Social Media Reach Summary
      </h2>
      <p className="text-xl text-center text-gray-700 mb-14">
        Your property posts have been effective in reaching potential buyers and generating engagement.
        Here’s a look at how well your property performed:
      </p>

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <Card className="bg-accent-gold text-primary-dark p-6 rounded-xl shadow-lg">
            <CardContent>
              <h3 className="text-3xl font-bold mb-4">{title}</h3>
              <div className="grid gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-primary-medium pb-3 last:border-none"
                  >
                    <div className="text-3xl">{metric.icon}</div>
                    <div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-lg text-primary-medium">{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          {images.map((imgSrc, index) => (
            <div
              key={index}
              className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-md flex-1"
            >
              <ImageWrapper
                src={imgSrc}
                alt={`Preview ${index + 1}`}
                pdfMode={pdfMode}
                fill={true}
                width={500} // used by next/image in web mode
                height={300}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
