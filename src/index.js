
const Merkling = require('merkling')

var ipfsAPI = require('ipfs-api')
// const IPFS = require('ipfs')

// Setup a local ipfs node and start it,
// you could substitute a js-ipfs-api instance in here
// if you wanted pointed at infura
// const ipfs = new IPFS({
//   repo: './.jsipfs'
// })

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

console.info('Starting IPFS node (internal to node process)')

const main = async () => {
  console.info('IPFS Loaded!')
  console.info('')

  const merkling = new Merkling({ ipfs: ipfs })

  // Create a js object and save it to IPFS
  // as an IPLD node thing
  const course = {
    name: 'consensys academy',
    year: 2018,
    description: 'A dive into Ethereum'
  }

  console.info('Saving course object:', course)
  const savedCourse = await merkling.save(course)

  console.info('Saved with CID - ', savedCourse._cid.toBaseEncodedString())

  // Read a saved object
  console.info('Get the course object from IPFS')
  const loadedCourse = await merkling.get(savedCourse._cid.toBaseEncodedString())

  console.info('Saved course object hash and retrieved one match:', loadedCourse._cid.toBaseEncodedString() === savedCourse._cid.toBaseEncodedString())

  // Both the saved and retrieved versions of the object have hidden properties
  // that are behind symbols: the cid and the status (saved, dirty, unloaded)
  console.info(loadedCourse)

  // You can change the course, but you need to resave it to get the changes
  // and a new hash
  const firstVersionHash = loadedCourse._cid.toBaseEncodedString()
  loadedCourse.year = 2019
  await merkling.save(loadedCourse)
  const secondVersionHash = loadedCourse._cid.toBaseEncodedString()
  console.info('Updated Hash', secondVersionHash)
  console.info('Before and after hash not equal: ', firstVersionHash !== secondVersionHash)

  // Things get more interesting with nested objects

  // Create an in-memory merkling object that has not been saved to the chain
  const registry = merkling.create({
    registry: 'Consensys Academy',
    versions: merkling.create({
      v1: savedCourse,
      v2: loadedCourse
    })
  })

  //   registry.versions.v1 = merkling.load(firstVersionHash)
  //   registry.versions.v2 = merkling.load(secondVersionHash)

  const savedRegistry = await merkling.save(registry)

  console.info(savedRegistry._cid.toBaseEncodedString())
  console.info('Using the ipfs cli you should be able to access both versions:')
  console.info('   ipfs dag get zdpuAqShHoxaooxWFbCfuNSEDT5u92CpSRykv5GQnBDJohW6B')
  console.info('   ipfs dag get zdpuAqShHoxaooxWFbCfuNSEDT5u92CpSRykv5GQnBDJohW6B/versions/v1')
  console.info('   ipfs dag get zdpuAqShHoxaooxWFbCfuNSEDT5u92CpSRykv5GQnBDJohW6B/versions/v2')

  const retrievedRegistry = await merkling.get(savedRegistry._cid)

  await merkling.resolve(retrievedRegistry.versions)
  await merkling.resolve(retrievedRegistry.versions.v1)
  await merkling.resolve(retrievedRegistry.versions.v2)

  console.info(retrievedRegistry.versions.v1.year)
  console.info(retrievedRegistry.versions.v1.year)

  process.exit(0)
}

main()
