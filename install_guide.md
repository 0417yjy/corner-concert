# Install Guide
개발하기 위해 설치하는 방법을 적어놓는 문서

# 1. 레포지토리 클론
> [Git](https://git-scm.com/downloads) 설치 후 잘 설치되었는지 확인
> > cmd에서 ```git``` 치고 엔터 -> 각 명령어에 대한 설명이 나오면 잘 설치된 것


## 1.1. 커맨드라인으로 클론하기
1. 설치하고자 하는 폴더에서 우클릭 -> Git Bash Here
    ![git_bash_clone_1](https://i.imgur.com/s1sXj0L.png)
2. 클론 명령어 치고 엔터
    ```
    git clone https://github.com/0417yjy/corner-concert.git
    ```
## 1.2. 비주얼 스튜디오 코드로 클론하기
1. 에서 F1 -> Git:Clone -> URL(https://github.com/0417yjy/corner-concert.git) 쓰기
2. 설치하고자 하는 폴더 선택하여 클론

# 2. 일렉트론 설치
1. 클론한 폴더에 들어가기 & coco 폴더로 이동
   ```
   cd coco
   ```
2. Node.js 설치되었는지 확인
    ```
    node -v
    npm -v
    ```
3. Electron 설치
    ```
    npm i
    ```

# 3. 일렉트론 실행
```
npm start
```
![electron_demo](https://i.imgur.com/RVk45Cf.png)
