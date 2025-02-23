import React from "react";

// Extend the Property interface to include listingName and propertyType.
export interface Property {
  listingName: string;
  propertyType: "House" | "Apartment" | "Residential land" | "Commercial/Industrial";
  bedrooms: number;
  bathrooms: number;
  price: number;         // kept for display only; not used in matching
  size: number;          // in square meters
  amenityCount: number;  // total count of amenities present
  age: number;           // e.g., current year - yearConstructed
  parkingSpots: number;
  condition: number;     // ordinal, e.g., 1 (Poor) to 4 (Excellent)
  province: string;
  canton: string;
  district: string;
}

// Props for our component.
interface MatchScoreCalculatorProps {
  baseProperty: Property;
  comparables: Property[];
}

/**
 * Computes a relative similarity score for a numeric feature.
 * 
 * Parameters:
 * - base: base property’s value.
 * - comp: comparable property’s value.
 * - tolerancePercentage: relative tolerance. (e.g. 0.33 means that a difference equal
 *   to 33% of the base is “tolerable” and yields a moderate drop in similarity.)
 * - maxDiffPercentage: if the absolute difference exceeds (base * maxDiffPercentage),
 *   the similarity becomes 0.
 *
 * Special cases:
 * - If base > 0 and comp === 0, we assume the feature is missing → similarity 0.
 * - If both are 0, we return 100.
 *
 * Otherwise, we first compute a base similarity using a smooth formula:
 *
 *     baseSimilarity = 100 * (1 - diff / (tolerance + diff))
 *
 * Then, if diff is between tolerance and maxDiff, we linearly scale the similarity
 * down to 0.
 */
function relativeSimilarityScore(
  base: number,
  comp: number,
  tolerancePercentage: number,
  maxDiffPercentage: number
): number {
  if (base > 0 && comp === 0) {
    return 0;
  }
  if (base === 0 && comp === 0) {
    return 100;
  }
  const diff = Math.abs(base - comp);
  const tolerance = base * tolerancePercentage; // gradual drop region
  const maxDiff = base * maxDiffPercentage; // beyond this diff, similarity = 0
  
  if (diff >= maxDiff) {
    return 0;
  }
  
  // Base similarity using a smooth formula:
  const baseSimilarity = 100 * (1 - diff / (tolerance + diff));
  
  // If diff is below tolerance, use the base similarity.
  if (diff <= tolerance) {
    return baseSimilarity;
  } else {
    // For diff between tolerance and maxDiff, linearly interpolate from baseSimilarity to 0.
    const factor = (maxDiff - diff) / (maxDiff - tolerance);
    return baseSimilarity * factor;
  }
}

/**
 * For binary features, simply return 100 for a match and 0 for a mismatch.
 */
function binarySimilarity(match: boolean): number {
  return match ? 100 : 0;
}

/*
  Define relative tolerance percentages for numeric features.
  These values are adjustable based on domain knowledge.

  For the key group:
  - bedrooms: 0.33 means that for a 3-bedroom base, a difference of about 1 bedroom is acceptable.
  - size: 0.10 means a 10% difference in size (sqm) is acceptable.
*/
const keyTolerances: Record<string, number> = {
  bedrooms: 0.66,
  size: 0.10,
};

/*
  Define maximum difference percentages for the key group.
  When the difference exceeds this (relative to the base), the similarity is 0.
  For example, for bedrooms, if maxDiffPercentage = 4,
  then if base = 3, a difference of 3*4 = 12 bedrooms or more yields 0 similarity.
  (You can adjust these as needed.)
*/
const keyMaxDiffs: Record<string, number> = {
  bedrooms: 1.0, // a 100% difference (e.g. 3 vs. 6) yields 0 similarity
  size: 0.5,  // if the size difference is 50% of the base value, similarity is 0.
};

/*
  For the secondary group:
  Tolerances for bathrooms, parkingSpots, amenityCount, condition, and age.
*/
const secondaryTolerances: Record<string, number> = {
  bathrooms: 0.75,
  parkingSpots: 0.50,
  amenityCount: 0.50,
  condition: 0.25,
  age: 0.75,
};

/*
  Maximum difference percentages for the secondary group.
  These define the point beyond which similarity is 0.
*/
const secondaryMaxDiffs: Record<string, number> = {
  bathrooms: 1.0,
  parkingSpots: 1.0,
  amenityCount: 1.0,
  condition: 1.0,
  age: 1.0,
};

/*
  Define weights for each group (summing to 1 for clarity).
  For key details:
  - bedrooms, size, location, and propertyType.
*/
const keyWeights: Record<string, number> = {
  bedrooms: 1,
  size: 0,
  location: 0,       // will be computed via a weighted function below
  propertyType: 0,   // binary similarity: 100 if same, 0 if different
};

/*
  For secondary details:
  - bathrooms, parkingSpots, amenityCount, condition, and age.
*/
const secondaryWeights: Record<string, number> = {
  bathrooms: 0.20,
  parkingSpots: 0.20,
  amenityCount: 0.50,
  condition: 0.05,
  age: 0.05,
};

/**
 * NEW: Compute a weighted location similarity score.
 * Instead of a simple binary check, we weight each sub-level:
 * - province: 45%
 * - canton: 35%
 * - district: 20%
 * The function returns a score between 0 and 100.
 */
function weightedLocationSimilarity(base: Property, comp: Property): number {
  const locWeights = { province: 0.45, canton: 0.35, district: 0.20 };
  let score = 0;
  if (base.province === comp.province) score += locWeights.province;
  if (base.canton === comp.canton) score += locWeights.canton;
  if (base.district === comp.district) score += locWeights.district;
  return score * 100; // scale to 0–100
}

/**
 * Compute the weighted similarity score for the key group.
 * Key details: bedrooms, size, location, and propertyType.
 */
function computeKeySimilarity(base: Property, comp: Property): number {
  const simBedrooms = relativeSimilarityScore(
    base.bedrooms,
    comp.bedrooms,
    keyTolerances.bedrooms,
    keyMaxDiffs.bedrooms
  );
  const simSize = relativeSimilarityScore(
    base.size,
    comp.size,
    keyTolerances.size,
    keyMaxDiffs.size
  );
  const simLocation = weightedLocationSimilarity(base, comp);
  const simPropertyType = binarySimilarity(base.propertyType === comp.propertyType);

  const weightedSum =
    keyWeights.bedrooms * simBedrooms +
    keyWeights.size * simSize +
    keyWeights.location * simLocation +
    keyWeights.propertyType * simPropertyType;
  const totalWeight = keyWeights.bedrooms + keyWeights.size + keyWeights.location + keyWeights.propertyType;
  return weightedSum / totalWeight;
}

/**
 * Compute the weighted similarity score for the secondary group.
 * Secondary details: bathrooms, parkingSpots, amenityCount, condition, and age.
 */
function computeSecondarySimilarity(base: Property, comp: Property): number {
  const simBathrooms = relativeSimilarityScore(
    base.bathrooms,
    comp.bathrooms,
    secondaryTolerances.bathrooms,
    secondaryMaxDiffs.bathrooms
  );
  const simParking = relativeSimilarityScore(
    base.parkingSpots,
    comp.parkingSpots,
    secondaryTolerances.parkingSpots,
    secondaryMaxDiffs.parkingSpots
  );
  const simAmenity = relativeSimilarityScore(
    base.amenityCount,
    comp.amenityCount,
    secondaryTolerances.amenityCount,
    secondaryMaxDiffs.amenityCount
  );
  const simCondition = relativeSimilarityScore(
    base.condition,
    comp.condition,
    secondaryTolerances.condition,
    secondaryMaxDiffs.condition
  );
  const simAge = relativeSimilarityScore(
    base.age,
    comp.age,
    secondaryTolerances.age,
    secondaryMaxDiffs.age
  );
  
  const weightedSum =
    secondaryWeights.bathrooms * simBathrooms +
    secondaryWeights.parkingSpots * simParking +
    secondaryWeights.amenityCount * simAmenity +
    secondaryWeights.condition * simCondition +
    secondaryWeights.age * simAge;
  const totalWeight =
    secondaryWeights.bathrooms +
    secondaryWeights.parkingSpots +
    secondaryWeights.amenityCount +
    secondaryWeights.condition +
    secondaryWeights.age;
  return weightedSum / totalWeight;
}

/**
 * The MatchScoreCalculator component computes:
 * - A Key Score from the key group (bedrooms, size, location, propertyType)
 * - A Secondary Score from the secondary group (bathrooms, parkingSpots, amenityCount, condition, age)
 * The final match score is the average of the two.
 */
const MatchScoreCalculator: React.FC<MatchScoreCalculatorProps> = ({ baseProperty, comparables }) => {
  return (
    <div>
      <h3>Match Score Calculator</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Listing Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Primary Score</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Secondary Score</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Final Score</th>
          </tr>
        </thead>
        <tbody>
          {comparables.map((comp, index) => {
            const primaryScore = computeKeySimilarity(baseProperty, comp);
            const secondaryScore = computeSecondarySimilarity(baseProperty, comp);
            const finalScore = (primaryScore + secondaryScore) / 2;
            return (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                  {comp.listingName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  {primaryScore.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  {secondaryScore.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  {finalScore.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchScoreCalculator;
