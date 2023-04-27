require_relative '../services/completion_service'

class CompletionsController < ApplicationController
  def generate_completion
    text = params[:text]
    completion_size = params[:completionSize]
    service = CompletionService.new
    completion_response = service.generate_completion(text, completion_size)
    render json: { result: completion_response }
  end
end
