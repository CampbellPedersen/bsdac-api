aws --endpoint-url=http://localhost:4566 s3 mb s3://bsdapp-rap-audio
aws --endpoint-url=http://localhost:4566 s3api put-bucket-acl --bucket bsdapp-rap-audio --acl public-read