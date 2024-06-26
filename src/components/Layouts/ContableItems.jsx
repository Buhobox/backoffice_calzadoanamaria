
import { Select, Form, Popover } from "antd";
import { useProductStore } from './LayoutProducto';
import items from "../../api/cuentaAux.json"
const { Option } = Select;

export const ContableItems = () => {
  const producto = useProductStore()

  const listItems = producto.isProduct ? typesProduct : typesService

  function fixEncoding(str = "") {
    return str.replace(/Ã\?/g, 'Ñ')
  }

  function renderLabel(item) {
    const text = `${item.id} - P. ${item.value}`;
    return (
      <Popover content={`${item.id} - Parametrizacion ${item.value}`} placement="top">
        <span>
          {text.length > 23 ? `${text.substring(0, 20)}...` : text}
        </span>
      </Popover>
    );
  }

  return listItems.map((i, k) =>
    <Form.Item
      key={k}
      name={`cat${k}`}
      label={renderLabel(i)}
      rules={[
        {
          required: true,
          message: "Seleccione una categoria contable",
        },
      ]}
    >
      <Select
        onChange={(value) => producto.setCategory(k, value)}
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
            .localeCompare(`${optionB.children}`.toLowerCase())
        }
      >
        {items.map((category) => (
          <Option key={category.SubCuentAuxiliarNumero} value={category.SubCuentAuxiliarNumero}>
            {`${category.SubCuentAuxiliarNumero} - ${fixEncoding(category.SubCuentaAuxiliarNombre)}`}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

const typesProduct = [
  { id: 0, value: "de Inventario" },
  { id: 1, value: "de Ventas" },
  { id: 2, value: "Costo de Ventas" },
  { id: 4, value: "Devolucion Compras" },
  { id: 5, value: "Devolucion Ventas" },
]

const typesService = [
  { id: 1, value: "de Ventas" },
  { id: 4, value: "Devolucion Compras" },
  { id: 5, value: "Devolucion Ventas" },
  { id: 6, value: "Compras Debito" },
  { id: 7, value: "Compras Credito" },
]
