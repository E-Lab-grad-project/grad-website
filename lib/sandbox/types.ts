import type { LayoutItem } from "react-grid-layout";

export const WIDGET_TYPES = [
  "camera_arm1",
  "camera_arm2",
  "nlp_prediction",
  "command_prompt",
  "command_log",
  "control_panel",
] as const;

export type WidgetTypeId = (typeof WIDGET_TYPES)[number];

export type PlacedInstance = {
  instanceId: string;
  typeId: WidgetTypeId;
  /** Overrides merged on top of registry `defaultProps` for this type. */
  props?: Record<string, unknown>;
};

export type SandboxState = {
  instances: PlacedInstance[];
  layout: LayoutItem[];
};

export type SandboxDerived = {
  capabilities: Record<string, boolean>;
  issues: string[];
};
