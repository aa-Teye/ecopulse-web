import { useState } from "react";
import SegmentedControl from "../../../shared-components/SegmentedControl/SegmentedControl.jsx";
import ReportDrain from "./ReportDrain.jsx";
import MyReports from "./MyReports.jsx";

export default function Report({ initialTab = "new" }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
        <div>
          <div className="eyebrow mb-1">COMMUNITY REPORTING</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl">Report &amp; track</h1>
          <p className="text-body text-xs mt-1">
            Report a drain, an incident, or someone — or check the status of what you've already reported.
          </p>
        </div>
      </div>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: "new", label: "New Report" },
          { value: "mine", label: "My Reports" },
        ]}
      />

      {tab === "new" ? (
        <ReportDrain onViewReports={() => setTab("mine")} />
      ) : (
        <MyReports onReportNew={() => setTab("new")} />
      )}
    </div>
  );
}
