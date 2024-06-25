import React, { createContext, useContext, useState } from "react";

const CoordinatesContext = createContext();

export const CoordinatesProvider = ({ children }) => {
  const [originCoordinates, setOriginCoordinates] = useState([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState([]);
  const [stopCoordinates, setStopCoordinates] = useState([]);
  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [stopNames, setStopNames] = useState([]);
  const [showPath, setShowPath] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetching, setIsFetching] = useState(false);

  return (
    <CoordinatesContext.Provider
      value={{
        originCoordinates,
        setOriginCoordinates,
        destinationCoordinates,
        setDestinationCoordinates,
        stopCoordinates,
        setStopCoordinates,
        originName,
        setOriginName,
        destinationName,
        setDestinationName,
        stopNames,
        isFetching,
        setIsFetching,
        setStopNames,
        showPath,
        setShowPath,
        distance,
        setDistance,
        isLoading,
        setIsLoading, 
      }}
    >
      {children}
    </CoordinatesContext.Provider>
  );
};

export const useCoordinates = () => useContext(CoordinatesContext);
