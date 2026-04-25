import type { PlacedInstance, SandboxDerived } from "./types";

function countByType(instances: PlacedInstance[], typeId: string): number {
  return instances.filter((i) => i.typeId === typeId).length;
}

/**
 * Pure derived state from placed instances. Extend later with edges / pairing rules.
 */
export function reconcileSandbox(instances: PlacedInstance[]): SandboxDerived {
  const issues: string[] = [];

  if (countByType(instances, "camera_arm1") > 1) {
    issues.push("Only one Arm 1 camera tile is recommended.");
  }
  if (countByType(instances, "camera_arm2") > 1) {
    issues.push("Only one Arm 2 camera tile is recommended.");
  }
  if (countByType(instances, "command_prompt") > 1) {
    issues.push("Multiple command prompt tiles may duplicate the same NLP calls.");
  }

  const hasArm1Cam = countByType(instances, "camera_arm1") >= 1;
  const hasArm2Cam = countByType(instances, "camera_arm2") >= 1;
  const hasNlp = countByType(instances, "nlp_prediction") >= 1;
  const hasPrompt = countByType(instances, "command_prompt") >= 1;
  const hasControl = countByType(instances, "control_panel") >= 1;

  const capabilities: Record<string, boolean> = {
    preview_arm1: hasArm1Cam,
    preview_arm2: hasArm2Cam,
    nlp_surface: hasNlp,
    command_prompt_surface: hasPrompt,
    manual_control_surface: hasControl,
    /** Example implicit “wiring”: control + NLP both present (extend later). */
    control_with_nlp_context: hasControl && hasNlp,
    prompt_with_nlp_preview: hasPrompt && hasNlp,
  };

  return { capabilities, issues };
}
