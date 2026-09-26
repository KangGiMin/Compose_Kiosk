import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';

interface PaymentModalProps {
  onClose: () => void;      // 결제 취소하고 메뉴로 돌아가기
  onComplete: () => void;   // 결제 완료 후 처음(랜딩) 화면으로 돌아가기
}

type Step = 'STAMP' | 'PAYMENT'; // 모달 안에서 2단계로 진행

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onComplete }) => {
  const { totalAmount, clearCart } = useCartStore();
  
  // 1. 현재 화면 단계 상태 (스탬프 적립 -> 결제 수단)
  const [step, setStep] = useState<Step>('STAMP');
  
  // 2. 입력된 전화번호 상태
  const [phoneNumber, setPhoneNumber] = useState('');

  // 번호 패드 클릭 로직
  const handlePadClick = (num: string) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber((prev) => prev + num);
    }
  };

  // 번호 지우기 로직
  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  // 전화번호 하이픈 자동 포맷팅 (예: 01012345678 -> 010-1234-5678)
  const formatPhone = (num: string) => {
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  // 최종 결제 처리 로직
  const handlePayment = (method: string) => {
    // 실제 프로젝트에선 여기에 카드 단말기 연동 API가 들어가야 해!
    alert(`${method}(으)로 ${totalAmount.toLocaleString()}원 결제가 완료되었습니다!\n(적립 번호: ${formatPhone(phoneNumber) || '없음'})`);
    
    clearCart(); // 장바구니 싹 비우기
    onComplete(); // 랜딩 화면으로 돌려보내기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 select-none">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* 공통 헤더: 총 결제 금액 */}
        <div className="bg-gray-900 p-6 flex items-center justify-between">
          <span className="text-gray-300 font-medium">결제할 금액</span>
          <span className="text-3xl font-extrabold text-yellow-400">
            {totalAmount.toLocaleString()}원
          </span>
        </div>

        {/* --- STEP 1: 스탬프 적립 화면 --- */}
        {step === 'STAMP' && (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">스탬프 적립</h2>
            <p className="text-gray-500 mb-6">전화번호를 입력해 주세요</p>

            {/* 입력된 번호 표시 영역 */}
            <div className="w-full bg-gray-100 rounded-2xl h-16 flex items-center justify-center mb-6 text-3xl font-bold tracking-widest text-gray-800">
              {formatPhone(phoneNumber)}
            </div>

            {/* 숫자 키패드 (그리드 레이아웃) */}
            <div className="grid grid-cols-3 gap-3 w-full mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePadClick(num.toString())}
                  className="bg-gray-50 hover:bg-gray-200 active:scale-95 text-2xl font-bold py-5 rounded-2xl transition-all"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => setPhoneNumber('')}
                className="bg-gray-200 hover:bg-gray-300 active:scale-95 text-lg font-bold py-5 rounded-2xl transition-all"
              >
                전체삭제
              </button>
              <button
                onClick={() => handlePadClick('0')}
                className="bg-gray-50 hover:bg-gray-200 active:scale-95 text-2xl font-bold py-5 rounded-2xl transition-all"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="bg-gray-200 hover:bg-gray-300 active:scale-95 text-lg font-bold py-5 rounded-2xl transition-all flex items-center justify-center"
              >
                지우기
              </button>
            </div>

            {/* 하단 버튼 (적립 안함 / 다음) */}
            <div className="flex w-full gap-3">
              <button
                onClick={() => setStep('PAYMENT')}
                className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-300"
              >
                적립 안 함
              </button>
              <button
                onClick={() => setStep('PAYMENT')}
                disabled={phoneNumber.length > 0 && phoneNumber.length < 10}
                className="flex-1 py-4 bg-yellow-400 text-gray-900 font-extrabold text-lg rounded-2xl hover:bg-yellow-300 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
              >
                확인 (다음)
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: 결제 수단 선택 화면 --- */}
        {step === 'PAYMENT' && (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">결제 수단 선택</h2>
            
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <button
                onClick={() => handlePayment('신용/체크카드')}
                className="flex flex-col items-center justify-center py-8 bg-white border-2 border-gray-200 rounded-3xl hover:border-yellow-400 hover:bg-yellow-50 transition-all active:scale-95"
              >
                <span className="text-4xl mb-3">💳</span>
                <span className="font-bold text-lg">신용/체크카드</span>
              </button>
              <button
                onClick={() => handlePayment('간편결제')}
                className="flex flex-col items-center justify-center py-8 bg-white border-2 border-gray-200 rounded-3xl hover:border-yellow-400 hover:bg-yellow-50 transition-all active:scale-95"
              >
                <span className="text-4xl mb-3">📱</span>
                <span className="font-bold text-lg">간편결제(페이)</span>
              </button>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setStep('STAMP')} // 뒤로 가기
                className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-300"
              >
                이전으로
              </button>
              <button
                onClick={onClose} // 아예 결제 취소
                className="flex-1 py-4 bg-gray-800 text-white font-bold text-lg rounded-2xl hover:bg-gray-700"
              >
                결제 취소
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;