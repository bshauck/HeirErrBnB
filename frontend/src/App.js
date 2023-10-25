import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";

import BookingCalendar from "./components/BookingCalendar"
import ManageBookings from "./components/ManageBookings";
import ManageSpots from "./components/ManageSpots";
import Navigation from "./components/Navigation";
import SpotBookingCreate from "./components/SpotBookingCreate"
import SpotCreate from "./components/SpotCreate";
import SpotDetails from "./components/SpotDetails";
import SpotEdit from "./components/SpotEdit";
import SpotList from "./components/SpotList";
import { restoreCSRF } from "./store/csrf";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  restoreCSRF()

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path="/spots/:id/bookings/new" component={SpotBookingCreate} />
        <Route exact path="/spots/:id/edit" component={SpotEdit} />
        <Route exact path="/bookings/current" component={ManageBookings} />
        <Route exact path="/spots/current" component={ManageSpots} />
        <Route exact path="/spots/new" component={SpotCreate} />
        <Route exact path="/spots/:id" component={SpotDetails} />
        <Route exact path="/calendar" component={BookingCalendar} />  // TODO: will be modal and not come from main switch
        <Route exact path="/" component={SpotList} />
      </Switch>
      }
    </>
  );
}

export default App;
