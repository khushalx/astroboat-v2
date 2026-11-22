import Image from "next/image";
import styles from "./moon.module.css";

export function MoonReference() {
  return <Image src="/textures/moon/reference.webp" width={1000} height={1000} priority unoptimized
    alt="NASA LRO surface reference showing the Moon's cratered near side; not the selected lunar phase."
    className={styles.reference} />;
}
