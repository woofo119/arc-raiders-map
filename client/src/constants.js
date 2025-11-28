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
    location: {
        label: '위치 (Location)',
        types: [
            { id: 'extraction', label: '탈출구 (Extraction)', icon: '/icons/icon_extraction.png' },
            { id: 'raider_hatch', label: '레이더 해치 (Raider Hatch)', icon: '/icons/icon_raider_hatch.png' },
            { id: 'locked_room', label: '잠긴 방 (Locked Room)', icon: '/icons/icon_locked_room.png' },
            { id: 'supply_call', label: '보급 호출소 (Supply Call Station)', icon: '/icons/icon_supply_call.png' },
            { id: 'field_depot', label: '야전 저장소 (Field Depot)', icon: '/icons/icon_field_depot.png' },
            { id: 'player_spawn', label: '플레이어 스폰 (Player Spawn)', icon: '/icons/icon_player_spawn.png' },
            { id: 'field_crate', label: '야전 상자 (Field Crate)', icon: '/icons/icon_field_crate.png' },
            { id: 'vent_extraction', label: '환풍구 탈출구 (Vent Extraction)', icon: 'Wind' },
            { id: 'train_extraction', label: '기차 탈출구 (Train Extraction)', icon: 'Train' },
            { id: 'stairs_down', label: '지하 계단 (Stairs Down)', icon: 'ArrowDownCircle' },
        ]
    },
    nature: {
        label: '자연 (Nature)',
        types: [
            { id: 'mushroom', label: '버섯 (Mushroom)', icon: '/icons/icon_mushroom.png' },
            { id: 'prickly_pear', label: '선인장 열매 (Prickly Pear)', icon: '/icons/icon_prickly_pear.png' },
            { id: 'agave', label: '용설란 (Agave)', icon: '/icons/icon_agave.png' },
            { id: 'great_mullein', label: '우단담배풀 (Great Mullein)', icon: '/icons/icon_great_mullein.png' },
            { id: 'apricot', label: '살구 (Apricot)', icon: '/icons/icon_apricot.png' },
            { id: 'olives', label: '올리브 (Olives)', icon: '/icons/olives.png' }, // Large icon used as fallback
            { id: 'lemon', label: '레몬 (Lemon)', icon: 'Sprout' },
        ]
    },
    container: {
        label: '컨테이너 (Container)',
        types: [
            { id: 'weapon_case', label: '무기 상자 (Weapon Case)', icon: '/icons/weapon_case.png' }, // Large icon used as fallback
            { id: 'security_locker', label: '보안 라커 (Security Locker)', icon: '/icons/icon_security_locker.png' },
            { id: 'armor_crate', label: '방어구 상자 (Armor Crate)', icon: '/icons/armor_crate.png' }, // Large icon used as fallback
            { id: 'medical_box', label: '의료 상자 (Medical Box)', icon: '/icons/medical_box.png' }, // Large icon used as fallback
            { id: 'grenade_box', label: '수류탄 상자 (Grenade Box)', icon: '/icons/grenade_box.png' }, // Large icon used as fallback
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
