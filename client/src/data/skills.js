import { skillIcons } from '../assets/skillIcons';

export const SKILL_DATA = {
    conditioning: {
        label: "단련",
        color: "text-green-500",
        bg: "bg-green-500",
        border: "border-green-500",
        skills: [
            // Tier 0
            { id: "c1", name: "거뜬한 무게", maxLevel: 5, description: "실드를 착용해도 이동속도가 크게 느려지지 않습니다. 실드 착용 시 이동속도 페널티(준중량 5%, 중량 15%)가 최대 50% 감소한다.", reqPoints: 0, x: 25, y: 75, icon: skillIcons.c1, prerequisites: [] },
            { id: "c2", name: "부드러운 압박", maxLevel: 5, description: "강제 개방시 내는 소음이 줄어듭니다.", reqPoints: 0, x: 30, y: 65, icon: skillIcons.c2, prerequisites: ["c1"] },
            { id: "c3", name: "능숙한 탐구자", maxLevel: 5, description: "문과 컨테이너를 강제 개방하는 데 걸리는 시간이 줄어듭니다. 최대 30% 더 빨리 개방할 수 있다.", reqPoints: 0, x: 30, y: 55, icon: skillIcons.c3, prerequisites: ["c2"] },
            { id: "c5", name: "폭발 내성", maxLevel: 5, description: "근처 폭발이 청력에 미치는 영향이 줄어듭니다.", reqPoints: 0, x: 20, y: 65, icon: skillIcons.c5, prerequisites: ["c1"] },
            { id: "c6", name: "싸우거나 도망가거나", maxLevel: 5, description: "전투에서 다치면 일정량의 기력을 되돌려받습니다. 다음 사용까지 쿨다운이 적용됩니다. 사용 쿨은 15초이다.", reqPoints: 0, x: 20, y: 55, icon: skillIcons.c6, prerequisites: ["c5"] },
            { id: "c8", name: "거뜬한 스윙", maxLevel: 5, description: "근접 공격으로 소모하는 기력이 줄어듭니다.", reqPoints: 0, x: 30, y: 35, icon: skillIcons.c8, prerequisites: ["c4"] },
            { id: "c9", name: "스카이 클리어링 스윙", maxLevel: 5, description: "드론에 주는 근접 대미지가 증가합니다.", reqPoints: 0, x: 30, y: 25, icon: skillIcons.c9, prerequisites: ["c8"] },
            { id: "c10", name: "쏠쏠한 부수입", maxLevel: 1, description: "물체를 강제 개방하면 자원이 생성됩니다. 개방한 컨테이너의 유형에 따라 지상 재료를 생성한다.", reqPoints: 0, x: 25, y: 35, icon: skillIcons.c10, prerequisites: ["c7", "c4"] },
            { id: "c11", name: "무기 장착 완료", maxLevel: 1, description: "장착한 무기가 과중 상태에 미치는 영향이 줄어듭니다. 장비중인 무기 및 장착된 모드의 무게가 절반으로 감소한다. 인벤토리에 있는 무기에는 영향이 없다.", reqPoints: 0, x: 25, y: 25, icon: skillIcons.c11, prerequisites: ["c10"] },
            { id: "c12", name: "쓰러져도 지지 않아", maxLevel: 5, description: "쓰러진 상태에서 사망할 때까지 걸리는 시간이 길어집니다.", reqPoints: 0, x: 20, y: 35, icon: skillIcons.c12, prerequisites: ["c7"] },
            { id: "c13", name: "엉금엉금 거북이", maxLevel: 5, description: "쓰러졌을 때 받는 대미지가 줄어듭니다.", reqPoints: 0, x: 20, y: 25, icon: skillIcons.c13, prerequisites: ["c12"] },

            // Tier 1 (Req 15)
            { id: "c4", name: "깃털 같은 구르기", maxLevel: 1, description: "쉴드가 부서지고 몇 초 내에 처음 시전하는 회피 구르기가 기력을 소모하지 않습니다.", reqPoints: 15, x: 30, y: 45, icon: skillIcons.c4, prerequisites: ["c3"] },
            { id: "c7", name: "생존자의 기력", maxLevel: 1, description: "치명상 상태 시, 기력을 특정 수치까지 자동으로 회복합니다.", reqPoints: 15, x: 20, y: 45, icon: skillIcons.c7, prerequisites: ["c6"] },

            // Tier 2 (Req 36)
            { id: "c14", name: "파리채", maxLevel: 1, description: "이제 근접 공격 한 번으로 와스프와 포탑을 파괴할 수 있습니다.", reqPoints: 36, x: 30, y: 15, icon: skillIcons.c14, prerequisites: ["c11"] },
            { id: "c15", name: "위기 극복", maxLevel: 1, description: "치명상 상태 시, 체력을 특정 한도까지 자동으로 회복합니다. 체력이 약 10% 정도일 때, 약 10초 후 서서히 30% 정도까지 체력이 회복된다. 붕대와 중첩 사용할 수 있다.", reqPoints: 36, x: 20, y: 15, icon: skillIcons.c15, prerequisites: ["c11"] }
        ]
    },
    mobility: {
        label: "이동성",
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        skills: [
            // Root
            { id: "m3", name: "날렵한 등반가", maxLevel: 5, description: "더 빨리 기어오르고 뛰어 넘을 수 있습니다.", reqPoints: 0, x: 50, y: 75, icon: skillIcons.m3, prerequisites: [] },

            // Left Column (Running/Rolling)
            { id: "m4", name: "마라톤 선수", maxLevel: 5, description: "이동으로 소모하는 기력이 줄어듭니다. 기력 소모가 최대 25% 감소한다.", reqPoints: 0, x: 42, y: 65, icon: skillIcons.m4, prerequisites: ["m3"] },
            { id: "m2", name: "젊음의 폐", maxLevel: 5, description: "최대 기력이 증가합니다. 기력이 최대 25% 증가한다.", reqPoints: 0, x: 42, y: 55, icon: skillIcons.m2, prerequisites: ["m4"] },
            { id: "m7", name: "힘들이지 않고 구르기", maxLevel: 5, description: "회피 구르기로 소모하는 기력이 줄어듭니다. 3레벨에서 기력 감소가 최소가 되며, 구르기 횟수가 추가된다.", reqPoints: 0, x: 42, y: 45, icon: skillIcons.m7, prerequisites: ["m2"] },
            { id: "m15", name: "추진력을 얻기 위함", maxLevel: 1, description: "전력 질주 회피 구르기 후, 잠깐 전력 질주가 기력을 소모하지 않습니다. 쿨다운 시간이 적용됩니다. 약 2초간 기력을 소모하지 않는다. 쿨은 약 15초.", reqPoints: 15, x: 42, y: 35, icon: skillIcons.m15, prerequisites: ["m7"] },
            { id: "m10", name: "영웅적 도약", maxLevel: 5, description: "전력 질주 회피 구르기를 더 멀리까지 시전할 수 있습니다. 구르기 거리가 약 5~10% 증가한다.", reqPoints: 0, x: 42, y: 25, icon: skillIcons.m10, prerequisites: ["m15"] },
            { id: "m_new3", name: "연속 뛰기", maxLevel: 1, description: "뛰어넘기가 끝나기 직전에 점프할 수 있습니다.", reqPoints: 36, x: 42, y: 15, icon: skillIcons.m15, prerequisites: ["m10"] }, // Using m15 icon

            // Center Column (Wall/Vault/Crawl)
            { id: "m5", name: "미친 듯 벽 타기", maxLevel: 5, description: "더 멀리 벽 도약을 시전할 수 있습니다. 도약 거리가 약 10% 증가한다.", reqPoints: 0, x: 50, y: 65, icon: skillIcons.m5, prerequisites: ["m3"] },
            { id: "m_new1", name: "구를 준비 완료", maxLevel: 5, description: "낙하 시, 낙법을 시전할 수 있는 타이밍이 길어집니다.", reqPoints: 0, x: 50, y: 55, icon: skillIcons.m6, prerequisites: ["m5"] },
            { id: "m14", name: "걷기 전에 기기", maxLevel: 5, description: "쓰러졌을 때 기어가는 속도가 빨라집니다. 기어가는 속도가 최대 35% 증가한다.", reqPoints: 0, x: 50, y: 35, icon: skillIcons.m14, prerequisites: ["m_new1"] }, // Gap at y:45 intentional or fill?
            { id: "m16", name: "넘고 넘고 뛰어넘고", maxLevel: 1, description: "뛰어넘기가 더는 기력을 소모하지 않습니다.", reqPoints: 36, x: 50, y: 15, icon: skillIcons.m16, prerequisites: ["m14"] },

            // Right Column (Slide/Walk)
            { id: "m13", name: "멀리멀리 슬라이드", maxLevel: 5, description: "더 멀리 더 빠르게 슬라이드할 수 있습니다.", reqPoints: 0, x: 58, y: 65, icon: skillIcons.m13, prerequisites: ["m3"] },
            { id: "m11", name: "튼튼한 발목", maxLevel: 5, description: "치명적이지 않은 높이에서 떨어질 때 받는 낙상 피해가 줄어듭니다.", reqPoints: 0, x: 58, y: 55, icon: skillIcons.m11, prerequisites: ["m13"] },
            { id: "m1", name: "차분한 산보", maxLevel: 1, description: "걸을 때도 가만히 서 있을 때처럼 기력이 회복됩니다. 기본 이동이 아니라 V를 누르고 걸을 때의 회복량이 늘어난다.", reqPoints: 15, x: 58, y: 45, icon: skillIcons.m1, prerequisites: ["m11"] },
            { id: "m_new2", name: "혈기 왕성 뜀박질", maxLevel: 1, description: "기력 소진 상태에서 더는 뛰어넘기 속도가 느려지지 않습니다.", reqPoints: 0, x: 58, y: 35, icon: skillIcons.m12, prerequisites: ["m1"] }
        ]
    },
    survival: {
        label: "생존",
        color: "text-red-500",
        bg: "bg-red-500",
        border: "border-red-500",
        skills: [
            // Tier 0
            { id: "s16", name: "날렵한 웅크리기", maxLevel: 5, description: "웅크린 상태에서 이동하는 속도가 증가합니다. 속도는 최대 10% 증가한다.", reqPoints: 0, x: 75, y: 75, icon: skillIcons.s16, prerequisites: [] },
            { id: "s6", name: "쪼그려서 원기회복", maxLevel: 5, description: "웅크린 상태에서 기력 회복량이 증가합니다. 기력 회복량은 최대 30% 증가한다.", reqPoints: 0, x: 80, y: 65, icon: skillIcons.s6, prerequisites: ["s16"] },
            { id: "s8", name: "라운드 중 제작", maxLevel: 1, description: "지상의 필드에서 아이템을 제작할 수 있는 능력이 잠금 해제됩니다.", reqPoints: 0, x: 80, y: 55, icon: skillIcons.s8, prerequisites: ["s6"] },
            { id: "s3", name: "노획 본능", maxLevel: 5, description: "컨테이너 수색 시, 전리품이 더 빨리 드러납니다. 수색 속도는 최대 20% 증가한다.", reqPoints: 0, x: 70, y: 65, icon: skillIcons.s3, prerequisites: ["s16"] },
            { id: "s4", name: "침묵의 청소부", maxLevel: 5, description: "노획할 때 내는 소음이 줄어듭니다.", reqPoints: 0, x: 70, y: 55, icon: skillIcons.s4, prerequisites: ["s3"] },
            { id: "s2", name: "튼튼한 노새", maxLevel: 5, description: "과중 상태가 기력 회복에 미치는 영향이 줄어듭니다.", reqPoints: 0, x: 80, y: 35, icon: skillIcons.s2, prerequisites: ["s1"] },
            { id: "s9", name: "심호흡 세 번", maxLevel: 5, description: "능력 사용으로 소모한 기력을 더 빨리 회복합니다. 기존 5초인 기력 회복 시간을 약 2.5초 줄여준다.", reqPoints: 0, x: 80, y: 25, icon: skillIcons.s9, prerequisites: ["s2"] },
            { id: "s10", name: "여행자 땜장이", maxLevel: 1, description: "필드 제작할 수 있는 아이템을 추가로 잠금 해제합니다. 잠금 해제되는 아이템 중에서 레이더 해치 열쇠가 핵심이며 그 외에 여러 설치형 가젯을 수급할 수 있다. 다만 야간전을 돈다면 해치가 없어지므로 성능이 살짝 낮아지는 편.", reqPoints: 0, x: 75, y: 35, icon: skillIcons.s10, prerequisites: ["s5", "s1"] },
            { id: "s11", name: "어느 레이더의 폐품", maxLevel: 5, description: "레이더 컨테이너 노획 시, 낮은 확률로 필드 제작 아이템을 추가로 획득할 수 있습니다.", reqPoints: 0, x: 75, y: 25, icon: skillIcons.s11, prerequisites: ["s10"] },
            { id: "s12", name: "태평양 어깨", maxLevel: 5, description: "휴대할 수 있는 최대 무게가 증가합니다. 스킬 포인트당 최대 무게가 2 증가한다. 무게 10은 증강물의 등급이 하나 더 올라가는 수준으로 효과가 굉장히 크고, PvP 전투시에도 기동력 저하 없이 부착물과 사용 아이템을 더 많이 쓸 수 있게 해주는 원동력이 되기애 가치가 매우 높다.", reqPoints: 0, x: 70, y: 35, icon: skillIcons.s12, prerequisites: ["s5"] },
            { id: "s13", name: "노획자의 행운", maxLevel: 5, description: "노획 시, 아이템을 두 배로 발견할 확률이 생깁니다. 아이템을 두 배 획득하는 것이 아니고, 아이템 감정을 동시에 2개를 할 수 있는 스킬이다. 2개를 동시에 감정해서 파밍 속도가 증가하므로 가치가 매우 높다.", reqPoints: 0, x: 70, y: 25, icon: skillIcons.s13, prerequisites: ["s12"] },

            // Tier 1 (Req 15)
            { id: "s1", name: "새것처럼 쌩쌩", maxLevel: 1, description: "치유 효과를 받고 있으면 기력 회복이 증가합니다.", reqPoints: 15, x: 80, y: 45, icon: skillIcons.s1, prerequisites: ["s8"] },
            { id: "s5", name: "침묵 속의 고통", maxLevel: 1, description: "치명상 상태 시, 움직일 때 내는 소음이 줄어듭니다.", reqPoints: 15, x: 70, y: 45, icon: skillIcons.s5, prerequisites: ["s4"] },

            // Tier 2 (Req 36)
            { id: "s14", name: "지뢰 해체", maxLevel: 1, description: "인접한 지뢰와 배치형 폭발물을 해체할 수 있습니다.", reqPoints: 36, x: 80, y: 15, icon: skillIcons.s14, prerequisites: ["s11"] },
            { id: "s15", name: "보안 침해", maxLevel: 1, description: "보안 사물함을 강제로 열 수 있습니다. 맵 주요 지점에 있는 보안 사물함을 강제 개방으로 열 수 있다. 스킬 보유자가 이미 강제 개방을 한 사물함이라도, 스킬 미보유자는 열어볼 수 없다.", reqPoints: 36, x: 70, y: 15, icon: skillIcons.s15, prerequisites: ["s11"] }
        ]
    }
};
