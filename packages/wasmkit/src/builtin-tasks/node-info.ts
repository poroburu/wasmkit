import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import chalk from "chalk";

import { task } from "../internal/core/config/config-env";
import { WasmkitError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { getChainFromAccount, getClient } from "../lib/client";
import { ChainType, TaskArguments, WasmkitRuntimeEnvironment } from "../types";
import { TASK_NODE_INFO } from "./task-names";

export default function (): void {
  task(TASK_NODE_INFO, "Prints node info and status")
    .setAction(nodeInfo);
}

async function nodeInfo (
  _taskArgs: TaskArguments,
  env: WasmkitRuntimeEnvironment
): Promise<void> {
  const client = await getClient(env.network);
  console.log(`[${chalk.gray("wasmkit")}] ${chalk.green("INF")}`, "Network:", chalk.green(env.network.name));
  console.log(`[${chalk.gray("wasmkit")}] ${chalk.green("INF")}`, "RPC URL:", chalk.green(env.network.config.endpoint));
  const chain = getChainFromAccount(env.network);

  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      console.log(`[${chalk.gray("wasmkit")}] ${chalk.green("INF")}`, "ChainId:", chalk.green(await (client).getChainId()));
      console.log(`[${chalk.gray("wasmkit")}] ${chalk.green("INF")}`, "Block height:", chalk.green(await (client).getHeight()));
      break;
    }
    // case ChainType.Injective: {

    // }
    default: {
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: env.network.config.accounts[0].address });
    }
  }
}
