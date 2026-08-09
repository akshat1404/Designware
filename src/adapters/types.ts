import type { TokenSpec } from "../schema/tokenSpec.js";

/**
 * Normalizes one company's raw token package into the internal TokenSpec
 * shape. Reads installed package contents directly (no network call) —
 * each adapter is one-off code since every package ships a different
 * shape (Carbon splits color/layout/theme across three packages; Atlaskit
 * and Polaris bundle everything into one).
 */
export type TokenAdapter = () => TokenSpec | Promise<TokenSpec>;
