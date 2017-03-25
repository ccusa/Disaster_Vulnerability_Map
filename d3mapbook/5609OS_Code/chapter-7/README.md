## Seed Project for D3 coding

A simple seed project to create testable d3 work

### Commands

Assumes that npm has been installed

```bash
npm install
```

Then to start the project

```bash
# Start http-server
node_modules/http-server/bin/http-server

# Start karma
node_modules/karma/bin/karma start
```

Compile the assets into a library:

```bash
# For compressed
uglifyjs scripts/* > scripts/chart.js
```

```bash
# for hackability, non minified
uglifyjs scripts/* -b
```

(If you need uglify)

```bash
npm install uglify-js -g
```