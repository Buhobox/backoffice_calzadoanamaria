import { create } from "apisauce";
import Cookies from "js-cookie";
import { getNowDateIso, getNextDateIso } from "../utils/utils";

const customerkey = "ck_cd9b0a6408043f8ad214a1a2e1357e0cb4a10209";
const customersecret = "cs_fdcd9152c77b3be7650ef9bea26fa7d8d43e0bed";

export const baseurlwc = "https://calzadoanamaria.com/wp-json/wc/v3";
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