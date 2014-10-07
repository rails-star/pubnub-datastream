//=require ./online_list

var Chat = (function(){
    var Message = function(data){
        this.author = data.author
        this.message = data.message
        this.timetoken = data.timetoken
    }

    Message.prototype.toString = function() {
        return '[' + this.author + ']: ' + this.message
    };

    var Channel = function(name){
        this.name = name;
        this.$list = $('#'+name)
        this.history = [];
    }

    Channel.prototype.addMessage = function(message) {
        var message = new Message(message)
        this.history.push(message)
        this.outMessage(message)
    }

    Channel.prototype.outMessage = function(message) {
        var $li = $('<li class="list-group-item"></li>')
        $li.text(message.toString())
        this.$list.append($li)
        this.$list.scrollTop(this.$list.prop('scrollHeight'))
    }

    var Chat = function(nickname){
        this.$input = $('#chat_input')
        this.$submit = $('#submit')
        this.nickname = nickname
        this.channels = []
        this.users = new OnlineList(this)
        this.bindEvents(this)
    }

    Chat.prototype.bindEvents = function(self) {
        this.$submit.on('click', function(){
            if(self.$input.val()){
                self.sendMessage(self.$input.val())
                self.clearInput()
            }
        })
        this.$input.on('keydown', function(e){
            if(e.keyCode === 13 && self.$input.val()){
                self.sendMessage(self.$input.val())
                self.clearInput()
            }
        })
    }

    Chat.prototype.pushMessage = function(data){
        this.channels[data.channel].addMessage(data.message)
    }

    Chat.prototype.clearInput = function(data){
        this.$input.val('')
    }

    Chat.prototype.addChannel = function(name) {
        this.channels[name] = new Channel(name)
    }

    Chat.prototype.connectToServer = function() {
        var self = this
        setupPushServerConnection(this.nickname, 'main_channel', function(json){
            if(json.online){
                self.users.rebuild(json.online)
            } else if(json.message){
                self.pushMessage(json)
            }
        })
    }

    Chat.prototype.sendMessage = function(msg){
        $.post('/message', {author: this.nickname, message: msg}, function(){})
    }

    return Chat
})()
