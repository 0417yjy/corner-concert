# Node.js 기반 웹 서버

## 서버 측 명령어
* 도커 이미지 생성
    ```
    $ docker build -t [이름]:[버전] [위치]
    ~/corner-conert/webserver$ docker build -t coco-nodejs-webserver-docker:latest .
    ```

* 도커 컨테이너 실행
    ```
    $ docker run [이름]
    $ docker run coco-nodejs-webserver-docker
    ```

## 클라이언트 측 명령어
* 서버 상태 체크
    ```
    curl 124.111.89.191:53000/status # 개발중 테스트 포트
    curl 124.111.89.191:55000/status # 도커 컨테이너 포트 (상용화)
    ```
    *Server is on*