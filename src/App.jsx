import React, { useState } from "react";
import InputForm from "./components/InputForm/InputForm";
import Map from "./components/Map/Map";
import classes from "./App.module.css";

const App = () => {
  return (
    <div>
      <header className={classes["App-header"]}>
        <img src="/logo.png" alt="logo" width={100} />
      </header>
      <main className={classes.main_container}>
        <div className={classes.tagline}>
          <p>
            Let's calculate <span className={classes.highlight}>distance</span>{" "}
            from Google maps
          </p>
        </div>
        <section className={classes.container}>
          <div className={classes.form_container}>
            <InputForm />
          </div>
          <div className={classes.maps_container}>
            <Map />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
