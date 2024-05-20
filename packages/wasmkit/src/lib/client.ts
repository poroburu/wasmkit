import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";
import chalk from "chalk";
import { SecretNetworkClient, Wallet } from "secretjs";
import { Coin } from "secretjs/dist/protobuf/cosmos/base/v1beta1/coin";

import { WasmkitError } from "../internal/core/errors";
import { ERRORS } from "../internal/core/errors-list";
import { Account, ChainType, Network, TxnStdFee } from "../types";
import { defaultFees } from "./constants";

export async function getClient (
  network: Network
): Promise<SecretNetworkClient | CosmWasmClient> {
  const chain = getChainFromAccount(network);
  switch (chain) {
    case ChainType.Secret: {
      return new SecretNetworkClient({
        chainId: network.config.chainId,
        url: network.config.endpoint
      });
    }
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
): Promise<SecretNetworkClient | SigningCosmWasmClient> {
  const chain = getChainFromAccount(network);
  switch (chain) {
    case ChainType.Secret: {
      const wall = new Wallet(account.mnemonic);
      return new SecretNetworkClient({
        url: network.config.endpoint,
        chainId: network.config.chainId,
        wallet: wall,
        walletAddress: account.address
      });
    }
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
  signingClient: SecretNetworkClient | SigningCosmWasmClient,
  sender: string,
  contractName: string,
  wasmFileContent: Buffer,
  customFees?: TxnStdFee,
  source?: string,
  builder?: string
): Promise<{codeId: number, contractCodeHash: {code_hash: string}}> {
  const networkName = getChainFromAccount(network);
  switch (networkName) {
    case ChainType.Secret: {
      const inGasLimit = parseInt(customFees?.gas as string);
      const inGasPrice =
        parseFloat(customFees?.amount[0].amount as string) /
        parseFloat(customFees?.gas as string);
      signingClient = signingClient as SecretNetworkClient;
      const uploadReceipt = await signingClient.tx.compute.storeCode(
        {
          sender: sender,
          wasm_byte_code: wasmFileContent,
          source: source ?? "",
          builder: builder ?? ""
        },
        {
          gasLimit: Number.isNaN(inGasLimit) ? undefined : inGasLimit,
          gasPriceInFeeDenom: Number.isNaN(inGasPrice) ? undefined : inGasPrice
        }
      );
      // console.log(uploadReceipt, "sds");
      const res = uploadReceipt?.arrayLog?.find(
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        (log: any) => log.type === "message" && log.key === "code_id"
      );
      if (res === undefined) {
        throw new WasmkitError(ERRORS.GENERAL.STORE_RESPONSE_NOT_RECEIVED, {
          jsonLog: JSON.stringify(uploadReceipt, null, 2),
          contractName: contractName
        });
      }
      const codeId = Number(res.value);
      const contractCodeHash = await signingClient.query.compute.codeHashByCodeId({
        code_id: codeId.toString()
      });
      const parsedContractCodeHash: {code_hash: string} =
        { code_hash: (contractCodeHash.code_hash === undefined) ? "" : contractCodeHash.code_hash };
      return { contractCodeHash: parsedContractCodeHash, codeId: codeId };
    }
    case ChainType.Juno:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      const uploadReceipt = await (signingClient as SigningCosmWasmClient).upload(
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
  signingClient: SecretNetworkClient | SigningCosmWasmClient,
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
    case ChainType.Secret: {
      if (contractCodeHash === "mock_hash") {
        throw new WasmkitError(ERRORS.GENERAL.CONTRACT_NOT_DEPLOYED, {
          param: contractName
        });
      }
      const inGasLimit = parseInt(customFees?.gas as string);
      const inGasPrice =
        parseFloat(customFees?.amount[0].amount as string) /
        parseFloat(customFees?.gas as string);

      const tx = await (signingClient as SecretNetworkClient).tx.compute.instantiateContract(
        {
          code_id: codeId,
          sender: sender,
          code_hash: contractCodeHash,
          init_msg: initArgs,
          label: label,
          init_funds: transferAmount
        },
        {
          gasLimit: Number.isNaN(inGasLimit) ? undefined : inGasLimit,
          gasPriceInFeeDenom: Number.isNaN(inGasPrice) ? undefined : inGasPrice
        }
      );

      // Find the contract_address in the logs
      const res = tx?.arrayLog?.find(
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        (log: any) => log.type === "message" && log.key === "contract_address"
      );
      if (res === undefined) {
        throw new WasmkitError(ERRORS.GENERAL.INIT_RESPONSE_NOT_RECEIVED, {
          jsonLog: JSON.stringify(tx, null, 2),
          contractName: contractName
        });
      }
      return res.value;
    }
    case ChainType.Juno:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Osmosis:
    case ChainType.Archway:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Terra: {
      const contract = await (signingClient as SigningCosmWasmClient).instantiate(
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
  signingClient: SecretNetworkClient | SigningCosmWasmClient,
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
    case ChainType.Secret: {
      const inGasLimit = parseInt(customFees?.gas as string);
      const inGasPrice =
        parseFloat(customFees?.amount[0].amount as string) /
        parseFloat(customFees?.gas as string);
      // eslint-disable-next-line
      return await (signingClient as SecretNetworkClient).tx.compute.executeContract(
        {
          sender: sender,
          contract_address: contractAddress,
          code_hash: contractCodeHash,
          msg: msgData,
          sent_funds: transferAmount as Coin[] | undefined
        },
        {
          gasLimit: Number.isNaN(inGasLimit) ? undefined : inGasLimit,
          gasPriceInFeeDenom: Number.isNaN(inGasPrice) ? undefined : inGasPrice,
          memo: memo
        }
      );
    }
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
  client: SecretNetworkClient | CosmWasmClient,
  network: Network,
  msgData: Record<string, unknown>,
  contractAddress: string,
  contractHash: string
): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
  const chain = getChainFromAccount(network);

  switch (chain) {
    case ChainType.Secret: {
      return await (client as SecretNetworkClient).query.compute.queryContract({
        contract_address: contractAddress,
        query: msgData,
        code_hash: contractHash
      });
    }
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
  client: SecretNetworkClient | CosmWasmClient,
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
    case ChainType.Secret: {
      const info = await (client as SecretNetworkClient).query.bank.balance({
        address: accountAddress,
        denom: balanceDenom
      });
      if (info === undefined) {
        throw new WasmkitError(ERRORS.GENERAL.BALANCE_UNDEFINED);
      }

      const infoBalance = info.balance ?? { amount: "0", denom: balanceDenom };
      const normalisedBalance: Coin = (infoBalance.amount === undefined ||
        infoBalance.denom === undefined) ? { amount: "0", denom: balanceDenom }
        : { amount: infoBalance.amount, denom: infoBalance.denom };
      return [normalisedBalance];
    }
    case ChainType.Juno:
    case ChainType.Archway:
    case ChainType.Neutron:
    case ChainType.Atom:
    case ChainType.Umee:
    case ChainType.Nibiru:
    case ChainType.Osmosis:
    case ChainType.Terra: {
      const info = await (client as CosmWasmClient)?.getBalance(accountAddress, balanceDenom);
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
