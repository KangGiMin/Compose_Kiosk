// 키오스크가 켜졌을 때 가장 먼저 뜨는 화면이고, 여기서 선택한 값(매장 or 포장)에 따라 다음 메뉴 화면으로 넘어가게 됨

import React from 'react';

// 부모 컴포넌트(App.tsx 등)에서 매장/포장 선택 결과를 받을 함수 타입 정의
interface LandingScreenProps {
  onSelectOrderType: (type: 'DINE_IN' | 'TAKE_OUT') => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onSelectOrderType }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 select-none">
      
      {/* 1. 상단 브랜딩 영역 (컴포즈 특유의 노란색 배경) */}
      <div className="flex flex-col items-center justify-center w-full h-2/5 bg-yellow-400 rounded-b-[40px] shadow-md">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter mb-2">
          COMPOSE COFFEE
        </h1>
        <p className="text-gray-800 font-medium text-lg">
          주문하실 방법을 선택해 주세요
        </p>
      </div>

      {/* 2. 하단 선택 버튼 영역 */}
      <div className="flex flex-col sm:flex-row gap-8 mt-16 w-full max-w-3xl px-8">
        
        {/* 매장 버튼 */}
        <button
          onClick={() => onSelectOrderType('DINE_IN')}
          className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-12 transition-all active:scale-95 border-4 border-transparent hover:border-yellow-400"
        >
          <div className="text-8xl mb-6">☕️</div>
          <span className="text-4xl font-extrabold text-gray-800 mb-2">매장</span>
          <span className="text-gray-500 font-medium">먹고 가기</span>
        </button>

        {/* 포장 버튼 */}
        <button
          onClick={() => onSelectOrderType('TAKE_OUT')}
          className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-12 transition-all active:scale-95 border-4 border-transparent hover:border-yellow-400"
        >
          <div className="text-8xl mb-6">🛍️</div>
          <span className="text-4xl font-extrabold text-gray-800 mb-2">포장</span>
          <span className="text-gray-500 font-medium">가져 가기</span>
        </button>

      </div>
    </div>
  );
};

export default LandingScreen;