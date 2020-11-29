import React from "react";
import "./Hideable.css";

export function Hideable({ visible, children }) {
  return <div className={`Hideable${visible ? "" : " Hideable--hidden"}`}>{children}</div>;
}
