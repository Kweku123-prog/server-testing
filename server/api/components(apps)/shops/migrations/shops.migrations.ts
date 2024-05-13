import { Shop } from "../models/shops.models";

const migrateShopLocation = async () => {
  const shops = await Shop.find({});

  shops.forEach(async (shop) => {
    if(!shop.type) {
        shop.type = '2c6c0332'
    }
    // if (shop?.latitude) {
    //   console.log({ lat: shop.latitude, lng: shop.longitude });
    //   shop.location.coordinates = [shop.longitude, shop.latitude];
    // }
    await shop.save();
  });
};

export { migrateShopLocation };
