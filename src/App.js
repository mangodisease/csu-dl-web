import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import OCR from "./pages/OCR";

function App() {
  const location = useLocation()
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path={["/OCR", "/"]} component={()=>{ return <OCR /> }} />
          <Route exact path="/reports" component={()=>{ return <>On Development</>}} />
          <Redirect from="*" to={location.pathname}/>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
