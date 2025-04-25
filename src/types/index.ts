export interface Product {
  id: string;
  name: string;
  quantity: number;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: 'ADD' | 'REMOVE';
  quantity: number;
  date: string;
  notes: string;
}

export interface User {
  username: string;
  password: string;
  isAuthenticated: boolean;
}
