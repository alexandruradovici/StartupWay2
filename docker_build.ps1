Write-Host $args[0]
$image_name = $args[0]
$tag = $args[1] 
$service = $args[2]
$label = $args[3]
docker build -t $image_name . --no-cache
docker tag ${image_name} techlounge/startupway:$tag
docker push techlounge/startupway:$tag
aws lightsail push-container-image --region eu-central-1 --service-name $service --label $label --image techlounge/startupway:$tag
