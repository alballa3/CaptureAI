import { Route, Routes } from "react-router";
import Overlay from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/screen" element={<Overlay />} />
    </Routes>
  )
}