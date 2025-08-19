import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EngagementReview = () => {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("engagementFull");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Add created timestamp if not present
      if (!parsed.createdAt) {
        parsed.createdAt = new Date().toISOString();
        localStorage.setItem("engagementFull", JSON.stringify(parsed));
      }
      setData(parsed);
    }
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No engagement data found.
      </div>
    );
  }

  function formatDate(date: string | null | undefined) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: data.timezone,
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Engagement Review
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Review the engagement details before final confirmation.
        </p>

        {/* Engagement Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Engagement Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <span className="font-medium">Engagement Owner:</span>
            <span>{data.EngagementOwner}</span>

            <span className="font-medium">Speaker:</span>
            <span>{data.Speaker}</span>

            <span className="font-medium">Caterer:</span>
            <span>{data.Caterer}</span>

            <span className="font-medium">Cohost:</span>
            <span>{data.Cohost}</span>

            <span className="font-medium">Created At:</span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
        </div>

        {/* Date & Time Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Date & Time Selections
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <span className="font-medium text-blue-600">Primary:</span>
            <span className="text-blue-600 font-semibold">
              {formatDate(data.primary)}
            </span>

            <span className="font-medium">Secondary:</span>
            <span>{formatDate(data.secondary)}</span>

            <span className="font-medium">Tertiary:</span>
            <span>{formatDate(data.tertiary)}</span>

            <span className="font-medium">Timezone:</span>
            <span>{data.timezone}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngagementReview;
