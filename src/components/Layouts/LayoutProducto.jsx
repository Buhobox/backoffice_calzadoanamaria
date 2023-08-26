import { Card, Row, Select, Space, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Steps, Button } from "antd";
import React, { useState } from "react";
import Text from "antd/lib/typography/Text";
import { Divider } from "@material-ui/core";
import { ProductoVariante } from "./ProductoVariante";
import { ProductSimple } from "./ProductSimple";
import { GetAllCategorys } from "../../api/api";
import { GetTokenProducto } from "../../api/utils";
import { ReviewProduct } from "./ReviewProduct";
import axios from "axios";
import Cookies from "js-cookie";
import { Atributes } from "./Atributes";
import { toast } from "react-toastify";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
const { Step } = Steps;
const { Option } = Select;
const baseurl =
  "https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/";

const customerkey = "ck_0e37d26500f4832b854f614a80b06c93ee8fe825";
const customersecret = "cs_ff52b60f771953c9a0e0281f7346ba05253b41ea";
const baseurlwc = "https://mentaoficial.com/wp-json/wc/v3";
let credentials = `consumer_key=${customerkey}&consumer_secret=${customersecret}`;

export const LayoutProducto = () => {
  const stylecard = {
    width: "70vw",
    borderRadius: "12px",
    margin: 10,
    boxShadow: "1px 2px 2px 0px #cccccc",
  };

  const [current, setCurrent] = React.useState(0);
  const [selected, setselected] = useState(null);
  const [controlStatusGeneral, setcontrolStatusGeneral] = useState({
    nextDisabled: true,
    loading: false,
  });
  const [attributesData, setattributesData] = useState([]);
  const [terminos, setterminos] = useState([]);

  const [controlAttT, setcontrolAttT] = useState({
    attributeSelected: null,
    termsSelected: [],
    data: [],
  });

  const knowName = (id) => {
    let name = "";
    categorys.forEach((category) => {
      if (category.id === id) {
        name = category.name;
      }
    });
    return name;
  };

  const [productSimple, setproductSimple] = useState({
    TipoProducto: 1,
    IdIva: 0,
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
      if (data) {
        let productotosave = {
          ...productSimple,
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
              wholesale_customer: productotosave.PrecioVentaConIva2,
            },
            categories: [
              {
                id: productotosave.IdCategoria,
              },
              {
                id: productotosave.IdSubCategoria,
              },
            ],
          };

          axios
            .post(baseurlwc + `/products?${credentials}`, {
              ...producttowc,
            })
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
          axios
            .post(baseurl + "GuardarProducto", {
              ...productotosave,
            })
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
                  sku: res.data.CodigoBarras,
                  type: selected === "2" ? "variable" : "simple",
                  regular_price: productotosave.PrecioVentaConIva1,
                  manage_stock: true,
                  status: "pending",
                  sale_price: productotosave.PrecioVentaConIva1,
                  stock_quantity: 0,
                  weight: productotosave.weight,
                  stock_status: "outofstock",
                  wholesale_price: {
                    wholesale_customer: productotosave.PrecioVentaConIva2,
                  },
                  categories: [
                    {
                      id: productotosave.IdCategoria,
                    },
                    {
                      id: productotosave.IdSubCategoria,
                    },
                  ],
                };

                axios
                  .post(baseurlwc + `/products?${credentials}`, {
                    ...producttowc,
                  })
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

  const handleProductSimple = (namefield, value) => {
    if (namefield === "IdCategoria" || namefield === "IdSubCategoria") {
      let name = namefield === "IdCategoria" ? "Categoria" : "SubCategoria";

      setproductSimple({
        ...productSimple,
        [namefield]: value,
        [name]: knowName(value),
      });
    } else if (namefield === "PrecioVentaConIva2") {
      setproductSimple({
        ...productSimple,
        [namefield]: value,
        PrecioVentaConIva3: value,
      });
    } else {
      setproductSimple({
        ...productSimple,
        [namefield]: value,
      });
    }
  };

  const [categorys, setcategorys] = useState([]);

  React.useEffect(() => {
    GetAllCategorys().then((res) => {
      setcategorys(res.data);
    });
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
      title: "Seleccionar Tipo Producto",
      content: (
        <TipoDeProducto
          handleselectproductype={handleselectproductype}
          selected={selected}
          setcontrolStatusGeneral={setcontrolStatusGeneral}
        />
      ),
    },
    {
      title: "Crear Producto",
      content: (
        <RenderTypeProduct
          selected={selected}
          handleProductSimple={handleProductSimple}
          productSimple={productSimple}
          categorys={categorys}
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
      title: "Seleccionar Tipo Producto",
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
          handleProductSimple={handleProductSimple}
          productSimple={productSimple}
          categorys={categorys}
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
          attributesData={attributesData}
          setattributesData={setattributesData}
          controlStatusGeneral={controlStatusGeneral}
          terminos={terminos}
          setterminos={setterminos}
          next={next}
          setcontrolAttT={setcontrolAttT}
          controlAttT={controlAttT}
          setcontrolStatusGeneral={setcontrolStatusGeneral}
        />
      ),
    },

    {
      title: "Variaciones",
      content: (
        <ProductoVariante
          productSimple={productSimple}
          handleProductSimple={handleProductSimple}
          categorys={categorys}
          addProductSimple={addProductSimple}
          variation={true}
          controlAttT={controlAttT}
        />
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
              ? "Gestionar Productos"
              : selected === "1"
              ? "Gestión producto simple"
              : "Gestión producto variable"
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
                }}
                type="primary"
                shape="round"
                onClick={() => {
                  setCurrent(0);
                  setproductSimple({
                    TipoProducto: 1,
                    IdIva: 0,
                  });
                  setselected(null);
                  setcontrolStatusGeneral({
                    nextDisabled: true,
                    finish: false,
                  });
                  Cookies.remove("productid");
                  Cookies.remove("productname");
                  setcontrolAttT({
                    attributeSelected: null,
                    data: [],
                    terminos: [],
                  });
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
              style={{
                width: "100px",
                height: "100px",
              }}
            />
            <Select
              placeholder="Seleccione un tipo de producto"
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
                backgroundColor: "#C7E9E9",
                fontFamily: "Roboto",
                fontSize: "19px",
                color: "grey",
              }}
            >
              <Option style={{ fontSize: "19px" }} value="1">
                Producto Simple
              </Option>
              <Option style={{ fontSize: "19px" }} value="2">
                Producto Variante
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
              Tipo de producto a crear
            </Text>
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/product-5806313-4863042.png"
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
                background: "#C7E9E9",
                padding: "10px",
                border: "none",
                color: "black",
              }}
              color="blue"
            >
              {props.selected === "1" ? "Producto Simple" : "Producto Variante"}
            </Tag>
          </Space>
        )}
      </Row>
    </div>
  );
};

const RenderTypeProduct = ({
  selected,
  productSimple,
  handleProductSimple,
  categorys,
  addProductSimple,
}) => {
  return (
    <>
      {selected === "1" ? (
        <ProductSimple
          productSimple={productSimple}
          handleProductSimple={handleProductSimple}
          categorys={categorys}
          addProductSimple={addProductSimple}
        />
      ) : (
        <ProductoVariante
          productSimple={productSimple}
          handleProductSimple={handleProductSimple}
          categorys={categorys}
          addProductSimple={addProductSimple}
        />
      )}
    </>
  );
};
