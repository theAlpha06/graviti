import React, { useRef, useState } from "react";
import axios from "axios";
import { useCoordinates } from "../context/coordinates";
import ShowDistance from "../Distance/Distance";
import classes from "./InputForm.module.css";

const InputForm = () => {
  const {
    setOriginCoordinates,
    setDestinationCoordinates,
    setOriginName,
    setDestinationName,
    setStopCoordinates,
    setStopNames,
    isFetching,
    setIsFetching,
    setShowPath,
    isLoading,
    setIsLoading,
  } = useCoordinates();

  const originInputRef = useRef();
  const destinationInputRef = useRef();
  const stopInputRef = useRef();

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [showDistance, setShowDistance] = useState(false);

  const GEOAPIFY_API_KEY = "4b378c2986934cf79016b165ae2739cb";

  const fetchSuggestions = async (query) => {
    if (!query) return [];
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data.features.map((feature) => ({
        formatted: feature.properties.formatted,
        coordinates: feature.geometry.coordinates,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const handleSuggestionSelect = (type, suggestion) => {
    if (type === "origin") {
      originInputRef.current.value = suggestion.formatted;
      setOriginName(suggestion.formatted);
      setOriginCoordinates(suggestion.coordinates);
      setOriginSuggestions([]);
    } else if (type === "destination") {
      destinationInputRef.current.value = suggestion.formatted;
      setDestinationName(suggestion.formatted);
      setDestinationCoordinates(suggestion.coordinates);
      setDestinationSuggestions([]);
    } else if (type === "stop") {
      stopInputRef.current.value = suggestion.formatted;
      setStopCoordinates(suggestion.coordinates);
      setStopNames(suggestion.formatted);
      setStopSuggestions([]);
    }
    setShowDistance(false);
  };

  const handleInputChange = async (type, value) => {
    setIsLoading(true);
    const suggestions = await fetchSuggestions(value);
    if (type === "origin") {
      setOriginSuggestions(suggestions);
    } else if (type === "destination") {
      setDestinationSuggestions(suggestions);
    } else if (type === "stop") {
      setStopSuggestions(suggestions);
    }
    setShowDistance(false);
  };

  const handleCalculate = () => {
    let hasEmptyField = false;

    if (!originInputRef.current.value) {
      setOriginCoordinates([]);
      setOriginName("");
      hasEmptyField = true;
      alert("Please provide an origin.");
    }
    if (!destinationInputRef.current.value) {
      setDestinationCoordinates([]);
      setDestinationName("");
      hasEmptyField = true;
      alert("Please provide a destination.");
    }
    if (stopInputRef.current.value === "") {
      setStopCoordinates([]);
      setStopNames("");
    }

    if (hasEmptyField) {
      setShowPath(false);
      return;
    }

    setIsLoading(true); 
    setIsFetching(true);
    setShowPath(true);
    setShowDistance(true);
  };

  return (
    <>
      <div className={classes.content}>
        <div className={classes.form_container}>
          <div className={classes.input_group}>
            <label htmlFor="origin">Origin</label>
            <div className={classes.input_wrapper}>
              <input
                ref={originInputRef}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                type="text"
                id="origin"
                className={classes.input_with_icon}
              />
            </div>
            {originSuggestions.length > 0 && (
              <ul className={classes.suggestions_list}>
                {originSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionSelect("origin", suggestion)}
                    className={classes.suggestion_item}
                  >
                    {suggestion.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={classes.input_group}>
            <label htmlFor="stop">Add Stop</label>
            <div className={classes.input_wrapper}>
              <input
                ref={stopInputRef}
                onChange={(e) => handleInputChange("stop", e.target.value)}
                type="text"
                id="stop"
                className={classes.input_with_icon}
              />
            </div>
            {stopSuggestions.length > 0 && (
              <ul className={classes.suggestions_list}>
                {stopSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionSelect("stop", suggestion)}
                    className={classes.suggestion_item}
                  >
                    {suggestion.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className={classes.input_group}>
            <label htmlFor="destination">Destination</label>
            <div className={classes.input_wrapper}>
              <input
                ref={destinationInputRef}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                type="text"
                id="destination"
                className={classes.input_with_icon}
              />
            </div>
            {destinationSuggestions.length > 0 && (
              <ul className={classes.suggestions_list}>
                {destinationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleSuggestionSelect("destination", suggestion)
                    }
                    className={classes.suggestion_item}
                  >
                    {suggestion.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={classes.bnt_container}>
          <button
            type="button"
            className={classes.btn}
            onClick={handleCalculate}
            disabled={isFetching} 
          >
            {isFetching ? "Loading..." : "Calculate"}
          </button>
        </div>
      </div>
      {showDistance && !isLoading && <ShowDistance />}
    </>
  );
};

export default InputForm;
