# Data Stream Tutorial for Real-Time Web Apps with Ruby on Rails | PubNub

You when you are finished with this tutorial, you will know how to send or receive “Hello!” to the PubNub Real-Time Network with the Ruby on Rails. 
The PubNub supports the gem called pubnub written by Ruby, you can use the data stream APIS of the pubnub gem directly.

Tutorial Contents:

* Getting Started
  
* Create the Project
    
* Create the Chatting Form

* Push Server

* Application architecture and server communications

* How to run the project from the git

## Getting Started
To complete the exercises in this tutorial you’ll need to have installed Ruby on Rails.
Ruby version required: 2.1.1
Rails version required:  4.1.0

## Step 1: Create the Project
Once you already installed the Ruby on Rails on your computer, you can create a project with the generate command.

```ruby
rails g pubnub_demos
```

### Add the PubNub gem 
In order to use the pubnub APIs, you need to add the pubnub gem onto the Gemfile.

### Add the Unicorn gem 
We use unicorn as the app server.
Then you can run the bundle command.	
```ruby
bundle install
```

## Step 2: Configuration
Now we need to set up the appropriate credentials to access the PubNub network. We do this by initializing our PubNub API. Here we can define the publish_key and subscribe_key we will need to publish and subscribe to a channel.
Please open the config/pubnub.yml and define the publish_key and subscribe_key of your accounts on the pubnub as follows.

### Access the API  
```ruby
subscribe_key: sub-c-xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
publish_key: pub-c-yyyyyyy-yyyy-yyyyy-yyyy-yyyyyyyyyy
```

We defined the class called [PubnubListener](https://github.com/alexbily/pubnub/blob/master/lib/pubnub_listener.rb) and [Notify](https://github.com/alexbily/pubnub/blob/master/lib/notifier.rb) for access the pubnub API. You can check this class in the github.	

## Step 3: Write the Controller
Now you need to create a controller, and define the methods.

### Send Messages 
It’s time to send a message to everyone around the world subscribed to channel. Because we have defined the sending message method in the PublishListener class so that you can send the message.
Once we are subscribed to the channel all we need to do is use the Publish API, specify the channelname and message we’d like to send. We’ll also include code to capture the response from PubNub.

### Subscribe & Publish to channel demo
```ruby
 def message
    msg = {author: params[:author], message: params[:message]}
    PubnubListener.publish msg
    render json: {status: 'ok'}
end
def subscribe
    @name = params[:user][:nickname]
    if @name.present?
      cookies[:name] = @name
      redirect_to root_url
    else
      flash[:notice] = 'Invalid name'
      render :login
    end
  end
```
### Register the route
Please add the routes into the config/route.rb file.
```ruby
  resource :chat, path: '/', only: [:index] do
    collection do
      post :message, to: 'chat#message'
    end
  end
```
That’s it, as soon as you make the publish call your message is replicated around the world and received by anyone subscribed to the channel.

## Step 4: Create the Chatting Form
Please put the text input box for send message and list for message history, send button as follows.

```haml
 = hidden_field_tag :nickname, @name
.well.col-md-3
  .panel.panel-primary
    .panel-heading
      %h3.panel-title Online
    .panel-body
      %ul.list-group#online_users
.well.col-md-9
  %ul.nav.nav-tabs#channel_tabs
    %li.active
      %a{href: '#main_channel', role: 'tab', data: {toggle: 'tab'} } Main Channel
  .tab_content
    %ul.tab-pane.list-group.message_list#main_channel
    .form-horizontal.col-md-12
      .form-group.col-md-10
        %input#chat_input.form-control
      %button#submit.btn.btn-primary.col-md-2
        send
```

###Login Page
![login](https://github.com/alexbily/pubnub/blob/master/doc/login.png)
         

### Chatting Room Page 
![chatting](https://github.com/alexbily/pubnub/blob/master/doc/chat.png)
            
##Step 5: Push Server
Please create the push_server.yml with content in the config directory of the project.
```ruby
Host: localhost
Port: 8082
```

Next, you need to import the [push server](https://github.com/alexbily/pubnub/tree/master/push_server) to the project from the git.

## Application architecture and server communications 
When application is initialized, rails server subscribes to pubnub channel in the active state for the whole lifetime of the app.
Browser authenticates in the app using user login and connects to node.js push-server using websockets.
When message is sent by user to the rails app, server-side code calls pubnub SDK method to publish the message into the channel.
When new message arrives via the pubnub channel to the railss app it forms http request to the push server and push server sends updates to all active clients
List of active users is formed from the list of active websocket connections.

![structure](https://github.com/alexbily/pubnub/blob/master/doc/structure.png)

# How to run this demo from git
1. install rvm
2. clone repo locally
3. cd app/ && bundle install
4. create config/push_server.yml with content
```
    host: localhost
    port: 8082
```
5. run rails server
```
    rails s
```

6. run push server
    cd push_server && node server

7. configure nginx
    upstream application {
      server 127.0.0.1:3000 max_fails=0 fail_timeout=20s;
    }

    upstream push_server {
      server 127.0.0.1:3333 max_fails=0 fail_timeout=20s;
    }

    server {
      listen 80;

      client_max_body_size 4G;
      root /path/to/app/demo_app;

      location @unicorn {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        include blocked.conf;

        proxy_pass http://application;
      }

      location ~ ^/broadcast? {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_set_header Connection keep-alive;
        proxy_buffering off;
        proxy_send_timeout 600s;

        proxy_pass http://push_server;
      }

      try_files /public/$uri @unicorn;

      error_page 500 502 503 504 /500.html;

    }

8. run application in browser by http://localhost/


