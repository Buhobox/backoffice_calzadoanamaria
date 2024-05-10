import { DataUsageOutlined } from "@material-ui/icons";
import { create } from "apisauce";
import Cookies from "js-cookie";
import { getNowDateIso, getNextDateIso } from "../utils/utils";

const customerkey = "ck_2c7fed3da5c1ef10e1e206c401a60ae211713519";
const customersecret = "cs_8e32946b91e27d33765800c5c77a85d66ade7b4c";

export const baseurlwc = "https://santandereanadecascos.buhobox.com.co/wp-json/wc/v3";
export const credentials = `consumer_key=${customerkey}&consumer_secret=${customersecret}`;
export const baseurl = "https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/";

const ActualMonth = getNowDateIso();
const NextMonth = getNextDateIso();

const api = create({
  baseURL: baseurlwc,
  headers: { Accept: "application/vnd.github.v3+json" },
});

export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}?${credentials}`);


export const getCustomerOrders = () =>
  api.get(`/orders?status=enviado&${credentials}`);

export const getAllOrdersWhosales = (numpage = 1) =>
  api.get(
    `/orders?status=sendwholesaler&per_page=100&page=${numpage}&before=${NextMonth}&after=${ActualMonth}&${credentials}`
  );

export const getReportsTotal = () =>
  api.get(`/reports/orders/totals?${credentials}`);

export const reportSalesToday = () => api.get(`/reports/sales?${credentials}`);

export const getCustomerOrdersEnviados = () =>
  api.get(`/orders?status=processing&${credentials}`);

export const getCustomerOrderssendwholesaler = () =>
  api.get(`/orders?status=sendwholesaler&per_page=100&${credentials}`);


export const GetAllCategorys = () =>
  api.get(`/products/categories?${credentials}&per_page=100`);

export const AddProductWC = (data) => api.post(`/products?${credentials}`, { data });

export const GetAllAttributes = () =>
  api.get(`/products/attributes?${credentials}&per_page=100`);

export const GetAllTermsAttributes = (id) =>
  api.get(`/products/attributes/${id}/terms?${credentials}&per_page=100`);


export const AddAttributes = (data) =>
  api.put(`/products/${Cookies.get('productid')}/?${credentials}`, data);