import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons/lib/icons";
import { Row, Steps } from "antd";
import React from "react";
const { Step } = Steps;

export const ReviewProduct = ({ controlStatusGeneral }) => {
  return (
    <>
      <Row justify="center" style={{ marginTop: "10px" }}>
        <Steps direction="vertical" current={controlStatusGeneral.step}>
          <Step
            icon={
              controlStatusGeneral.step == 1 ? (
                <LoadingOutlined />
              ) : (
                <CheckCircleOutlined style={{ color: "green" }} />
              )
            }
            title="Obtener token"
            description={controlStatusGeneral.messagestep1}
          />
          <Step
            icon={
              controlStatusGeneral.step == 2 &&
              controlStatusGeneral.status == "loading" ? (
                <LoadingOutlined />
              ) : controlStatusGeneral.step !== 2 &&
                controlStatusGeneral.status == "success" ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : (
                controlStatusGeneral.step == 2 &&
                controlStatusGeneral.status == "error" && (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )
              )
            }
            title="Crear producto ARI"
            description={controlStatusGeneral.messagestep2}
          />
          <Step
            icon={
              controlStatusGeneral.step == 3 &&
              controlStatusGeneral.status == "loading" ? (
                <LoadingOutlined />
              ) : (
                controlStatusGeneral.step != 3 &&
                controlStatusGeneral.status == "success" && (
                  <CheckCircleOutlined style={{ color: "green" }} />
                )
              )
            }
            title="Crear Producto Menta"
            description={controlStatusGeneral.messagestep3}
          />
        </Steps>
      </Row>
    </>
  );
};
