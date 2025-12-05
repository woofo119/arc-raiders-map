
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
    {
        name: 'Osprey',
        nameKr: '오스프레이',
        grade: 'Rare',
        image: '/MP/imgi_17_osprey.png',
        // Wiki Data (Placeholder based on Torrente structure for now to prevent empty view)
        description: '강력한 저격 소총으로, 긴 사거리를 자랑합니다.',
        ammoType: '중량 탄약 (Heavy)',
        magazineSize: '5 → 6 → 7 → 8',
        fireMode: '단발 (Semi-Auto)',
        penetration: '높음 (High)',
        stats: {
            damage: 85,
            fireRate: 15,
            range: 95,
            stability: 40,
            mobility: 20,
            stealth: 80
        },
        weight: 15.0,
        crafting: [
            {
                level: 1,
                bonusStats: '-',
                materials: [
                    { name: '오스프레이 설계도', count: 1 },
                    { name: '고급 기계 부품', count: 3 },
                    { name: '중량 총기 부품', count: 2 }
                ],
                cost: 8000
            }
        ]
    },
    { name: 'Jupiter', nameKr: '주피터', grade: 'Legendary', image: '/MP/imgi_18_jupiter.png' },
    {
        name: 'Torrente',
        nameKr: '토렌테',
        // ... (Torrente data stays same, but ensuring mapping uses it) ...

        // ... inside seedWeapons ...
        const weaponsToInsert = items.map(item => ({
            name: `${item.name} (${item.nameKr})`,
            type: 'Main',
            grade: item.grade,
            imageUrl: item.image,
            // Use provided description or fallback
            description: item.description || `${item.grade} Grade Item`,
            // Use provided detailed stats or empty defaults
            ammoType: item.ammoType || '',
            magazineSize: item.magazineSize || '',
            fireMode: item.fireMode || '',
            penetration: item.penetration || '',
            stats: item.stats || {
                damage: 0, fireRate: 0, range: 0, stability: 0, mobility: 0, stealth: 0
            },
            weight: item.weight || 0,
            crafting: item.crafting || [],
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
