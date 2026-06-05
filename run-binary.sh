#!/bin/bash
# Helper script to run the json-endpoints binary with environment variables

# Parse arguments
ENV_FILE=".env"
BINARY_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --env-file)
      ENV_FILE="$2"
      BINARY_ARGS+=("--env-file" "$2")
      shift 2
      ;;
    *)
      BINARY_ARGS+=("$1")
      shift
      ;;
  esac
done

# Load environment from .env file if it exists (fallback for system env)
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment from: $ENV_FILE"
  export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
else
  echo "Warning: $ENV_FILE not found, using system environment variables"
fi

# Set defaults
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-production}

# Run the binary with arguments
./dist/json-endpoints "${BINARY_ARGS[@]}"
