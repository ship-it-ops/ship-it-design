import type { ReactNode } from 'react';

import { nodeToString } from '../../utils/structuredData';

import type { ListingCardSpec, ListingCardVariant } from './ListingCard';

/**
 * Internal helper shared between `ListingCard` and `ListingDetail` for
 * building a schema.org `Accommodation` / `Product` (or override) JSON-LD
 * payload from the components' visible props. Not re-exported through the
 * package barrel — internal API.
 */

function parsePriceAmount(priceAmount: number | undefined, price: ReactNode): number | null {
  if (typeof priceAmount === 'number' && Number.isFinite(priceAmount)) {
    return priceAmount;
  }
  const text = nodeToString(price);
  if (!text) return null;
  const cleaned = text.replace(/[^\d.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export interface ListingSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url?: string;
  image?: string[];
  offers?: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    url?: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount?: number;
    bestRating: number;
  };
  additionalProperty?: Array<{ '@type': 'PropertyValue'; name: string; value: string }>;
}

export interface BuildListingSchemaInput {
  variant: ListingCardVariant;
  schema?: string;
  title: ReactNode;
  titleText?: string;
  eyebrow?: ReactNode;
  descriptionText?: string;
  url?: string;
  photos: ReadonlyArray<string>;
  price: ReactNode;
  priceAmount?: number;
  priceCurrency?: string;
  rating?: number;
  reviewCount?: number;
  specs?: ReadonlyArray<ListingCardSpec>;
}

export function buildListingSchema(input: BuildListingSchemaInput): ListingSchema | null {
  const name = input.titleText ?? nodeToString(input.title);
  if (!name) return null;
  const defaultType = input.variant === 'spec' ? 'Product' : 'Accommodation';
  const schema: ListingSchema = {
    '@context': 'https://schema.org',
    '@type': input.schema ?? defaultType,
    name,
  };
  const description = input.descriptionText ?? nodeToString(input.eyebrow);
  if (description) schema.description = description;
  if (input.url) schema.url = input.url;
  if (input.photos.length > 0) {
    schema.image = [...input.photos];
  }
  const numericPrice = parsePriceAmount(input.priceAmount, input.price);
  if (numericPrice !== null && input.priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: numericPrice,
      priceCurrency: input.priceCurrency,
    };
    if (input.url) schema.offers.url = input.url;
  }
  if (typeof input.rating === 'number') {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.rating,
      bestRating: 5,
    };
    if (typeof input.reviewCount === 'number') {
      schema.aggregateRating.reviewCount = input.reviewCount;
    }
  }
  if (input.specs && input.specs.length > 0) {
    const additional: NonNullable<ListingSchema['additionalProperty']> = [];
    for (const spec of input.specs) {
      const propName = nodeToString(spec.label);
      const value = nodeToString(spec.value);
      if (propName && value) {
        additional.push({ '@type': 'PropertyValue', name: propName, value });
      }
    }
    if (additional.length > 0) {
      schema.additionalProperty = additional;
    }
  }
  return schema;
}
