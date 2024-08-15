import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Select, Space, Form, Input, Button } from "antd";
import React from "react";
import { TypeIva, TypeProduct } from "../../api/utils";
import { useProductStore } from "./LayoutProducto";
export const productStore = 1;
const { Option } = Select;

export const ProductSimple = ({ addProductSimple }) => {
  const producto = useProductStore()

  const onFinish = (values) => {
    console.log("::values", values)
    addProductSimple(productStore);
  };

  const onFinishFailed = (errorInfo) => {
    message.info("Por favor complete todos los campos");
  };

  return (
    <Row justify="center" style={{ marginTop: "10px" }}>
      <Space direction="horizontal">
        <Col span={24} className="site-card-border-less-wrapper">
          <Card
            hoverable
            bordered
            title="Datos del producto"
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
                label="Referencia Producto"
                name="Codigo"
                rules={[{ required: true, message: "Digite la referencia del producto" }]}
              >
                <Input
                  maxLength={45}
                  onChange={(value) => producto.setData({ Codigo: value.target.value })}
                />
              </Form.Item>
              {/* <Form.Item
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
                  onChange={(value) => producto.setData({ productstore: value })}
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
              </Form.Item>*/}
              <Form.Item
                label="Nombre producto"
                name="Descripcion"
                rules={[{ required: true, message: "Digite el nombre del producto" }]}
              >
                <Input
                  onChange={(value) => producto.setData({ Descripcion: value.target.value })}
                />
              </Form.Item>
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
                  onChange={(value) => producto.setData({
                    IdCategoria: value,
                    Categoria: producto.knowName(value, producto.categorys)
                  })}
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
                  {producto.categorys.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="IdSubCategoria"
                label="SubCategoria"
                rules={[
                  {
                    required: false,
                    message: "Seleccione una subcategoria",
                  },
                ]}
              >
                <Select
                  onChange={(value) => producto.setData({
                    IdSubCategoria: value,
                    SubCategoria: producto.knowName(value, producto.categorys)
                  })}
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
                  {producto.categorys.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Precio de venta"
                name="PrecioVentaConIva1"
                rules={[
                  { required: true, message: "Digite el precio de venta" },
                ]}
              >
                <Input
                  placeholder="$200.000"
                  type="number"
                  onChange={(value) => producto.setData({
                    PrecioVentaConIva1: parseInt(value.target.value)
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
                  placeholder="$150.000"
                  type="number"
                  onChange={(value) =>
                    producto.setData({
                      PrecioVentaConIva2: parseInt(value.target.value),
                      PrecioVentaConIva3: parseInt(value.target.value),
                    })
                  }
                />
              </Form.Item>
              {!producto.isProduct ? null :
                <Form.Item
                  label="Peso del producto"
                  name="weight"
                  rules={[
                    { required: true, message: "Digite el peso del producto" },
                  ]}
                >
                  <Input
                    placeholder="(1): kg | (300): gr | (0.3): otros"
                    type="text"
                    onChange={(value) => producto.setData({ weight: value.target.value })}
                  />
                </Form.Item>
              }
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
                  onChange={(value) => producto.setData({ PorcentajeIva: value })}
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
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  icon={<PlusCircleOutlined />}
                >
                  Crear Producto
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Space>
    </Row >
  );
};
