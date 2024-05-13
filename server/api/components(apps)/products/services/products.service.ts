import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Shop } from "../../shops";
import { Product } from "../models/products.model";
import { IAddProduct, IProduct } from "../products.interface";

class ProductsService {
  public async addProduct(
    payload: IAddProduct,
    vendorId: string,
    shopId: string
  ) {
    try {
      const shop = await Shop.findOne({ _id: shopId, vendor: vendorId })
        .select("category")
        .lean()
        .exec();

      if (!shop) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Shop not found");
      }

      if (!shop.category) {
        throw new HandleException(
          STATUS_CODES.NOT_FOUND,
          "Shop does not have a category"
        );
      }

      const product = new Product({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        photos: payload.photos,
        sizes: payload.sizes,
        colors: payload.colors,
        shop: shopId,
        category: shop.category,
        vendor: vendorId,
      });
      await product.save();
      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductById(productId: string): Promise<IProduct> {
    try {
      const product = await Product.findById({ _id: productId })
        .populate({ path: "shop", select: "name location.coordinates" })
        .populate({ path: "vendor", select: "firstName lastName" })
        .select("_id name description photos price sizes colors")
        .lean()
        .exec();

      if (!product) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Product not found");
      }
      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async getProductsByCategory(
    categoryId: string,
    page: number,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    try {
      // const products = await Product.find({ category: categoryId })
      //   .select("_id name description photos price")
      //   .skip(skip)
      //   .limit(limit)
      //   .lean()
      //   .exec();
      const query = { category: categoryId };

      const options = {
        page,
        limit: 20,
        select: "name description photos price",
        leanWithId: false,
        lean: true,
      };

      const products = await Product.paginate(query, options);

      return products;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  public async updateProduct(
    productId: string,
    vendor: string,
    payload: Partial<IProduct>
  ): Promise<IProduct> {
    try {
      const vendorOwnsProduct = await Product.exists({
        _id: productId,
        vendor,
      });
      if (!vendorOwnsProduct) {
        throw new HandleException(
          STATUS_CODES.FORBIDDEN,
          "Vendor does not own the product"
        );
      }

      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: payload },
        { new: true }
      )
        .select("name description price photos shop category sizes colors")
        .lean();

      if (!product) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Product not found");
      }

      return product;
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async deleteProduct(productId: string, vendor: string) {
    try {
      const vendorOwnsProduct = await Product.exists({
        _id: productId,
        vendor,
      });
      if (!vendorOwnsProduct) {
        throw new HandleException(
          STATUS_CODES.FORBIDDEN,
          "You cannot perform this action"
        );
      }
      const result = await Product.deleteOne({ _id: productId });

      if (result.deletedCount === 0) {
        throw new HandleException(STATUS_CODES.NOT_FOUND, "Product not found");
      }
      console.log("Product deleted", productId);
    } catch (error: any) {
      throw new HandleException(error.status, error.message);
    }
  }

  async searchProducts(term: string, page: number) {
    const query = { name: { $regex: term, $options: "i" } };

    const options = {
      page,
      limit: 20,
      select: "name price shop photos",
      populate: [{ path: "shop", select: "name" }],
      leanWithId: false,
    };

    const products = await Product.paginate(query, options);
    return products;
  }
}

export const productsService = new ProductsService();
