import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, Camera, MapPin, Search, Award } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useReportStore } from "../store/useReportStore.js";
import VoiceInputButton from "../components/VoiceInputButton.jsx";

export default function ReportDrain() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    coords,
    status: locStatus,
    error: locError,
    locate,
  } = useGeolocation();
  const addReport = useReportStore((s) => s.addReport);

  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [formError, setFormError] = useState(null);

  function handleFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setFormError("Please use a JPEG or PNG photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Photo must be under 5MB.");
      return;
    }
    setFormError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!locationText && !coords) {
      setFormError("Add a location. Type it in or use your current location.");
      return;
    }
    if (!description.trim()) {
      setFormError("Describe what you saw so responders know what to expect.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const created = await addReport({
        location:
          locationText || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
        coords,
        description,
        photo,
      });
      setSubmitted(created);
    } catch (err) {
      setFormError("Something went wrong sending your report, please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="section-pad max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-live-bg text-live-text flex items-center justify-center mx-auto shadow-sm">
          <Check size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">Report submitted successfully</h1>
          <p className="text-body text-xs sm:text-sm">
            Reference <span className="font-mono text-forest font-bold">{submitted.id}</span>{" "}
            · Status{" "}
            <span className="font-mono text-gold-dark font-bold bg-gold-soft px-2.5 py-0.5 rounded-full text-xs">{submitted.status}</span>
          </p>
        </div>
        <p className="text-body text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
          A neighborhood admin and local response team will review it shortly. You'll earn Eco-Tokens once it's verified.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={() => navigate("/")}>
            Back
          </Button>
          <Button
            className="!px-5 !py-2.5 text-xs sm:text-sm"
            onClick={() => {
              setSubmitted(null);
              setLocationText("");
              setDescription("");
              setPhoto(null);
              setPhotoPreview(null);
            }}
          >
            Report another drain
          </Button>
        </div>
      </div>
    );
  }

  /* ── Compact & Refined Form ── */
  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
        <div>
          <div className="eyebrow mb-1">DRAIN CLEARANCE TRACKER</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl">Report a blocked drain</h1>
          <p className="text-body text-xs mt-1">
            Provide location and photo evidence to help community responders clear flood hazards fast.
          </p>
        </div>
        <Link to="/my-reports">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">My previous reports</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4 sm:gap-5">
        <div className="md:col-span-7 space-y-3 sm:space-y-4">
          <Card className="!p-3 sm:!p-4">
            <label className="font-display font-bold text-xs sm:text-sm text-forest block mb-2">Location details</label>
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body/50" />
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Search street, landmark or area name..."
                className="input-base !pl-10 !py-2.5 text-xs sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={locate}
                disabled={locStatus === "locating"}
                className="!text-[11px] gap-1.5 !px-3 !py-1.5"
              >
                <MapPin size={13} />
                {locStatus === "locating" ? "Locating…" : "Use GPS location"}
              </Button>
              {coords && (
                <p className="text-xs text-live-text font-mono font-semibold">
                  Pinned: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </p>
              )}
            </div>
            {locStatus === "error" && (
              <p className="text-xs text-coral mt-1 font-medium">{locError}</p>
            )}
          </Card>

          {/* Interactive Accra Map Preview */}
          <div className="rounded-2xl bg-mint-dark border border-hairline h-48 sm:h-56 flex items-center justify-center text-body/60 text-xs font-medium overflow-hidden relative shadow-inner">
            <div className="text-center space-y-1.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-forest flex items-center justify-center mx-auto shadow-sm">
                <MapPin size={20} />
              </div>
              <p className="font-display font-bold text-forest text-xs sm:text-sm">Accra Drainage Map View</p>
              <p className="text-[11px] font-mono text-body">Your District Sector</p>
            </div>
          </div>

          <Card className="!p-4 sm:!p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="font-display font-bold text-xs sm:text-sm text-forest">Blockage Description</label>
              <VoiceInputButton onTranscript={setDescription} />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What did you observe? (e.g. Silt buildup, plastic waste, overflowing water near road) — or tap Speak instead"
              className="input-base resize-none !rounded-xl !p-3 text-xs sm:text-sm"
            />
          </Card>
        </div>

        <div className="md:col-span-5 space-y-3 sm:space-y-4">
          <Card className="!p-3 sm:!p-4">
            <label className="font-display font-bold text-xs sm:text-sm text-forest block mb-2">Photo Evidence</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${dragOver
                  ? "border-forest bg-mint"
                  : "border-hairline hover:border-forest/40 hover:bg-mint/40"
                }`}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Drain report preview"
                  className="max-h-44 mx-auto rounded-xl object-cover shadow-sm"
                />
              ) : (
                <>
                  <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center mx-auto mb-2 text-forest">
                    <Camera size={20} strokeWidth={1.8} />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-forest uppercase tracking-wider">
                    DROP PHOTO OR CLICK TO UPLOAD
                  </p>
                  <p className="text-[11px] text-body mt-1">
                    JPEG or PNG formats, up to 5MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </Card>

          <Card className="!bg-gold-soft !border-0 !p-4 space-y-2">
            <div className="flex items-center gap-2 text-forest font-display font-bold text-xs sm:text-sm">
              <Award size={16} className="text-forest" /> Earn +15 Eco-Tokens
            </div>
            <p className="text-xs text-body leading-relaxed">
              Every verified drain clearance report rewards you with Eco-Tokens that boost your community rank.
            </p>
          </Card>

          {formError && <p className="text-xs text-coral font-semibold">{formError}</p>}

          <Button type="submit" className="w-full justify-center py-3 text-xs sm:text-sm font-bold" disabled={submitting}>
            {submitting ? "Submitting report…" : "Submit Drain Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
