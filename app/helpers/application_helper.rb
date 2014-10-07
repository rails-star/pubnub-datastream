module ApplicationHelper
  def user_signed_in?
    @name.present?
  end
end
