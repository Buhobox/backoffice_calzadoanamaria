import { Card, Avatar } from "antd";
import styles from "./cards.module.css";

const { Meta } = Card;

export const CardInfo = (props) => {

  return (
    <Card
      className={styles.cardsApp}
      bordered={true}
      style={{ width: 300, marginTop: 16 }}
    >
      <Meta
        avatar={
          <Avatar src={props.imagen} />
        }
        title={props.title}
        description={`${props.content} ${props.extrainfo}`}
      />
    </Card>
  );
};
