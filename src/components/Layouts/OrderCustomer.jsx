import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Spin, Space, Input, message } from "antd";
import { getCustomerOrdersEnviados, getOrderById } from "../../api/api";
import { GenerateFactura } from "../../api/utils";
import { useFirestore } from "reactfire";
import { toast } from "react-toastify";

export const OrderCustomerClient = () => {
  const [dataSourceCustomer, setdataSourceCustomer] = useState(null);
  const [banderaload, setbanderload] = useState(false);
  const [loading, setloading] = useState(false);
  const [searchOrderNumber, setsearchOrderNumber] = useState();
  const db = useFirestore();
  const statustoFacturar = [
    "procesadoig",
    "procesadowasa",
    "procesadomayo",
    "processing",
  ];

  function handleCancelarBusqueda() {
    setbanderload(!banderaload);
    setsearchOrderNumber(null);
  }

  function handleBuscar(orderId) {
    message.loading({ content: "Buscando orden...", key: "loading" });
    getOrderById(orderId).then((response) => {
      if (statustoFacturar.includes(response.data.status)) {
        if (response.ok) {
          let arraytem = [];
          arraytem.push(response.data);
          setdataSourceCustomer(arraytem);
        } else {
          setbanderload(!banderaload);
          message.error({ content: "No se encontro la orden", key: "error" });
        }
      } else {
        message.error({
          content: `No puede facturar esta orden, esta orden se encuentra ${response.data.status}`,
          key: "error",
        });
      }
    });
  }

  const CreateOrderRealTime = (orderId) => {
    //db.collection("orders").add({ id: orderId, status: "pending" });
    db.collection("orders")
      .doc(orderId.toString())
      .set({ id: orderId, status: "pending" });
  };

  const DeleteOrderCompleted = (orderId) => {
    db.collection("orders").doc(orderId.toString()).delete();
    setdataSourceCustomer(
      dataSourceCustomer.filter((data) => data.id !== orderId)
    );
  };

  function validarOrdenesFacturadas(orderId) {
    toast.configure();


    var docRef = db.collection("orders").doc(orderId.toString());

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          toast.info(
            "Atencion!, Esta factura ya esta siendo procesada para facturar!",
            {
              autoClose: false,
            }
          );
          setdataSourceCustomer(
            dataSourceCustomer.filter((data) => data.id !== orderId)
          );
        } else {
          getOrderById(orderId).then((response) => {
            if (
              response.data.status === "facturado" ||
              response.data.status === "facturadoig" ||
              response.data.status === "facturadomayo" ||
              response.data.status === "facturadowasa"
            ) {
              toast.error(`Atencion!, Esta orden ya ha sido facturada!`, {
                autoClose: false,
              });
              setdataSourceCustomer(
                dataSourceCustomer.filter((data) => data.id !== orderId)
              );
            } else {
              CreateOrderRealTime(orderId);
              GenerateFactura(response.data, DeleteOrderCompleted);
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

   
     
  }

  const columns = [
    {
      title: "Numero de orden",
      dataIndex: "number",
      key: "number",
      render: (text, record) => (
        <Tag color="green" key={record}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Metodo de pago",
      dataIndex: "payment_method_title",
      key: "payment_method_title",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <>
          {text === "processing" ? (
            <Tag color="green" key={record}>
              PEDIDO WEB
            </Tag>
          ) : text === "procesadowasa" ? (
            <Tag color="blue" key={record}>
              PEDIDO WHATSAPP
            </Tag>
          ) : text === "procesadoig" ? (
            <Tag color="red" key={record}>
              PEDIDO INSTAGRAM
            </Tag>
          ) : text === "procesadomayo" ? (
            <Tag color="yellow" key={record}>
              PEDIDO MAYORISTA
            </Tag>
          ) : (
            text === "facturado" && (
              <Tag color="green" key={record}>
                FACTURADO
              </Tag>
            )
          )}
        </>
      ),
    },

    {
      title: "Accion",
      key: "action",
      render: (text, record) => (
        <>
          {text.status !== "facturado" &&
            text.status !== "facturadoig" &&
            text.status !== "facturadomayo" &&
            text.status !== "facturadowasa" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  validarOrdenesFacturadas(text.id);
                }}
                type="primary"
                shape="round"
              >
                FACTURAR
              </Button>
            )}
        </>
      ),
    },
  ];

  useEffect(() => {
    setloading(true);
    getCustomerOrdersEnviados().then((res) => {
      setdataSourceCustomer(res.data);
    });
    setloading(false);
  }, []);

  useEffect(() => {
    setloading(true);
    setdataSourceCustomer([]);
    getCustomerOrdersEnviados().then((res) => {
      setdataSourceCustomer(res.data);
    });
    setloading(false);
  }, [banderaload]);


  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space style={{ margin: 10 }} orientation="horizontal">
            <Input
              value={searchOrderNumber}
              onChange={(e) => setsearchOrderNumber(e.target.value)}
              required={true}
              style={{ fontSize: "20px", borderRadius: "5px" }}
              placeholder="Número de orden"
            />

            <Button
              onClick={() => handleBuscar(searchOrderNumber)}
              disabled={searchOrderNumber ? false : true}
              type="primary"
              shape="round"
            >
              Buscar Orden
            </Button>

            <Button
              onClick={() => handleCancelarBusqueda()}
              disabled={searchOrderNumber ? false : true}
              type="danger"
              shape="round"
            >
              Cancelar
            </Button>
          </Space>

          <Table dataSource={dataSourceCustomer} columns={columns} />
        </>
      )}
    </div>
  );
};
