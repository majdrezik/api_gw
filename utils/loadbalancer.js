const loadBalancer = {}

loadBalancer.ROUND_ROBIN = (service) => {
  // service is the object in registery.services
  const newIndex = ++service.index >= service.instances.length ? 0 : service.index
  service.index = newIndex
  // before returning the newIndex, check whether the instance at that index is enabled/disabled
  return loadBalancer.isEnabled(service, newIndex, loadBalancer.ROUND_ROBIN)
}

loadBalancer.isEnabled = (service, newIndex, loadBalancerStrategy) => {
  return service.instances[newIndex].enabled ? newIndex : loadBalancerStrategy(service) // if disabled, call ROUND_ROBIN to get the next index
}
// to use it via the require in index.js
module.exports = loadBalancer