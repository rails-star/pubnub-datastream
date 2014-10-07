Rails.application.routes.draw do

  resource :chat, path: '/', only: [:index] do
    collection do
      post :login, to: 'chat#subscribe'
      delete :logout, to: 'chat#logout'
      post :message, to: 'chat#message'
    end
  end

  root to: 'chat#index'
end
