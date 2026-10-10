"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en segundos, para escalonar elementos de una misma fila. */
  delay?: number;
  as?: "div" | "li" | "article";
};

/**
 * Aparicion suave (sube y se desvanece) al entrar en pantalla. Da ritmo al
 * scroll, sobre todo en movil, donde no existen los efectos de hover.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
