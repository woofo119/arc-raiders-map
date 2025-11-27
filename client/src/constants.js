// 맵 데이터 정의
export const MAPS = [
    { id: 'dam', name: '댐 전장 (Dam Battlefield)', image: '/map_dam.webp' },
    { id: 'bluegate', name: '블루 게이트 (Blue Gate)', image: '/map_bluegate.webp' },
    { id: 'buriedcity', name: '파묻힌 도시 (Buried City)', image: '/map_buriedcity.webp' },
    { id: 'spacebase', name: '우주 기지 (Space Base)', image: '/map_spacebase.webp' },
    { id: 'stellamontis', name: '스텔라 몬티스 (Stella Montis)', image: '/map_stellamontis.webp' },
];

// 마커 카테고리 정의
export const MARKER_CATEGORIES = {
    container: {
        label: '컨테이너 (Container)',
        types: [
            { id: 'weapon_case', label: '무기 상자 (Weapon Case)', icon: 'Box' },
            { id: 'armor_crate', label: '방어구 상자 (Armor Crate)', icon: 'Shield' },
            { id: 'medical_box', label: '의료 상자 (Medical Box)', icon: 'PlusSquare' },
            { id: 'grenade_box', label: '수류탄 상자 (Grenade Box)', icon: 'Bomb' },
        ]
    },
    location: {
        label: '주요 위치 (Location)',
        types: [
            { id: 'extraction', label: '탈출구 (Extraction)', icon: 'DoorOpen' },
            { id: 'locked_room', label: '잠긴 방 (Locked Room)', icon: 'Lock' },
            { id: 'safe_house', label: '안전 가옥 (Safe House)', icon: 'Home' },
        ]
    },
    resource: {
        label: '자원 (Resource)',
        types: [
            { id: 'mushroom', label: '버섯 (Mushroom)', icon: 'Sprout' },
            { id: 'herb', label: '약초 (Herb)', icon: 'Leaf' },
            { id: 'mineral', label: '광물 (Mineral)', icon: 'Gem' },
        ]
    },
    quest: {
        label: '퀘스트 (Quest)',
        types: [
            { id: 'quest_item', label: '퀘스트 아이템 (Quest Item)', icon: 'Scroll' },
            { id: 'npc', label: 'NPC', icon: 'User' },
        ]
    }
};
