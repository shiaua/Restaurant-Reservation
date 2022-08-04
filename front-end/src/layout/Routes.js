import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./menuComponents/Dashboard";
import CreateReservation from "./menuComponents/CreateReservation";
import Seat from "./menuComponents/reservationComponents/Seat";
import EditReservation from "./menuComponents/reservationComponents/EditReservation";
import CreateTable from "./menuComponents/CreateTable";
import Search from "./menuComponents/Search";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:resId/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:resId/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;