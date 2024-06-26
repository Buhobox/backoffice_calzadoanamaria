import { LoadingOutlined } from "@ant-design/icons";
import { Form, Button, Select, Card } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { AddAttributes } from "../../api/api";
import { create } from "zustand";
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

export const useAttributesStore = create((set) => ({
  list: [],
  groups: {},
  selected: [],
  options: {},
  data: {},
  setList: (list) => set({ list }),
  setData: (data) => set({ data }),
  setSelected: (selected) => set({ selected }),
  setOptions: (code, options) => set((state) => ({ options: { ...state.options, [code]: options } })),
  setGroups: (groups) => set((state) => ({ groups: { ...state.groups, ...groups } })),
  reset: () => set({ list: [], groups: {}, selected: [], options: {}, data: {} }),
}))

export const Atributes = ({
  next,
  setcontrolStatusGeneral,
  controlStatusGeneral,
}) => {
  const attributes = useAttributesStore()

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);

  const getJustOptions = () => {
    const data = {}
    attributes.selected.forEach(id => {
      const name = attributes.list.filter(i => i.id === id)[0].name
      data[name] = attributes.options[id].map(option => {
        const text = attributes.groups[id].filter(i => i.id === option)[0].name
        return text
      })
    })
    attributes.setData(data)
  }

  const onFinish = (values) => {
    setloading(true);

    const data = attributes.selected.map(id => {
      const options = attributes.groups[id].filter(option =>
        attributes.options[id].includes(option.id)
      ).map(option => option.name)
      return { id, options, visible: true, variation: true }
    })
    getJustOptions()
    //  Añade data a woo/products
    AddAttributes({ attributes: data }).then((res) => {
      if (res.data.id) {
        toast.success(data.length === 1
          ? "Se agrego correctamente el atributo"
          : "Se agregaron correctamente los atributo"
        );
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
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item
          name="atributos"
          label="Atributos"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Seleccione uno ó varios atributos"
            maxTagCount="responsive"
            allowClear
            onChange={(values) => attributes.setSelected(values)}
          >
            {attributes.list.length > 0 &&
              attributes.list.map((term) => (
                <Option key={term.id} value={term.id}>
                  {term.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        {attributes.list.map(att => !attributes.selected.includes(att.id) ? null :
          <Form.Item
            key={att.id}
            name={att.name}
            label={att.name}
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Seleccione uno ó varios terminos"
              maxTagCount="responsive"
              allowClear
              onChange={(values) => attributes.setOptions(att.id, values)}
            >
              {attributes.groups[att.id].map((term) => (
                <Option key={term.id} value={term.id}>
                  {term.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

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
