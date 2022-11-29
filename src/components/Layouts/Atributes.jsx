import { LoadingOutlined } from "@ant-design/icons";
import { Form, Button, Select, Card } from "antd";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  AddAttributes,
  GetAllAttributes,
  GetAllTermsAttributes,
} from "../../api/api";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 16,
  },
};

export const Atributes = ({
  attributesData,
  setattributesData,
  terminos,
  setterminos,
  next,
  setcontrolAttT,
  controlAttT,
  setcontrolStatusGeneral,
  controlStatusGeneral,
}) => {
  const [form] = Form.useForm();
  const [termTemporales, settermTemporales] = useState([]);
  const [loading, setloading] = useState(false);

  const handleChangeAttribute = (value) => {
    setcontrolAttT({
      ...controlAttT,
      attributeSelected: value,
    });
    settermTemporales([]);
    setterminos([]);

    GetAllTermsAttributes(value).then((res) => {
      setterminos(res.data || []);
    });
  };

  const onFinish = (values) => {
    setloading(true);
    let dataSave = {
      attributes: [
        {
          id: controlAttT.attributeSelected,
          options: termTemporales,
          visible: true,
          variation: true,
        },
      ],
    };

    AddAttributes(dataSave).then((res) => {
      if (res.data.id) {
        setcontrolAttT({
          ...controlAttT,
          data: termTemporales,
        });
        toast.success("Se agrego correctamente el atributo");
        next();
        setcontrolStatusGeneral({
          ...controlStatusGeneral,
          finish: true,
        });
      } else {
        toast.error("Error al agregar el atributo");
      }
    });
  };

  const handleChangeTerms = (terms) => {
    terms.map((termid) => {
      let termino = terminos.filter((ter) => ter.id == termid)[0];
      settermTemporales([...termTemporales, termino.name]);
    });
  };

  React.useEffect(() => {
    GetAllAttributes().then((res) => {
      setattributesData(res.data || []);
    });
  }, []);

  return (
    <Card
      title="Atributos y terminos a utilizar"
      hoverable
      bordered
      style={{
        width: "40vw",
        borderRadius: "12px",
        margin: 10,
        boxShadow: "1px 2px 2px 0px #cccccc",
      }}
    >
      <Form
        initialValues={{ terms: termTemporales }}
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item
          name="attribute"
          label="Atributos"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione un atributo"
            onChange={handleChangeAttribute}
            allowClear
          >
            {attributesData.map((attribute) => (
              <Option key={attribute.id} value={attribute.id}>
                {attribute.name} || {attribute.slug}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="terms"
          label="Terminos"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Seleccione uno ó varios terminos"
            maxTagCount="responsive"
            allowClear
            onChange={handleChangeTerms}
            value={termTemporales}
            defaultValue={termTemporales}
          >
            {terminos.length > 0 &&
              terminos.map((term) => (
                <Option key={term.id} value={term.id}>
                  {term.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          {loading ? (
            <LoadingOutlined style={{ fontSize: "23px" }} />
          ) : (
            <Button shape="round" type="primary" htmlType="submit">
              Seleccionar y seguir
            </Button>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};
