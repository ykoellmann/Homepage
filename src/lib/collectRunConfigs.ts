import type { RunConfigMeta } from "./runConfigTypes";

const modules = import.meta.glob("../pages/**/meta.ts", { eager: true }) as Record<
    string,
    { runConfig: RunConfigMeta } | { default?: any } | any
>;

// Normalisiere: akzeptiere export const runConfig = ...
export const runConfigs: RunConfigMeta[] = Object.values(modules)
    .map((m) => (m.runConfig ? m.runConfig : m.default?.runConfig ? m.default.runConfig : null))
    .filter(Boolean);