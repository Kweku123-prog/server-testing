import { Request, Response } from "express";
import { shopServices } from "../services/shops.services";
import { STATUS_CODES } from "../../../constants";
import { vendorService } from "../../vendors";
import { shopRepository } from "../repository/shops.repo";
import { HandleException, handleErrorResponse } from "../../../utils";
import { validateShops } from "../validators/shops.validation";

class ShopController {
  async getShopTypes(req: Request, res: Response) {
    try {
      const shopTypes = await shopServices.getShopTypes();
      res.status(STATUS_CODES.OK).json({
        message: "Fetched shop types",
        data: shopTypes,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getCategoriesByShopType(req: Request, res: Response) {
    const { shopTypeId } = req.params;
    try {
      const categories = await shopServices.getCategoriesByShopType(shopTypeId);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched categories for shop type: " + shopTypeId,
        data: categories,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await shopServices.getAllCategories();
      return res.status(STATUS_CODES.OK).json({
        messsage: "Fetched categories",
        data: categories,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async createShop(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user._id;
      await validateShops.createShop(req.body);
      await vendorService.getVendorById(vendorId, "_id");
      await shopServices.isNameTaken(req.body.name);
      await shopServices.isValidCategoryID(req.body.category);

      const shop = await shopServices.createShop(req.body, vendorId);
      res.status(STATUS_CODES.CREATED).json({
        message: "Created shop",
        data: {
          shop: {
            _id: shop._id,
            name: shop.name,
            vendor: shop.vendor,
          },
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async updateShop(req: Request, res: Response) {
    const vendorId = (req as any).user._id;
    try {
      await validateShops.updateShop(req.body);
      const shop = await shopServices.updateShop(
        req.params.shopId,
        vendorId,
        req.body
      );
      res.status(STATUS_CODES.OK).json({
        message: "Updated shop",
        data: shop,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  public async getProductsForAshop(req: Request, res: Response) {
    const { shopId } = req.params;
    try {
      const products = await shopServices.getProductsForAShop(
        req.params.shopId
      );
      res.status(STATUS_CODES.OK).json({
        message: `Fetched products for shop: ${shopId}`,
        data: {
          products,
        },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getOrders(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const orders = await shopServices.getOrders(req.params.shopId, page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched orders",
        data: orders,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async deleteShop(req: Request, res: Response) {
    try {
      await shopServices.deleteShop(req.params.shopId);
      res.status(STATUS_CODES.OK).json({
        message: "Shop deleted successfully",
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getFoodAndGroceryShops(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const shops = await shopServices.getFoodAndGroceryShops(page);
      res.status(STATUS_CODES.OK).json({
        message: "Successful",
        data: { shops },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async searchShops(req: Request, res: Response) {
    const query = req.query.name as string;
    const page = parseInt(req.query.page as string) || 1;

    try {
      if (!query) {
        throw new HandleException(
          STATUS_CODES.BAD_REQUEST,
          "Provide a search term"
        );
      }

      const shops = await shopRepository.searchShops(query, page);
      res.status(STATUS_CODES.OK).json({
        message: "Found shops",
        data: { shops },
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const shopController = new ShopController();
