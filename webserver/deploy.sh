# 도커로 배포하는 자동 스크립트

# 변수 선언
image_name="coco-nodejs-webserver-docker"
container_name="coco-webserver-container-"
container_num=${1:-1}
test_url="124.111.89.191:55000/status"

# 스크립트 시작
printf "1. Remove current working containers...\n"
docker rm $(docker stop $(docker ps -q --filter "name=${container_name}"))
printf "Complete\n\n"

printf "2. Remove old webserver docker image..."
docker rmi ${image_name}
printf "Complete\n\n"

printf "3. Build a image from current source..."
docker build -t ${image_name}:latest .
printf "Complete\n\n"

printf "4. Make %d containers to run...\n" $container_num
for ((i=0;i<container_num;i++)); do
    docker run --restart="always" -p 5000:3000 -d --name ${container_name}${i} ${image_name}
done
printf "Complete\n\n"

printf "5. Test if server is on\n"
sleep 1
curl ${test_url}
printf "\n"