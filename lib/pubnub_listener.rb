require 'pubnub'

class PubnubListener

  CONFIG = ::Psych.load_file "#{::Rails.root}/config/pubnub.yml"

  @pubnub = Pubnub.new(
    :publish_key   => CONFIG['publish_key'],
    :subscribe_key => CONFIG['subscribe_key']
  )

  MAIN_CHANNEL = 'main_channel'

  class << self
    attr_reader :subscribed

    def subscribe channel = MAIN_CHANNEL, &block
      @pubnub.subscribe :channel  => channel, &block
    end

    def publish message, channel = MAIN_CHANNEL
      @pubnub.publish :channel  => channel, :message => message do
        puts 'Message sended'
      end
    end

    def unsubscribe channel = MAIN_CHANNEL, &block
      @pubnub.unsubscribe :channel  => channel, &block
    end

  end

end
