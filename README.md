# Firebase 와 연동한 SPA 채팅앱

## 사용 기술
- FrontEnd : React + semantic-ui-react Framwork, SASS, CSS-IN-JS
- BackEnd : Firebase
- MiddleWares : redux-devtools-extension, redux-logger
- Modules : react-redux, react-router-dom, styled-components, mime-types, moment, uuid

## 구현 기능
- 회원가입 & 로그인 + with Validation Check
- 채널 추가
- 텍스트, 이미지 메시지 전송

### 회원가입 & 로그인 + with Validation Check
![회원가입 & 로그인 + with Validation Check](https://github.com/LimEunSeop/assets/blob/master/images/react-firebase-practice/firebase-회원가입_로그인_로그아웃.gif?raw=true)

### 채널 추가
![채널 추가](https://github.com/LimEunSeop/assets/blob/master/images/react-firebase-practice/firebase-채널추가.gif?raw=true)

### 텍스트, 이미지 메시지 전송
![텍스트, 이미지 메시지 전송](https://github.com/LimEunSeop/assets/blob/master/images/react-firebase-practice/firebase-텍스트_이미지-메시지추가.gif?raw=true)

## 공부 내용 Memo
- 회원가입 후 user 상태업데이트를 한다면 then 로직에서 바로 처리하는 것이 좋다.
- 가입시 updateUserProfile 을 통해 auth 에 displayNam, photoURL 을 추가저장할 수 있다. 만약을 대비해 DB 에 따로넣어 추가처리를 대비하는것 뿐, 아직까진 DB 저장할 필요까진 없다.
- 콘솔의 auth 에서 displayName, photoURL 을 볼 수 있는 방법은 없다. 그래서 DB 같이 저장하나보다.
- firebase 데이터 수정 함수 : update(하위 선택한 노드만 수정), set(하위 전부 지우고 새로새팅)
- firebase.dataase().ref().on() 메서드는 비동기 리스너를 통해 데이터를 가져올 수 있고, 기본적으로 DB 변화를 감지하여 trigger 한다.
 'value' 이벤트는 child 전체를 가져오고 'child_added' 는 추가된 데이터 가져온다. 채팅에서는 이렇게 하되 기본 게시판은 SELECT 로 일회 데이터 로딩하는게 효과적일 것이다.
- push() 는 랜덤키 새로받아 엔트리 추가하기 위함이고, child() 는 정해진 키로 엔트리를 추가하기 위함이다.
- 채널 변경시 내가 생각하는 바람직한 로직 : 채널 클릭시 기존 child_added 이벤트 및 messages 상태 제거 & 로딩상태 true -> 새로운 이벤트 링크 및 messages 상태 초기화 하는 로직을 componentDidUpdate 라이프사이클에 추가한다.
- 모달에 있어야할 인터페이스 : Open 여부, close 핸들러, (필요한경우)인풋핸들러 및 submit핸들러
- 파일인풋 모달에 있어야할 인터페이스 : Valid Mime List, file 상태, 파일 mime 체크 메서드 (with mime-types 모듈)
- 폼에있어야될것 : modal관리 flag, 로딩, 에러, 폼데이터, submit 처리 메서드 등등..
- Firebase 파일 업로드 방법 : Uploadtask 를 storageRef.child(filePath).put(file, metadata) 등으로 업로드 수행 동시에 task 를 참조를 받고 그 참조로 업로드 테스크 이벤트 청취 후 업로드 완료되면 DownloadURL 을 받아 처리하면 된다.

## 의문점 Memo
- 아무리 실시간 업데이트가 필요한 채팅앱이라지만, child_added 는 최초 로드시 콜백을 여러번 호출하기 때문에 효율이 안 좋아 보인다. 그렇지만 카카오톡에서 봤듯이 채팅방의 메시지를 최초 로드할 때는 대략 20개? 몇개밖에 로드 안한다. 따라서 그정도의 효율은 무시가능해 보인다. 그렇지만 나는 한가지 경우를 추가하여 생각해보고 싶다. 만약 최초로드도 많고 실시간 로딩해야된다면?? 나는 최초로딩시 데이터를 한꺼번에 로드하고 child_added 를 추가하고 싶다. 이래야 loading spinner 를 효율적으로 표시할수 있기도 하다. RealtimeDatabase 에서는 불가능한걸까? Deprecated 된 DB니... Cloud FireStore 에서는 이 점을 구현해볼 수 있길 기대해본다. 
> 한 번에 데이터를 로딩하는 once() 라는 헬퍼가 있긴하다. 첫 로딩시에는 once 로 부르되 이후 업데이트는 child_added 를 수행하도록 한번 고민해보았지만, 제공되는 기능으로 불가능하다는 결론을 도출했다.

- Router 의 최상단에 Auth 변화 체크하여 user 상태를 변화시키는 AuthStateChanged 콜백이 있는데, 로그인 로그아웃시 각각 3번 호출된다. 뭔가 찝찝하다. 여러번 호출 안되는 방법 뭐가 있을까?
- 그와 관련해서 Router 연결되면 라이프사이클이 어찌들 되는지 좀 정리할 필요가 있어보인다..
