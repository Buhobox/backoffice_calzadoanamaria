// import { useEffect, useState } from 'react'
// import axios from 'axios';
import { Select, Form } from "antd";
import { useProductStore } from './LayoutProducto';
import items from "../../api/cuentaAux.json"
const { Option } = Select;

export const ContableItems = ({ handleProductSimple = () => { } }) => {
  const producto = useProductStore()
  // const [items, setItems] = useState(cuentaAux);

  // const fetchItems = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3001/api/items');
  //     setItems(response.data);
  //   } catch (error) {
  //     console.error('Error al obtener los datos:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  function fixEncoding(str = "") {
    return str.replace(/Ã\?/g, 'Ñ')
  }

  const Category = ({ id }) => {
    return (
      <Form.Item
        name={id}
        label="Categoria contable"
        rules={[
          {
            required: true,
            message: "Seleccione una categoria contable",
          },
        ]}
      >
        <Select
          onChange={(value) => handleProductSimple(id, value)}
          placeholder="Seleccione una categoria contable"
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
          {items.map((category) => (
            <Option key={category.SubCuentAuxiliarNumero} value={category.SubCuentAuxiliarNumero}>
              {fixEncoding(category.SubCuentaAuxiliarNombre)}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
  }

  const TypeCategory = ({ id }) => {
    const listItems = producto.isProduct ? typesProduct : typesService
    return (
      <Form.Item
        name={id}
        label="Tipo de categoria"
        rules={[
          {
            required: true,
            message: "Seleccione un tipo contable",
          },
        ]}
      >
        <Select
          onChange={(value) => handleProductSimple(id, value)}
          placeholder="Seleccione un tipo contable"
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
          {listItems.map((types) => (
            <Option key={types.id} value={types.id}>
              {`${types.id} - ${types.value}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
  }

  return (
    <>
      <Category id="catContable1" />
      <TypeCategory id="typeCat1" />
      <Category id="catContable2" />
      <TypeCategory id="typeCat2" />
      <Category id="catContable3" />
      <TypeCategory id="typeCat3" />
      <Category id="catContable4" />
      <TypeCategory id="typeCat4" />
      <Category id="catContable5" />
      <TypeCategory id="typeCat5" />
    </>
  )
}

const typesProduct = [
  { id: 0, value: "Parametrizacion de Inventario" },
  { id: 1, value: "Parametrizacion de Ventas" },
  { id: 2, value: "Parametrizacion Costo de Ventas" },
  { id: 4, value: "Parametrizacion Devolucion Compras" },
  { id: 5, value: "Parametrizacion Devolucion Ventas" },
]

const typesService = [
  { id: 1, value: "Parametrizacion de Ventas" },
  { id: 4, value: "Parametrizacion Devolucion Compras" },
  { id: 5, value: "Parametrizacion Devolucion Ventas" },
  { id: 6, value: "Parametrizacion Compras Debito" },
  { id: 7, value: "Parametrizacion Compras Credito" },
]
