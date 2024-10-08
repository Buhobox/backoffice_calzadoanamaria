import { LoadingOutlined } from "@ant-design/icons";
import { Form, Button, Select, Card } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AddAttributes, GetAllTermsAttributes } from "../../api/api"; // Asegúrate de importar GetAllTermsAttributes
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

// Creación del estado global usando zustand
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
}));

// Función para cargar todos los términos de un atributo de forma paginada
const fetchAllTerms = async (id, page = 1, accumulatedTerms = []) => {
  try {
    // Realiza la consulta de términos usando la función personalizada con el número de página
    const response = await GetAllTermsAttributes(id, page);
    const { data } = response;

    // Combina los términos obtenidos en esta página con los anteriores
    const newTerms = [...accumulatedTerms, ...data];

    // Verifica si hay más términos en las siguientes páginas
    if (data.length === 100) {
      // Si hay más de 100 términos, realiza otra solicitud con la siguiente página
      return await fetchAllTerms(id, page + 1, newTerms);
    } else {
      // Si no hay más páginas, retorna todos los términos acumulados
      return newTerms;
    }
  } catch (error) {
    console.error("Error fetching terms:", error);
    return accumulatedTerms; // Retorna lo acumulado hasta ahora en caso de error
  }
};

export const Atributes = ({ next, setcontrolStatusGeneral, controlStatusGeneral }) => {
  const attributes = useAttributesStore();
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    // Cargar todos los términos para cada atributo al montar el componente
    const loadAllTerms = async () => {
      const groups = {};
      for (const attr of attributes.list) {
        const terms = await fetchAllTerms(attr.id);
        groups[attr.id] = terms;
      }
      attributes.setGroups(groups);
    };

    if (attributes.list.length > 0) {
      loadAllTerms();
    }
  }, [attributes.list]);

  const getJustOptions = () => {
    const data = {};
    attributes.selected.forEach(id => {
      data[id] = attributes.options[id].map(option => {
        const text = attributes.groups[id]?.find(i => i.id === option)?.name;
        return text;
      });
    });
    attributes.setData(data);
  };

  const onFinish = (values) => {
    setloading(true);

    const data = attributes.selected.map(id => {
      const options = attributes.groups[id]
        .filter(option => attributes.options[id].includes(option.id))
        .map(option => option.name);
      return { id, options, visible: true, variation: true };
    });
    getJustOptions();

    AddAttributes({ attributes: data }).then((res) => {
      if (res.data.id) {
        toast.success(data.length === 1
          ? "Se agregó correctamente el atributo"
          : "Se agregaron correctamente los atributos"
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
      title="Atributos y términos a utilizar"
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
            placeholder="Selecciona uno o varios atributos"
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

        {attributes.list.map(att => attributes.selected.includes(att.id) && (
          <Form.Item
            key={att.id}
            name={att.name}
            label={att.name}
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Selecciona uno o varios términos"
              maxTagCount="responsive"
              allowClear
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(values) => attributes.setOptions(att.id, values)}
            >
              {attributes.groups[att.id]?.map((term) => (
                <Option key={term.id} value={term.id}>
                  {term.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ))}

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
