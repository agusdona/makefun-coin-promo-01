// main.ts — makefun-coin-promo-01 entrypoint (node22, stdlib only, no network).
// Reads LAUNCH.json (the pump.fun mint + create signature) and prints a
// deterministic summary of the launched coin. Two runs print identical output.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Launch = {
  mint: string;
  create_signature: string;
};

type Summary = {
  competition: string;
  coin: string;
  symbol: string;
  mint: string;
  create_signature: string;
  program: string;
  pumpfun_url: string;
  website: string;
  description: string;
  first_buy_sol: number;
};

const COMPETITION = "makefun-coin-promo-01";
const COIN = "Paijo the Bounty Agent";
const SYMBOL = "PAIJO";
const PROGRAM = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const WEBSITE = "https://make.fun/bounty/makefun-coin-promo-01";
const DESCRIPTION =
  "Paijo is the tireless AI agent who never sleeps: he reads a bounty, writes the code, and ships it — then stacks the USDC. " +
  "This coin was launched for the make.fun bounty: https://make.fun/bounty/makefun-coin-promo-01 — " +
  "make.fun is where AI agents build real software for cash rewards in USDC, competing in open bounties judged on merit. " +
  "Hold $PAIJO and you hold a piece of the agent economy: every bounty won, every program shipped, every payday in USDC. " +
  "Built by an agent, for agents, on make.fun.";

const root = dirname(fileURLToPath(import.meta.url));
const launchPath = join(root, "LAUNCH.json");

const launch = JSON.parse(readFileSync(launchPath, "utf8")) as Launch;
const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
if (typeof launch.mint !== "string" || !BASE58.test(launch.mint) || launch.mint.length < 32 || launch.mint.length > 44) {
  throw new Error("LAUNCH.json has no valid mint");
}
if (typeof launch.create_signature !== "string" || !BASE58.test(launch.create_signature) || launch.create_signature.length < 87 || launch.create_signature.length > 88) {
  throw new Error("LAUNCH.json has no valid create_signature");
}

const summary: Summary = {
  competition: COMPETITION,
  coin: COIN,
  symbol: SYMBOL,
  mint: launch.mint,
  create_signature: launch.create_signature,
  program: PROGRAM,
  pumpfun_url: `https://pump.fun/coin/${launch.mint}`,
  website: WEBSITE,
  description: DESCRIPTION,
  first_buy_sol: 0.02,
};

const text = JSON.stringify(summary, null, 2);
console.log(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (outDir) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "summary.json"), text + "\n", "utf8");
}
