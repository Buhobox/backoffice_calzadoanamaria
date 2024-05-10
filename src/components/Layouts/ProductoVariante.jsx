import { PlusCircleFilled } from "@ant-design/icons";
import { Card, Col, message, Row, Select, Space } from "antd";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { GetTokenProducto, TypeIva, TypeProduct } from "../../api/utils";
import { productStore } from "./ProductSimple";
import { baseurl, baseurlwc, credentials } from "../../api/api";

const { Option } = Select;

export const ProductoVariante = ({
  handleProductSimple,
  productSimple,
  categorys,
  addProductSimple,
  variation = false,
  controlAttT,
}) => {
  const onFinish = (values) => {
    if (variation) {
      addVariante(values);
    } else {
      addProductSimple(values.productstore);
    }
  };

  toast.configure();

  const onFinishFailed = (errorInfo) => {
    message.info("Por favor complete todos los campos");
  };

  const [termselected, settermselected] = useState("");

  const addVariante = (values) => {
    let productS = productSimple;
    productS.Descripcion = Cookies.get("productname") + "-" + termselected;
    productS.TipoProducto = 1;
    productS.weight = values.weight;
    const getToken = GetTokenProducto(productStore);
    toast.promise(getToken, {
      pending: "Obteniendo token...",
      success: "Token obtenido 👌",
      error: "Ocurrio un error ... 🤯",
    });

    getToken.then((token) => {
      let { data } = token;
      if (data) {
        let productotosave = {
          ...productS,
          Token: data,
        };

        toast.info("Guardando producto...", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        axios
          .post(baseurl + "GuardarProducto", {
            ...productotosave,
          })
          .then((res) => {
            if (res.data.Exito) {
              let producttowc = {
                regular_price: productotosave.PrecioVentaConIva1,
                price: productotosave.PrecioVentaConIva1,
                manage_stock: true,
                weight: productotosave.weight,
                sku: res.data.CodigoBarras,
                wholesale_price: {
                  wholesale_customer: productotosave.PrecioVentaConIva2,
                },
                attributes: [
                  {
                    id: controlAttT.attributeSelected,
                    option: values.termselected.toString(),
                  },
                ],
              };

              let idproduct = Cookies.get("productid");
              axios
                .post(
                  baseurlwc +
                    "/products/" +
                    idproduct +
                    "/variations" +
                    "?" +
                    credentials,
                  { ...producttowc }
                )
                .then((res) => {
                  console.log(
                    "🚀 ~ file: ProductoVariante.jsx ~ line 101 ~ .then ~ res",
                    res
                  );
                  if (res.data.id) {
                    toast.success("Producto guardado con exito");
                  } else {
                    toast.error(
                      "Ocurrio un error al guardar el producto => " +
                        res.data.message
                    );
                  }
                });
            } else {
              toast.error(res.data.MensajeError);
            }
          });
      }
    });
  };

  return (
    <Row justify="center" style={{ marginTop: "10px" }}>
      <Space direction="horizontal">
        <Col span={24} className="site-card-border-less-wrapper">
          <Card
            hoverable
            bordered
            title={
              variation
                ? "Crear Variante (Puedes crear una o mas variantes en este formulario, escogiendo los terminos diferentes para cada producto)"
                : "Datos del producto"
            }
            style={{
              width: "40vw",
              borderRadius: "12px",
              margin: 10,
              boxShadow: "1px 2px 2px 0px #cccccc",
            }}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              // initialValues={{
              //   IdCategoria: productSimple.IdCategoria,
              //   IdSubCategoria: productSimple.IdSubCategoria,
              //   Descripcion: productSimple.Descripcion,
              //   PrecioVentaConIva1: productSimple.PrecioVentaConIva1,
              //   PrecioVentaConIva2: productSimple.PrecioVentaConIva2,
              //   PorcentajeIva: productSimple.PorcentajeIva,
              // }}
            >
              <Form.Item
                name="productstore"
                label="Tipo de tienda"
                rules={[
                  {
                    required: true,
                    message: "Seleccione un tipo de tienda",
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    handleProductSimple("productstore", value);
                  }}
                  placeholder="Seleccione tipo de tienda"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {TypeProduct.map((productype) => (
                    <Option key={productype.Codigo} value={productype.Codigo}>
                      {productype.Descripcion}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {variation && (
                <Form.Item
                  name="termselected"
                  label="Termino del producto"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione un termino",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      settermselected(value);
                    }}
                    placeholder="Seleccione un termino"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {controlAttT.data.length > 0 &&
                      controlAttT.data.map((termi, index) => (
                        <Option key={index} value={termi}>
                          {termi}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
              {!variation && (
                <Form.Item
                  label="Nombre"
                  name="Descripcion"
                  rules={[{ required: true, message: "Digite el nombre" }]}
                >
                  <Input
                    disabled={variation}
                    onChange={(value) =>
                      handleProductSimple("Descripcion", value.target.value)
                    }
                  />
                </Form.Item>
              )}
              {!variation && (
                <Form.Item
                  name="IdCategoria"
                  label="Categoria"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione una categoria",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      handleProductSimple("IdCategoria", value);
                    }}
                    placeholder="Seleccione una categoria"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {categorys.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {!variation && (
                <Form.Item
                  name="IdSubCategoria"
                  label="SubCategoria"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione una subcategoria",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      handleProductSimple("IdSubCategoria", value);
                    }}
                    placeholder="Seleccione una subcategoria"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {categorys.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {variation && (
                <>
                  <Form.Item
                    label="Precio de venta"
                    name="PrecioVentaConIva1"
                    rules={[
                      { required: true, message: "Digite el precio de venta" },
                    ]}
                  >
                    <Input
                      placeholder="$200000"
                      type="number"
                      onChange={(value) =>
                        handleProductSimple(
                          "PrecioVentaConIva1",
                          value.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Precio Mayoreo"
                    name="PrecioVentaConIva2"
                    rules={[
                      { required: true, message: "Digite el precio Mayorista" },
                    ]}
                  >
                    <Input
                      placeholder="$200000"
                      type="number"
                      onChange={(value) =>
                        handleProductSimple(
                          "PrecioVentaConIva2",
                          value.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Precio del producto"
                    name="weight"
                    rules={[
                      {
                        required: true,
                        message: "Digite el peso del producto",
                      },
                    ]}
                  >
                    <Input
                      placeholder="(1): zapatos | (0.3): otros"
                      type="text"
                      onChange={(value) =>
                        handleProductSimple("weight", value.target.value)
                      }
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item
                name="PorcentajeIva"
                label="porcentaje iva"
                rules={[
                  {
                    required: true,
                    message: "Seleccione un porcentaje iva",
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    handleProductSimple("PorcentajeIva", value);
                  }}
                  placeholder="Seleccione un porcentaje iva"
                  allowClear
                >
                  {TypeIva.map((typeiva) => (
                    <Option key={typeiva.Codigo} value={typeiva.Valor}>
                      {typeiva.Descripcion}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  icon={<PlusCircleFilled />}
                  type="primary"
                  htmlType="submit"
                  shape="round"
                >
                  {variation ? "Crear variacion" : "Crear producto"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Space>
    </Row>
  );
};
