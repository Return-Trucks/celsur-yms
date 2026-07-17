"use client";

type NavItem = { label: string; screen: string; icon: string; badge?: string; alert?: boolean };
type NavGroup = { id: string; label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  { id: "operations", label: "Today's Operations", items: [{ label: "Control Tower", screen: "dashboard", icon: "⌂" }, { label: "Workload Builder", screen: "workload", icon: "▣", badge: "70" }, { label: "Prioritization Engine", screen: "priority", icon: "⚖" }] },
  { id: "yard", label: "Yard", items: [{ label: "Yard Map", screen: "yardmap", icon: "▦" }] },
  { id: "movement", label: "Movement", items: [{ label: "Daily Schedule", screen: "schedule", icon: "◷" }, { label: "Dock Calendar", screen: "dockcalendar", icon: "▥" }, { label: "Gate Management", screen: "gate", icon: "⇄" }, { label: "Dispatch & Comms", screen: "dispatch", icon: "◉" }] },
  { id: "tracking", label: "Tracking", items: [{ label: "Client Delivery", screen: "delivery", icon: "⊳" }, { label: "Empty Returns", screen: "empty", icon: "⟲" }] },
  { id: "containers", label: "Containers", items: [{ label: "Container 360", screen: "c360", icon: "⊡" }, { label: "All Containers", screen: "containers", icon: "▤" }, { label: "Demurrage", screen: "demurrage", icon: "$", badge: "7", alert: true }, { label: "Exceptions", screen: "exceptions", icon: "!", badge: "4" }, { label: "Documents", screen: "documents", icon: "▭" }] },
  { id: "performance", label: "Performance", items: [{ label: "Cycle Performance", screen: "cycle", icon: "◐" }, { label: "Reports", screen: "reports", icon: "◫" }] },
];

export const groupForScreen = (screen: string) => navGroups.find(group => group.items.some(item => item.screen === screen))?.id ?? "operations";

type Props = {
  activeScreen: string;
  expandedGroups: string[];
  onNavigate: (screen: string) => void;
  onToggle: (groupId: string) => void;
};

export default function DemoSidebar({ activeScreen, expandedGroups, onNavigate, onToggle }: Props) {
  return <aside className="demo-sidebar" aria-label="Celsur operations navigation">
    <div className="demo-sidebar__brand"><div className="demo-sidebar__logo">CL</div><div><strong>Celsur</strong><span>Operations Console</span></div></div>
    <label className="demo-sidebar__search"><span aria-hidden="true">⌕</span><input aria-label="Search container, BL, customer" placeholder="Search container, BL, customer…" /></label>
    <nav className="demo-sidebar__nav">
      {navGroups.map(group => {
        const expanded = expandedGroups.includes(group.id);
        return <section className={`demo-sidebar__group${expanded ? " is-expanded" : ""}`} key={group.id}>
          <button className="demo-sidebar__group-toggle" type="button" aria-expanded={expanded} aria-controls={`demo-nav-${group.id}`} onClick={() => onToggle(group.id)}>
            <span>{group.label}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
          <div className="demo-sidebar__items" id={`demo-nav-${group.id}`} aria-hidden={!expanded}>
            {group.items.map(item => <button key={item.screen} className={`demo-sidebar__item${activeScreen === item.screen ? " is-active" : ""}${item.alert ? " is-alert" : ""}`} type="button" tabIndex={expanded ? 0 : -1} onClick={() => onNavigate(item.screen)}>
              <span className="demo-sidebar__item-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>{item.badge && <span className="demo-sidebar__badge">{item.badge}</span>}
            </button>)}
          </div>
        </section>;
      })}
    </nav>
    <div className="demo-sidebar__footer"><span className="demo-sidebar__avatar">MR</span><span><strong>Martín R.</strong><small>Ops Manager · Pacheco</small></span><span aria-hidden="true">⚙</span></div>
  </aside>;
}
