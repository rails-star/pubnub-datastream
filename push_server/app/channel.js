var Channel = function (name) {
  this.name = name
  this.subscriptions = []
  if (name)
    Channel.pool.push(this)
}

var arrayRemove = function (array, element) {
  var index = array.indexOf(element)
  if (index !== -1)
    array.splice(index, 1)
}

Channel.pool = []

Channel.prototype.subscribe = function (subscription) {
  this.subscriptions.push(subscription)
}

Channel.prototype.unsubscribe = function (subscription) {
  arrayRemove(this.subscriptions, subscription)
  this.broadcast(JSON.stringify({online: this.onlineUsers()}))
}

Channel.prototype.destroy = function () {
  this.name = null
  arrayRemove(Channel.pool, this)
}

Channel.prototype.onlineUsers = function(){
  var users = []
  for (var i = 0; i < this.subscriptions.length; i++) {
    users.push(this.subscriptions[i].nickname)
  }
  return users
}

Channel.prototype.broadcast = function (message) {
  var subscriptions = this.subscriptions
  for (var i = 0, l = subscriptions.length; i < l; i++)
    subscriptions[i].send(message)
}

Channel.getByName = function (channelName) {
  var channel
  for (var i = 0; i < Channel.pool.length; i++) {
    channel = Channel.pool[i]
    if (channel.name === channelName)
      return channel
  }
  return new Channel(channelName)
}

module.exports = Channel
