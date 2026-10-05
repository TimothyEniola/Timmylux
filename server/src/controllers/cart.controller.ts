import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const cart = await cartService.getCart(userId);

    res.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { productId, variationId, quantity } = req.body;

    if (!productId) {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
      return;
    }

    const cartItem = await cartService.addToCart(
      userId,
      productId,
      variationId,
      quantity || 1
    );

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      res.status(400).json({
        success: false,
        message: 'Quantity is required',
      });
      return;
    }

    const cartItem = await cartService.updateCartItem(id, userId, quantity);

    res.json({
      success: true,
      message: 'Cart updated',
      data: cartItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    await cartService.removeFromCart(id, userId);

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    await cartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};