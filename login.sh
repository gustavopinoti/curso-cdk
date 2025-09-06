#!/bin/bash

# --- Variáveis de configuração ---
# Use as informações que você forneceu.
DOMAIN="curso-cdk"
ACCOUNT_ID=""
REGION="us-east-2"
REPOSITORY="constructs-cdk"
SCOPE="@curso-cdk"

CODEARTIFACT_URL_BASE="https://${DOMAIN}-${ACCOUNT_ID}.d.codeartifact.${REGION}.amazonaws.com"
CODEARTIFACT_REPO_URL="${CODEARTIFACT_URL_BASE}/npm/${REPOSITORY}/"


NPM_TOKEN=$(aws codeartifact get-authorization-token --domain "${DOMAIN}" --domain-owner "${ACCOUNT_ID}" --query authorizationToken --output text --region "${REGION}")

if [ -z "${NPM_TOKEN}" ]; then
    echo "Erro: Não foi possível obter o token de autenticação. Verifique suas credenciais da AWS."
    exit 1
fi
cat > .npmrc <<EOL
# Permite o acesso a pacotes públicos do registro padrão do NPM
registry=https://registry.npmjs.org/

# Configura o escopo para buscar pacotes privados no seu repositório do CodeArtifact
${SCOPE}:registry=${CODEARTIFACT_REPO_URL}

# Adiciona o token de autenticação para o seu repositório CodeArtifact
//${CODEARTIFACT_URL_BASE}/npm/${REPOSITORY}/:_authToken=${NPM_TOKEN}
EOL

echo "Arquivo .npmrc criado com sucesso!"
