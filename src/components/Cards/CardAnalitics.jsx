import React from "react";
import { Card, Tag, Row } from "antd";
import styles from "./cards.module.css";
const { Meta } = Card;

export const CardAnalitics = (props) => {
  return (
    <Card className={styles.cardsApp} title={props.title} bordered={true}>
      <Row justify="center" style={{ marginBottom: 10 }}>
        <Tag color="#aa2e34">POR MAYOR</Tag>
        <Tag color="#DCB7B1">DETAL</Tag>
      </Row>
      {props.content}
    </Card>
  );
};
