param(
  [string]$ProjectName = "stop-webapp"
)

npm install -g @railway/cli
railway login
railway init --name $ProjectName
railway up
railway domain
