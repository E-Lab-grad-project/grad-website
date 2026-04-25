import type { WidgetTypeId } from "./types";

export type WidgetPort = {
  id: string;
  direction: "in" | "out";
};

export type WidgetRegistryEntry = {
  id: WidgetTypeId;
  label: string;
  description: string;
  defaultW: number;
  defaultH: number;
  minW?: number;
  minH?: number;
  /** Reserved for implicit / explicit wiring later. */
  ports: WidgetPort[];
  defaultProps?: Record<string, unknown>;
};

const entries: Record<WidgetTypeId, WidgetRegistryEntry> = {
  camera_arm1: {
    id: "camera_arm1",
    label: "Camera — Arm 1",
    description: "Live video for arm 1",
    defaultW: 4,
    defaultH: 10,
    minW: 3,
    minH: 6,
    ports: [],
    defaultProps: {
      armName: "Arm 1",
      armId: 1,
      enabled: true,
    },
  },
  camera_arm2: {
    id: "camera_arm2",
    label: "Camera — Arm 2",
    description: "Live video for arm 2",
    defaultW: 4,
    defaultH: 10,
    minW: 3,
    minH: 6,
    ports: [],
    defaultProps: {
      armName: "Arm 2",
      armId: 2,
      enabled: false,
    },
  },
  nlp_prediction: {
    id: "nlp_prediction",
    label: "NLP prediction",
    description: "Shows parsed command predictions",
    defaultW: 4,
    defaultH: 8,
    minW: 3,
    minH: 4,
    ports: [],
    defaultProps: {},
  },
  command_prompt: {
    id: "command_prompt",
    label: "Command prompt",
    description: "Type natural-language commands and send to NLP",
    defaultW: 4,
    defaultH: 10,
    minW: 3,
    minH: 6,
    ports: [],
    defaultProps: {},
  },
  command_log: {
    id: "command_log",
    label: "Command log",
    description: "Recent commands and status lines",
    defaultW: 4,
    defaultH: 8,
    minW: 3,
    minH: 4,
    ports: [],
    defaultProps: {},
  },
  control_panel: {
    id: "control_panel",
    label: "Manual control",
    description: "Arrow / manual control panel",
    defaultW: 4,
    defaultH: 12,
    minW: 3,
    minH: 8,
    ports: [],
    defaultProps: {},
  },
};

export function getWidgetMeta(typeId: WidgetTypeId): WidgetRegistryEntry {
  return entries[typeId];
}

export function listPaletteWidgets(): WidgetRegistryEntry[] {
  return Object.values(entries);
}
