aws dynamodb create-table \
  --endpoint-url http://localhost:4566 \
  --table-name Raps \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10