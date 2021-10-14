import { BrowserRouter, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { DownloadTest } from "./components/DownloadTest";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { NoEmailVerified } from "./components/NoEmailVerified";
import { PrivateRoute } from "./components/PrivateRoute";
import { Signup } from "./components/Signup";
import { UpdateProfile } from "./components/UpdateProfile";
import { UpLoadTest } from "./components/UpLoadTest";
import { AuthProvider } from "./contexts/AuthProvider";
import { ForgotPassword } from "./contexts/ForgotPassword";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route path="/noemailverified" component={NoEmailVerified} />
          <Route path="/updateprofile" component={UpdateProfile} />
          <Route path="/uploadtest" component={UpLoadTest} />
          <Route path="/downloadtest" component={DownloadTest} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
