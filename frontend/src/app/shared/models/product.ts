import { User } from './user';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  user: User;
  createdAt: Date;
  category: string;
}

export interface CustomProduct {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export interface Category {
  name: string;
  icon: string;
  subCategories: SubCategory[];
  expanded: boolean;
}

export interface SubCategory {
  name: string;
  subSubCategories: SubSubCategory[];
  expanded: boolean;
}

export interface SubSubCategory {
  name: string;
}

export interface FilteredCategory {
  name: string;
  subCategories?: SubCategory[];
  subSubCategories?: SubSubCategory[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
