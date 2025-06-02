import { Route, Routes } from "react-router";
import Overlay from "./pages";
import "./App.css"
import ModernSettings from "./pages/settings";
export default function App() {
  return (
    <Routes>
      <Route path="/screen" element={<Overlay />} />
      <Route path="/setting" element={<ModernSettings />} />
    </Routes>
  )
}