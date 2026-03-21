import Card from "@/components/Card/Card";
import styles from "./cardItems.module.css";

const CardItems = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </section>
  );
};

export default CardItems;
