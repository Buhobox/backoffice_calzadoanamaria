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
import { useProductStore } from "./LayoutProducto";
import { ContableItems } from "./ContableItems";
import { useAttributesStore } from "./Atributes";

const { Option } = Select;

export const ProductoVariante = ({
  addProductSimple,
  variation = false,
}) => {
  const producto = useProductStore()
  const attributes = useAttributesStore()

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

  const [termselected, settermselected] = useState({});

  const addVariante = (values) => {
    let productS = producto.data;
    productS.Descripcion = Cookies.get("productname") + "-" + Object.values(termselected).join("-");
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
              const filteredAttributes = attributes.selected.map(id => {
                const name = values[`termselected-${id}`]
                const group = attributes.list.filter(i => i.id === id)[0]
                const att = attributes.groups[id].filter(i => i.name === name)[0]
                return { id: group.id, option: name, name: group.name, slug: att.slug }
              })

              let producttowc = {
                regular_price: productotosave.PrecioVentaConIva1.toString(),
                price: productotosave.PrecioVentaConIva1.toString(),
                manage_stock: true,
                weight: productotosave.weight,
                sku: res.data.CodigoBarras,
                wholesale_price: {
                    wholesale_customer: productotosave.PrecioVentaConIva2.toString(),
                },
                attributes: filteredAttributes,
                meta_data: [
                    {
                        key: '_codigo_de_barras',
                        value: productotosave.Codigo
                    }
                ]
            };

              let idproduct = Cookies.get("productid");
              axios
                .post(
                  `${baseurlwc}/products/${idproduct}/variations?${credentials}`,
                  { ...producttowc }
                )
                .then((res) => {
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
                ? "Crear Variaciones (Selecciona términos para generar una o más variantes)"
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
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              initialValues={{
                Codigo: producto.data.Codigo,
                productstore: producto.data.productstore,
                IdCategoria: producto.data.IdCategoria,
                IdSubCategoria: producto.data.IdSubCategoria,
                Descripcion: producto.data.Descripcion,
                PrecioVentaConIva1: producto.data.PrecioVentaConIva1,
                PrecioVentaConIva2: producto.data.PrecioVentaConIva2,
                PorcentajeIva: producto.data.PorcentajeIva
              }}
            >
              <Form.Item
                label="Referencia producto"
                name="Codigo"
                rules={[{ required: true, message: "Digite la referencia del producto" }]}
              >
                <Input
                  maxLength={45}
                  onChange={(value) => producto.setData({ Codigo: value.target.value })}
                />
              </Form.Item>
              {!variation ? null : Object.keys(attributes.data).map(key =>
                <Form.Item
                  key={key}
                  name={`termselected-${key}`}
                  label={"Selecciona  un término"}
                  rules={[
                    {
                      required: true,
                      message: "Selecciona un término",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      settermselected(old => ({ ...old, [key]: value }));
                    }}
                    placeholder="Selecciona un término"
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
                    {attributes.data[key].map((termi, index) => (
                      <Option key={index} value={termi}>
                        {termi}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {!variation && (
                <Form.Item
                  label="Nombre producto"
                  name="Descripcion"
                  rules={[{ required: true, message: "Digite el nombre del producto" }]}
                >
                  <Input
                    disabled={variation}
                    onChange={(value) => producto.setData({ Descripcion: value.target.value })}
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
                      message: "Selecciona una categoria",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => producto.setData({
                      IdCategoria: value,
                      Categoria: producto.knowName(value, producto.categorys)
                    })}
                    placeholder="Selecciona una categoria"
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
                    {producto.categorys.map((category) => (
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
                      message: "Selecciona una subcategoria",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => producto.setData({
                      IdSubCategoria: value,
                      SubCategoria: producto.knowName(value, producto.categorys)
                    })}
                    placeholder="Selecciona una subcategoria"
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
                    {producto.categorys.map((category) => (
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
                      onChange={(value) => producto.setData({
                        PrecioVentaConIva1: value.target.value
                      })}
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
                      onChange={(value) => producto.setData({
                        PrecioVentaConIva2: value.target.value,
                        PrecioVentaConIva3: value.target.value,
                      })}
                    />
                  </Form.Item>
                    <Form.Item
                      label="Peso del producto"
                      name="weight"
                      rules={[
                        {
                          required: true,
                          message: "Digite el peso del producto",
                        },
                      ]}
                    >
                      <Input
                        placeholder="(1): kg | (300): gr | (0.3): otros"
                        type="text"
                        onChange={(value) => producto.setData({ weight: value.target.value })}
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
                    message: "Selecciona un porcentaje iva",
                  },
                ]}
              >
                <Select
                  onChange={(value) => producto.setData({ PorcentajeIva: value })}
                  placeholder="Selecciona un porcentaje iva"
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
                  {variation ? "Crear variacion" : `Crear ${producto.type}`}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Space>
    </Row>
  );
};
