export type Status = "At Port" | "Pickup Planned" | "In Transit" | "In Yard" | "At Client" | "Empty Ready" | "Returned" | "Exception" | "Doc Hold";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Container {
  id: string; customer: string; customerCode: string; vessel: string; status: Status;
  location: string; freeTime: number; priority: Priority; driver?: string; truck?: string;
  documents: { bl: boolean; customs: boolean; gate: boolean; pod: boolean };
}
export interface DockAppointment { id: string; door: string; time: string; container: string; carrier: string; driver: string; duration: number; }
export interface Activity { id: number; time: string; title: string; detail: string; tone: "blue" | "green" | "amber"; }

const customers = [
  ["BRG", "Bridgestone", "Llavallol"], ["PIR", "Pirelli", "Merlo"], ["MIC", "Michelin", "Garín"],
  ["VWA", "Volkswagen", "Pacheco"], ["TYA", "Toyota", "Zárate"], ["FOA", "Ford", "Pacheco"]
] as const;
const seeds: Array<[string, number, Status, string, Priority]> = [
  ["MSKU7102341", 7, "At Port", "Maersk Salvador", "P2"], ["SUDU8830012", 6, "At Port", "CMA CGM Tigris", "P2"],
  ["HLCU4419987", 5, "Pickup Planned", "Hapag Hannover", "P2"], ["YMLU9112233", 5, "Pickup Planned", "Yang Ming Eastern", "P2"],
  ["CSNU3340198", 4, "In Transit", "COSCO Boston", "P2"], ["CMAU2271204", 4, "In Yard", "CMA CGM Tigris", "P2"],
  ["MEDU8831702", 3, "In Yard", "MSC Genoa", "P1"], ["TGHU8820013", 5, "In Transit", "Hapag Hannover", "P2"],
  ["MAEU1110456", 6, "At Client", "Maersk Salvador", "P2"], ["BEAU4430019", 4, "At Client", "ONE Triumph", "P2"],
  ["SEGU2330145", 6, "Empty Ready", "Maersk Salvador", "P2"], ["HLBU7704412", 7, "Returned", "Hapag Hannover", "P3"],
  ["SUDU2204481", 2, "Exception", "Maersk Salvador", "P0"], ["TCKU5519902", 1, "Doc Hold", "CMA CGM Tigris", "P0"],
  ["CSNU8810112", 3, "Doc Hold", "COSCO Boston", "P1"], ["MAEU9920147", 1, "Exception", "Maersk Salvador", "P0"]
];

export const containers: Container[] = Array.from({ length: 32 }, (_, index) => {
  const seed = seeds[index % seeds.length]; const customer = customers[index % customers.length];
  return {
    id: index < seeds.length ? seed[0] : `${seed[0].slice(0, 4)}${String(7200000 + index * 173)}`,
    customer: customer[1], customerCode: customer[0], vessel: seed[3], status: seed[2],
    location: customer[2], freeTime: Math.max(0, seed[1] - Math.floor(index / 12)), priority: seed[4],
    driver: index % 3 === 0 ? ["Diego Vázquez", "Juan Fernández", "M. Reyes"][index % 3] : undefined,
    truck: index % 3 === 0 ? ["T-007", "T-002", "T-009"][index % 3] : undefined,
    documents: { bl: true, customs: seed[2] !== "Doc Hold", gate: seed[2] !== "Doc Hold", pod: ["At Client", "Empty Ready", "Returned"].includes(seed[2]) }
  };
});

export const initialAppointments: DockAppointment[] = [
  { id: "APT-104", door: "D-01", time: "08:30", container: "MSKU7102341", carrier: "Celsur Fleet", driver: "Diego Vázquez", duration: 45 },
  { id: "APT-105", door: "D-02", time: "09:15", container: "YMLU9112233", carrier: "Drayexpress", driver: "Juan Fernández", duration: 60 },
  { id: "APT-106", door: "D-03", time: "10:30", container: "MEDU8831702", carrier: "TransAndina", driver: "M. Reyes", duration: 30 }
];
export const initialActivity: Activity[] = [
  { id: 1, time: "06:42", title: "Gate-out confirmed", detail: "CMAU2271204 · Celsur Fleet", tone: "green" },
  { id: 2, time: "06:35", title: "Document exception raised", detail: "TCKU5519902 · Customs release pending", tone: "amber" },
  { id: 3, time: "06:28", title: "Pickup dispatched", detail: "MSKU7102341 · Truck T-007", tone: "blue" }
];
