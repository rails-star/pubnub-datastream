var User = function(name, list){
    this.name = name;
    this.isOnline = true;
    this.$el = $('<li class="list-group-item"></li>');
    this.list = list;
    this.$name = $('<span class="name">'+name+'</span>');
    this.$state = $('<span class="state glyphicon glyphicon-user online"></span>');
    this.$elapsed = $('<span class="elapsed"></span>');
    $(this.$el).append(this.$state);
    $(this.$el).append(this.$name);
    $(this.$el).append(this.$elapsed);
    list.$el.append(this.$el);
}

User.prototype.online = function(){
    this.$state.removeClass('offline').addClass('online')
    this.isOnline = true;
    this.timer = null;
    this.updateTimer = null;
    this.$elapsed.text('');
}

User.prototype.offline = function(){
    this.$state.removeClass('online').addClass('offline')
    this.isOnline = false;
    this.timer = new Timer(60000, new Date());
    this.$elapsed.text('1 sec. ago')
}

User.prototype.isOver = function(time){
    if(!this.isOnline)
        this.updateEapsedTime(time);
    return this.timer && this.timer.isOver(time);
}

User.prototype.updateEapsedTime = function(time){
    if(this.updateTimer){
        if(this.updateTimer.isOver(time)){
            this.$elapsed.text(this.timer.elapsedSec(time) + ' sec ago');
            this.updateTimer = new Timer(3000, new Date)
        }
    } else {
        this.updateTimer = new Timer(3000, new Date)
    }
}

User.prototype.destroy = function(){
    this.$el.remove();
}
