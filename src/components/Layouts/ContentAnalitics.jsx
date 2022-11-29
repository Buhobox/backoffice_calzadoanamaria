import { Layout, Row, Col, DatePicker,  Button, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { CardAnalitics } from "../Cards/CardAnalitics";
import { BarGrafico } from "../charts/Bar/";
import { DonaGrafico } from "../charts/Torta/";
import { getCustomerOrders, getAllOrdersWhosales } from "../../api/api";
import { SearchOutlined,RestOutlined} from "@ant-design/icons";
import {
  AmounTotal,
  TotaltoMoneyCop,
  PorcentajesTotal,
} from "../../utils/utils";
const { Content } = Layout;

export const ContentAnalitics = () => {
  const [sumPorMayor, setsumPorMayor] = useState(0);
  const [sumDetal, setsumDetal] = useState(0);
  const [formaterdetal, setformaterdetal] = useState(0);
  const [formatermayor, setformatermayor] = useState(0);
  const [initialdate, setinitialdate] = useState();
  const [finishdate, setfinishdate] = useState();
  const [isButtondisabled, setisButtondisabled] = useState(true);
  const [bandera, setbandera] = useState(false);
  const [loading, setloading] = useState(true);

  let arraygeneral = [];
  let datamayorista = [];

  useEffect(() => {
    let limite = 1;
    let limitemay = 1;

    for (let i = 1; i < 100; i++) {
      getCustomerOrders(i).then((response) => {
        limite++;
        if (response.data && response.data.length > 0 && limite <= 100) {
          arraygeneral.push(...response.data);
        }

        if (limite == 100) {
          setloading(false);
          // console.log("aha", arraygeneral);
          setsumDetal(AmounTotal(arraygeneral));
          setformaterdetal(TotaltoMoneyCop(AmounTotal(arraygeneral)));
        }
      });
    }

    for (let i = 1; i < 100; i++) {
      getAllOrdersWhosales(i).then((response) => {
        limitemay++;
        if (response.data && response.data.length > 0 && limitemay <= 100) {
          datamayorista.push(...response.data);
        }

        if (limitemay == 100) {
          setloading(false);
          // console.log("aja mayorista", datamayorista);
          setsumPorMayor(AmounTotal(datamayorista));
          setformatermayor(TotaltoMoneyCop(AmounTotal(datamayorista)));
        }
      });
    }

    //  console.log(getCustomerOrders())
    // console.log("aja");
    // getAllOrdersWhosales().then((response) => {
    //   setsumPorMayor(AmounTotal(response));
    //   setformatermayor(TotaltoMoneyCop(AmounTotal(response)));
    // });

    // getCustomerOrders().then((response) => {
    //   console.log(response)

    //   setsumDetal(AmounTotal(response));
    //   setformaterdetal(TotaltoMoneyCop(AmounTotal(response)));
    // });
  }, []);

  // useEffect(() => {
  //   if(arraygeneral.length>0)console.log("holoa")
  //   console.log("arraygeneral", arraygeneral);
  // }, [arraygeneral]);

  useEffect(() => {
    habilitarboton();
  }, [initialdate, finishdate]);

  const HangleChangeFiltersInitial = (date, dateString) => {
    let datestructuring = dateString ? `${dateString}T00:00:00` : null;
    setinitialdate(datestructuring);
  };

  const HangleChangeFiltersFinish = (date, dateString) => {
    let datestructuring = dateString ? `${dateString}T00:00:00` : null;
    setfinishdate(datestructuring);
  };

  function habilitarboton() {
    // console.log(initialdate, finishdate);
    if (initialdate && finishdate) {
      setisButtondisabled(false);
    } else {
      setisButtondisabled(true);
    }
  }

  function HandleFiltrar() {
    console.log("--HANDLE filtrar--");
    // getAllOrdersWhosales(initialdate, finishdate).then((response) => {
    //   setsumPorMayor(AmounTotal(response));
    //   setformatermayor(TotaltoMoneyCop(AmounTotal(response)));
    // });
  }

  function HandleReset() {
    console.log("--HANDLE RESET--");
    setinitialdate(undefined);
    setfinishdate(undefined);
    setisButtondisabled(true);
    setbandera(!bandera);
  }

  const VentasDetalvsMayor = {
    labels: [`${formatermayor}`, `${formaterdetal}`],
    title: "Mayorista VS Detal",
    data: [sumPorMayor, sumDetal],
    colors: ["#7AB0AB", "#DCB7B1"],
  };

  const VentasDona = {
    labels: ["Mayorista", "Detal"],
    title: "Mayorista VS Detal",
    percent: PorcentajesTotal(sumPorMayor, sumDetal),
    colors: ["#7AB0AB", "#DCB7B1"],
  };

  return (
    <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
      <Row
        className="filterContent"
        justify="center"
        style={{ marginBottom: "20px" }}
      >
        <Col xs={24} sm={4} md={6} lg={8} xl={1} style={{ margin: 10 }}>
          <h1 style={{color:"#95AFAF", fontSize:'20px'}}>
            <strong>Filtros</strong>
          </h1>
        </Col>

        <Col xs={24} sm={4} md={6} lg={8} xl={3} style={{ margin: 10 }}>
          <DatePicker
            placeholder="Fecha inicial"
            bordered
            onChange={HangleChangeFiltersInitial}
          />
        </Col>

        <Col xs={24} sm={4} md={6} lg={8} xl={3} style={{ margin: 10 }}>
          <DatePicker
            placeholder="Fecha final"
            bordered
            onChange={HangleChangeFiltersFinish}
          />
        </Col>

        <Col xs={24} sm={4} md={6} lg={8} xl={1} style={{ margin: 10 }}>
          <Button
            onClick={() => HandleFiltrar()}
            disabled={isButtondisabled}
            type="primary"
            shape="round"
            icon={<SearchOutlined />}
          >
            Filtrar
          </Button>
        </Col>

     

        <Col xs={24} sm={4} md={6} lg={8} xl={1} style={{ margin: 10 }}>
          <Button
            onClick={() => HandleReset()}
            type="primary"
            shape="round"
            icon={<RestOutlined />}
            style={{backgroundColor:"#7AB0AB !important"}}
          >
            Borrar filtros
          </Button>
        </Col>
      </Row>

      <Row justify="center">
        <Col xs={24} sm={4} md={6} lg={8} xl={4}>
          <Skeleton loading={loading} active avatar>
            <CardAnalitics
              title="Mayorista VS Detal"
              content={<BarGrafico databar={VentasDetalvsMayor} />}
            />
          </Skeleton>
        </Col>
        <Col xs={24} sm={4} md={6} lg={8} xl={4}>
          <Skeleton loading={loading} active avatar>
            <CardAnalitics
              title="(%) Mayorista VS (%) Detal"
              content={<DonaGrafico databar={VentasDona} />}
            />
          </Skeleton>
        </Col>
      </Row>
    </Content>
  );
};
