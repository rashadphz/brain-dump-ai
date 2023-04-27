class ApplicationController < ActionController::API
  before_action :cors_set_access_control_headers

  def cors_preflight_check
    return unless request.method == 'OPTIONS'

    cors_set_access_control_headers
    render text: '', content_type: 'text/plain'
  end

  protected

  def cors_set_access_control_headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] =
      'Origin, Content-Type, Accept, Authorization, Token, Auth-Token, Email, X-User-Token, X-User-Email'
    response.headers['Access-Control-Max-Age'] = '1728000'
  end
end
