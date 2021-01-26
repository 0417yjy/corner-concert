# 코딩 스타일 가이드
예로 드는 언어는 자바스크립트 문법
## 공통
* 변수, 함수의 식별자(identifier)는 **snake_style**로 작성하되, 단 클래스의 경우 **PascalCase** 형태로 작성
  ```
  let variable_name; // 변수 선언

  function do_something() {} // 함수 선언
  
  class ClassName { // 클래스 선언
      constructor() {}
  }
  ```
* 글로벌 상수 및 enum 원소는 전부 대문자, 즉 **UPPERCASE** 로 작성
  ```
  const PI = 3.141592;
  ```
* 가능한 주석은 친절하게 쓰되, 코드 읽는 데 방해되지 않도록 각 라인마다 달지는 않기
## HTML
* class와 id의 기능을 혼용하지 않고 구분. class는 **공통된 특성을 가진 여러 오브젝트**들을 지칭하며, id는 **해당 문서에서 유일한 오브젝트**에 이름을 붙임.