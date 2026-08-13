import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, Shield, Flame, HeartPulse, User, Phone, ExternalLink } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { usePlanStore } from "../store/usePlanStore.js";

const NATIONAL_CONTACTS = [
  {
    id: "unified",
    name: "Unified Emergency Service",
    number: "112",
    hint: "Dispatches Police, Fire, or Ambulance based on incident",
    tone: "coral",
    Icon: LifeBuoy,
  },
  {
    id: "police",
    name: "Ghana Police Service",
    number: "191",
    hint: "Crime, security incidents, traffic control",
    tone: "forest",
    Icon: Shield,
  },
  {
    id: "fire",
    name: "Ghana National Fire Service",
    number: "192",
    hint: "Fire rescue, flood rescue, trapped victims",
    tone: "coral",
    Icon: Flame,
  },
  {
    id: "ambulance",
    name: "National Ambulance Service",
    number: "193",
    hint: "Medical emergencies and hospital transport",
    tone: "moss",
    Icon: HeartPulse,
  },
];

const toneClasses = {
  coral:  "bg-coral/10 text-coral border-coral/20",
  forest: "bg-mint text-forest border-forest/20",
  moss:   "bg-live-bg text-live-text border-emerald/30",
};

function ContactRow({ Icon, name, hint, number, tone }) {
  return (
    <Card className="!p-4 sm:!p-5 flex items-center gap-3.5 sm:gap-4">
      <span className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-forest text-sm sm:text-base truncate">{name}</p>
        <p className="text-[11px] sm:text-xs text-body mt-0.5">{hint}</p>
      </div>
      <a href={`tel:${number}`} className="shrink-0">
        <Button className="!px-3.5 !py-2 sm:!px-4 sm:!py-2.5 gap-1.5 font-mono text-xs">
          <Phone size={13} /> Call {number}
        </Button>
      </a>
    </Card>
  );
}

export default function EmergencyContacts() {
  const { plan, loadPlan } = usePlanStore();

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  return (
    <div className="section-pad py-5 sm:py-7 lg:py-10 space-y-5 sm:space-y-6 w-full">
      <div className="border-b border-hairline pb-4">
        <div className="eyebrow mb-1">HELPLINES</div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl">Helplines & Support</h1>
        <p className="text-body text-xs sm:text-sm mt-1">
          Numbers to call for help, not only life-threatening emergencies — free on all mobile networks.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-5 sm:gap-6">

        {/* Left Column: National Hotlines (7 cols) */}
        <div className="md:col-span-7 space-y-3 sm:space-y-4">
          <div className="eyebrow mb-2">NATIONAL HELPLINES</div>
          {NATIONAL_CONTACTS.map((c) => (
            <ContactRow key={c.id} {...c} />
          ))}
        </div>

        {/* Right Column: NADMO & Household Contact (5 cols) */}
        <div className="md:col-span-5 space-y-4 sm:space-y-5">
          <div>
            <div className="eyebrow mb-2">YOUR HOUSEHOLD CONTACT</div>
            {plan?.contact ? (
              <ContactRow
                Icon={User}
                name={plan.contact.name}
                hint="Saved emergency contact"
                number={plan.contact.number}
                tone="forest"
              />
            ) : (
              <Card className="!p-5 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center mx-auto text-forest/40">
                  <User size={20} />
                </div>
                <p className="text-forest font-bold text-xs sm:text-sm">
                  No personal contact saved yet.
                </p>
                <Link to="/emergency-plan" className="inline-block">
                  <Button variant="secondary" className="!text-xs !py-1.5 !px-4">Add contact</Button>
                </Link>
              </Card>
            )}
          </div>

          <div>
            <div className="eyebrow mb-2">NADMO DISTRICT INFO</div>
            <Card className="!bg-gold-soft !border-0 !p-4 sm:!p-5 space-y-2">
              <p className="font-display font-bold text-forest text-xs sm:text-sm">District Disaster Operations</p>
              <p className="text-xs text-forest leading-relaxed">
                The National Disaster Management Organisation (NADMO) operates district dispatch teams. Call 112 directly or search the online registry.
              </p>
              <a
                href="https://web.nadmo.gov.gh/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest underline underline-offset-2 hover:text-forest-light pt-1"
              >
                web.nadmo.gov.gh <ExternalLink size={12} />
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
