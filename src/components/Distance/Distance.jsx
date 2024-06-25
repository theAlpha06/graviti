import classes from "./Distance.module.css";
import { useCoordinates } from "../context/coordinates";

const ShowDistance = () => {
  const { distance, originName, destinationName } = useCoordinates();

  const formatDistance = (distance) => {
    if (distance !== undefined && distance !== null) {
      return new Intl.NumberFormat('en-IN').format(distance);
    }
    return "Calculating...";
  };

  return (
    <div className={classes.container}>
      <div className={classes.distance_container}>
        <p>Distance</p>
        <div className={classes.distance}>
          <h1>{distance ? `${formatDistance(distance)} kms` : "Calculating..."}</h1>
        </div>
      </div>
      <div className={classes.info}>
        The distance between <span className={classes.highlight}>{originName}</span> and{" "}
        <span className={classes.highlight}>{destinationName}</span> is{" "}
        <span className={classes.highlight}>{distance ? `${formatDistance(distance)} kms` : "Calculating..."}</span>
      </div>
    </div>
  );
};

export default ShowDistance;
