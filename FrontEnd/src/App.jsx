import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/HomePage";
import ProblemsPage from "./Pages/ProblemsPage";

function App() {
  const { isSignedIn } = useUser();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{duration : 3000}} />
    </>
  );
}

export default App;
