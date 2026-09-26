import React, { useEffect, useState } from 'react';

interface OrderCompleteScreenProps {
  onReturnHome: () => void; // 5초 뒤 또는 버튼을 눌렀을 때 랜딩 화면으로 돌아갈 함수
}

const OrderCompleteScreen: React.FC<OrderCompleteScreenProps> = ({ onReturnHome }) => {
  // 1. 화면에 보여줄 남은 시간 (초)
  const [timeLeft, setTimeLeft] = useState(5);

  // 2. 가짜 주문 번호 생성 (100 ~ 999 사이 랜덤 숫자)
  // 실제 서버랑 연결할 땐 백엔드에서 받아온 번호를 써야 해!
  const orderNumber = Math.floor(Math.random() * 900) + 100;

  useEffect(() => {
    // 1초(1000ms)마다 setInterval이 돌면서 timeLeft 상태를 1씩 깎아내림
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 정확히 5초(5000ms) 뒤에 onReturnHome 함수를 실행해서 화면을 전환함
    const timeout = setTimeout(() => {
      onReturnHome();
    }, 5000);

    // 컴포넌트가 화면에서 사라질 때(Unmount) 돌아가는 청소(Cleanup) 함수
    // 만약 손님이 5초를 안 기다리고 '처음으로' 버튼을 눌러서 나갔을 때, 
    // 뒤에서 타이머가 계속 돌아가서 에러를 내는 걸 막아주는 아주 중요한 녀석이야!
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onReturnHome]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-yellow-400 select-none">
      
      <div className="bg-white p-12 rounded-[40px] shadow-2xl flex flex-col items-center max-w-lg w-full text-center mx-4 border-4 border-yellow-200">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">주문이 완료되었습니다</h1>
        <p className="text-gray-500 font-medium mb-10 text-lg">결제하신 카드와 영수증을 챙겨주세요</p>

        {/* 주문 번호 빵! 띄워주는 영역 */}
        <div className="w-full bg-gray-50 rounded-3xl py-10 mb-10 border-2 border-gray-100 shadow-inner">
          <span className="text-gray-400 font-bold block mb-3 text-xl">주문번호</span>
          <span className="text-8xl font-black text-yellow-500 tracking-tighter">
            {orderNumber}
          </span>
        </div>

        {/* 카운트다운 텍스트 */}
        <p className="text-gray-600 font-bold mb-6 flex items-center justify-center gap-2">
          <span className="text-yellow-500 text-2xl">{timeLeft}</span>초 뒤에 처음 화면으로 돌아갑니다
        </p>

        {/* 성격 급한 손님을 위한 수동 버튼 */}
        <button
          onClick={onReturnHome}
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-extrabold text-xl hover:bg-gray-800 active:scale-95 transition-all w-full shadow-lg"
        >
          처음으로 돌아가기
        </button>
      </div>

    </div>
  );
};

export default OrderCompleteScreen;