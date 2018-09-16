Merkling Starter
================

This is a basic introduction to merkling usage.

Usage
-----

Install the deps

```bash
npm install
```

Run a local ipfs node

```bash
ipfs daemon
```

Run the demo script

```bash
node src/index.js
```

The main file `src/index.js` is commented to give an overview. After running the file your local
ipfs node should be populated so that you can query into it i.e.

```bash
ipfs dag get zdpuAqShHoxaooxWFbCfuNSEDT5u92CpSRykv5GQnBDJohW6B/versions/v2/description
```

Have fun, and any feedback is more than welcome!