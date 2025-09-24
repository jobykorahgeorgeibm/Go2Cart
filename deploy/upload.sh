#!/bin/bash

set -e

# Download jq binary for Linux 64-bit
if ! command -v jq >/dev/null 2>&1; then
  echo "Downloading jq binary..."
  curl -L -o /tmp/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
  chmod +x /tmp/jq
  export PATH="/tmp:$PATH"
fi

# Get Bearer Token
echo "Getting Bearer Token from IBM IAM..."

IAM_TOKEN=$(curl --silent --location 'https://iam.cloud.ibm.com/oidc/token' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode "apikey=$IBM_API_KEY" \
  --data-urlencode 'response_type=cloud_iam' \
  --data-urlencode 'grant_type=urn:ibm:params:oauth:grant-type:apikey' \
  | jq -r '.access_token')

if [[ "$IAM_TOKEN" == "null" || -z "$IAM_TOKEN" ]]; then
  echo "Failed to get IAM token."
  exit 1
fi

echo "Successfully received Bearer Token"

# Upload files from public folder (or build if you have one)
UPLOAD_DIR="public"  # or "build" if using a bundler

if [ ! -d "$UPLOAD_DIR" ]; then
  echo "Directory $UPLOAD_DIR does not exist."
  exit 1
fi

echo "Uploading files to COS..."

find $UPLOAD_DIR -type f | while read -r file; do
  # Path relative to UPLOAD_DIR
  REL_PATH=${file#$UPLOAD_DIR/}

  echo "Uploading $REL_PATH..."

  curl --silent --show-error --fail --location --request PUT "${COS_BUCKET_URL}${REL_PATH}" \
    --header "Authorization: Bearer $IAM_TOKEN" \
    --header "Content-Type: text/html" \
    --data-binary @"$file"

done

echo "✅ All files uploaded."
