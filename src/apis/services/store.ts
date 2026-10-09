import { apiCore } from "../core";

class StoreService {
  getPublicStoreProfile = async (slug: string) => {
    const res = await apiCore.get(`/stores/${slug}`);
    return res.data;
  };

  getVendorStores = async () => {

  };
};

export const storeService = new StoreService();
