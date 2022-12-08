import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Select, Space } from "antd";
import { Form, Input, Button } from "antd";
import React from "react";
import { TypeIva} from "../../api/utils";
const productStore = 1; //menta oficial
const { Option } = Select;

export const ProductSimple = ({
  handleProductSimple,
  productSimple,
  categorys,
  addProductSimple,
}) => {

  const onFinish = (values) => {
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
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              initialValues={{
                IdCategoria: productSimple.IdCategoria,
                IdSubCategoria: productSimple.IdSubCategoria,
                Descripcion: productSimple.Descripcion,
                PrecioVentaConIva1: productSimple.PrecioVentaConIva1,
                PrecioVentaConIva2: productSimple.PrecioVentaConIva2,
                PorcentajeIva: productSimple.PorcentajeIva,
              }}
            >
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
              </Form.Item> */}
              <Form.Item
                label="Nombre"
                name="Descripcion"
                rules={[{ required: true, message: "Digite el nombre" }]}
              >
                <Input
                  onChange={(value) =>
                    handleProductSimple("Descripcion", value.target.value)
                  }
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
                label="Peso del producto"
                name="weight"
                rules={[
                  { required: true, message: "Digite el peso del producto" },
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
    </Row>
  );
};
