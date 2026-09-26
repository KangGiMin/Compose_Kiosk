// 메인 화면

import React, { useState } from 'react';
import { categories, menuItems } from '../../data/menuData';
import { useCartStore } from '../../store/cartStore';
// 나중에 모달 컴포넌트를 만들면 여기에 import 할 거야

const MainScreen: React.FC = () => {
  // 1. 현재 선택된 카테고리 상태 (기본값은 첫 번째 카테고리인 '커피')
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  // 2. Zustand 장바구니 스토어에서 총 수량과 총 결제 금액만 쏙 빼오기
  const { totalCount, totalAmount } = useCartStore();

  // 3. 전체 메뉴 중에서 '지금 선택된 카테고리'에 속한 메뉴만 걸러내기
  const filteredMenus = menuItems.filter(
    (menu) => menu.categoryId === activeCategory
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 select-none">
      
      {/* 상단: 카테고리 탭 영역 */}
      <div className="flex bg-white shadow-sm overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 py-4 text-xl font-bold border-b-4 transition-colors whitespace-nowrap px-6 ${
              activeCategory === category.id
                ? 'border-yellow-400 text-gray-900' // 선택된 탭은 노란색 밑줄
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 중단: 3x3 메뉴 그리드 영역 */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* grid-cols-3로 설정해서 무조건 한 줄에 3개씩 배치되게 만듦 */}
        <div className="grid grid-cols-3 gap-6 auto-rows-max">
          {filteredMenus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => {
                // TODO: 나중에 여기를 누르면 HOT/ICE, 샷 추가 고르는 모달(OptionModal)을 띄울 거야!
                console.log('클릭한 메뉴:', menu.name);
              }}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center transition-transform active:scale-95 hover:shadow-md border border-gray-100"
            >
              {/* 이미지 들어갈 자리 (이미지 없으면 회색 동그라미로 표시) */}
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                {menu.imageUrl ? (
                  <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <span className="text-lg font-bold text-gray-800 text-center break-keep">
                {menu.name}
              </span>
              <span className="text-yellow-500 font-extrabold mt-1">
                {menu.basePrice.toLocaleString()}원
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단: 고정 장바구니 바 영역 */}
      <div className="h-24 bg-gray-900 text-white flex items-center justify-between px-8 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-10">
        
        {/* 왼쪽: 총 주문 수량 */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-medium">총 주문 내역</span>
          <div className="text-2xl font-bold">
            <span className="text-yellow-400 mr-2">{totalCount}</span>개
          </div>
        </div>
        
        {/* 오른쪽: 총 결제 금액 & 결제 버튼 */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-gray-400 text-sm font-medium block">결제 금액</span>
            <span className="text-3xl font-extrabold text-yellow-400">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <button 
            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl text-2xl font-extrabold hover:bg-yellow-300 transition-colors active:scale-95"
          >
            결제하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default MainScreen;