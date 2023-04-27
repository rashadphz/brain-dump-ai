require 'openai'

class CompletionService
  def initialize
    token = ENV['OPENAI_API_KEY']
    @client = OpenAI::Client.new(access_token: token)
  end

  def tokens_for_word_count(word_count)
    (word_count * 1.3).to_i
  end

  def tokens_for_completion_size(completion_size)
    case completion_size
    when 'word'
      tokens_for_word_count(2)
    when 'sentence'
      tokens_for_word_count(10)
    when 'multiline'
      tokens_for_word_count(50)
    end
  end

  def generate_completion(prompt, completion_size)
    max_tokens = tokens_for_completion_size(completion_size)

    response = @client.chat(
      parameters: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system',
            content: 'Your job is to predict text that should follow my message. Give one prediction of what text might follow, DO NOT give any other context. This is not a chat.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: max_tokens,
        temperature: 0.7
      }
    )

    response.dig('choices', 0, 'message', 'content')
  end
end
