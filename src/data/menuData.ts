// 메뉴 및 옵션 정의

// 1. 타입 정의
export type Temperature = 'HOT' | 'ICE' | 'BOTH'; // 뜨거운것만, 차가운것만, 둘다 가능

export interface MenuOption {
  id: string;
  name: string; // 예: '샷 추가', '헤이즐넛 시럽 추가', '타피오카 펄 추가'
  price: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;   // 어떤 카테고리에 속하는지 연결
  name: string;
  basePrice: number;    // 기본 가격
  temperature: Temperature;
  imageUrl: string;
  // 음료마다 가능한 옵션이 다르므로 배열로 관리
  availableOptions: {
    shots?: MenuOption[];
    syrups?: MenuOption[];
    toppings?: MenuOption[];
  };
}

// 2. 카테고리 데이터
export const categories: Category[] = [
  { id: 'c1', name: '커피' },
  { id: 'c2', name: '논커피/라떼' },
  { id: 'c3', name: '스무디/프라페' },
];

// 3. 공통으로 쓸 수 있는 옵션들 미리 정의 (재사용성)
const commonShots: MenuOption[] = [
  { id: 's1', name: '1샷 추가', price: 500 },
  { id: 's2', name: '2샷 추가', price: 1000 },
];

const commonSyrups: MenuOption[] = [
  { id: 'sy1', name: '헤이즐넛 시럽', price: 500 },
  { id: 'sy2', name: '바닐라 시럽', price: 500 },
];

// 4. 전체 메뉴 데이터
export const menuItems: MenuItem[] = [
  {
    id: 'm1',
    categoryId: 'c1',
    name: '아메리카노',
    basePrice: 1500,
    temperature: 'BOTH',
    imageUrl: '/assets/americano.png',
    availableOptions: {
      shots: commonShots,
      syrups: commonSyrups,
    },
  },
  {
    id: 'm2',
    categoryId: 'c1',
    name: '아인슈페너',
    basePrice: 3900,
    temperature: 'ICE', // 아인슈페너는 보통 아이스만 가능
    imageUrl: '/assets/einspanner.png',
    availableOptions: {
      shots: commonShots,
      // 펄 추가 같은 게 가능하다면 여기에 toppings 추가
    },
  },
  {
    id: 'm3',
    categoryId: 'c3',
    name: '리얼초코 자바칩 프라페',
    basePrice: 3900,
    temperature: 'ICE',
    imageUrl: '/assets/choco_frappe.png',
    availableOptions: {
      toppings: [
        { id: 't1', name: '타피오카 펄 추가', price: 500 },
        { id: 't2', name: '휘핑 크림 많이', price: 0 },
      ],
    },
  },
];