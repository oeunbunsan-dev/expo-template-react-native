import { apiCore } from "../core";

class VendorService {
  listVendorProducts = async (params ? : any) => {
    const res = await apiCore.get("/vendor/products", { params });
    return res.data;
  };

  createVendorProduct = async (payload: any) => {
    const res = await apiCore.post("/vendor/products", payload);
    return res.data;
  };

  updateVendorProduct = async (id: any, payload: any) => {
    const res = await apiCore.put(`/vendor/products/${id}`, payload);
    return res.data;
  };

  deleteVendorProduct = async (id: any) => {
    const res = await apiCore.delete("/vendor/products/" + id);
    return res.data;
  };

  getVendorDashboardOverview = async () => {
    const res = await apiCore.get("/vendor/dashboard");
    return res.data;
  };

  getVendorProfile = async () => {
    const res = await apiCore.get("/vendor/profile");
    return res.data;
  };
};

export const vendorService = new VendorService();
