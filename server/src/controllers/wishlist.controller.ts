import { Request, Response } from 'express';
import prisma from '../config/database';

export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            variations: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
      return;
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
      return;
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      data: wishlistItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const wishlistItem = await prisma.wishlist.findFirst({
      where: { id, userId },
    });

    if (!wishlistItem) {
      res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
      return;
    }

    await prisma.wishlist.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};