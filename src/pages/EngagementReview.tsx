import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";

type EngagementRecord = {
  EngagementOwner?: string;
  Speaker?: string;
  Caterer?: string;
  Cohost?: string;
  createdAt?: string;
  primary?: string;
  secondary?: string | null;
  tertiary?: string | null;
  timezone?: string;
};

const EngagementReview = () => {
  const [records, setRecords] = useState<EngagementRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    try {
      const full = localStorage.getItem("engagementFull");
      if (full) {
        const parsed = JSON.parse(full);
        const recordsArray = Array.isArray(parsed) ? parsed : [parsed];

        // Ensure all records have required fields
        const updatedRecords = recordsArray.map((rec: EngagementRecord) => ({
          ...rec,
          createdAt: rec.createdAt || new Date().toISOString(),
        }));

        setRecords(updatedRecords);
      }
    } catch (err) {
      console.error("Error parsing engagement data", err);
    }
  };

  const deleteRecord = (index: number) => {
    if (confirm("Are you sure you want to delete this engagement record?")) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
      localStorage.setItem("engagementFull", JSON.stringify(updatedRecords));
    }
  };

  const clearAllRecords = () => {
    if (confirm("Are you sure you want to delete ALL engagement records?")) {
      setRecords([]);
      localStorage.removeItem("engagementFull");
    }
  };

  const formatDate = (dateStr: string | null | undefined, tz?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";

    try {
      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } catch {
      return date.toLocaleString();
    }
  };

  if (!records.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Engagement Records
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created any engagement records yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Engagement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Engagement Review
            </h2>
            <p className="text-sm text-gray-500">
              Review all saved engagement records ({records.length} total)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
            <button
              onClick={clearAllRecords}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

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
                <th className="px-4 py-3 border text-blue-600 font-semibold">
                  Primary
                </th>
                <th className="px-4 py-3 border">Secondary</th>
                <th className="px-4 py-3 border">Tertiary</th>
                <th className="px-4 py-3 border">Timezone</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border text-center font-semibold">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border">
                    {record.EngagementOwner || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    {record.Speaker || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    {record.Caterer || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">{record.Cohost || "N/A"}</td>
                  <td className="px-4 py-3 border">
                    {formatDate(record.createdAt, record.timezone)}
                  </td>
                  <td className="px-4 py-3 border text-blue-600 font-semibold">
                    {formatDate(record.primary, record.timezone)}
                  </td>
                  <td className="px-4 py-3 border">
                    {formatDate(record.secondary, record.timezone)}
                  </td>
                  <td className="px-4 py-3 border">
                    {formatDate(record.tertiary, record.timezone)}
                  </td>
                  <td className="px-4 py-3 border">
                    {record.timezone || "N/A"}
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => deleteRecord(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Create Another Engagement
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngagementReview;
