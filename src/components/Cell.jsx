import React from "react";
import "../styles/Cells.css";

const Cell = ({
  value,
  readOnly,
  onChangeCell,
  onSelect,
  isSelected,
  highlight,
  isError,
}) => {
  const classNames = ["sudoku-cell"];
  if (readOnly) classNames.push("readonly");
  if (isSelected) classNames.push("selected");
  if (highlight?.row) classNames.push("highlight-row");
  if (highlight?.col) classNames.push("highlight-col");
  if (highlight?.block) classNames.push("highlight-block");
  if (highlight?.sameValue) classNames.push("highlight-same-value");
  if (isError) classNames.push('error');

  return (
    <input
      className={classNames.join(" ")}
      type="text"
      maxLength={1}
      value={value || ""}
      onFocus={onSelect}
      onClick={onSelect}
      onBlur={onSelect}
      onChange={(e) => {
        const val = e.target.value;
        if (/^[1-9]?$/.test(val)) onChangeCell(val);
      }}
      readOnly={readOnly}
    />
  );
};

export default Cell;
