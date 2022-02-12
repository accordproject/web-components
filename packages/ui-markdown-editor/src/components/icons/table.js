import React from "react";

/**
 * Renders the icon for Table in svg format.
 *
 * @returns {HTMLOrSVGElement} SVG for the Table icon
 */
const icon = () => (
  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <path
      d="M0,37.215v55v15v300.57h445v-300.57v-15v-55H0z M276.667,277.595H168.333v-70.19h108.334V277.595z M306.667,207.405H415
	v70.19H306.667V207.405z M276.667,307.595v70.19H168.333v-70.19H276.667z M30,207.405h108.333v70.19H30V207.405z M168.333,177.405
	v-70.19h108.334v70.19H168.333z M138.333,107.215v70.19H30v-70.19H138.333z M30,307.595h108.333v70.19H30V307.595z M306.667,377.785
	v-70.19H415v70.19H306.667z M415,177.405H306.667v-70.19H415V177.405z"
      fill="#949CA2"
      fillRule="nonzero"
    />
  </g>
);

const table = {
  type: "table",
  label: `Insert table`,
  height: "25px",
  width: "25px",
  padding: "4px",
  viewBox: "0 0 445 445",
  icon,
};

export default table;
