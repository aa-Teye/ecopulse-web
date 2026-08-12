import { useEffect, useState } from "react";
import { Check, Minus, Plus, Users, Accessibility, Phone, ShieldCheck, MapPin } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import RadarField from "../../../shared-components/RadarField/RadarField.jsx";
import { usePlanStore } from "../store/usePlanStore.js";
import { ACCESSIBILITY_OPTIONS } from "../api/endpoints/plan.js";


function PlanBuilder({ initial, onSaved }) {
  const saveHouseholdPlan = usePlanStore((s) => s.saveHouseholdPlan);
  const [householdSize, setHouseholdSize] = useState(
    initial?.householdSize ?? 1,
  );
  const [needs, setNeeds] = useState(
    new Set(initial?.accessibilityNeeds ?? []),
  );
  const [contactName, setContactName] = useState(initial?.contact?.name ?? "");
  const [contactNumber, setContactNumber] = useState(
    initial?.contact?.number ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function toggleNeed(need) {
    setNeeds((prev) => {
      const next = new Set(prev);
      next.has(need) ? next.delete(need) : next.add(need);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contactName.trim() || !contactNumber.trim()) {
      setError("Add an emergency contact so responders know who to reach.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const saved = await saveHouseholdPlan({
        householdSize,
        accessibilityNeeds: Array.from(needs),
        contact: { name: contactName, number: contactNumber },
      });
      onSaved(saved);
    } catch {
      setError("Could not save your plan, please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4 sm:gap-5">
      <div className="md:col-span-7 space-y-3 sm:space-y-4">
        <Card className="!p-3 sm:!p-4">
          <p className="text-xs sm:text-sm font-bold text-forest mb-3">1. People in your household</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setHouseholdSize((n) => Math.max(1, n - 1))}
              className="w-10 h-10 rounded-full border border-hairline text-forest flex items-center justify-center hover:bg-mint hover:border-forest/30 transition-all font-bold"
              aria-label="Decrease household size"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <span className="font-display font-extrabold text-3xl sm:text-4xl w-12 text-center text-forest">
              {householdSize}
            </span>
            <button
              type="button"
              onClick={() => setHouseholdSize((n) => Math.min(20, n + 1))}
              className="w-10 h-10 rounded-full border border-hairline text-forest flex items-center justify-center hover:bg-mint hover:border-forest/30 transition-all font-bold"
              aria-label="Increase household size"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </Card>

        <Card className="!p-4 sm:!p-5">
          <p className="text-xs sm:text-sm font-bold text-forest mb-3">2. Accessibility & Mobility Needs</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {ACCESSIBILITY_OPTIONS.map((need) => {
              const checked = needs.has(need);
              return (
                <label
                  key={need}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    checked
                      ? "bg-live-bg/40 border-live-text text-forest font-semibold"
                      : "bg-white border-hairline text-body hover:border-forest/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      checked
                        ? "bg-live-text text-white shadow-sm"
                        : "border-2 border-hairline text-transparent"
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleNeed(need)}
                  />
                  <span className="text-xs sm:text-sm">{need}</span>
                </label>
              );
            })}
          </div>
        </Card>

        <Card className="!p-4 sm:!p-5">
          <p className="text-xs sm:text-sm font-bold text-forest mb-3">3. Primary Emergency Contact</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Full Name"
              className="input-base !py-2.5 text-xs sm:text-sm"
            />
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Phone Number (+233)"
              className="input-base !py-2.5 text-xs sm:text-sm"
            />
          </div>
        </Card>

        {error && <p className="text-xs text-coral font-semibold">{error}</p>}

        <Button type="submit" className="w-full justify-center py-3 text-xs sm:text-sm font-bold" disabled={saving}>
          {saving ? "Saving plan…" : "Save Household Emergency Plan"}
        </Button>
      </div>

      <div className="md:col-span-5 space-y-3 sm:space-y-4">
        <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between min-h-[180px] text-white bg-forest shadow-card-lg">
          <RadarField />
          <div className="relative z-10 space-y-1.5">
            <div className="eyebrow !text-white/80 before:!bg-gold">WHY BUILD A PLAN?</div>
            <p className="font-display font-extrabold text-base sm:text-lg text-white">Tailored Evacuation Response</p>
            <p className="text-xs text-white/90 leading-relaxed">
              In an active flood event, emergency services use your plan details to prioritize evacuation routes and assign accessible shelter spaces.
            </p>
          </div>
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center gap-1.5 text-xs text-gold">
            <ShieldCheck size={14} /> Saved locally & synced to district team
          </div>
        </div>

        <Card className="!bg-mint !border-0 !p-4 space-y-2">
          <div className="flex items-center gap-2 font-display font-bold text-forest text-xs sm:text-sm">
            <MapPin size={16} /> Designated District Shelter
          </div>
          <p className="text-xs sm:text-sm text-forest leading-relaxed">
            Your district community shelter (assigned by local authority)
          </p>
        </Card>
      </div>
    </form>
  );
}


function PlanSummary({ plan, onEdit }) {
  return (
    <div className="grid md:grid-cols-12 gap-5 sm:gap-6">
      <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-card-lg min-h-[240px] flex flex-col justify-between">
        <img
          src="/assets/Rectangle 40249.png"
          alt="Family safe together"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end h-full space-y-1.5">
          <div className="eyebrow !text-white/80 before:!bg-gold">SAFETY PLAN ACTIVE</div>
          <p className="font-display font-extrabold text-xl sm:text-2xl text-white leading-snug">Plan saved</p>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs">
            Alerts and shelter guidance are now tailored to your household.
          </p>
          <div className="pt-3">
            <Button
              variant="ghost"
              className="!bg-white/15 !text-white !border-white/30 hover:!bg-white/25 w-full justify-center !py-2.5 text-xs sm:text-sm"
              onClick={onEdit}
            >
              Edit plan details
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 space-y-4">
        <Card className="divide-y divide-hairline !p-5">
          <div className="pb-3.5 flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-mint text-live-text flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[10px] font-mono text-body uppercase tracking-wider">Household size</p>
              <p className="font-display font-bold text-forest text-base sm:text-lg mt-0.5">{plan.householdSize} family members</p>
            </div>
          </div>
          <div className="py-3.5 flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-mint text-live-text flex items-center justify-center shrink-0">
              <Accessibility size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[10px] font-mono text-body uppercase tracking-wider">Accessibility requirements</p>
              <p className="font-display font-bold text-forest text-base sm:text-lg mt-0.5">
                {plan.accessibilityNeeds.length
                  ? plan.accessibilityNeeds.join(", ")
                  : "Standard evacuation protocol"}
              </p>
            </div>
          </div>
          <div className="pt-3.5 flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-mint text-live-text flex items-center justify-center shrink-0">
              <Phone size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[10px] font-mono text-body uppercase tracking-wider">Designated emergency contact</p>
              <p className="font-display font-bold text-forest text-base sm:text-lg mt-0.5">
                {plan.contact.name} · <span className="font-mono text-forest">{plan.contact.number}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="!bg-mint !border-0 !p-4 flex items-start gap-3">
          <MapPin size={18} className="text-forest shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-forest text-xs sm:text-sm">Assigned Emergency Shelter</p>
            <p className="text-xs sm:text-sm text-forest/90 mt-0.5 leading-relaxed">
              <span className="font-bold">{plan.shelter.name}</span>: {plan.shelter.note}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}


export default function EmergencyPlan() {
  const { plan, loading, loadPlan } = usePlanStore();
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(null);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const effectivePlan = justSaved ?? plan;

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-3">
        <div className="eyebrow mb-1">Emergency Plan</div>
        <h1 className="text-lg sm:text-xl lg:text-2xl">
          {effectivePlan && !editing
            ? "Household emergency plan"
            : "Emergency Plan Builder"}
        </h1>
        {(!effectivePlan || editing) && (
          <p className="text-body text-xs sm:text-sm mt-1">
            Specify household details so evacuation alerts and shelter placement fit your family.
          </p>
        )}
      </div>

      {loading && !effectivePlan ? (
        <LoadingSpinner label="Loading your plan…" />
      ) : effectivePlan && !editing ? (
        <PlanSummary plan={effectivePlan} onEdit={() => setEditing(true)} />
      ) : (
        <PlanBuilder
          initial={effectivePlan}
          onSaved={(saved) => {
            setJustSaved(saved);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
