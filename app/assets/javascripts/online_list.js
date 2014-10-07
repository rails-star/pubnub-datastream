//=require ./user
var OnlineList = function(chat){
    this.chat = chat
    this.$el = $('#online_users')
    this.users = []
    this.initTimer();
}

OnlineList.prototype.rebuild = function(users) {
    var self = this;
    $.each(users, function(i, name){
        var user;
        if(user = self.findByName(name)) {
            user.online();
        } else {
            self.users.push(new User(name, self));
        }
    })
    this.turnOffUsers(users);
}

OnlineList.prototype.findByName = function(user) {
    for(var i=0; i < this.users.length; i++){
        if(this.users[i].name == user)
            return this.users[i];
    }
    return false;
}

OnlineList.prototype.turnOffUsers = function(users) {
    for(var i=0; i < this.users.length; i++){
        if(!(~users.indexOf(this.users[i].name))){
            if(this.users[i].isOnline)
                this.users[i].offline();
        }
    }
    return false;
}

OnlineList.prototype.updateUsers = function(time) {
    var self = this;
    $.each(this.users, function(i, user){
        if(user.isOver(time)){
            user.destroy();
            self.users.splice(i, 1);
        }
    })
}

OnlineList.prototype.initTimer = function() {
    var self = this;
    setInterval(function(){
        self.updateUsers(new Date())
    }, 200)
}

