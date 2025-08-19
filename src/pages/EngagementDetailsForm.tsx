import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    localStorage.setItem("engagementDetails", JSON.stringify(details));
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
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Engagement Owner <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="EngagementOwner"
            value={details.EngagementOwner}
            onChange={handleChange}
            placeholder="Enter Engagement Owner"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Speaker */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Speaker <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Speaker"
            value={details.Speaker}
            onChange={handleChange}
            placeholder="Enter Speaker Name"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Caterer */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Caterer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Caterer"
            value={details.Caterer}
            onChange={handleChange}
            placeholder="Enter Caterer"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Cohost */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Cohost <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Cohost"
            value={details.Cohost}
            onChange={handleChange}
            placeholder="Enter Cohost"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
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
