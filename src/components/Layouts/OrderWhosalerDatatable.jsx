import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { getCustomerOrderssendwholesaler } from "../../api/api";
import { GenerateFactura } from "../../api/utils";

export const OrderWhosalerDatatable = () => {
  const [dataSourceWhosaler, setdataSourceWhosaler] = useState(null);
  const [banderaload, setbanderload] = useState(false);

  function callback() {
    console.log("llamando callback");
    setbanderload(!banderaload);
  }

  const columns = [
    {
      title: "Numero de orden",
      dataIndex: "number",
      key: "number",
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
        <Tag color="red" key={record}>
          POR FACTURAR
        </Tag>
      ),
    },

    {
      title: "Accion",
      key: "number",
      render: (text, record) => (
        <Button
          onClick={() => GenerateFactura(text, callback)}
          type="primary"
          shape="round"
        >
          Facturar
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getCustomerOrderssendwholesaler().then((response) => {
      setdataSourceWhosaler(response.data);
    });
  }, [banderaload]);

  useEffect(() => {
    getCustomerOrderssendwholesaler().then((response) => {
      setdataSourceWhosaler(response.data);
    });
  }, []);
  return (
    <div>
      <Table dataSource={dataSourceWhosaler} columns={columns} />
    </div>
  );
};
