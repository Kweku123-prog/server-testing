import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { ICustomer } from "../customers.interface";
import { Customer } from "../models/customers.models";

class CustomerRepository {
  async updateProfile(customerId: string, payload: Partial<ICustomer>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!customer) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Customer not found");
    }
    return customer;
  }
}

export const customerRepo = new CustomerRepository();
