import classes from './PopupContent.module.css'
import React from "react";
import { FaCar } from "react-icons/fa";

const PopupContent = ({ timeInHours, distanceInKm }) => {
  return (
    <div className={classes.container}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", paddingBottom: "5px", color: "green", fontWeight:"bold"}}>
        <FaCar style={{ width: "20px", height: "20px", color: "#0079ff" }} />
        <span>{timeInHours} hrs</span>
      </div>
      <div>
        <span>{distanceInKm} kms</span>
      </div>
    </div>
  );
};

export default PopupContent;
