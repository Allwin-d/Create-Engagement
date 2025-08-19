import { BrowserRouter, Routes, Route } from "react-router-dom";
import EngagementDetailsForm from "./pages/EngagementDetailsForm";
import EngagementDatePicker from "./pages/EngagementDatePicker";
import EngagementReview from "./pages/EngagementReview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EngagementDetailsForm />} />
        <Route path="/datepicker" element={<EngagementDatePicker />} />
        <Route path="/review" element={<EngagementReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
