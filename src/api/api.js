import { DataUsageOutlined } from "@material-ui/icons";
import { create } from "apisauce";
import Cookies from "js-cookie";
import { getNowDateIso, getNextDateIso } from "../utils/utils";
const customerkey = "ck_0e37d26500f4832b854f614a80b06c93ee8fe825";
const customersecret = "cs_ff52b60f771953c9a0e0281f7346ba05253b41ea";
const baseurl = "https://mentaoficial.com/wp-json/wc/v3";
let credentials = `consumer_key=${customerkey}&consumer_secret=${customersecret}`;
const ActualMonth = getNowDateIso();
const NextMonth = getNextDateIso();

const api = create({
  baseURL: baseurl,
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

export const AddProductWC = (data) =>api.post(`/products?${credentials}`, {data});

export const GetAllAttributes = () =>
    api.get(`/products/attributes?${credentials}&per_page=100`);

export const GetAllTermsAttributes = (id) =>
api.get(`/products/attributes/${id}/terms?${credentials}&per_page=100`);


export  const AddAttributes = (data) =>
api.put(`/products/${Cookies.get('productid')}/?${credentials}`, data);