# Deployment helpers

These shell scripts support self-hosted VPS deployments. They are optional and should be reviewed and adapted to your environment before use.

- `deploy.sh` and `vps-deploy.sh` provision Docker-based deployments.
- `update.sh` rebuilds and restarts the application.
- `setup-ssl.sh` configures TLS certificates.
- `check-vps-config.sh` and `rebuild-studio.sh` assist with troubleshooting and Studio rebuilds.

Do not store server addresses, passwords, API tokens, or TLS certificates in the repository. See the [Docker deployment guide](../../docs/deployment/DOCKER_DEPLOYMENT_GUIDE.md) for the deployment workflow.
