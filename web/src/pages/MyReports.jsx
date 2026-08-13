import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import SegmentedControl from "../../../shared-components/SegmentedControl/SegmentedControl.jsx";
import { useReportStore } from "../store/useReportStore.js";

const STATUS_META = {
  pending:  { label: "Pending",  chip: "bg-gold-soft text-sim-text border border-gold/30" },
  approved: { label: "Approved", chip: "bg-live-bg text-live-text border border-emerald/30" },
  rejected: { label: "Rejected", chip: "bg-coral/10 text-coral border border-coral/20" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusChip({ status }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    chip: "bg-mint text-body",
  };
  return (
    <span
      className={`inline-block text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${meta.chip}`}
    >
      {meta.label}
    </span>
  );
}

export default function MyReports({ onReportNew }) {
  const { reports, loading, error, loadReports } = useReportStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const counts = reports.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    { pending: 0, approved: 0, rejected: 0 },
  );

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Stats Cards */}
      {reports.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="text-center !py-3 sm:!py-4">
            <p className="font-display font-extrabold text-xl sm:text-3xl text-forest">{counts.pending}</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-body mt-0.5">Pending</p>
          </Card>
          <Card className="text-center !py-3 sm:!py-4">
            <p className="font-display font-extrabold text-xl sm:text-3xl text-live-text">{counts.approved}</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-body mt-0.5">Approved</p>
          </Card>
          <Card className="text-center !py-3 sm:!py-4">
            <p className="font-display font-extrabold text-xl sm:text-3xl text-coral">{counts.rejected}</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-body mt-0.5">Rejected</p>
          </Card>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All Reports" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
        <span className="text-[11px] font-mono text-body hidden sm:inline">
          Showing {filtered.length} of {reports.length} reports
        </span>
      </div>

      {loading && reports.length === 0 && (
        <LoadingSpinner label="Loading your reports…" />
      )}
      {error && (
        <p className="text-xs text-coral font-semibold">
          Couldn't load your reports, please try again.
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12">
          <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center mx-auto mb-2 text-forest/40">
            <FileText size={20} />
          </div>
          <p className="text-forest font-bold text-xs sm:text-sm mb-1">
            {reports.length === 0
              ? "You haven't submitted any reports yet."
              : "No reports match this status filter."}
          </p>
          <p className="text-xs text-body mb-4 max-w-xs mx-auto">Help your community by reporting clogged drains near your home or business.</p>
          {reports.length === 0 && (
            <Button variant="secondary" className="!text-xs !py-1.5 !px-4" onClick={onReportNew}>
              Report your first drain
            </Button>
          )}
        </Card>
      )}

      {/* 3-column desktop report grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} className="!p-4 flex flex-col justify-between h-full">
            <div className="space-y-2">
              {r.photoUrl && (
                <img
                  src={r.photoUrl}
                  alt={`Drain report at ${r.location}`}
                  className="w-full h-28 object-cover rounded-xl"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <p className="font-display font-bold text-forest text-xs sm:text-sm truncate">{r.location}</p>
                <StatusChip status={r.status} />
              </div>
              <p className="text-xs text-body leading-relaxed">{r.description}</p>
            </div>
            <div className="pt-2.5 border-t border-hairline mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-body">
              <span className="font-mono">Ref: {r.id}</span>
              <span className="font-mono">{formatDate(r.reportedAt)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
