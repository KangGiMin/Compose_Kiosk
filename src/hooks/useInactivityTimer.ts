import { useEffect, useRef, useState, useCallback } from 'react';

export const useInactivityTimer = (
  onReset: () => void, // 타이머가 끝났을 때 실행할 함수 (홈으로 이동 + 장바구니 초기화)
  inactivityTime = 60000, // 아무것도 안 할 때 모달이 뜨기까지의 대기 시간 (기본 60초)
  warningTime = 10000 // 모달이 뜬 후 최종 초기화까지의 카운트다운 시간 (기본 10초)
) => {
  // 모달을 띄울지 말지 결정하는 상태
  const [showWarning, setShowWarning] = useState(false);
  // 모달에 보여줄 남은 시간 (초)
  const [timeLeft, setTimeLeft] = useState(warningTime / 1000);
  
  // 뒤에서 몰래 돌아가는 타이머들을 담아둘 바구니 (렌더링에 영향 안 주게 useRef 사용)
const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머를 맨 처음 상태로 싹 리셋하고 다시 시작하는 함수
  const startIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    
    setShowWarning(false);
    setTimeLeft(warningTime / 1000);

    // 1. 60초짜리 거대한 시한폭탄 세팅
    idleTimer.current = setTimeout(() => {
      setShowWarning(true); // 60초 동안 아무 일도 없으면 모달 띄우기!

      // 2. 모달이 뜨면 1초마다 남은 시간을 깎아내리는 타이머 시작
      countdownInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 시간이 0이 되면 모든 타이머 부수고 부모가 준 onReset 함수 실행
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            setShowWarning(false);
            onReset();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, inactivityTime);
  }, [inactivityTime, warningTime, onReset]);

  // 사용자가 화면을 터치하거나 마우스를 움직일 때마다 실행되는 함수
  const handleUserActivity = useCallback(() => {
    // 경고 모달이 이미 떠있는 상태가 아닐 때만 타이머를 계속 뒤로 미룸
    if (!showWarning) {
      startIdleTimer();
    }
  }, [showWarning, startIdleTimer]);

  // 모달에서 '계속하기' 버튼을 눌렀을 때 수동으로 타이머를 연장해 주는 함수
  const extendTimer = () => {
    startIdleTimer();
  };

  useEffect(() => {
    // 키오스크니까 주로 터치(touchstart)랑 클릭(mousedown)을 빡세게 감지해!
    const events = ['mousedown', 'mousemove', 'keypress', 'touchstart', 'scroll'];
    
    // 컴포넌트 켜지자마자 화면 전체에 이벤트 리스너 달아주기
    events.forEach((event) => document.addEventListener(event, handleUserActivity));
    
    // 첫 타이머 가동
    startIdleTimer();

    // 컴포넌트 꺼질 때 찌꺼기 안 남게 청소(Cleanup)
    return () => {
      events.forEach((event) => document.removeEventListener(event, handleUserActivity));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [handleUserActivity, startIdleTimer]);

  // UI 쪽에선 이 3개만 갖다 쓰면 돼!
  return { showWarning, timeLeft, extendTimer };
};