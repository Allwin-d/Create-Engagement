import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type EngagementRecord = {
  EngagementOwner?: string;
  Speaker?: string;
  Caterer?: string;
  Cohost?: string;
  createdAt?: string;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  timezone?: string;
};

const EngagementReview = () => {
  const [records, setRecords] = useState<EngagementRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("engagementFull");
    if (saved) {
      let parsed: EngagementRecord[] = [];

      try {
        const temp = JSON.parse(saved);

        if (Array.isArray(temp)) {
          parsed = temp;
        } else if (temp && typeof temp === "object") {
          parsed = [temp];
        }
      } catch (err) {
        console.error("Error parsing engagement data", err);
      }

      const updated = parsed.map((rec) =>
        rec.createdAt ? rec : { ...rec, createdAt: new Date().toISOString() }
      );

      localStorage.setItem("engagementFull", JSON.stringify(updated));
      setRecords(updated);
    }
  }, []);

  if (!records.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No engagement data found.
      </div>
    );
  }

  function formatDate(date: string | null | undefined, tz?: string) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: tz,
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-2xl p-8 space-y-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Engagement Review
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Review all saved engagement records before final confirmation.
        </p>

        {/* Column Table Format */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">Engagement Owner</th>
                <th className="px-4 py-3 border">Speaker</th>
                <th className="px-4 py-3 border">Caterer</th>
                <th className="px-4 py-3 border">Cohost</th>
                <th className="px-4 py-3 border">Created At</th>
                <th className="px-4 py-3 border text-blue-600">Primary</th>
                <th className="px-4 py-3 border">Secondary</th>
                <th className="px-4 py-3 border">Tertiary</th>
                <th className="px-4 py-3 border">Timezone</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
              {records.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border text-center">{index + 1}</td>
                  <td className="px-4 py-3 border">
                    {data.EngagementOwner || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">{data.Speaker || "N/A"}</td>
                  <td className="px-4 py-3 border">{data.Caterer || "N/A"}</td>
                  <td className="px-4 py-3 border">{data.Cohost || "N/A"}</td>
                  <td className="px-4 py-3 border">
                    {formatDate(data.createdAt, data.timezone)}
                  </td>
                  <td className="px-4 py-3 border text-blue-600 font-semibold">
                    {formatDate(data.primary, data.timezone)}
                  </td>
                  <td className="px-4 py-3 border">
                    {formatDate(data.secondary, data.timezone)}
                  </td>
                  <td className="px-4 py-3 border">
                    {formatDate(data.tertiary, data.timezone)}
                  </td>
                  <td className="px-4 py-3 border">{data.timezone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
