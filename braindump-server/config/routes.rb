Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  match '*all', controller: 'application', action: 'cors_preflight_check', via: [:options]
  post '/api/completions', to: 'completions#generate_completion'
end
