import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Product } from "../../products";

class AdminOpsForProductsService {
  async getProducts(page: number) {
    const query = {};

    const options = {
      page,
      limit: 20,
      select: "name price createdAt",
      populate: [{ path: "category", select: "name" }],
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const products = await Product.paginate(query, options);
    return products;
  }

  async getProductDetails(productId: string) {
    const product = await Product.findById(productId)
      .select("-__v")
      .populate({ path: "shop", select: "name email phoneNumber" })
      .populate({ path: "category", select: "name" })
      .populate({ path: "vendor", select: "firstName lastName phoneNumber" })
      .lean()
      .exec();

    return product;
  }

  async deleteProduct(productId: string) {
    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Product not found");
    }
  }
}

export const adminOpsForProductsService = new AdminOpsForProductsService();
