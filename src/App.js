import { Switch, Route, Redirect } from "react-router-dom";
import Tables from "./pages/Tables";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { useLocation } from "react-router-dom";
import OCR from "./pages/OCR";
import Test from "./pages/text";

function App() {
  const location = useLocation()
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path={["/OCR", "/"]} component={()=>{ return <OCR /> }} />
          <Route exact path={"/test"} component={()=>{ return <Test /> }} />
          <Route exact path="/reports" component={Tables} />
          <Redirect from="*" to={location.pathname}/>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
