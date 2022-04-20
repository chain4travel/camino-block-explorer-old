# C4t Block explorer (block-explorer-pw)

Block explorer for the camino block chain by c4t.

Uses [Quasar](https://quasar.dev/) with the quasar cli and vite as build tools.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

#### This has some issues when using AvalancheJS that need to be ironed out

```bash
quasar dev
```

#### Current best way to build and run locally (does not have hot reload, but works with AvalancheJS)

Requires Quasar to be installed globally (for the serve part)

```bash
quasar build && quasar serve dist/spa
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Run production build artifact

```bash
quasar serve dist/spa
```

## Known issues

- AvalancheJs does not work in dev mode (quasar dev). Therefore atm

```
quasar build && quasar serve dist/spa
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
