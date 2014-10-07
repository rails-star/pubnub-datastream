class ChatController < ApplicationController
  respond_to :html, :json

  def index
    @name = cookies[:name]
    render :login unless @name
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

  def logout
    cookies.delete :name
    redirect_to root_url
  end

  def message
    msg = {author: params[:author], message: params[:message]}
    PubnubListener.publish msg
    render json: {status: 'ok'}
  end

end
