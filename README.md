# C4t Block explorer (block-explorer-pw)

Block explorer for the camino block chain by c4t

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
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
