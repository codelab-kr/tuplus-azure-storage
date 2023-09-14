
# Tuflix - video-storage (azure-storage)

이것은 Tuflix 의 하위 프로젝트인 video-storage (azure-storage) 입니다.
통합 실행 등 상세한 사항은
https://github.com/codelab-master/tuflix-deploy 을 참고해주세요.


## 마이크로서비스 개별 실행
- 개별 실행 시에는 docker 컨테이너를 사용하지 않습니다.
- 마이크로서비스 경로에 `start.sh`  파일이 경로에 존재하지 경우 `start.sh.example` 을 참고하여 작성합니다.
- 각 마이크로서비스 경로에서 `start.sh` 을 실행합니다.
  ```bash
  ./start.sh     # for production
  ./start.sh dev # for development
  ```
- 권한이 없다고 나오는 경우에는 `chmod +x start.sh` 를 실행합니다.
- 실행을 멈추고 싶을 때는 터미널에서 `Ctrl + C` 를 누릅니다.
