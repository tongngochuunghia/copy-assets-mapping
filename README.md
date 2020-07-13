```
                                                 _                                 _       _
   ___ ___  _ __  _   _        __ _ ___ ___  ___| |_ ___       _ __ ___   ___   __| |_   _| | ___
  / __/ _ \| '_ \| | | |_____ / _` / __/ __|/ _ \ __/ __|_____| '_ ` _ \ / _ \ / _` | | | | |/ _ \
 | (_| (_) | |_) | |_| |_____| (_| \__ \__ \  __/ |_\__ \_____| | | | | | (_) | (_| | |_| | |  __/
  \___\___/| .__/ \__, |      \__,_|___/___/\___|\__|___/     |_| |_| |_|\___/ \__,_|\__,_|_|\___|
           |_|    |___/
 Version v1.0.0 - tongngochuunghia@gmail.com
```

Welcome to the `copy-assets-mapping`!

## Introduction
CLI tools used to copy file mapping from `node_modules` to projects (`plugins` or `libs`).

**Before**
```
root
+-- node_modules
|   +-- fontawesome-free
|       +-- css
|       |   |-- all.css
|       |   |-- all.min.css
|       |
|       +-- webfonts
|           |-- fontawesome-free.otf
|           |-- fontawesome-free.eot
|           |-- fontawesome-free.svg
|           |-- fontawesome-free.ttf
|           |-- fontawesome-free.woff
|           |-- fontawesome-free.woff2
|
+-- public
|   |-- .gitignore
|
|-- mapping.json
|-- package.json
|-- README.md
```

**Using `copy-assets-mapping`**
```bash
$ copy-assets-mapping mappingPath=./mapping.json
```

**After**
```
root
+-- node_modules
|   +-- fontawesome-free
|       +-- css
|       |   |-- all.css
|       |   |-- all.min.css
|       |
|       +-- webfonts
|           |-- fontawesome-free.otf
|           |-- fontawesome-free.eot
|           |-- fontawesome-free.svg
|           |-- fontawesome-free.ttf
|           |-- fontawesome-free.woff
|           |-- fontawesome-free.woff2
|
+-- public
|   +-- css
|   |   |-- all.css
|   |   |-- all.min.css
|   |
|   +-- webfonts
|   |   |-- fontawesome-free.otf
|   |   |-- fontawesome-free.eot
|   |   |-- fontawesome-free.svg
|   |   |-- fontawesome-free.ttf
|   |   |-- fontawesome-free.woff
|   |   |-- fontawesome-free.woff2
|   |
|   |-- .gitignore
|
|-- mapping.json
|-- package.json
|-- README.md
```

## System Requirements
- [Node.js 12.16.1](https://nodejs.org/en/) or later
- MacOS, Windows and Linux are supported

## Setup
Install `copy-assets-mapping` in your project:
```bash
npm install https://github.com/tongngochuunghia/copy-assets-mapping.git
# or
yarn add https://github.com/tongngochuunghia/copy-assets-mapping.git
```

Open `package.json` and add the following `scripts`:
```bash
"scripts": {
  "copy-assets": "copy-assets-mapping --mapping=./mapping.json"
}
```
- `--mapping`: The file mapping config with json format, default `./mapping.json`
- `--debug`: Enabled debug mode, default `false`
```json
[
  {
    "from": "node_modules/fontawesome-free/css",
    "to": "public/fontawesome-free/css"
  },
  {
    "from": "node_modules/fontawesome-free/webfonts",
    "to": "public/fontawesome-free/webfonts"
  }
]
```

## Using
```bash
$ npm run copy-assets
# or
$ yarn copy-assets
```

## Reference
- [Build a JavaScript Command Line Interface (CLI) with Node.js](https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/)
