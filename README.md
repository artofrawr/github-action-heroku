# Heroku Deploy - GitHub Action

A simple action to build, push and deploy containers to your Heroku app.

## How to use it

```yml
name: '' #set whatevername you want to your github job
on: {} # set the events you would like to trigger this job

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Build, Push and Deploy to Heroku
        uses: artofrawr/github-action-heroku@v1.0.0  # use the latest version of the action
        with:
          email: ${{ secrets.HEROKU_EMAIL }} # your heroku email
          api_key: ${{ secrets.HEROKU_API_KEY }} # your  heroku api key
          app_name: ${{ secrets.HEROKU_APP_NAME }} # you aplication name
          dockerfile: 'backend/Dockerfile' # set the path to the the Dockerfile
          process: 'web' # the process type you're deploying to
```

| Variables  | Required           | Default           |
| ------------- |:-------------:|:-------------:|
| email      | ✅| - |
| api_key      | ✅| - |
| app_name | ✅| - |
| dockerfile | ✅| - |
| process | ⬜| "web" |
