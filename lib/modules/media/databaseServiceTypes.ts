import { MediaAsset } from '../../../types/modules/media/types';

/**
 * Interface for the result of getMediaAssets
 */
export interface GetMediaAssetsResult {
  assets: MediaAsset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Interface for the query parameters for getMediaAssets
 */
export interface GetMediaAssetsQuery {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}