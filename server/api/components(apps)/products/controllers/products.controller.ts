import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants";
import { productsService } from "../services/products.service";
import { Shop } from "../../shops";
import { handleErrorResponse } from "../../../utils";
import { validateProducts } from "../validators/products.validation";

class ProductsController {
  public async addProduct(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      await validateProducts.addProduct(req.body);

      const product = await productsService.addProduct(
        req.body,
        userId,
        req.params.shopId
      );
      res.status(STATUS_CODES.CREATED).json({
        message: "Added product",
        data: product,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const product = await productsService.getProductById(
        req.params.productId
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched product",
        data: {
          product,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async getProductsByCategory(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const products = await productsService.getProductsByCategory(
        req.params.categoryId,
        page
      );
      res.status(STATUS_CODES.OK).json({
        message: "Fetched product",
        data: {
          products,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async updateProduct(req: Request, res: Response) {
    const vendorId = (req as any).user._id;

    try {
      await validateProducts.updateProduct(req.body);
      const product = await productsService.updateProduct(
        req.params.productId,
        vendorId,
        req.body
      );

      res.status(STATUS_CODES.OK).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    const vendorId = (req as any).user._id;
    try {
      await productsService.deleteProduct(req.params.productId, vendorId);
      res.status(STATUS_CODES.OK).json({
        message: "Product deleted",
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async searchProducts(req: Request, res: Response) {
    const query = req.query.name as string;
    const page = parseInt(req.query.page as string) || 1;
    try {
      const products = await productsService.searchProducts(query, page);
      res.status(STATUS_CODES.OK).json({
        message: "Found products",
        data: products,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const productsController = new ProductsController();
