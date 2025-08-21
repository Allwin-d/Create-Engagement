import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const EngagementDetailsForm = () => {
  const [details, setDetails] = useState({
    EngagementOwner: "",
    Speaker: "",
    Caterer: "",
    Cohost: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !details.EngagementOwner ||
      !details.Speaker ||
      !details.Caterer ||
      !details.Cohost
    ) {
      alert("All text fields are required");
      return;
    }

    const saved = localStorage.getItem("engagementFull");
    let records = [];
    if (saved) {
      try {
        records = JSON.parse(saved);
        if (!Array.isArray(records)) {
          records = [records];
        }
      } catch {
        records = [];
      }
    }

    const newRecord = {
      ...details,
      createdAt: new Date().toISOString(),
    };
    const updatedRecords = [...records, newRecord];

    localStorage.setItem("engagementFull", JSON.stringify(updatedRecords));

    navigate("/datepicker");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Engagement Details
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Please provide the details of the engagement. All fields are required.
        </p>

        {/* Engagement Owner */}
        <InputField
          label="Engagement Owner *"
          name="EngagementOwner"
          type="text"
          value={details.EngagementOwner}
          onChange={handleChange}
          placeholder="Enter Engagement Owner"
          required
        />

        {/* Speaker */}
        <InputField
          label="Speaker *"
          name="Speaker"
          type="text"
          value={details.Speaker}
          onChange={handleChange}
          placeholder="Enter Speaker Name"
          required
        />

        {/* Caterer */}
        <InputField
          label="Caterer *"
          name="Caterer"
          type="text"
          value={details.Caterer}
          onChange={handleChange}
          placeholder="Enter Caterer"
          required
        />

        {/* Cohost */}
        <InputField
          label="Cohost *"
          name="Cohost"
          type="text"
          value={details.Cohost}
          onChange={handleChange}
          placeholder="Enter Cohost"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-4 py-3 rounded-lg shadow-md"
        >
          Next: Select Date & Time
        </button>
      </form>
    </div>
  );
};

export default EngagementDetailsForm;
