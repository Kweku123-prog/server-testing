import mongoose from "mongoose";

import { STATUS_CODES, URL_LINKS } from "../../../constants";
import { HandleException } from "../../../utils";
import { Order } from "../../orders";
import { IProduct, deleteProduct } from "../../products";
import { Product } from "../../products/models/products.model";
import {
  ICategory,
  ICreateShop,
  IShop,
  IShopType,
} from "../interfaces/shops.interface";
import { Category, ShopType, categorySchema } from "../models/shops.models";
import { Shop } from "../models/shops.models";
import { shopRepository } from "../repository/shops.repo";

class ShopServices {
  async getShopById(id: string, selectFields?: string): Promise<IShop> {
    try {
      const query = Shop.findById(id);

      if (selectFields) {
        query.select(selectFields);
      }

      const shop = await query.exec();
      if (!shop) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Shop not found");
      }
      return shop;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getShopTypes(): Promise<IShopType[]> {
    try {
      const shopTypes = await ShopType.find().select("_id name image").lean();
      return shopTypes;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getCategoriesByShopType(shopTypeId: string) {
    try {
      const categories = await Category.find({ shopType: shopTypeId })
        .select("_id name image")
        .lean();

      return categories;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async createShop(
    payload: ICreateShop,
    vendor: string
  ): Promise<IShop> {
    const logo = payload.logo || URL_LINKS.DEFAULT_SHOP_LOGO;
    
    try {
      const newShop = new Shop({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        vendor,
        street: payload.street,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        postalCode: payload.postalCode,
        location: {
          coordinates: payload.location.coordinates,
        },
        type: payload.type,
        category: payload.category,
        logo: logo,
      });

      const savedShop = await newShop.save();
      return savedShop;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async updateShop(
    shopId: string,
    vendorId: string,
    payload: Partial<IShop>
  ) {
    try {
      const vendorOwnsShop = await Shop.exists({
        _id: shopId,
        vendor: vendorId,
      });
      if (!vendorOwnsShop) {
        throw new HandleException(
          STATUS_CODES.FORBIDDEN,
          "Vendor does not own the shop"
        );
      }
      // const projection: Record<string, number | boolean | object> = {};
      // Object.keys(payload).forEach((key) => {
      //   projection[key] = 1;
      // });
      // projection['_id'] = 0

      const select = Object.keys(payload);
      select.push("-_id");

      const shop = await Shop.findByIdAndUpdate(
        shopId,
        { $set: payload },
        { new: true }
      )
        .select(select)
        .lean();
      return shop;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async isValidCategoryID(categoryID: string): Promise<boolean> {
    try {
      const category = await Category.findById(categoryID).select("_id");
      if (category) {
        return true;
      }
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Category not found");
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getAllCategories(): Promise<ICategory[] | string> {
    try {
      const categories = await Category.find({});
      if (categories.length < 1) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "There are no categories available"
        );
      }
      return categories;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async isNameTaken(name: string): Promise<boolean> {
    try {
      const shop = await Shop.findOne({ name }).select("name").lean().exec();
      if (shop) {
        throw new HandleException(
          STATUS_CODES.CONFLICT,
          "Name is not available"
        );
      }
      return false;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductsForAShop(shopId: string): Promise<IProduct[]> {
    try {
      const products = await Product.find({ shop: shopId }).select(
        "_id name photos price"
      );
      return products;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getOrders(shopId: string, page: number) {
    const options = {
      page,
      limit: 10,
      sort: { createdAt: -1 },
    };
    try {
      const aggregation = [
        {
          $match: {
            "items.shop": shopId,
          },
        },
        {
          $addFields: {
            items: {
              $filter: {
                input: "$items",
                as: "item",
                cond: { $eq: ["$$item.shop", shopId] },
              },
            },
          },
        },
        {
          $lookup: {
            from: "customers",
            let: { customerId: "$customer" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$customerId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
            as: "customerDetails",
          },
        },
        {
          $unwind: "$customerDetails",
        },
        {
          $lookup: {
            from: "products",
            let: { productIds: "$items.product" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$productIds"],
                  },
                },
              },
            ],
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            _id: 1,
            customer: {
              _id: "$customerDetails._id",
              firstName: "$customerDetails.firstName",
              lastName: "$customerDetails.lastName",
            },
            items: {
              _id: "$productDetails._id",
              name: "$productDetails.name",
              photos: { $arrayElemAt: ["$productDetails.photos", 0] },
              quantity: 1,
              price: 1,
              size: 1,
              color: 1,
              shop: 1,
            },
            deliveryFee: 1,
            deliveryAddress: 1,
            deliveryAddressCord: 1,
            productTotal: 1,
            totalAmount: 1,
            status: 1,
            createdAt: 1,
          },
        },
      ];
      const orders = Order.aggregate(aggregation);
      const results = await Order.aggregatePaginate(orders, options);

      return results.docs;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async deleteShop(shopId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await Shop.deleteOne({ _id: shopId });
      if (result.deletedCount === 0) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Shop not found");
      }
      await deleteProduct(shopId);
      await session.commitTransaction();
    } catch (error: any) {
      await session.abortTransaction();
      throw new HandleException(error.status, error.message);
    } finally {
      session.endSession();
    }
  }

  async getFoodAndGroceryShops(page: number) {
    const shops = await shopRepository.getFoodAndGroceryShops(page);
    return shops;
  }
}

export const shopServices = new ShopServices();
