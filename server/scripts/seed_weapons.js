
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
    { name: 'Rattler', nameKr: '레틀러', grade: 'Common', image: '/MP/imgi_5_rattler.png' },
    { name: 'Arpeggio', nameKr: '아르페지오', grade: 'Uncommon', image: '/MP/imgi_6_arpeggio.png' },
    { name: 'Bettina', nameKr: '베티나', grade: 'Epic', image: '/MP/bettina.png' }, // Missing image
    { name: 'Tempest', nameKr: '템페스트', grade: 'Epic', image: '/MP/imgi_7_tempest.png' },
    { name: 'Ferro', nameKr: '페로', grade: 'Common', image: '/MP/imgi_2_ferro.png' },
    { name: 'Renegade', nameKr: '레니게이드', grade: 'Rare', image: '/MP/imgi_3_renegade.png' },
    { name: 'Aphelion', nameKr: '아펠리온', grade: 'Legendary', image: '/MP/aphelion.png' }, // Missing image
    { name: 'Stitcher', nameKr: '스티처', grade: 'Common', image: '/MP/imgi_12_stitcher.png' },
    { name: 'Bobcat', nameKr: '밥캣', grade: 'Epic', image: '/MP/imgi_13_bobcat.png' },
    { name: 'Hairpin', nameKr: '헤어핀', grade: 'Common', image: '/MP/imgi_8_hairpin.png' },
    { name: 'Burletta', nameKr: '부를레타', grade: 'Uncommon', image: '/MP/imgi_9_burletta.png' },
    { name: 'Venator', nameKr: '베나토르', grade: 'Rare', image: '/MP/imgi_11_venator.png' },
    { name: 'Anvil', nameKr: '앤빌', grade: 'Uncommon', image: '/MP/imgi_10_anvil.png' },
    { name: 'Il Toro', nameKr: '일 토로', grade: 'Uncommon', image: '/MP/imgi_14_il_toro.png' },
    { name: 'Vulcano', nameKr: '볼카노', grade: 'Epic', image: '/MP/imgi_15_vulcano.png' },
    { name: 'Osprey', nameKr: '오스프레이', grade: 'Rare', image: '/MP/imgi_17_osprey.png' },
    { name: 'Jupiter', nameKr: '주피터', grade: 'Legendary', image: '/MP/imgi_18_jupiter.png' },
    {
        name: 'Torrente',
        nameKr: '토렌테',
        grade: 'Rare',
        image: '/MP/imgi_16_torrente.png',
        // Wiki Data
        description: '대용량 탄창을 지녔지만, 웅크린 상태에서만 정확하게 발사할 수 있습니다.',
        ammoType: '준중량 탄약 (Medium)',
        magazineSize: '60 → 70 → 80 → 90',
        fireMode: '전자동 (Full Auto)',
        penetration: '준수 (Fair)',
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
                    { name: '준중량 총기 부품', count: 3 },
                    { name: '강철 스프링', count: 6 }
                ],
                cost: 7000
            },
            {
                level: 2,
                bonusStats: '탄창 크기 +10%\n재장전 시간 -15%\n내구력 +10',
                materials: [
                    { name: '고급 기계 부품', count: 1 },
                    { name: '준중량 총기 부품', count: 2 }
                ],
                cost: 10000
            },
            {
                level: 3,
                bonusStats: '탄창 크기 +20%\n재장전 시간 -30%\n내구력 +20',
                materials: [
                    { name: '고급 기계 부품', count: 1 },
                    { name: '준중량 총기 부품', count: 2 }
                ],
                cost: 13000
            },
            {
                level: 4,
                bonusStats: '탄창 크기 +30%\n재장전 시간 -45%\n내구력 +30',
                materials: [
                    { name: '고급 기계 부품', count: 2 },
                    { name: '준중량 총기 부품', count: 2 }
                ],
                cost: 17000
            }
        ]
    },
    { name: 'Equalizer', nameKr: '이퀄라이저', grade: 'Legendary', image: '/MP/imgi_19_equalizer.png' },
    { name: 'Hull Cracker', nameKr: '헐크래커', grade: 'Epic', image: '/MP/hull_cracker.png' }, // Missing image
];

const seedWeapons = async () => {
    await connectDB();

    try {
        await Weapon.deleteMany({}); // Clear existing
        console.log('Weapons cleared');

        const weaponsToInsert = items.map(item => ({
            name: `${item.name} (${item.nameKr})`,
            type: 'Main', // Defaulting to Main as per current known info
            grade: item.grade,
            imageUrl: item.image,
            description: `${item.grade} Grade Item`,
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
