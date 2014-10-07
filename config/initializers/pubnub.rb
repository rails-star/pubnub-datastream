PubnubListener.subscribe do |envelope|
  if envelope.message['author'] && envelope.message['message']
    message = {
      author: envelope.message['author'],
      timetoken: envelope.timetoken,
      message: envelope.message['message']
    }
    Notifier.notify envelope.channel, message
  end
end
