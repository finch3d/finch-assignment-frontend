import React, { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./input.module.css";

function Input({ label, placeholder, onSubmit }) {
  let [value, setValue] = useState(placeholder);
  let [focus, setFocus] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(value);
  }

  useEffect(() => {
    setValue(placeholder);
  }, [placeholder]);

  let unSaved = placeholder !== value;

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label>
        <span
          className={classnames(styles.label, { [styles.activeLabel]: focus })}
        >
          {label}:
        </span>
        <input
          size=""
          className={styles.input}
          value={value}
          type="number"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(event) => setValue(event.target.value)}
        ></input>
        <div
          className={classnames(styles.line, { [styles.activeLine]: focus })}
        />
      </label>
      <input
        className={styles.button}
        type="submit"
        disabled={!unSaved}
        value={"Update"}
      />
    </form>
  );
}

export default Input;
