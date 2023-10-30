import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";

import BookingCalendar2 from "./components/BookingCalendar2"
import ManageBookings from "./components/ManageBookings";
import ManageSpots from "./components/ManageSpots";
import Navigation from "./components/Navigation";
import SpotBookingCreate from "./components/SpotBookingCreate"
import SpotBookingUpdate from "./components/SpotBookingUpdate"
import SpotCreate from "./components/SpotCreate";
import SpotDetails from "./components/SpotDetails";
import SpotEdit from "./components/SpotEdit";
import SpotList from "./components/SpotList";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() =>
      {setIsLoaded(true);
      history.push("/")});
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/spots/:spotId/bookings/:bookingId/edit" component={SpotBookingUpdate} />
        <Route exact path="/spots/:id/bookings/new" component={SpotBookingCreate} />
        <Route exact path="/spots/:id/edit" component={SpotEdit} />
        <Route exact path="/bookings/current" component={ManageBookings} />
        <Route exact path="/spots/current" component={ManageSpots} />
        <Route exact path="/spots/new" component={SpotCreate} />
        <Route exact path="/calendar2" component={BookingCalendar2} />
        <Route exact path="/spots/:id" component={SpotDetails} />
        <Route exact path="/" component={SpotList} />
      </Switch>}
    </>
  );
}

export default App;
