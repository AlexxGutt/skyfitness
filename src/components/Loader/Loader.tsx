import styles from "./loader.module.css";

type LoaderProps = {
  text: string;
};

const Loader = ({ text = "" }: LoaderProps) => {
  return (
    <div className={styles.loader}>
      <span className={styles.text}>Загружаю {text ? `${text}` : ""}</span>
      <span className={styles.dots}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
};

export default Loader;
