import prisma from '../config/database';

export const getCart = async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
      variation: true,
    },
  });
};

export const addToCart = async (
  userId: string,
  productId: string,
  variationId?: string,
  quantity: number = 1
) => {
  // Check if product exists and is available
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.available) {
    throw new Error('Product not available');
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
      variationId: variationId || null,
    },
  });

  if (existingItem) {
    // Update quantity
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: true,
        variation: true,
      },
    });
  }

  // Create new cart item
  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      variationId,
      quantity,
    },
    include: {
      product: true,
      variation: true,
    },
  });
};

export const updateCartItem = async (
  id: string,
  userId: string,
  quantity: number
) => {
  // Verify ownership
  const cartItem = await prisma.cartItem.findFirst({
    where: { id, userId },
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id } });
  }

  return prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: {
      product: true,
      variation: true,
    },
  });
};

export const removeFromCart = async (id: string, userId: string) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { id, userId },
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  return prisma.cartItem.delete({ where: { id } });
};

export const clearCart = async (userId: string) => {
  return prisma.cartItem.deleteMany({
    where: { userId },
  });
};