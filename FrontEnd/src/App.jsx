import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/HomePage";
import ProblemsPage from "./Pages/ProblemsPage";
import DashboardPage from "./Pages/DashBoardPage";

function App() {
  const { isSignedIn , isLoaded } = useUser();

  // * this will get rid of the flickering 
  if(!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> :  <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> :  <Navigate to="/" /> } />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{duration : 3000}} />
    </>
  );
}

export default App;
