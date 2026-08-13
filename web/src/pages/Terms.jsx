import { Link } from "react-router-dom";
import Card from "../../../shared-components/Card/Card.jsx";

const SECTIONS = [
  {
    title: "What we collect",
    body: "Your name, phone number and/or email, and a hashed password (we never store your password in plain text). Optionally: your district, and details you add to an emergency plan — household size, accessibility needs, and an emergency contact's name and number.",
  },
  {
    title: "Location and photos",
    body: "When you report a blocked drain or log a green act, we store the location you provide (typed or from your device's GPS) and any photo you attach. This is what lets responders and neighbours see where help is needed.",
  },
  {
    title: "Activity data",
    body: "Your Eco-Tokens balance, badges, game scores, and community status updates (safe / evacuating / need help) are stored against your account so your progress and community activity are visible where the app shows them.",
  },
  {
    title: "Why we collect it",
    body: "To run the features you're signing up for: verified drain reports, community alerts, an emergency plan tailored to your household, gamified climate learning, and a shared view of what's happening in your area during a flood.",
  },
  {
    title: "Who sees it",
    body: "Your name and activity (like green acts and leaderboard rank) are visible to other users, since this is a community app. Your password, phone/email, and emergency plan details are not shown to other users. We don't sell your data.",
  },
  {
    title: "This is a hackathon MVP",
    body: "EcoPulse is an early-stage community project (GreenRes Hackathon), not a finished commercial product. Treat it accordingly — don't submit sensitive information beyond what's asked for, and expect it to evolve.",
  },
];

export default function Terms() {
  return (
    <div className="section-pad py-6 sm:py-8 max-w-2xl mx-auto space-y-4">
      <div className="border-b border-hairline pb-3">
        <div className="eyebrow mb-1">BEFORE YOU SIGN UP</div>
        <h1 className="text-xl sm:text-2xl">Terms &amp; how we use your data</h1>
        <p className="text-body text-xs sm:text-sm mt-1">
          Plain language, not legalese — here's what Wɔnɔ collects and why.
        </p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="!p-4 sm:!p-5">
            <p className="font-display font-bold text-forest text-sm mb-1.5">{s.title}</p>
            <p className="text-xs sm:text-sm text-body leading-relaxed">{s.body}</p>
          </Card>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link to="/sign-up" className="text-xs font-bold text-forest underline underline-offset-2 hover:text-forest-light">
          Back to sign up
        </Link>
      </div>
    </div>
  );
}
