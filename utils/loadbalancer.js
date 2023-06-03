const loadBalancer = {}

loadBalancer.ROUND_ROBIN = (service) => {
  // service is the object in registery.services
  const newIndex = ++service.index >= service.instances.length ? 0 : service.index
  service.index = newIndex
  return newIndex
}

// to use it via the require in index.js
module.exports = loadBalancer