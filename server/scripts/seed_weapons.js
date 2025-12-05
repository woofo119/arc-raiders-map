
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
        name: 'Kettle', nameKr: '케틀', grade: 'Common', image: '/MP/imgi_4_kettle.png',
        description: '빠르고 정확하지만 탄속이 느린 돌격 소총.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '25',
        fireMode: '반자동 (Semi-Auto)',
        stats: { damage: 10, fireRate: 28, range: 43, stability: 60, mobility: 80, stealth: 50 },
        crafting: [{ level: 1, cost: 500, materials: [{ name: '기계 부품', count: 1 }] }]
    },
    {
        name: 'Rattler', nameKr: '레틀러', grade: 'Common', image: '/MP/imgi_5_rattler.png',
        description: '저렴한 공격 수단. 독특한 2발 장전 메커니즘을 가집니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '20',
        fireMode: '전자동 (Full-Auto)',
        stats: { damage: 9, fireRate: 33, range: 56, stability: 50, mobility: 70, stealth: 40 },
        crafting: [{ level: 1, cost: 600, materials: [] }]
    },
    {
        name: 'Arpeggio', nameKr: '아르페지오', grade: 'Uncommon', image: '/MP/imgi_6_arpeggio.png',
        description: '균형 잡힌 성능의 돌격 소총.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '30',
        fireMode: '점사 (Burst)',
        stats: { damage: 11, fireRate: 40, range: 50, stability: 70, mobility: 75, stealth: 60 }
    },
    {
        name: 'Bettina', nameKr: '베티나', grade: 'Epic', image: '/MP/bettina.png',
        description: '느린 발사 속도와 강력한 피해량을 가진 에픽 소총.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '20',
        fireMode: '전자동 (Full-Auto)',
        stats: { damage: 14, fireRate: 32, range: 51, stability: 40, mobility: 50, stealth: 30 }
    },
    {
        name: 'Tempest', nameKr: '템페스트', grade: 'Epic', image: '/MP/imgi_7_tempest.png',
        description: '불펍 방식의 올라운더 무기. 근중장거리 모두 대응 가능.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '30',
        fireMode: '전자동 (Full-Auto)',
        stats: { damage: 13, fireRate: 38, range: 60, stability: 80, mobility: 80, stealth: 60 }
    },
    {
        name: 'Ferro', nameKr: '페로', grade: 'Common', image: '/MP/imgi_2_ferro.png',
        description: '강력한 위력의 중절식(Break-Action) 전투 소총.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '1',
        fireMode: '단발 (Single)',
        stats: { damage: 40, fireRate: 7, range: 53, stability: 30, mobility: 90, stealth: 70 }
    },
    {
        name: 'Renegade', nameKr: '레니게이드', grade: 'Rare', image: '/MP/imgi_3_renegade.png',
        description: '레버액션 방식의 암살용 무기.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '6',
        fireMode: '수동 (Lever-Action)',
        stats: { damage: 45, fireRate: 5, range: 70, stability: 60, mobility: 60, stealth: 85 }
    },
    {
        name: 'Aphelion', nameKr: '아펠리온', grade: 'Legendary', image: '/MP/aphelion.png',
        description: '최고 등급의 전투 소총. 강력한 저지력을 가집니다.',
        ammoType: '에너지 (Energy)',
        magazineSize: '20',
        stats: { damage: 50, fireRate: 20, range: 80, stability: 90, mobility: 80, stealth: 90 }
    },
    {
        name: 'Stitcher', nameKr: '스티처', grade: 'Common', image: '/MP/imgi_12_stitcher.png',
        description: '높은 연사력으로 근거리 화력이 우수한 기관단총.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '40',
        fireMode: '전자동 (Full-Auto)',
        stats: { damage: 7, fireRate: 45, range: 42, stability: 50, mobility: 100, stealth: 60 }
    },
    {
        name: 'Bobcat', nameKr: '밥캣', grade: 'Epic', image: '/MP/imgi_13_bobcat.png',
        description: '빠른 기동성을 제공하는 고성능 기관단총.',
        ammoType: '경량 탄약 (Light)',
        magazineSize: '35',
        stats: { damage: 8, fireRate: 50, range: 40, stability: 60, mobility: 95, stealth: 70 }
    },
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
        description: '대용량 탄창을 지녔지만, 웅크린 상태에서만 정확하게 발사할 수 있습니다.', // Updated from screenshot
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '60 → 70 → 80 → 90',
        fireMode: '전자동 (Full-Auto)',
        penetration: '준수',
        stats: {
            damage: 8,
            fireRate: 58.3,
            range: 49.9,
            stability: 74.2,
            mobility: 37.7,
            stealth: 1
        },
        weight: 12.0,
        crafting: [
            {
                level: 1,
                bonusStats: '-',
                materials: [
                    { name: '토렌테 설계도', count: 1 },
                    { name: '고급 기계 부품', count: 2 },
                    { name: '중량 총기 부품', count: 3 },
                    { name: '강철 스프링', count: 6 }
                ],
                cost: 7000
            },
            {
                level: 2,
                bonusStats: '탄창 크기 +10%\n재장전 시간 -15%\n내구력 +10',
                materials: [
                    { name: '고급 기계 부품', count: 1 },
                    { name: '중량 총기 부품', count: 2 }
                ],
                cost: 10000
            },
            {
                level: 3,
                bonusStats: '탄창 크기 +20%\n재장전 시간 -30%\n내구력 +20',
                materials: [
                    { name: '고급 기계 부품', count: 1 },
                    { name: '중량 총기 부품', count: 2 }
                ],
                cost: 13000
            },
            {
                level: 4,
                bonusStats: '탄창 크기 +30%\n재장전 시간 -45%\n내구력 +30',
                materials: [
                    { name: '고급 기계 부품', count: 2 },
                    { name: '중량 총기 부품', count: 2 }
                ],
                cost: 17000
            }
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
