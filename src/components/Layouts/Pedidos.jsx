import { Layout, Row, Col, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { CardInfo } from "../Cards/CardInfo";
import { getReportsTotal } from "../../api/api";
import { imagesutils } from "../../utils/utils";
const { Content } = Layout;

export const Pedidos = () => {
  const [datareports, setdatareports] = useState([]);
  const [active, setactive] = useState(true);

  useEffect(() => {
    getReportsTotal().then((res) => {
      setdatareports(res.data);
      console.log("reports", res.data);
      setactive(false);
    });
  }, []);

  return (
    <>
      {datareports && datareports.length > 0 ? (
        <Content className="containerPersonalized">
          <Row justify="center">
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[0].name}
                  content={datareports[0].total}
                  imagen={imagesutils.pending}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[1].name}
                  content={datareports[1].total}
                  imagen={imagesutils.processing}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[2].name}
                  content={datareports[2].total}
                  imagen={imagesutils.onhold}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[3].name}
                  content={datareports[3].total}
                  imagen={imagesutils.completed}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[4].name}
                  content={datareports[4].total}
                  imagen={imagesutils.cancelled}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[5].name}
                  content={datareports[5].total}
                  imagen={imagesutils.rembolsado}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[6].name}
                  content={datareports[6].total}
                  imagen={imagesutils.failed}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[7].name}
                  content={datareports[7].total}
                  imagen={imagesutils.sendwholesaler}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>

            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[8].name}
                  content={datareports[8].total}
                  imagen={imagesutils.faltante}
                  extrainfo="Pedidos"
                />
              </Skeleton>
            </Col>
            <Col className="gutter-row" span={6} xs={24} sm={10} md={10}>
              <Skeleton loading={false} active avatar>
                <CardInfo
                  title={datareports[9].name}
                  content={datareports[9].total}
                  imagen={imagesutils.enviado}
                  extrainfo="Pedidos"
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
