import Home from "./components/pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyles from "./components/GlobalStyle";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/Profile";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "./contexts/AuthContext/AuthContext";
import { NotificationContainer } from "react-notifications";
import Manage from "./components/pages/Manage";
import VulnerableComponent from "./components/VunerablePage";

function App() {
  const { user } = useContext(AuthContext);
  const [rerenderFeed, setRerenderFeed] = useState(0);
  const handleChange = useCallback((newValue) => {
    setRerenderFeed(newValue);
  }, []);
  return (
      <>
        <GlobalStyles />
        <NotificationContainer />
        <BrowserRouter>
          <Routes>
            <Route
                path="/"
                element={
                  user ? (
                      <Home rerenderFeed={rerenderFeed} onChange={handleChange} />
                  ) : (
                      <Navigate to="/login" />
                  )
                }
            />
            <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : <Signup />}
            />
            <Route
                path="/manage"
                element={user ? (
                    <Manage />
                ) : (
                    <Navigate to="/login" />
                )}
            />
            <Route
                path="/profile/:username"
                element={
                  user ? (
                      <Profile rerenderFeed={rerenderFeed} onChange={handleChange} />
                  ) : (
                      <Navigate to="/login" />
                  )
                }
            />
              <Route
                  path="/vunerable"
                  element={<VulnerableComponent/>}
              />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
