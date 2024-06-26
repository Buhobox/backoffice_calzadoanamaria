import { Layout, Row, Col, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { CardInfo } from "../Cards/CardInfo";
import { reportSalesToday } from "../../api/api";
import { imagesutils } from "../../utils/utils";
const { Content } = Layout;

export const VentasHoy = () => {
  const [active, setactive] = useState(true);
  const [datareports, setdatareports] = useState([]);

  useEffect(() => {
    reportSalesToday().then((res) => {
      console.log(res);
      setdatareports(res.data);
      setactive(false);
    });
  }, []);

  return (
    <>
      {datareports.length > 0 ? (
        <Content className="containerPersonalized">
          <Row justify="center">
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title="Venta total hoy"
                  content={`$${datareports[0].total_sales}`}
                  imagen={imagesutils.totalventas}
                  extrainfo=""
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title="Monto total Neto"
                  content={`$${datareports[0].net_sales}`}
                  imagen={imagesutils.ventasnetas}
                  extrainfo=""
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title="Monto total envios"
                  content={`$${datareports[0].total_shipping}`}
                  imagen={imagesutils.totalenvio}
                  extrainfo=""
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title="Ordenes totales"
                  content={`${datareports[0].total_orders}`}
                  imagen={imagesutils.countordenes}
                  extrainfo="Orden(es)"
                />
              </Skeleton>
            </Col>
          </Row>
        </Content>
      ) : (
        <Content style={{ margin: "24px 44px 0", overflow: "initial" }}>
          <Row justify="center">
            <Skeleton.Button active={active} size="large" shape="round" />
            <Skeleton.Button active={active} size="large" shape="round" />
            <Skeleton.Avatar active={active} size="large" shape="round" />
            <Skeleton.Input
              style={{ width: 200 }}
              active={active}
              size="large"
            />
          </Row>
        </Content>
      )}
    </>
  );
};
