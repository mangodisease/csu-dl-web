/* eslint-disable */
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import OCR from "./pages/OCR";
import Reports from "./pages/Reports";
import { useState } from "react";
import Login from "./pages/Login";

function App() {
  const location = useLocation()
  const [user, setuser] = useState(getCachedUser())
  function getCachedUser() {
    try {
      const l = localStorage.getItem("user")
      return JSON.parse(l)
    } catch (err) {
      console.log(err.message)
      return null
    }
  }
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={()=>{ return <Login setuser={setuser}/>}} />
        <Main>
          <Route exact path={"/OCR"} component={()=>{ return <OCR /> }} />
          <Route exact path="/reports" component={()=>{ return <Reports />}} />
          <Redirect from="*" to={user===null? "/": location.pathname}/>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
