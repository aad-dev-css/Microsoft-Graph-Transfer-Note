import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Feedback from "./pages/Feedback";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}
