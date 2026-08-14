import { useEffect, useMemo, useState } from "react";
import { Newspaper, PlayCircle, Search } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import SegmentedControl from "../../../shared-components/SegmentedControl/SegmentedControl.jsx";
import Modal from "../../../shared-components/Modal/Modal.jsx";
import { fetchNews } from "../api/endpoints/home.js";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "weather", label: "Weather" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "community", label: "Community" },
  { value: "global", label: "Global" },
  { value: "education", label: "Education" },
];

function youtubeThumbnail(embedUrl) {
  const match = embedUrl?.match(/embed\/([^?&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(diffMs / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function News() {
  const [news, setNews] = useState(null);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  const filtered = useMemo(() => {
    if (!news) return null;
    return news.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        item.source.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [news, category, query]);

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-3">
        <div className="eyebrow mb-1">NEWS HUB</div>
        <h1 className="text-lg sm:text-xl lg:text-2xl">Climate &amp; Flood News</h1>
        <p className="text-body text-xs mt-1">
          Forecasts, infrastructure updates, and community wins, updated daily.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <SegmentedControl value={category} onChange={setCategory} options={CATEGORIES} className="w-full sm:w-auto" />
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news…"
            className="w-full rounded-full border border-hairline bg-white pl-9 pr-4 py-2 text-xs sm:text-sm text-forest placeholder:text-body/50 focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>
      </div>

      {!filtered ? (
        <LoadingSpinner label="Loading news…" />
      ) : filtered.length === 0 ? (
        <Card className="text-center !py-10 text-body text-sm">No articles match your search.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((item) => {
            const thumbnail = item.videoUrl ? youtubeThumbnail(item.videoUrl) : null;
            return (
              <Card key={item.id} hover className="!p-3 sm:!p-4 flex flex-col gap-2.5">
                {thumbnail && (
                  <button
                    onClick={() => setVideo(item)}
                    className="relative rounded-xl overflow-hidden aspect-video bg-mint group"
                  >
                    <img
                      src={thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                      <PlayCircle size={36} className="text-white drop-shadow" strokeWidth={1.5} />
                    </span>
                  </button>
                )}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-forest bg-mint rounded-full px-2.5 py-1">
                    <Newspaper size={11} /> {item.source}
                  </span>
                  <span className="text-[10px] text-body/60 font-mono">{timeAgo(item.publishedAt)}</span>
                </div>
                <p className="font-display font-bold text-forest text-sm sm:text-base leading-snug">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="text-xs text-body leading-relaxed line-clamp-3">{item.summary}</p>
                )}
                {item.videoUrl && !thumbnail && (
                  <button
                    onClick={() => setVideo(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest self-start hover:text-forest-light"
                  >
                    <PlayCircle size={16} /> Watch video
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!video} onClose={() => setVideo(null)} labelledBy="video-modal-title">
        {video && (
          <div className="space-y-3">
            <h3 id="video-modal-title" className="text-lg font-bold text-forest pr-6">{video.title}</h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-mint">
              <iframe
                src={video.videoUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
