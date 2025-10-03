export function applyInputs(ref: any, inputs: Record<string, unknown>) {
  Object.entries(inputs).forEach(([k, v]) => ref.setInput(k, v));
}
