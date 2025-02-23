// app/list-properties/evaluate/MatchScore.tsx

import React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import MatchScoreCalculator, { Property } from "./MatchScoreCalculator";

interface FormValues {
  baseProperty: Property;
  comparables: Property[];
}

const defaultValues: FormValues = {
  baseProperty: {
    listingName: "Base Property",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 2,
    price: 350000,
    size: 500,
    amenityCount: 10, // e.g., pool and garden present
    age: 5,         // computed as currentYear - yearConstructed
    parkingSpots: 3,
    condition: 4,    // ordinal: 1=Poor, 4=Excellent
    province: "Province A",
    canton: "Canton A",
    district: "District A",
  },
  comparables: [
    {
      listingName: "Listing 1",
      propertyType: "House",
      bedrooms: 4,
      bathrooms: 2,
      price: 350000,
      size: 500,
      amenityCount: 10,
      age: 5, 
      parkingSpots: 3,
      condition: 4,
      province: "Province A",
      canton: "Canton A",
      district: "District A",
    },
    {
      listingName: "Listing 2",
      propertyType: "House",
      bedrooms: 5,
      bathrooms: 3,
      price: 360000,
      size: 600,
      amenityCount: 7,
      age: 5,
      parkingSpots: 2,
      condition: 4,
      province: "Province A",
      canton: "Canton A",
      district: "District B",
    },
    {
      listingName: "Listing 3",
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      price: 360000,
      size: 400,
      amenityCount: 8,
      age: 6,
      parkingSpots: 1,
      condition: 2,
      province: "Province A",
      canton: "Canton A",
      district: "District A",
    },
    {
      listingName: "Listing 4",
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      price: 360000,
      size: 100,
      amenityCount: 10,
      age: 5,
      parkingSpots: 3,
      condition: 4,
      province: "Province A",
      canton: "Canton A",
      district: "District A",
    },
    // You can add more comparables here.
  ],
};

const MatchScore: React.FC = () => {
  // Initialize the form with onChange mode so that every modification triggers an update.
  const methods = useForm<FormValues>({
    defaultValues,
    mode: "onChange",
  });

  // useWatch subscribes to changes in the form state.
  const baseProperty = useWatch({ control: methods.control, name: "baseProperty" });
  const comparables = useWatch({ control: methods.control, name: "comparables" });

  return (
    <FormProvider {...methods}>
      <div>
        <h2>Property Match Scores</h2>
        {/* Whenever baseProperty or comparables changes, the calculator re-renders */}
        <MatchScoreCalculator
          baseProperty={baseProperty}
          comparables={comparables}
        />
      </div>
    </FormProvider>
  );
};

export default MatchScore;

