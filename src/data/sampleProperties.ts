export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  size: number;
  bedrooms?: number;
  bathrooms?: number;
  landSize?: number;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
  type: 'apartment' | 'house' | 'land' | 'commercial';
}

export const featuredProperties: Property[] = [
  {
    id: 'prop-1',
    title: '3-izbový byt, Bratislava',
    location: 'Staré Mesto, Bratislava',
    price: 185000,
    size: 75,
    bedrooms: 3,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isFeatured: true,
    type: 'apartment'
  },
  {
    id: 'prop-2',
    title: 'Rodinný dom, Košice',
    location: 'Sever, Košice',
    price: 245000,
    size: 120,
    bedrooms: 4,
    bathrooms: 2,
    landSize: 450,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isFeatured: true,
    type: 'house'
  },
  {
    id: 'prop-3',
    title: '2-izbový byt, Žilina',
    location: 'Centrum, Žilina',
    price: 125000,
    size: 55,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isNew: true,
    type: 'apartment'
  },
  {
    id: 'prop-4',
    title: 'Stavebný pozemok, Nitra',
    location: 'Zobor, Nitra',
    price: 89000,
    size: 800,
    landSize: 800,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
    type: 'land'
  },
  {
    id: 'prop-5',
    title: 'Kancelárske priestory, Bratislava',
    location: 'Ružinov, Bratislava',
    price: 320000,
    size: 150,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    type: 'commercial'
  },
  {
    id: 'prop-6',
    title: 'Luxusný dom, Banská Bystrica',
    location: 'Sásová, Banská Bystrica',
    price: 380000,
    size: 200,
    bedrooms: 5,
    bathrooms: 3,
    landSize: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isFeatured: true,
    type: 'house'
  }
];

export const newProperties: Property[] = [
  {
    id: 'prop-7',
    title: '1-izbový byt, Trnava',
    location: 'Centrum, Trnava',
    price: 85000,
    size: 35,
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
    isNew: true,
    type: 'apartment'
  },
  {
    id: 'prop-8',
    title: 'Rodinný dom, Prešov',
    location: 'Solivar, Prešov',
    price: 195000,
    size: 110,
    bedrooms: 4,
    bathrooms: 2,
    landSize: 500,
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isNew: true,
    type: 'house'
  },
  {
    id: 'prop-9',
    title: 'Obchodný priestor, Martin',
    location: 'Centrum, Martin',
    price: 150000,
    size: 80,
    imageUrl: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isNew: true,
    type: 'commercial'
  }
];
