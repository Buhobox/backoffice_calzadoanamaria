import { Card, Layout, Row } from "antd";
import { OrderCustomerClient } from "./OrderCustomer";
const { Content } = Layout;

const Facturacion = () => {
  const stylecard = {
    width: "70vw",
    borderRadius: "12px",
    margin: 10,
    boxShadow: "1px 2px 2px 0px #cccccc",
  };
  return (
    <>
      <Content
        style={{ marginLeft: "10vw", marginTop: "10px", overflow: "initial" }}
      >
        <Row justify="center">
          <Card
            style={stylecard}
            title="ORDENES POR FACTURAR"
          >
            <OrderCustomerClient />
          </Card>
        </Row>
      </Content>
    </>
  );
};

export default Facturacion;
