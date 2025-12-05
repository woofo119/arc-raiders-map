
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Weapon from '../models/Weapon.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const items = [
    {
        name: 'Kettle',
        nameKr: '케틀',
        grade: 'Common',
        image: '/MP/imgi_4_kettle.png',
        description: '빠르고 정확하게 발사하지만 탄속이 느리고 재장전 시간이 오래 걸립니다.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '20',
        fireMode: '반자동 (Semi-Auto)',
        penetration: '매우 취약',
        stats: { damage: 10, fireRate: 28, range: 42.8, stability: 69.8, mobility: 58.5, stealth: 26 },
        weight: 7.0,
        crafting: [
            { level: 1, cost: 840, bonusStats: '-', materials: [{ name: '금속 부품', count: 6 }, { name: '고무 부품', count: 8 }] },
            { level: 2, cost: 2000, bonusStats: '탄속 +25%\n재장전 시간 -13%\n내구력 +10', materials: [{ name: '금속 부품', count: 8 }, { name: '플라스틱 부품', count: 10 }] },
            { level: 3, cost: 3000, bonusStats: '탄속 +50%\n재장전 시간 -26%\n내구력 +20', materials: [{ name: '금속 부품', count: 10 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 4, cost: 5000, bonusStats: '탄속 +75%\n재장전 시간 -40%\n내구력 +30', materials: [{ name: '기계 부품', count: 3 }, { name: '간단한 총기 부품', count: 1 }] }
        ]
    },
    {
        name: 'Rattler',
        nameKr: '래틀러',
        grade: 'Common',
        image: '/MP/imgi_5_rattler.png',
        description: '저렴한 공격 수단이지만, 발사할 때마다 총알 2발을 재장전해야 합니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '10 → 14 → 18 → 22',
        fireMode: '전자동 (Full-Auto)',
        penetration: '준수',
        stats: { damage: 9, fireRate: 33.3, range: 56.2, stability: 72.2, mobility: 54.8, stealth: 14 },
        weight: 6.0,
        crafting: [
            { level: 1, cost: 1750, bonusStats: '-', materials: [{ name: '금속 부품', count: 16 }, { name: '고무 부품', count: 12 }] },
            { level: 2, cost: 3000, bonusStats: '탄창 크기 +4\n내구력 +10', materials: [{ name: '기계 부품', count: 2 }] },
            { level: 3, cost: 5000, bonusStats: '탄창 크기 +8\n내구력 +20', materials: [{ name: '기계 부품', count: 2 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 4, cost: 7000, bonusStats: '탄창 크기 +12\n내구력 +30', materials: [{ name: '기계 부품', count: 3 }, { name: '간단한 총기 부품', count: 1 }] }
        ]
    },
    {
        name: 'Arpeggio',
        nameKr: '아르페지오',
        grade: 'Uncommon',
        image: '/MP/imgi_6_arpeggio.png',
        description: '준수한 피해량과 정확도를 지녔습니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '24',
        fireMode: '3점사 (Burst)',
        penetration: '준수',
        stats: { damage: 9.5, fireRate: 18.3, range: 55.9, stability: 84, mobility: 57.3, stealth: 14 },
        weight: 7.0,
        crafting: [
            { level: 1, cost: 5500, bonusStats: '-', materials: [{ name: '기계 부품', count: 6 }, { name: '간단한 총기 부품', count: 6 }] },
            { level: 2, cost: 8000, bonusStats: '발사 속도 +20%\n재장전 시간 -12.5%\n내구력 +10', materials: [{ name: '기계 부품', count: 4 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 3, cost: 11500, bonusStats: '발사 속도 +40%\n재장전 시간 -25%\n내구력 +20', materials: [{ name: '기계 부품', count: 5 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 4, cost: 15000, bonusStats: '발사 속도 +60%\n재장전 시간 -50%\n내구력 +30', materials: [{ name: '기계 부품', count: 5 }, { name: '간단한 총기 부품', count: 1 }] }
        ]
    },
    {
        name: 'Bettina',
        nameKr: '베티나',
        grade: 'Epic',
        image: '/MP/bettina.png',
        description: '느린 발사 속도와 높은 피해량을 지녔습니다.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '20',
        fireMode: '전자동 (Full-Auto)',
        penetration: '강력',
        stats: { damage: 14, fireRate: 32, range: 51.3, stability: 76.4, mobility: 48.2, stealth: 14 },
        weight: 11.0,
        crafting: [
            { level: 1, cost: 8000, bonusStats: '-', materials: [{ name: '베티나 설계도', count: 1 }, { name: '고급 기계 부품', count: 3 }, { name: '중량 총기 부품', count: 3 }, { name: '캔', count: 3 }] },
            { level: 2, cost: 11000, bonusStats: '발사 속도 +5%\n재장전 시간 -11.1%\n내구력 +10', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '중량 총기 부품', count: 2 }] },
            { level: 3, cost: 14000, bonusStats: '발사 속도 +10%\n재장전 시간 -22.2%\n내구력 +20', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '중량 총기 부품', count: 2 }] },
            { level: 4, cost: 18000, bonusStats: '발사 속도 +15%\n재장전 시간 -33.3%\n내구력 +30', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '중량 총기 부품', count: 2 }] }
        ]
    },
    {
        name: 'Tempest',
        nameKr: '템페스트',
        grade: 'Epic',
        image: '/MP/imgi_7_tempest.png',
        description: '적당한 발사 속도와 정확도를 지녔습니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '25',
        fireMode: '전자동 (Full-Auto)',
        penetration: '준수',
        stats: { damage: 10, fireRate: 36.7, range: 55.9, stability: 78.9, mobility: 46, stealth: 14 },
        weight: 11.0,
        crafting: [
            { level: 1, cost: 13000, bonusStats: '-', materials: [{ name: '템페스트 설계도', count: 1 }, { name: '자성 가속기', count: 1 }, { name: '준중량 총기 부품', count: 3 }, { name: '엑소더스 모듈', count: 2 }] },
            { level: 2, cost: 17000, bonusStats: '수평 반동 -16.6%\n재장전 시간 -13%\n내구력 +10', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '준중량 총기 부품', count: 1 }] },
            { level: 3, cost: 22000, bonusStats: '수평 반동 -33.3%\n재장전 시간 -26%\n내구력 +20', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '준중량 총기 부품', count: 3 }] },
            { level: 4, cost: 27000, bonusStats: '수평 반동 -50%\n재장전 시간 -40%\n내구력 +30', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '준중량 총기 부품', count: 3 }] }
        ]
    },
    {
        name: 'Ferro',
        nameKr: '페로',
        grade: 'Common',
        image: '/MP/imgi_2_ferro.png',
        description: '강력한 위력을 뽐내지만 발사할 때마다 재장전해야 합니다.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '1',
        fireMode: '중절식 (Break-Action)',
        penetration: '강력',
        stats: { damage: 40, fireRate: 6.6, range: 53.1, stability: 78.1, mobility: 31.5, stealth: 8 },
        weight: 8.0,
        crafting: [
            { level: 1, cost: 475, bonusStats: '-', materials: [{ name: '금속 부품', count: 5 }, { name: '고무 부품', count: 2 }] },
            { level: 2, cost: 1000, bonusStats: '재장전 시간 -13%\n내구력 +10', materials: [{ name: '금속 부품', count: 7 }] },
            { level: 3, cost: 2000, bonusStats: '재장전 시간 -26%\n내구력 +20', materials: [{ name: '금속 부품', count: 9 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 4, cost: 2900, bonusStats: '재장전 시간 -39%\n내구력 +30', materials: [{ name: '기계 부품', count: 1 }, { name: '간단한 총기 부품', count: 1 }] }
        ]
    },
    {
        name: 'Renegade',
        nameKr: '레니게이드',
        grade: 'Rare',
        image: '/MP/imgi_3_renegade.png',
        description: '높은 피해량, 정확도, 헤드샷 대미지를 지녔습니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '8',
        fireMode: '레버 액션 (Lever-Action)',
        penetration: '준수',
        stats: { damage: 35, fireRate: 21, range: 68.8, stability: 85.7, mobility: 55.8, stealth: 16 },
        weight: 10.0,
        crafting: [
            { level: 1, cost: 7000, bonusStats: '-', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '준중량 총기 부품', count: 3 }, { name: '기름', count: 5 }] },
            { level: 2, cost: 10000, bonusStats: '탄 퍼짐 회복시간 -16.6%\n발사 속도 +25%\n내구력 +10', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '준중량 총기 부품', count: 2 }] },
            { level: 3, cost: 13000, bonusStats: '탄 퍼짐 회복시간 -33.3%\n발사 속도 +50%\n내구력 +20', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '준중량 총기 부품', count: 2 }] },
            { level: 4, cost: 17000, bonusStats: '탄 퍼짐 회복시간 -50%\n발사 속도 +75%\n내구력 +30', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '준중량 총기 부품', count: 2 }] }
        ]
    },
    {
        name: 'Aphelion',
        nameKr: '아펠리온',
        grade: 'Legendary',
        image: '/MP/aphelion.png',
        description: '고속 에너지탄을 발사합니다.',
        ammoType: '에너지 탄창 (Energy)',
        magazineSize: '10',
        fireMode: '2점사 (2-Burst)',
        penetration: '강력',
        stats: { damage: 24, fireRate: 9, range: 76, stability: 88, mobility: 39, stealth: 16 },
        weight: 10.0,
        crafting: [
            { level: 1, cost: 27500, bonusStats: '-', materials: [{ name: '아펠리온 설계도', count: 1 }, { name: '자성 가속기', count: 3 }, { name: '정교한 총기 부품', count: 3 }, { name: '마트리아크 원자로', count: 1 }] }
        ]
    },
    {
        name: 'Stitcher',
        nameKr: '스티처',
        grade: 'Common',
        image: '/MP/imgi_12_stitcher.png',
        description: '피해량은 준수하지만 발사 속도가 꽤 느리고 조작이 까다롭습니다.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '20',
        fireMode: '전자동 (Full-Auto)',
        penetration: '매우 취약',
        stats: { damage: 7, fireRate: 45.3, range: 42.1, stability: 45.3, mobility: 73.8, stealth: 19 },
        weight: 5.0,
        crafting: [
            { level: 1, cost: 800, bonusStats: '-', materials: [{ name: '금속 부품', count: 8 }, { name: '고무 부품', count: 4 }] },
            { level: 2, cost: 2000, bonusStats: '수평 반동 -16.6%\n재장전 시간 -13%\n내구력 +10', materials: [{ name: '금속 부품', count: 8 }, { name: '고무 부품', count: 1 }] },
            { level: 3, cost: 3000, bonusStats: '수평 반동 -33.3%\n재장전 시간 -26%\n내구력 +20', materials: [{ name: '금속 부품', count: 10 }, { name: '간단한 총기 부품', count: 1 }] },
            { level: 4, cost: 5000, bonusStats: '수평 반동 -50%\n재장전 시간 -40%\n내구력 +30', materials: [{ name: '기계 부품', count: 3 }, { name: '간단한 총기 부품', count: 1 }] }
        ]
    },
    {
        name: 'Bobcat',
        nameKr: '밥캣',
        grade: 'Epic',
        image: '/MP/imgi_13_bobcat.png',
        description: '발사 속도는 빠르지만 정확도가 낮습니다.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '20',
        fireMode: '전자동 (Full-Auto)',
        penetration: '매우 취약',
        stats: { damage: 6, fireRate: 66.7, range: 44, stability: 45.9, mobility: 73.1, stealth: 21 },
        weight: 7.0,
        crafting: [
            { level: 1, cost: 13000, bonusStats: '-', materials: [{ name: '밥캣 설계도', count: 1 }, { name: '자성 가속기', count: 1 }, { name: '경량 총기 부품', count: 3 }, { name: '엑소더스 모듈', count: 2 }] },
            { level: 2, cost: 17000, bonusStats: '최대 한 발 탄 퍼짐 -15%\n수평 반동 -15%\n재장전 시간 -13%\n내구력 +10', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '경량 총기 부품', count: 1 }] },
            { level: 3, cost: 22000, bonusStats: '최대 한 발 탄 퍼짐 -30%\n수평 반동 -30%\n재장전 시간 -26%\n내구력 +20', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '경량 총기 부품', count: 3 }] },
            { level: 4, cost: 27000, bonusStats: '최대 한 발 탄 퍼짐 -50%\n수평 반동 -45%\n재장전 시간 -40%\n내구력 +30', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '경량 총기 부품', count: 3 }] }
        ]
    },
    // Remaining items with default templates
    {
        name: 'Hairpin', nameKr: '헤어핀', grade: 'Common', image: '/MP/imgi_8_hairpin.png',
        description: '기본적인 호신용 권총 (Welrod inspiration).',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '12',
        stats: { damage: 15, fireRate: 20, range: 30, stability: 80, mobility: 100, stealth: 90 }
    },
    {
        name: 'Burletta', nameKr: '부를레타', grade: 'Uncommon', image: '/MP/imgi_9_burletta.png',
        description: '안정적인 성능의 반자동 권총.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '15',
        stats: { damage: 18, fireRate: 22, range: 35, stability: 85, mobility: 100, stealth: 85 }
    },
    {
        name: 'Venator', nameKr: '베나토르', grade: 'Rare', image: '/MP/imgi_11_venator.png',
        description: '강력한 더블 배럴 권총.',
        ammoType: '산탄 (Shotgun)',
        magazineSize: '2',
        stats: { damage: 60, fireRate: 4, range: 15, stability: 20, mobility: 90, stealth: 40 }
    },
    {
        name: 'Anvil', nameKr: '앤빌', grade: 'Uncommon', image: '/MP/imgi_10_anvil.png',
        description: '아크 장갑 파괴에 탁월한 중량탄 핸드캐논.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '6',
        fireMode: '리볼버 (Revolver)',
        stats: { damage: 40, fireRate: 10, range: 45, stability: 40, mobility: 80, stealth: 60 }
    },
    {
        name: 'Il Toro', nameKr: '일 토로', grade: 'Uncommon', image: '/MP/imgi_14_il_toro.png',
        description: '근거리 제압용 산탄총.',
        ammoType: '산탄 (Shotgun)',
        magazineSize: '5',
        stats: { damage: 100, fireRate: 8, range: 20, stability: 30, mobility: 70, stealth: 20 }
    },
    {
        name: 'Vulcano', nameKr: '볼카노', grade: 'Epic', image: '/MP/imgi_15_vulcano.png',
        description: '근접 DPS 최강자 반자동 산탄총.',
        ammoType: '산탄 (Shotgun)',
        magazineSize: '8',
        fireMode: '반자동 (Semi-Auto)',
        stats: { damage: 110, fireRate: 12, range: 25, stability: 40, mobility: 65, stealth: 10 }
    },
    {
        name: 'Osprey', nameKr: '오스프레이', grade: 'Rare', image: '/MP/imgi_17_osprey.png',
        description: '스코프가 기본 장착된 초장거리 저격 소총 (Sniper).',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '5',
        fireMode: '볼트액션 (Bolt-Action)',
        stats: { damage: 85, fireRate: 15, range: 95, stability: 60, mobility: 50, stealth: 80 }
    },
    {
        name: 'Jupiter', nameKr: '주피터', grade: 'Legendary', image: '/MP/imgi_18_jupiter.png',
        description: '전설적인 위력의 저격 소총.',
        ammoType: '에너지 (Energy)',
        magazineSize: '5',
        stats: { damage: 150, fireRate: 10, range: 100, stability: 70, mobility: 40, stealth: 70 }
    },
    {
        name: 'Torrente',
        nameKr: '토렌테',
        grade: 'Rare',
        image: '/MP/imgi_16_torrente.png',
        description: '대용량 탄창을 지녔지만, 웅크린 상태에서만 정확하게 발사할 수 있습니다.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '60 → 70 → 80 → 90',
        fireMode: '전자동 (Full-Auto)',
        penetration: '준수',
        stats: { damage: 8, fireRate: 58.3, range: 49.9, stability: 74.2, mobility: 37.7, stealth: 1 },
        weight: 12.0,
        crafting: [
            { level: 1, cost: 7000, bonusStats: '-', materials: [{ name: '토렌테 설계도', count: 1 }, { name: '고급 기계 부품', count: 2 }, { name: '중량 총기 부품', count: 3 }, { name: '강철 스프링', count: 6 }] },
            { level: 2, cost: 10000, bonusStats: '탄창 크기 +10%\n재장전 시간 -15%\n내구력 +10', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '중량 총기 부품', count: 2 }] },
            { level: 3, cost: 13000, bonusStats: '탄창 크기 +20%\n재장전 시간 -30%\n내구력 +20', materials: [{ name: '고급 기계 부품', count: 1 }, { name: '중량 총기 부품', count: 2 }] },
            { level: 4, cost: 17000, bonusStats: '탄창 크기 +30%\n재장전 시간 -45%\n내구력 +30', materials: [{ name: '고급 기계 부품', count: 2 }, { name: '중량 총기 부품', count: 2 }] }
        ]
    }
];

// Helper to generate default crafting data for others
const defaultCrafting = (grade) => {
    const baseCost = grade === 'Common' ? 1000 : grade === 'Uncommon' ? 2000 : 5000;
    return [
        { level: 1, cost: baseCost, bonusStats: '-', materials: [{ name: '기계 부품', count: 5 }] },
        { level: 2, cost: baseCost * 1.5, bonusStats: '대미지 +5%', materials: [{ name: '강화 부품', count: 2 }] },
        { level: 3, cost: baseCost * 2, bonusStats: '대미지 +10%', materials: [{ name: '희귀 합금', count: 1 }] },
        { level: 4, cost: baseCost * 3, bonusStats: '대미지 +15%\n재장전 속도 +10%', materials: [{ name: '코어 프로세서', count: 1 }] }
    ];
};

const seedWeapons = async () => {
    try {
        await connectDB();
        await Weapon.deleteMany(); // Clear existing
        console.log('Cleared Weapon Collection');

        const weaponsToInsert = items.map(item => ({
            name: `${item.name} (${item.nameKr})`,
            type: 'Main',
            grade: item.grade,
            imageUrl: item.image,
            description: item.description,
            ammoType: item.ammoType || '일반 탄약',
            magazineSize: item.magazineSize || '30',
            fireMode: item.fireMode || '자동',
            stats: item.stats || { damage: 0, fireRate: 0, range: 0, stability: 0, mobility: 0, stealth: 0 },
            // Use specific crafting if defined, otherwise use default
            crafting: item.crafting && item.crafting.length > 0 ? item.crafting : defaultCrafting(item.grade),
            penetration: item.penetration || '-',
            weight: item.weight || (Math.random() * 10 + 5).toFixed(1),
            createdAt: new Date()
        }));

        await Weapon.insertMany(weaponsToInsert);
        console.log('Weapons Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedWeapons();
