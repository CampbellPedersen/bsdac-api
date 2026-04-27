aws --endpoint-url=http://localhost:4566 --region eu-west-1 s3 mb s3://bsdapp-rap-audio
aws --endpoint-url=http://localhost:4566 --region eu-west-1 s3api put-bucket-acl --bucket bsdapp-rap-audio --acl public-read
