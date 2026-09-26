import React, { useState } from 'react';
import { MenuItem, MenuOption, Temperature } from '../../data/menuData';
import { useCartStore } from '../../store/cartStore';

interface OptionModalProps {
  menu: MenuItem;
  onClose: () => void; // 모달 닫기 함수
}

const OptionModal: React.FC<OptionModalProps> = ({ menu, onClose }) => {
  // Zustand 스토어에서 장바구니 추가 함수 가져오기
  const addToCart = useCartStore((state) => state.addToCart);

  // 1. 온도 상태 (기본값 설정: BOTH면 무조건 ICE를 기본으로, 아니면 정해진 온도)
  const [temperature, setTemperature] = useState<Temperature>(
    menu.temperature === 'BOTH' ? 'ICE' : menu.temperature
  );

  // 2. 선택된 옵션들을 담을 배열 상태
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);

  // 3. 옵션 토글 함수 (선택/해제)
  const handleToggleOption = (option: MenuOption) => {
    setSelectedOptions((prev) => {
      // 이미 배열에 있으면 빼고, 없으면 넣음 (체크박스 로직)
      const isExist = prev.some((o) => o.id === option.id);
      if (isExist) {
        return prev.filter((o) => o.id !== option.id);
      }
      return [...prev, option];
    });
  };

  // 4. 실시간 총 금액 계산
  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const totalPrice = menu.basePrice + optionsPrice;

  // 5. 장바구니 담기 실행
  const handleAddToCart = () => {
    addToCart({
      menuId: menu.id,
      name: menu.name,
      basePrice: menu.basePrice,
      temperature,
      selectedOptions,
      quantity: 1, // 처음 담을 땐 무조건 1개
    });
    onClose(); // 담고 나서 모달 닫아주기
  };

  // 옵션 리스트 렌더링을 도와주는 내부 함수
  const renderOptionGroup = (title: string, options?: MenuOption[]) => {
    if (!options || options.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOptions.some((o) => o.id === opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => handleToggleOption(opt)}
                className={`p-4 rounded-xl text-left border-2 font-medium transition-all active:scale-95 flex justify-between ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{opt.name}</span>
                <span>+{opt.price}원</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    // 배경을 반투명하게 덮는 딤(Dim) 처리 영역
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 select-none">
      
      {/* 모달 본체 */}
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
        
        {/* 상단 헤더: 메뉴명 & 닫기 버튼 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900">{menu.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold p-2">
            ✕
          </button>
        </div>

        {/* 중앙: 스크롤 가능한 옵션 선택 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* 온도 선택 (HOT/ICE 둘 다 가능할 때만 렌더링) */}
          {menu.temperature === 'BOTH' && (
            <div className="mb-8 flex gap-4">
              <button
                onClick={() => setTemperature('HOT')}
                className={`flex-1 py-4 rounded-2xl text-xl font-bold border-2 transition-all ${
                  temperature === 'HOT'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                HOT
              </button>
              <button
                onClick={() => setTemperature('ICE')}
                className={`flex-1 py-4 rounded-2xl text-xl font-bold border-2 transition-all ${
                  temperature === 'ICE'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                ICE
              </button>
            </div>
          )}

          {/* 추가 옵션들 (샷, 시럽, 토핑) */}
          {renderOptionGroup('샷 추가', menu.availableOptions.shots)}
          {renderOptionGroup('시럽 추가', menu.availableOptions.syrups)}
          {renderOptionGroup('토핑 추가', menu.availableOptions.toppings)}
        </div>

        {/* 하단: 총 금액 & 장바구니 담기 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 block mb-1">총 금액</span>
            <span className="text-3xl font-extrabold text-yellow-500">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xl py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-md"
          >
            장바구니 담기
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default OptionModal;