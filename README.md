# WasmKit

<p align="center" width="100%">
  <img src="./assets/wasm_kit_logo_light.png" width=25% height=25%>
</p>

WasmKit is a development framework for building the CosmWasm contracts. The aim of the project is to make CosmWasm contracts development process simple, efficient and scalable. Users can focus on the logic of CosmWasm contracts and not much about further steps in development.

It facilitates features such as initiating project repo from contract templates, easy compilation of contracts, deployment, Interacting with contracts using schema and contract testing framework.

## Support

Join [WasmKit's discord chat](https://discord.gg/vhYgNxy47y) for support, feedback, and general chatter.

## Features

✅ &nbsp;Bootstrap contract boilerplate<br/>
✅ &nbsp;Contract compilation made simple<br/>
✅ &nbsp;Typescript based interaction scripts<br/>
✅ &nbsp;Abstractions over networks, accounts and contracts<br/>
✅ &nbsp;Typescript based intergation tests<br/>
✅ &nbsp;Easily spin up local networks<br/>
✅ &nbsp;Autogenerate web based contract playgrounds with type safety<br/>
🏗️ &nbsp;Network state forking<br/>

## Requirements

- Node `v14+`
- Yarn `v1.22+` or NPM `v6.0+`

## Setup rust environment

WasmKit requires a Rust environment installed on a local machine to work properly. This Rust environment can be installed with the help of WasmKit in just a command.

```bash
wasmkit install
```

## Install wasmkit

### Installation from released version

To install WasmKit globally in your system you can use:

```bash
yarn global add @kubiklabs/wasmkit
```

or

```bash
npm install -g @kubiklabs/wasmkit
```

### Installation from source

```bash
git clone https://github.com/kubiklabs/wasmkit.git
cd wasmkit
yarn install
yarn build
cd packages/wasmkit
yarn link
chmod +x $HOME/.yarn/bin/wasmkit
```

### Install dependencies

Setup Rust compiler:

```bash
cd infrastructure
make setup-rust
```

Follow our infrastructure README for instructions on how to set up a private network.

## Usage

### Initialize a project

```bash
wasmkit init <project-name>
```

This will create a directory <project-name> inside the current directory with boiler-plate code. The `contracts/` directory has all the rust files for the contract logic. `scripts/` directory contains  `.js` scripts that users can write according to the use case, a sample script has been added to give some understanding of how a user script should look like. `test/` directory contains `.js` scripts to run tests for the deployed contracts.

### Listing tasks

To see the possible tasks (commands) that are available, go to the project's folder. 

```bash
wasmkit
``` 

This is the list of built-in tasks. This is your starting point to find out what tasks are available to run.

### Compile the project

To compile the contracts, Go to project directory:

```bash
cd <project-name>
wasmkit compile
```

This command will generate compiled `.wasm` files in `artifacts/contracts/` directory and schema `.json` files in `artifacts/schema/` directory.

### Cleanup artifacts

To clear artifacts data, use

```bash
wasmkit clean
``` 
This will remove the `artifacts/` directory completely. To clean artifacts for only one contract, use:

```bash
wasmkit clean <contract-name>
``` 

### Running user scripts

User scripts are a way to define the flow of interacting with contracts on some network in the form of a script. These scripts can be used to deploy a contract, query/transact with the contract. A sample script `scripts/sample-script.ts` is available in the boilerplate.

```bash
wasmkit run scripts/sample-script.ts
```

## Run tests

```bash
yarn run test
```

## License

This project is forked from hardhat, and just base on the hardhat-core part then modify it under MIT license.

## Thanks

[Hardhat](https://github.com/NomicFoundation/hardhat) - Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. Get Solidity stack traces & console.log.
