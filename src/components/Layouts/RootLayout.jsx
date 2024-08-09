import React from "react";
import { Layout, Menu, Button, Row, Col, Drawer } from "antd";
import {
  BarChartOutlined,
  PieChartOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { ColorsGeneral } from "../../utils/utils";
import Facturacion from "./Facturacion";
import { VentasHoy } from "./VentasToday";
import { useState } from "react";
import { Typography } from "@material-ui/core";
import "firebase/auth";
import { useFirebaseApp } from "reactfire";
import Logo from "../../Assets/img/logo.png";
import { LayoutProducto } from "./LayoutProducto";

const { Header, Sider } = Layout;

export default function RootLayout() {
  const [contentab, setcontentab] = useState(2);
  let fb = useFirebaseApp();
  let History = useHistory();
  const [visibledrawer, setvisibledrawer] = useState(false);

  const HandleChange = (item) => {
    console.log(item.key);
    if (parseInt(item.key) === 4) {
      Logout();
    } else {
      // console.log(item.key);
      setcontentab(parseInt(item.key));
    }
  };

  const Logout = () => {
    fb.auth()
      .signOut()
      .then(() => {
        History.push("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  function onClosedrawer() {
    setvisibledrawer(false);
  }

  function onShowdrawer() {
    setvisibledrawer(true);
  }

  const titles = [
    "nothing",
    "Reporte de ventas",
    "Creación de productos/servicios",
    "Reporte Diario",
  ];

  return (
    <Layout>
      <Sider
        className="siderLayout"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          backgroundColor: "white",
        }}
      >
        <div className="logo">
        <img src={Logo} alt="Santandereana de cascos" className="logo-img-dash" style={{ width: '200px', height: 'auto' }} />
        </div>
        <Menu
          onSelect={(item) => HandleChange(item)}
          mode="inline"
          defaultSelectedKeys={["2"]}
          style={{
            color: "#01A93C",
            fontWeight: "bold",
          }}
        >
          {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
            FACTURACION
          </Menu.Item> */}

          <Menu.Item key="2" icon={<RocketOutlined />}>
            GESTIÓN
          </Menu.Item>

          <Menu.Item key="4" icon={<LogoutOutlined />}>
            CERRAR SESIÓN
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          className="site-layout-background"
          style={{ padding: 0, backgroundColor: ColorsGeneral.mentacolor }}
        >
          <Row>
            <Col span={1} offset={2}>
              <Button
                id="buttonMenumobil"
                onClick={() => onShowdrawer()}
                icon={<MenuUnfoldOutlined />}
                type="primary"
                style={{ backgroundColor: "#01A93C !important" }}
              />
            </Col>

            <Col style={{ marginTop: 5 }} span={16} offset={2}>
              <Typography
                className="title-header-dash"
                style={{
                  fontSize: "27px",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {titles[contentab]}
              </Typography>
            </Col>
          </Row>

          <Drawer
            className="drawerMobil"
            placement="left"
            closable={false}
            onClose={() => onClosedrawer()}
            visible={visibledrawer}
          >
            <div className="logo">
              <img src={Logo} alt="Santandereana de cascos" className="logo-img-dash" />
            </div>
            <Menu
              onSelect={(item) => HandleChange(item)}
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{
                color: "#01A93C",
                fontWeight: "bold",
              }}
            >
              <Menu.Item key="1" icon={<BarChartOutlined />}>
                FACTURACION
              </Menu.Item>

              <Menu.Item key="2" icon={<RocketOutlined />}>
                GESTIÓN
              </Menu.Item>

              <Menu.Item key="4" icon={<LogoutOutlined />}>
                CERRAR SESIÓN
              </Menu.Item>
            </Menu>
          </Drawer>
        </Header>

        {contentab === 1 ? (
          <Facturacion />
        ) : contentab === 2 ? (
          <LayoutProducto />
        ) : (
          contentab === 3 && <VentasHoy />
        )}
      </Layout>
    </Layout>
  );
}
