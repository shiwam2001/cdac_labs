export type DeviceType = {
  name: string;
  category: "Computer" | "Networking" | "Supporting" | "Custom";
};

export const deviceTypes: DeviceType[] = [
  { name: "Monitor", category: "Computer" },
  { name: "Keyboard", category: "Computer" },
  { name: "Mouse", category: "Computer" },
  { name: "CPU", category: "Computer" },
  { name: "Printer", category: "Computer" },
  { name: "WiFi Router", category: "Networking" },
  { name: "Network Switch", category: "Networking" },
  { name: "UPS", category: "Supporting" },
  { name: "Microphone", category: "Supporting" },
  { name: "Other", category: "Custom" }
];