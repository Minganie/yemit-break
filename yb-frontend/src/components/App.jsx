import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import NavBar from "./NavBar/NavBar";
import Sheet from "./Sheet";
import Toons from "./Toons";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/sheets">
          <Sheet />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="*">
          <Toons toons={[]} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
