import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GovSchemes from "./pages/GovSchemes";
import About from "./pages/About";
import RoofAIPage from "./pages/RoofAIPage";
import Support from "./pages/Support";
import SignUp from "./pages/SignUp";
import ContactUs from './components/ContactUs'
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Home2 /> : <Home />} />
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <LoginPage />}
        />
        {/* <Route path="/home" element={<Home2 />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/map-roof"
          element={authUser ? <RoofAIPage /> : <LoginPage />}
        />
        <Route
          path="/support"
          element={authUser ? <Support /> : <LoginPage />}
        />
        <Route
          path="/govschemes"
          element={authUser ? <GovSchemes /> : <LoginPage />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
