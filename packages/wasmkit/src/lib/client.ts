import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";
import chalk from "chalk";
import { Coin } from "secretjs/dist/protobuf/cosmos/base/v1beta1/coin";

import { WasmkitError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { Account, ChainType, Network, TxnStdFee } from "../types";
import { defaultFees } from "./constants";

export async function getClient (
  network: Network
): Promise<CosmWasmClient> {
  const chain = getChainFromAccount(network);
  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Osmosis:
    case ChainType.Terra:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Archway:
    case ChainType.Neutron: {
      return await CosmWasmClient.connect(network.config.endpoint);
    }
    // case ChainType.Injective: {

    // }
    default: {
      console.log(`[${chalk.gray("wasmkit")}] ${chalk.red("ERR")}`, "Error from client");

      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

export async function getSigningClient (
  network: Network,
  account: Account
): Promise<SigningCosmWasmClient> {
  const chain = getChainFromAccount(network);
  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "juno"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Neutron: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "neutron"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Atom: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "cosmos"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Umee: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "umee"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Nibiru: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "nibi"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Osmosis: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "osmo"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Terra: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        hdPaths: [makeCosmoshubPath(0)],
        prefix: "terra"
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    case ChainType.Archway: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
        prefix: 'archway'
      });
      return await SigningCosmWasmClient.connectWithSigner(
        network.config.endpoint,
        wallet
      );
    }
    // case ChainType.Injective: {

    // }
    default: {
      console.log(`[${chalk.gray("wasmkit")}] ${chalk.red("ERR")}`, "Error from signing client");
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

export function getChainFromAccount (network: Network): ChainType {
  if (network.config.accounts.length === 0) { // no account prefix, use neutron
    return ChainType.Neutron;
  } else if (network.config.accounts[0].address.startsWith("juno")) {
    return ChainType.Juno;
  } else if (network.config.accounts[0].address.startsWith("osmo")) {
    return ChainType.Osmosis;
    // } else if (network.config.accounts[0].address.startsWith("inj")) {
    //   return ChainType.Injective;
  } else if (network.config.accounts[0].address.startsWith("archway")) {
    return ChainType.Archway;
  } else if (network.config.accounts[0].address.startsWith("neutron")) {
    return ChainType.Neutron;
  } else if (network.config.accounts[0].address.startsWith("cosmos")) {
    return ChainType.Atom;
  } else if (network.config.accounts[0].address.startsWith("umee")) {
    return ChainType.Umee;
  } else if (network.config.accounts[0].address.startsWith("nibi")) {
    return ChainType.Nibiru;
  } else if (network.config.accounts[0].address.startsWith("terra")) {
    return ChainType.Terra;
  } else if (network.config.accounts[0].address.startsWith("secret")) {
    return ChainType.Secret;
  } else {
    throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
      { account: network.config.accounts[0].address });
  }
}

export async function storeCode (
  network: Network,
  signingClient: SigningCosmWasmClient,
  sender: string,
  contractName: string,
  wasmFileContent: Buffer,
  customFees?: TxnStdFee,
  source?: string,
  builder?: string
): Promise<{codeId: number, contractCodeHash: {code_hash: string}}> {
  const networkName = getChainFromAccount(network);
  switch (networkName) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      const uploadReceipt = await (signingClient).upload(
        sender,
        wasmFileContent,
        customFees ?? network.config.fees?.upload ?? defaultFees.upload,
        "uploading"
      );
      const codeId: number = uploadReceipt.codeId;
      return { codeId: codeId, contractCodeHash: { code_hash: "not_required" } };
    }
    default: {
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

export async function instantiateContract (
  network: Network,
  signingClient: SigningCosmWasmClient,
  codeId: number,
  sender: string,
  contractName: string,
  contractCodeHash: string,
  initArgs: Record<string, unknown>,
  label: string,
  transferAmount?: Coin[],
  customFees?: TxnStdFee,
  contractAdmin?: string | undefined
): Promise<string> {
  const chain = getChainFromAccount(network);
  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      const contract = await (signingClient).instantiate(
        sender,
        codeId,
        initArgs,
        label,
        customFees ?? network.config.fees?.init ?? defaultFees.init,
        {
          funds: transferAmount,
          admin: contractAdmin
        }
      );
      return contract.contractAddress;
    }
    // case ChainType.Injective: {

    // }
    default: {
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}
export async function executeTransaction (
  network: Network,
  signingClient: SigningCosmWasmClient,
  sender: string,
  contractAddress: string,
  contractCodeHash: string,
  msgData: Record<string, unknown>,
  transferAmount?: readonly Coin[],
  customFees?: TxnStdFee,
  memo?: string
): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
  const chain = getChainFromAccount(network);

  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      const customFeesVal: TxnStdFee | undefined = customFees !== undefined
        ? customFees : network.config.fees?.exec;
      // eslint-disable-next-line
      return await (signingClient as SigningCosmWasmClient).execute(
        sender,
        contractAddress,
        msgData,
        customFeesVal ?? network.config.fees?.exec ?? defaultFees.exec,
        memo === undefined ? "executing" : memo,
        transferAmount
      );
    }
    // case ChainType.Injective: {

    // }
    default: {
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

export async function sendQuery (
  client: CosmWasmClient,
  network: Network,
  msgData: Record<string, unknown>,
  contractAddress: string,
  contractHash: string
): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
  const chain = getChainFromAccount(network);

  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      // eslint-disable-next-line
      return await (client as SigningCosmWasmClient).queryContractSmart(contractAddress, msgData);
    }
    // case ChainType.Injective: {

    // }
    default: {
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

export async function getBalance (
  client: CosmWasmClient,
  accountAddress: string,
  network: Network
): Promise<Coin[]> {
  if (client === undefined) {
    throw new WasmkitError(ERRORS.GENERAL.CLIENT_NOT_LOADED);
  }
  const chain = getChainFromAccount(network);

  let balanceDenom = "";
  switch (chain) {
    case ChainType.Secret: {
      balanceDenom = "uscrt";
      break;
    }
    case ChainType.Juno: {
      balanceDenom = "ujuno";
      break;
    }
    case ChainType.Archway: {
      balanceDenom = "aarch";
      break;
    }
    case ChainType.Neutron: {
      balanceDenom = "untrn";
      break;
    }
    case ChainType.Atom: {
      balanceDenom = "uatom";
      break;
    }
    case ChainType.Umee: {
      balanceDenom = "uumee";
      break;
    }
    case ChainType.Nibiru: {
      balanceDenom = "unibi";
      break;
    }
    case ChainType.Osmosis: {
      balanceDenom = "uosmo";
      break;
    }
    case ChainType.Terra: {
      balanceDenom = "uluna";
      break;
    }
  }

  switch (chain) {
    case ChainType.Secret:
    case ChainType.Juno:
    case ChainType.Archway:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Osmosis:
    case ChainType.Terra: {
      const info = await (client)?.getBalance(accountAddress, balanceDenom);
      if (info === undefined) {
        throw new WasmkitError(ERRORS.GENERAL.BALANCE_UNDEFINED);
      }
      return [info];
    }
    // case ChainType.Injective: {

    // }
    default: {
      console.log(`[${chalk.gray("wasmkit")}] ${chalk.red("ERR")}`, "Error fetching balance");
      throw new WasmkitError(ERRORS.NETWORK.UNKNOWN_NETWORK,
        { account: network.config.accounts[0].address });
    }
  }
}

// export async function accountInfo(): Promise<any> {

// }
