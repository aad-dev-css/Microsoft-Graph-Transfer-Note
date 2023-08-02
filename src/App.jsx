import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Feedback from "./pages/Feedback";
import Roadmap from "./pages/Roadmap";
import KnownIssues from "./pages/KnownIssues";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/knownissues" element={<KnownIssues />} />
    </Routes>
  );
}
