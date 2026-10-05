import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { uploadMultipleToCloudinary } from '../services/upload.service';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, collection, featured, available } = req.query;

    const products = await productService.getAllProducts({
      category: category as string,
      collection: collection as string,
      featured: featured === 'true',
      available: available !== 'false', // Default to true
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await uploadMultipleToCloudinary(files, 'timmylux/products');
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      featured: req.body.featured === 'true',
      featuredExpiry: req.body.featuredExpiry ? new Date(req.body.featuredExpiry) : undefined,
      images: imageUrls,
      variations: req.body.variations ? JSON.parse(req.body.variations) : undefined,
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};