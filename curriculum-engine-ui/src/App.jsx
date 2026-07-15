import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import CurriculumGenerator from "./pages/CurriculumGenerator";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/"
              element={<LandingPage />}
          />

          <Route
              path="/generate"
              element={<CurriculumGenerator />}
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;









