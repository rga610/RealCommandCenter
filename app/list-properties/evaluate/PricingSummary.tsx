// app/list-properties/evaluate/PricingSummary.tsx
"use client";

import { useMemo, useEffect } from "react";
import { useWatch, useFormContext } from "react-hook-form";

export default function PricingSummary() {
  const { control } = useFormContext();
  // Use useWatch to subscribe to changes on the "comparables" field
  const comparables = useWatch({ control, name: "comparables" }) || [];

  useEffect(() => {
    console.log("📊 Comparables in PricingSummary:", comparables);
  }, [comparables]);

  const pricingStats = useMemo(() => {
    if (!comparables || comparables.length === 0) return null;

    // Calculate the price per sqm for each comparable record.
    const pricePerSqm = comparables
      .map((comp: any) => {
        const price = parseFloat(comp.price);
        const size = parseFloat(comp.size);
        return !isNaN(price) && !isNaN(size) && size > 0 ? price / size : null;
      })
      .filter((val): val is number => val !== null)
      .sort((a, b) => a - b);

    if (pricePerSqm.length === 0) return null;

    // Helper function for quartile calculation (handling edge cases)
    const quartile = (arr: number[], q: number) => {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (base >= arr.length - 1) {
        return arr[arr.length - 1];
      }
      return arr[base] + (arr[base + 1] - arr[base]) * rest;
    };

    const lowerQuartile = quartile(pricePerSqm, 0.25);
    const median = quartile(pricePerSqm, 0.5);
    const upperQuartile = quartile(pricePerSqm, 0.75);
    const min = pricePerSqm[0];
    const max = pricePerSqm[pricePerSqm.length - 1];
    const average =
      pricePerSqm.reduce((sum, val) => sum + val, 0) / pricePerSqm.length;

    return {
      lowerQuartile,
      median,
      upperQuartile,
      min,
      max,
      average,
    };
  }, [comparables]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Suggested Pricing</h3>
      {pricingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Lower Quartile:</strong> ${pricingStats.lowerQuartile.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(Bottom 25% of comparable listings)</small>
          </div>
          <div>
            <p>
              <strong>Median Price:</strong> ${pricingStats.median.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(The middle value among the comparables)</small>
          </div>
          <div>
            <p>
              <strong>Upper Quartile:</strong> ${pricingStats.upperQuartile.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(Top 25% of comparable listings)</small>
          </div>
          <div>
            <p>
              <strong>Average:</strong> ${pricingStats.average.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(Arithmetic mean of the comparables)</small>
          </div>
          <div>
            <p>
              <strong>Min:</strong> ${pricingStats.min.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(Lowest price per sqm in the list)</small>
          </div>
          <div>
            <p>
              <strong>Max:</strong> ${pricingStats.max.toFixed(2)} per sqm
            </p>
            <small className="text-gray-500">(Highest price per sqm in the list)</small>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Not enough comparables to calculate pricing.</p>
      )}
    </div>
  );
}
