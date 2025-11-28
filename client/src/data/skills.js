export const SKILL_DATA = {
    conditioning: {
        label: "단련 (Conditioning)",
        color: "text-red-500",
        skills: [
            { id: "c1", name: "거뜬한 무게", cost: 5, description: "실드를 착용해도 이동속도가 크게 느려지지 않습니다.\n실드 착용 시 이동속도 페널티(준중량 5%, 중량 15%)가 최대 20% 감소한다.", requirement: "" },
            { id: "c2", name: "부드러운 압박", cost: 5, description: "강제 개방시 내는 소음이 줄어듭니다.", requirement: "" },
            { id: "c3", name: "능숙한 탐구자", cost: 5, description: "문과 컨테이너를 강제 개방하는 데 걸리는 시간이 줄어듭니다.\n최대 30% 더 빨리 개방할 수 있다.", requirement: "" },
            { id: "c4", name: "깃털 같은 구르기", cost: 1, description: "쉴드가 부서지고 몇 초 내에 처음 시전하는 회피 구르기가 기력을 소모하지 않습니다.", requirement: "단련에 15포인트 필요" },
            { id: "c5", name: "폭발 내성", cost: 5, description: "근처 폭발이 청력에 미치는 영향이 줄어듭니다.", requirement: "" },
            { id: "c6", name: "싸우거나 도망가거나", cost: 5, description: "전투에서 다치면 일정량의 기력을 되돌려받습니다. 다음 사용까지 쿨다운이 적용됩니다.\n사용 쿨은 15초이다.", requirement: "" },
            { id: "c7", name: "생존자의 기력", cost: 1, description: "치명상 상태 시, 기력을 특정 수치까지 자동으로 회복합니다.", requirement: "단련에 15포인트 필요" },
            { id: "c8", name: "거뜬한 스윙", cost: 5, description: "근접 공격으로 소모하는 기력이 줄어듭니다.", requirement: "" },
            { id: "c9", name: "스카이 클리어링 스윙", cost: 5, description: "드론에 주는 근접 대미지가 증가합니다.", requirement: "" },
            { id: "c10", name: "쏠쏠한 부수입", cost: 1, description: "물체를 강제 개방하면 자원이 생성됩니다.\n개방한 컨테이너의 유형에 따라 지상 재료를 생성한다.", requirement: "" },
            { id: "c11", name: "무기 장착 완료", cost: 1, description: "장착한 무기가 과중 상태에 미치는 영향이 줄어듭니다.\n장비중인 무기 및 장착된 모드의 무게가 절반으로 절반으로 감소한다. 인벤토리에 있는 무기에는 영향이 없다.", requirement: "" },
            { id: "c12", name: "쓰러져도 지지 않아", cost: 5, description: "쓰러진 상태에서 사망할 때까지 걸리는 시간이 길어집니다.", requirement: "" },
            { id: "c13", name: "엉금엉금 거북이", cost: 5, description: "쓰러졌을 때 받는 대미지가 줄어듭니다.", requirement: "" },
            { id: "c14", name: "파리채", cost: 1, description: "이제 근접 공격 한 번으로 와스프와 포탑을 파괴할 수 있습니다.", requirement: "단련에 36포인트 필요" },
            { id: "c15", name: "위기 극복", cost: 1, description: "치명상 상태에서 벗어날 때, 짧은 시간 동안 이동 속도가 증가하고 받는 대미지가 감소합니다.", requirement: "단련에 36포인트 필요" }
        ]
    },
    mobility: {
        label: "이동성 (Mobility)",
        color: "text-blue-500",
        skills: [
            { id: "m1", name: "가벼운 발걸음", cost: 5, description: "이동 시 내는 소음이 줄어듭니다.", requirement: "" },
            { id: "m2", name: "기력 회복", cost: 5, description: "기력 회복 속도가 빨라집니다.", requirement: "" },
            { id: "m3", name: "날렵한 움직임", cost: 5, description: "장애물을 넘는 속도가 빨라집니다.", requirement: "" },
            { id: "m4", name: "전력 질주", cost: 1, description: "전력 질주 시 이동 속도가 증가합니다.", requirement: "이동성에 15포인트 필요" },
            { id: "m5", name: "등반 전문가", cost: 5, description: "등반 시 기력 소모가 줄어듭니다.", requirement: "" },
            { id: "m6", name: "빠른 손놀림", cost: 5, description: "무기 교체 속도가 빨라집니다.", requirement: "" },
            { id: "m7", name: "구르기", cost: 1, description: "회피 구르기 시 이동 거리가 증가합니다.", requirement: "이동성에 15포인트 필요" },
            { id: "m8", name: "은밀한 접근", cost: 5, description: "앉아서 이동 시 내는 소음이 줄어듭니다.", requirement: "" },
            { id: "m9", name: "재빠른 재장전", cost: 5, description: "무기 재장전 속도가 빨라집니다.", requirement: "" },
            { id: "m10", name: "도약", cost: 1, description: "점프 높이가 증가합니다.", requirement: "" },
            { id: "m11", name: "곡예사", cost: 1, description: "낙하 대미지가 줄어듭니다.", requirement: "" },
            { id: "m12", name: "숙련된 조준", cost: 5, description: "조준 시 이동 속도 감소가 줄어듭니다.", requirement: "" },
            { id: "m13", name: "안전 착지", cost: 5, description: "높은 곳에서 떨어질 때 구르기를 하면 낙하 대미지를 받지 않습니다.", requirement: "" },
            { id: "m14", name: "그림자", cost: 1, description: "앉아서 이동 시 적에게 발각될 확률이 줄어듭니다.", requirement: "이동성에 36포인트 필요" },
            { id: "m15", name: "유령", cost: 1, description: "전력 질주 시 적에게 발각될 확률이 줄어듭니다.", requirement: "이동성에 36포인트 필요" }
        ]
    },
    survival: {
        label: "생존 (Survival)",
        color: "text-green-500",
        skills: [
            { id: "s1", name: "응급 처치", cost: 5, description: "치료 아이템 사용 속도가 빨라집니다.", requirement: "" },
            { id: "s2", name: "추가 탄약", cost: 5, description: "휴대할 수 있는 탄약의 최대량이 증가합니다.", requirement: "" },
            { id: "s3", name: "자원 탐색", cost: 5, description: "근처의 자원 컨테이너를 감지할 수 있습니다.", requirement: "" },
            { id: "s4", name: "야전 의무병", cost: 1, description: "쓰러진 아군을 소생시키는 속도가 빨라집니다.", requirement: "생존에 15포인트 필요" },
            { id: "s5", name: "배낭 확장", cost: 5, description: "인벤토리 공간이 증가합니다.", requirement: "" },
            { id: "s6", name: "갈증 해소", cost: 5, description: "물 아이템 사용 시 갈증 해소량이 증가합니다.", requirement: "" },
            { id: "s7", name: "구급 상자", cost: 1, description: "치료 아이템 사용 시 추가 체력을 회복합니다.", requirement: "생존에 15포인트 필요" },
            { id: "s8", name: "탄약 제작", cost: 5, description: "필드에서 탄약을 제작할 수 있습니다.", requirement: "" },
            { id: "s9", name: "영양 보충", cost: 5, description: "음식 아이템 사용 시 허기 해소량이 증가합니다.", requirement: "" },
            { id: "s10", name: "야전 제작", cost: 1, description: "필드 제작할 수 있는 아이템을 추가로 잠금 해제합니다.\n잠금 해제되는 아이템 중에서 레이더 해치 열쇠가 핵심이며 그 외에 여러 설치형 가젯을 수급할 수 있다.", requirement: "" },
            { id: "s11", name: "어느 레이더의 폐품", cost: 5, description: "레이더 컨테이너 노획 시, 낮은 확률로 필드 제작 아이템을 추가로 획득할 수 있습니다.", requirement: "" },
            { id: "s12", name: "태평양 어깨", cost: 5, description: "휴대할 수 있는 최대 무게가 증가합니다.\n스킬 포인트당 최대 무게가 2 증가한다.", requirement: "" },
            { id: "s13", name: "노획자의 행운", cost: 5, description: "노획 시, 아이템을 두 배로 발견할 확률이 생깁니다.\n아이템을 두 배 획득하는 것이 아니고, 아이템 감정을 동시에 2개를 할 수 있는 스킬이다.", requirement: "" },
            { id: "s14", name: "지뢰 해체", cost: 1, description: "인접한 지뢰와 배치형 폭발물을 해체할 수 있습니다.", requirement: "생존에 36포인트 필요" },
            { id: "s15", name: "보안 침해", cost: 1, description: "보안 사물함을 강제로 열 수 있습니다.\n맵 주요 지점에 있는 보안 사물함을 강제 개방으로 열 수 있다.", requirement: "생존에 36포인트 필요" }
        ]
    }
};
