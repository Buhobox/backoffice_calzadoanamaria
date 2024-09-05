import { Card, Row, Select, Space, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Steps, Button } from "antd";
import { useEffect, useState } from "react";
import Text from "antd/lib/typography/Text";
import { ProductoVariante } from "./ProductoVariante";
import { ProductSimple } from "./ProductSimple";
import { GetAllAttributes, GetAllCategorys, GetAllTermsAttributes, baseurl, baseurlwc, credentials } from "../../api/api";
import { GetTokenProducto } from "../../api/utils";
import { ReviewProduct } from "./ReviewProduct";
import axios from "axios";
import Cookies from "js-cookie";
import { Atributes, useAttributesStore } from "./Atributes";
import { toast } from "react-toastify";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { create } from "zustand";

const { Step } = Steps;
const { Option } = Select;

const defProductConfig = {
  TipoProducto: 1,
  IdIva: 0
}

const defServiceConfig = {
  TipoProducto: 0,
  IdIva: 0
}

export const TYPE_PRODUCT = "Producto"
export const TYPE_SERVICE = "Servicio"

export const useProductStore = create((set) => ({
  type: "",
  isProduct: false,
  isService: false,
  categorys: [],
  data: defProductConfig,
  setType: (type) => set({
    type,
    isProduct: type === TYPE_PRODUCT,
    isService: type === TYPE_SERVICE,
    data: type === TYPE_PRODUCT ? defProductConfig : defServiceConfig
  }),
  setData: (data) => set(state => ({ data: { ...state.data, ...data } })),
  setcategorys: (categorys) => set({ categorys }),
  setCategory: (index, code) => set(state => {
    const data = Object.assign({}, state.data)
    data.ParametrizacionContableProducto[index].NumeroCuenta = code
    return { data }
  }),
  reset: () => set((state) => ({ data: state.isProduct ? defProductConfig : defServiceConfig })),
  knowName: (id, categorys) => {
    let name = categorys.filter(category => category.id === id);
    return name[0]?.name || "";
  }
}))

export const LayoutProducto = () => {
  const producto = useProductStore()
  const attributes = useAttributesStore()

  useEffect(() => {
    GetAllAttributes().then((res) => {
      attributes.setList(res.data || []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    attributes.list.forEach(item => {
      GetAllTermsAttributes(item.id).then((res) => {
        attributes.setGroups({ [item.id]: res.data || [] });
      });
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes.list])


  const stylecard = {
    width: "70vw",
    borderRadius: "12px",
    margin: 10,
    boxShadow: "1px 2px 2px 0px #cccccc",
  };

  const [current, setCurrent] = useState(0);
  const [selected, setselected] = useState(null);
  const [controlStatusGeneral, setcontrolStatusGeneral] = useState({
    nextDisabled: true,
    loading: false,
  });

  const addProductSimple = (productstore) => {
    const getToken = GetTokenProducto(productstore);
    setcontrolStatusGeneral({
      ...controlStatusGeneral,
      messagestep1: "Obteniendo token...",
      messagestep2: "Esperando respuesta...",
      loading: true,
      step: 1,
    });

    getToken.then((token) => {
      setcontrolStatusGeneral({
        ...controlStatusGeneral,
        messagestep1: "Token obtenido correctamente",
        messagestep2: "Creando producto...",
        loading: true,
        step: 2,
        status: "loading",
      });

      let { data } = token;
      // TODO: verificar peticion de token
      if (data) {
        let productotosave = {
          ...producto.data,
          Token: data,
        };
        if (selected === "2") {
          setcontrolStatusGeneral({
            ...controlStatusGeneral,
            messagestep3: "Creando producto en WooCommerce...",
            loading: true,
            step: 3,
            status: "loading",
          });
          let producttowc = {
            name: productotosave.Descripcion,
            type: selected === "2" ? "variable" : "simple",
            regular_price: productotosave.PrecioVentaConIva1,
            manage_stock: selected === "2" ? false : true,
            status: "pending",
            sale_price: productotosave.PrecioVentaConIva1,
            stock_quantity: 0,
            stock_status: "outofstock",
            wholesale_price: {
                wholesale_customer: productotosave.PrecioVentaConIva3,
            },
            categories: [
                {
                    id: productotosave.IdCategoria,
                },
                {
                    id: productotosave.IdSubCategoria,
                },
            ],
            meta_data: [
                {
                    key: '_codigo_de_barras',
                    value: productotosave.Codigo
                }
            ]
        };
        

          axios.post(baseurlwc + `/products?${credentials}`, { ...producttowc })
            .then((res) => {
              if (res.data.id) {
                Cookies.set("productid", res.data.id);
                Cookies.set("productname", res.data.name);
                setcontrolStatusGeneral({
                  ...controlStatusGeneral,
                  messagestep3: "Producto de wooCommerce creado correctamente",
                  step: 4,
                  status: "success",
                  loading: false,
                });
              }
            });
        } else {
          axios.post(baseurl + "GuardarProductoSinContabilidad", { ...productotosave })
            .then((res) => {
              setcontrolStatusGeneral({
                ...controlStatusGeneral,
                messagestep1: "Token obtenido correctamente",
                messagestep2: res.data.MensajeError,
                loading: true,
                step: res.data.Exito ? 3 : 2,
                status: res.data.Exito ? "success" : "error",
              });

              if (res.data.Exito) {
                setcontrolStatusGeneral({
                  ...controlStatusGeneral,
                  messagestep3: "Creando producto en WooCommerce...",
                  loading: true,
                  step: 3,
                  status: "loading",
                });

                let producttowc = {
                  name: productotosave.Descripcion,
                  codigo_de_barras: productotosave.Codigo,  // Campo directo en el objeto
                  sku: res.data.CodigoBarras,
                  type: selected === "2" ? "variable" : "simple",
                  regular_price: productotosave.PrecioVentaConIva1.toString(),
                  manage_stock: true,
                  status: "pending",
                  sale_price: productotosave.PrecioVentaConIva1.toString(),
                  stock_quantity: 0,
                  weight: productotosave.weight,
                  stock_status: "outofstock",
                  wholesale_price: {
                      wholesale_customer: productotosave.PrecioVentaConIva3.toString(),
                  },
                  categories: [
                      {
                          id: productotosave.IdCategoria,
                      },
                      {
                          id: productotosave.IdSubCategoria,
                      },
                  ],
                  meta_data: [
                      {
                          key: '_codigo_de_barras',
                          value: productotosave.Codigo  // Incluido en la metadata
                      }
                  ]
              };

                axios.post(baseurlwc + `/products?${credentials}`, { ...producttowc })
                  .then((res) => {
                    if (res.data.id) {
                      Cookies.set("productid", res.data.id);
                      Cookies.set("productname", res.data.name);
                      setcontrolStatusGeneral({
                        ...controlStatusGeneral,
                        messagestep3:
                          "Producto de wooCommerce creado correctamente",
                        step: 4,
                        status: "success",
                        finish: selected === "2" ? false : true,
                        loading: false,
                      });
                    }
                  });
              } else {
                toast.error(res.data.MensajeError);
              }
            });
        }
      }
    });

    setCurrent(current + 1);
  };

  useEffect(() => {
    GetAllCategorys().then((res) => {
      producto.setcategorys(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
    setcontrolStatusGeneral({
      ...controlStatusGeneral,
      loading: false,
    });
  };

  const renderStepsVariant = () => {
    return stepsProductVariant.map((item) => (
      <Step key={item.title} title={item.title} />
    ));
  };

  const renderSteps = () => {
    return steps.map((item) => <Step key={item.title} title={item.title} />);
  };

  const handleselectproductype = (typroduct) => {
    setselected(typroduct);
  };

  let rulesShowButtonNext = (selectedP, currentP = 1) => {
    let btnnext = false;
    let btnfinish = false;
    let btnprev = false;
    if (selectedP === "1") {
      switch (currentP) {
        case 0:
          btnnext = true;
          break;

        case 1:
          btnprev = true;
          break;

        case 2:
          btnfinish = true;
          btnprev = true;
          break;

        default:
        //
      }
    } else if (selectedP === "2") {
      switch (currentP) {
        case 0:
          btnnext = true;
          break;

        case 1:
          btnprev = true;
          break;

        case 2:
          btnnext = true;
          btnprev = true;
          break;

        case 4:
          btnfinish = true;
          break;

        default:
        //
      }
    }

    return {
      btnnext,
      btnfinish,
      btnprev,
    };
  };

  let steps = [
    {
      title: `Tipo Producto ${producto.type}`,
      content: (
        <TipoDeProducto
          handleselectproductype={handleselectproductype}
          selected={selected}
          setcontrolStatusGeneral={setcontrolStatusGeneral}
        />
      ),
    },
    {
      title: `Crear ${producto.type}`,
      content: (
        <RenderTypeProduct
          selected={selected}
          addProductSimple={addProductSimple}
          controlStatusGeneral={controlStatusGeneral}
        />
      ),
    },
    {
      title: "Resumen",
      content: <ReviewProduct controlStatusGeneral={controlStatusGeneral} />,
    },
  ];

  let stepsProductVariant = [
    {
      title: "Tipo Producto",
      content: (
        <TipoDeProducto
          handleselectproductype={handleselectproductype}
          selected={selected}
          setcontrolStatusGeneral={setcontrolStatusGeneral}
        />
      ),
    },
    {
      title: "Datos del producto",
      content: (
        <RenderTypeProduct
          selected={selected}
          addProductSimple={addProductSimple}
          controlStatusGeneral={controlStatusGeneral}
        />
      ),
    },
    {
      title: "Resumen",
      content: <ReviewProduct controlStatusGeneral={controlStatusGeneral} />,
    },
    {
      title: "Atributos",
      content: (
        <Atributes
          controlStatusGeneral={controlStatusGeneral}
          next={next}
          setcontrolStatusGeneral={setcontrolStatusGeneral}
        />
      ),
    },
    {
      title: "Variaciones",
      content: (
        <ProductoVariante addProductSimple={addProductSimple} variation />
      ),
    },
  ];

  return (
    <Content
      style={{ marginLeft: "10vw", marginTop: "10px", overflow: "initial" }}
    >
      <Row justify="center">
        <Card
          style={stylecard}
          title={
            !selected
              ? "Gestionar Productos/servicios"
              : selected === "1"
                ? `Gestión ${producto.type} simple`
                : `Gestión ${producto.type} variable`
          }
        >
          <Steps current={current}>
            <>{selected === "2" ? renderStepsVariant() : renderSteps()}</>
          </Steps>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              minHeight: "40vh",
              marginBottom: "30px",
              background: "#F0F2F5",
              borderRadius: "10px",
            }}
            className="steps-content"
          >
            {selected === "1"
              ? steps[current].content
              : stepsProductVariant[current].content}
          </div>
          <div className="steps-action">
            {rulesShowButtonNext(selected, current).btnnext && (
              <Button
                icon={<ArrowRightOutlined />}
                disabled={controlStatusGeneral.loading}
                style={{
                  height: "40px",
                  width: "130px",
                  background: "#8F3D26",
                  display: current === 4 && "none",
                }}
                shape="round"
                type="primary"
                onClick={() => next()}
              >
                Siguiente
              </Button>
            )}

            {rulesShowButtonNext(selected, current).btnfinish && (
              <Button
                icon={<CheckOutlined />}
                disabled={controlStatusGeneral.loading}
                style={{
                  width: "100px",
                  height: "40px",
                  width: "130px"
                }}
                type="primary"
                shape="round"
                onClick={() => {
                  setCurrent(0);
                  setselected(null);
                  setcontrolStatusGeneral({
                    nextDisabled: true,
                    finish: false,
                  });
                  Cookies.remove("productid");
                  Cookies.remove("productname");
                  producto.reset()
                  attributes.reset()
                }}
              >
                Finalizar
              </Button>
            )}

            {rulesShowButtonNext(selected, current).btnprev && (
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  height: "40px",
                  width: "130px",
                  marginLeft: "10px",
                }}
                danger
                shape="round"
                onClick={() => prev()}
              >
                Regresar
              </Button>
            )}
          </div>
        </Card>
      </Row>
    </Content>
  );
};

const TipoDeProducto = (props) => {
  const producto = useProductStore()
  return (
    <div
      style={{
        width: "70vw",
        borderRadius: "12px",
        margin: 10,
        boxShadow: "1px 2px 2px 0px #cccccc",
        background: "#fff",
      }}
    >
      {props.selected === null && (
        <Row justify="center" style={{ marginTop: "40px" }}>
          <Space direction="vertical">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/product-5806313-4863042.png"
              alt=""
              style={{
                width: "100px",
                height: "100px",
              }}
            />
              <Select
                placeholder={`Selecciona un tipo de producto ${producto.type}`}
                onChange={(value) => {
                  props.handleselectproductype(value);
                  props.setcontrolStatusGeneral({
                    nextDisabled: false,
                  });
                }}
                style={{
                  width: "auto",
                  height: "auto",
                  borderRadius: "12px",
                  backgroundColor: "#F29F05",
                  fontFamily: "Roboto",
                  fontSize: "19px",
                  color: "white",
                }}
              >
                <Option style={{ fontSize: "19px" }} value="1">
                  {producto.type} Simple
                </Option>
                <Option style={{ fontSize: "19px" }} value="2">
                  {producto.type} Variante
                </Option>
              </Select>
          </Space>
        </Row>
      )}

      <Row
        justify="center"
        style={{
          marginTop: "5vh",
        }}
      >
        {props.selected != null && (
          <Space direction="vertical">
            <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
              {`Tipo de ${producto.type} a crear`}
            </Text>
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/product-5806313-4863042.png"
              alt=""
              style={{
                width: "100px",
                height: "100px",
              }}
            />
            <Tag
              closable
              onClose={() => {
                props.handleselectproductype(null);
                props.setcontrolStatusGeneral({
                  nextDisabled: true,
                });
              }}
              style={{
                fontFamily: "Roboto",
                fontSize: "19px",
                background: "#F29F05",
                padding: "10px",
                border: "none",
                color: "white",
              }}
              color="blue"
            >
              {props.selected === "1" ? `${producto.type} Simple` : `${producto.type} variable`}
            </Tag>
          </Space>
        )}
      </Row>
    </div>
  );
};

const RenderTypeProduct = ({ selected, addProductSimple }) => {
  return (
    <>
      {selected === "1" ? (
        <ProductSimple addProductSimple={addProductSimple} />
      ) : (
        <ProductoVariante addProductSimple={addProductSimple} />
      )}
    </>
  );
};
