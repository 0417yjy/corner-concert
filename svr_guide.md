# 서버 가이드
접속 명령어: `ssh 124.111.89.191 -p 50000 -l coco-dev`
*전력 낭비 방지를 위해 자주 끌 것이니 접속이 안 되면 켜달라고 할 것*
## 자주 쓰는 명령어
### 리눅스
* SSH 접속 명령어
    ```
    ssh -i "coco-aws-key.pem" ubuntu@ec2-15-164-171-230.ap-northeast-2.compute.amazonaws.com
    ```
* MySQL 서비스 재시작
    ```
    sudo systemctl restart mysql.service
    ```
* 우분투에서 MySQL 접속
    ```
    $ mysql -u coco-dev -p # 이후 비밀번호 요구 -> 비밀번호 입력 (화면에 출력 안됨)
    mysql> use coco; # 'coco' 데이터베이스 사용
    ```
* 전원종료
    ```
    sudo poweroff
    ```