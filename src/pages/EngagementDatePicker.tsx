import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, Globe } from "lucide-react";

const EngagementDatePicker = () => {
  const [details, setDetails] = useState<any>({});
  const [primary, setPrimary] = useState<Date | null>(null);
  const [secondary, setSecondary] = useState<Date | null>(null);
  const [tertiary, setTertiary] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("engagementDetails");
    if (saved) setDetails(JSON.parse(saved));
  }, []);

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PST)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  ];

  const convertToTimezone = (
    date: Date,
    fromTz: string,
    toTz: string
  ): Date | null => {
    if (!date) return null;

    // Step 1: Interpret the date in the source timezone
    const dateInSourceTz = new Date(
      new Intl.DateTimeFormat("en-US", {
        timeZone: fromTz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date)
    );

    // Step 2: Convert the interpreted date to the target timezone
    const dateInTargetTz = new Date(
      new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(dateInSourceTz)
    );

    return dateInTargetTz;
  };

  const handleTimezoneChange = (newTimezone: string) => {
    const oldTimezone = timezone;
    setTimezone(newTimezone);

    if (primary)
      setPrimary(convertToTimezone(primary, oldTimezone, newTimezone));
    if (secondary)
      setSecondary(convertToTimezone(secondary, oldTimezone, newTimezone));
    if (tertiary)
      setTertiary(convertToTimezone(tertiary, oldTimezone, newTimezone));
  };

  const selectedSlots = useMemo(
    () => [primary, secondary, tertiary].filter(Boolean) as Date[],
    [primary, secondary, tertiary]
  );

  const validateUniqueTimes = (
    newDate: Date | null,
    currentSlot: Date | null
  ) => {
    return !selectedSlots.some(
      (slot) =>
        slot !== currentSlot &&
        slot &&
        newDate &&
        slot.getTime() === newDate.getTime()
    );
  };

  const isSlotDisabled = (date: Date) => {
    return selectedSlots.some((slot) => {
      const bufferStart = new Date(slot.getTime() - 30 * 60 * 1000);
      const bufferEnd = new Date(slot.getTime() + 45 * 60 * 1000);
      return date >= bufferStart && date <= bufferEnd;
    });
  };

  const handleDateChange = (
    date: Date | null,
    setter: (d: Date | null) => void,
    currentValue: Date | null
  ) => {
    if (!date) {
      setter(null);
      return;
    }

    const hours = date.getHours();
    if (hours < 6 || hours > 23 || (hours === 23 && date.getMinutes() > 0)) {
      alert("Please select a time between 6:00 AM and 11:00 PM.");
      return;
    }

    if (!validateUniqueTimes(date, currentValue)) {
      alert("This time is already selected. Please choose another.");
      return;
    }

    if (isSlotDisabled(date)) {
      alert("This time conflicts with another slot (buffer rule).");
      return;
    }

    setter(date);
  };

  const deleteSlot = (slotType: "primary" | "secondary" | "tertiary") => {
    if (slotType === "primary") setPrimary(null);
    if (slotType === "secondary") setSecondary(null);
    if (slotType === "tertiary") setTertiary(null);
  };

  const formatDateTime = (date: Date | null, tz: string) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primary) {
      alert("Primary Date and Time is required");
      return;
    }
    const fullData = {
      ...details,
      primary,
      secondary,
      tertiary,
      timezone,
      createdAt: new Date().toISOString(),
    };

    const existingRecords =
      JSON.parse(localStorage.getItem("engagementFull") || "[]") || [];

    existingRecords.push(fullData);

    localStorage.setItem("engagementFull", JSON.stringify(existingRecords));

    navigate("/review");
  };

  const SelectedSlot = ({
    label,
    date,
    onDelete,
    required = false,
  }: {
    label: string;
    date: Date | null;
    onDelete: () => void;
    required?: boolean;
  }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-600 w-5 h-5" />
          <h4 className="font-semibold text-blue-800">
            {label} {required && <span className="text-red-500">*</span>}
          </h4>
        </div>
        {date && (
          <button
            type="button"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        )}
      </div>
      <p className={`text-sm mt-2 ${date ? "text-gray-700" : "text-gray-400"}`}>
        {date ? formatDateTime(date, timezone) : "Not selected"}
      </p>
    </div>
  );

  const minTime = new Date();
  minTime.setHours(6, 0, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(23, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Engagement Date & Time
              </h2>
              <p className="text-gray-600">Pick your preferred meeting slots</p>
            </div>

            {/* Timezone */}
            <div className="mb-8">
              <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Select Timezone <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Slots */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Selected Time Slots
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectedSlot
                  label="Primary"
                  date={primary}
                  onDelete={() => deleteSlot("primary")}
                  required
                />
                <SelectedSlot
                  label="Secondary"
                  date={secondary}
                  onDelete={() => deleteSlot("secondary")}
                />
                <SelectedSlot
                  label="Tertiary"
                  date={tertiary}
                  onDelete={() => deleteSlot("tertiary")}
                />
              </div>
            </div>

            {/* Pickers */}
            <div className="space-y-6 mb-10">
              <DatePicker
                selected={primary}
                onChange={(date) => handleDateChange(date, setPrimary, primary)}
                showTimeSelect
                timeIntervals={15}
                minTime={minTime}
                maxTime={maxTime}
                minDate={new Date()}
                filterTime={(time) => !isSlotDisabled(time)}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select Primary Date & Time"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <DatePicker
                selected={secondary}
                onChange={(date) =>
                  handleDateChange(date, setSecondary, secondary)
                }
                showTimeSelect
                timeIntervals={15}
                minTime={minTime}
                maxTime={maxTime}
                minDate={new Date()}
                filterTime={(time) => !isSlotDisabled(time)}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select Secondary Date & Time"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <DatePicker
                selected={tertiary}
                onChange={(date) =>
                  handleDateChange(date, setTertiary, tertiary)
                }
                showTimeSelect
                timeIntervals={15}
                minTime={minTime}
                maxTime={maxTime}
                minDate={new Date()}
                filterTime={(time) => !isSlotDisabled(time)}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select Tertiary Date & Time"
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            {/* Rules */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mb-8">
              <h4 className="font-semibold text-yellow-800 mb-2">
                📋 Selection Rules
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Primary slot is required</li>
                <li>
                  • Available times: 6:00 AM – 11:00 PM (15-min intervals)
                </li>
                <li>• 30-min buffer before & 45-min after each slot</li>
                <li>• Duplicate slots not allowed</li>
                <li>• Timezone changes auto-adjust slots</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={!primary}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
              >
                Review Engagement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EngagementDatePicker;
