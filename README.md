# A simple Multi Signature Wallet for BitDAO, ERC20, ERC721 transactions on Mantle Testnet [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40XCodeCarlos)](https://twitter.com/XCodeCarlos)

<p align="center">
  <a href="#"><img src="public/assets/images/logo.png?raw=true" width="50%" alt="Multi Signature Wallets for BitDAO"></a>
</p>

🚀 A multi signature wallet contract that can be used with ERC20, ERC721 and BitDAO transactions and a frontend built using NextJS.

 ⚡ Create, import and use multi signature wallets for BitDAO, ERC20 and ERC721 transactions on Mantle Testnet.

### Features

- ⚡ Allow create multisig wallets with multiple admins
- 💎 Allow deposit and send BitDAO(BIT) token
- 🪙 Allow deposit and send ERC20 tokens
- 🖼️ Allow deposit and send ERC721(NFT) tokens
- 🔥 Frontend using [Next.js](https://nextjs.org) v13.x

**This project is experimental, use at your own risk.**

### Requirements

- Node.js 16+/npm, yarn and metamask

### Getting started

1. Run the following command on your local environment to install all packages:

```shell
yarn install
```

2. Compile the solidity code to get the artifacts

```bash
> yarn hardhat compile
```

Then, you can run locally in development mode with live reload:

```shell
yarn run dev
```

Open http://localhost:3000 with your favorite browser to see your project.


### Deploy to production

You can see the results locally in production mode with:

```shell
$ yarn run build
$ yarn run start
```

### Testing

All tests are colocated with the source code inside the same directory. So, it makes it easier to find them. Unfortunately, it is not possible with the `pages` folder which is used by Next.js for routing. So, what is why we have a `pages.test` folder to write tests from files located in `pages` folder.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug. Totally open to any suggestions and improvements.

### License

Licensed under the MIT License, Copyright © 2023

See [LICENSE](LICENSE) for more information.
