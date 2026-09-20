import prisma from '../config/database';

export const getAllProducts = async (filters?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  available?: boolean;
}) => {
  return prisma.product.findMany({
    where: {
      ...(filters?.category && { category: filters.category }),
      ...(filters?.collection && { collection: filters.collection }),
      ...(filters?.featured !== undefined && { featured: filters.featured }),
      ...(filters?.available !== undefined && { available: filters.available }),
    },
    include: {
      variations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variations: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const createProduct = async (data: {
  name: string;
  category: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  description?: string;
  featured?: boolean;
  featuredExpiry?: Date;
  images: string[];
  variations?: Array<{
    name: string;
    price?: number;
    color?: string;
    material?: string;
    image?: string;
  }>;
}) => {
  return prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      collection: data.collection,
      price: data.price,
      originalPrice: data.originalPrice,
      description: data.description,
      featured: data.featured || false,
      featuredExpiry: data.featuredExpiry,
      images: data.images,
      variations: data.variations
        ? {
            create: data.variations,
          }
        : undefined,
    },
    include: {
      variations: true,
    },
  });
};

export const updateProduct = async (
  id: string,
  data: Partial<{
    name: string;
    category: string;
    collection: string;
    price: number;
    originalPrice: number;
    description: string;
    featured: boolean;
    featuredExpiry: Date;
    available: boolean;
    images: string[];
  }>
) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      variations: true,
    },
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};