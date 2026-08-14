import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, Camera, Award, Sprout, Video } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { useGreenActStore } from "../store/useGreenActStore.js";
import { ACTION_TYPES } from "../api/endpoints/greenActs.js";
import VoiceInputButton from "../components/VoiceInputButton.jsx";

const ALLOWED_VIDEO_TYPES = /^video\/(mp4|quicktime|webm|3gpp)$/;

export default function ReportGreenAct({ onViewReports }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const afterFileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const addAct = useGreenActStore((s) => s.addAct);

  const [actionType, setActionType] = useState(ACTION_TYPES[0].value);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoAfter, setPhotoAfter] = useState(null);
  const [photoAfterPreview, setPhotoAfterPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [afterDragOver, setAfterDragOver] = useState(false);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [formError, setFormError] = useState(null);

  const selectedMeta = ACTION_TYPES.find((a) => a.value === actionType);

  function handleFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setFormError("Please use a JPEG or PNG photo.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setFormError("Photo must be under 50MB.");
      return;
    }
    setFormError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleAfterFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setFormError("Please use a JPEG or PNG photo.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setFormError("Photo must be under 50MB.");
      return;
    }
    setFormError(null);
    setPhotoAfter(file);
    setPhotoAfterPreview(URL.createObjectURL(file));
  }

  function handleVideoFile(file) {
    if (!file) return;
    if (!ALLOWED_VIDEO_TYPES.test(file.type)) {
      setFormError("Please use an MP4, MOV, WebM, or 3GP video.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setFormError("Video must be under 100MB.");
      return;
    }
    setFormError(null);
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      setFormError("Describe what you did.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const created = await addAct({ actionType, description, photo, photoAfter, video });
      setSubmitted(created);
    } catch {
      setFormError("Something went wrong sending this, please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="section-pad max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-live-bg text-live-text flex items-center justify-center mx-auto shadow-sm">
          <Check size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">Nice work!</h1>
          <p className="text-body text-xs sm:text-sm">
            +<span className="font-mono text-forest font-bold">{submitted.pointsAwarded}</span> Eco-Tokens for{" "}
            <span className="font-semibold text-forest">{submitted.actionLabel.toLowerCase()}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={() => navigate("/")}>
            Back home
          </Button>
          {onViewReports && (
            <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={onViewReports}>
              View my reports
            </Button>
          )}
          <Button
            className="!px-5 !py-2.5 text-xs sm:text-sm"
            onClick={() => {
              setSubmitted(null);
              setDescription("");
              setPhoto(null);
              setPhotoPreview(null);
              setPhotoAfter(null);
              setPhotoAfterPreview(null);
              setVideo(null);
              setVideoPreview(null);
            }}
          >
            Log another green act
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
        <div>
          <div className="eyebrow mb-1">CLIMATE ACTION</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl">Log a green act</h1>
          <p className="text-body text-xs mt-1">
            Tell your community what you did for the environment — Eco-Tokens land instantly.
          </p>
        </div>
        <Link to="/report-drain">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">Report a drain instead</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4 sm:gap-5">
        <div className="md:col-span-7 space-y-3 sm:space-y-4">
          <Card className="!p-3 sm:!p-4">
            <label className="font-display font-bold text-xs sm:text-sm text-forest block mb-2.5">What did you do?</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {ACTION_TYPES.map((a) => {
                const active = a.value === actionType;
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setActionType(a.value)}
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-left transition-all ${
                      active
                        ? "bg-live-bg/40 border-live-text text-forest font-semibold"
                        : "bg-white border-hairline text-body hover:border-forest/30"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{a.label}</span>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-sim-text shrink-0">+{a.points}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="!p-4 sm:!p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="font-display font-bold text-xs sm:text-sm text-forest">Tell us more</label>
              <VoiceInputButton onTranscript={setDescription} />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. Planted mango saplings along the riverbank with the neighbourhood cleanup crew — or tap Speak instead"
              className="input-base resize-none !rounded-xl !p-3 text-xs sm:text-sm"
            />
          </Card>
        </div>

        <div className="md:col-span-5 space-y-3 sm:space-y-4">
          <Card className="!p-3 sm:!p-4">
            <label className="font-display font-bold text-xs sm:text-sm text-forest block mb-2">
              Before / after photos (optional)
            </label>
            <p className="text-[11px] text-body mb-2.5">
              Show the impact — a "before" shot and an "after" shot make the change obvious.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="font-mono text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1.5">Before</p>
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
                  className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${dragOver
                      ? "border-forest bg-mint"
                      : "border-hairline hover:border-forest/40 hover:bg-mint/40"
                    }`}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Before preview"
                      className="max-h-28 mx-auto rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-mint flex items-center justify-center mx-auto mb-1.5 text-forest">
                        <Camera size={16} strokeWidth={1.8} />
                      </div>
                      <p className="font-mono text-[10px] font-bold text-forest uppercase tracking-wider">
                        UPLOAD
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
              </div>

              <div>
                <p className="font-mono text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1.5">After</p>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setAfterDragOver(true);
                  }}
                  onDragLeave={() => setAfterDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setAfterDragOver(false);
                    handleAfterFile(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => afterFileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${afterDragOver
                      ? "border-forest bg-mint"
                      : "border-hairline hover:border-forest/40 hover:bg-mint/40"
                    }`}
                >
                  {photoAfterPreview ? (
                    <img
                      src={photoAfterPreview}
                      alt="After preview"
                      className="max-h-28 mx-auto rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-mint flex items-center justify-center mx-auto mb-1.5 text-forest">
                        <Camera size={16} strokeWidth={1.8} />
                      </div>
                      <p className="font-mono text-[10px] font-bold text-forest uppercase tracking-wider">
                        UPLOAD
                      </p>
                    </>
                  )}
                  <input
                    ref={afterFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    capture="environment"
                    onChange={(e) => handleAfterFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-body mt-2">JPEG or PNG, up to 50MB each</p>
          </Card>

          <Card className="!p-3 sm:!p-4">
            <label className="font-display font-bold text-xs sm:text-sm text-forest block mb-2">Video (optional)</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setVideoDragOver(true);
              }}
              onDragLeave={() => setVideoDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setVideoDragOver(false);
                handleVideoFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => videoInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${videoDragOver
                  ? "border-forest bg-mint"
                  : "border-hairline hover:border-forest/40 hover:bg-mint/40"
                }`}
            >
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="max-h-44 mx-auto rounded-xl shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center mx-auto mb-2 text-forest">
                    <Video size={20} strokeWidth={1.8} />
                  </div>
                  <p className="font-mono text-[11px] font-bold text-forest uppercase tracking-wider">
                    DROP VIDEO OR CLICK TO UPLOAD
                  </p>
                  <p className="text-[11px] text-body mt-1">MP4, MOV, WebM or 3GP, up to 100MB</p>
                </>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/3gpp"
                capture="environment"
                onChange={(e) => handleVideoFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </Card>

          <Card className="!bg-gold-soft !border-0 !p-4 space-y-2">
            <div className="flex items-center gap-2 text-forest font-display font-bold text-xs sm:text-sm">
              <Award size={16} className="text-forest" /> Earn +{selectedMeta?.points ?? 10} Eco-Tokens
            </div>
            <p className="text-xs text-body leading-relaxed flex items-start gap-1.5">
              <Sprout size={14} className="text-forest shrink-0 mt-0.5" />
              Unlike drain reports, green acts award tokens instantly — no review needed.
            </p>
          </Card>

          {formError && <p className="text-xs text-coral font-semibold">{formError}</p>}

          <Button type="submit" className="w-full justify-center py-3 text-xs sm:text-sm font-bold" disabled={submitting}>
            {submitting ? "Logging…" : "Log this green act"}
          </Button>
        </div>
      </form>
    </div>
  );
}
