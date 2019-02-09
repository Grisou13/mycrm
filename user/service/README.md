# Auth service

# Requests

auth login: -> new token
- identifier: string
- password: password

user create: -> new user
- username: string
- email: string
- password: string
- user_id: string

Generate Token: -> return jwt token
- user_id: string
- anything else wanted to encode in jwt