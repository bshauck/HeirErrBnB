import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";

import ManageSpots from "./components/ManageSpots";
import Navigation from "./components/Navigation";
import SpotCreate from "./components/SpotCreate";
import SpotDetails from "./components/SpotDetails";
import SpotEdit from "./components/SpotEdit";
import SpotList from "./components/SpotList";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route path="/spots/:id/edit" component={SpotEdit} />
        <Route path="/spots/current" component={ManageSpots} />
        <Route path="/spots/new" component={SpotCreate} />
        <Route exact path="/spots/:id" component={SpotDetails} />
        <Route exact path="/" component={SpotList} />
      </Switch>
      }
    </>
  );
}

export default App;
