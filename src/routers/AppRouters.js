import React from "react";
import Login from "../components/Login";
import { Dashboard } from "../components/Dashboard";
import "firebase/auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useUser } from "reactfire";

export default function AppRouters() {
  const user = useUser();
  return (
    <>
      <Router>
      {user.data == null ? <Redirect to="/login" /> : <Redirect to="/" />}

        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
