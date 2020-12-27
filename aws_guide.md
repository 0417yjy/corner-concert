# AWS 가이드
## 기본정보
* 인스턴스 유형: t2.micro (EC2)
* Public IPv4 Address: 15.164.171.230
* Public IPv4 DNS: ec2-15-164-171-230.ap-northeast-2.compute.amazonaws.com
***

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

***
## 접속방법 - 무작정 따라하기
1. coco-aws-key.pem을 알기 쉬운 곳에 둔다 (예: corner-concert의 루트 경로)

    ![follow-pic-1](https://i.imgur.com/lr3VkR2.png)

2. 해당 경로에서 git bash 혹은 cmd를 연다
3. 위 SSH 접속 명령어를 입력하고 추가로 yes를 입력한다.

    ![follow-pic-2](https://i.imgur.com/8KK0igW.png)

4. ?? 성공!

    ![follow-pic-3](https://i.imgur.com/Wg1DlY0.png)