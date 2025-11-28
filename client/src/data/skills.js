export const SKILL_DATA = {
    conditioning: {
        label: "컨디셔닝",
        color: "text-green-500",
        bg: "bg-green-500",
        border: "border-green-500",
        skills: [
            // Tier 0 (No Requirement) - Bottom Rows
            { id: "c1", name: "거뜬한 무게", maxLevel: 5, description: "실드 착용 시 이동속도 페널티 감소", reqPoints: 0, row: 0, col: 1 }, // Root?
            { id: "c2", name: "부드러운 압박", maxLevel: 5, description: "강제 개방 소음 감소", reqPoints: 0, row: 1, col: 0 },
            { id: "c3", name: "능숙한 탐구자", maxLevel: 5, description: "강제 개방 속도 증가", reqPoints: 0, row: 1, col: 2 },
            { id: "c5", name: "폭발 내성", maxLevel: 5, description: "폭발 청력 영향 감소", reqPoints: 0, row: 2, col: 0 },
            { id: "c6", name: "싸우거나 도망가거나", maxLevel: 5, description: "피격 시 기력 회복", reqPoints: 0, row: 2, col: 2 },
            { id: "c8", name: "거뜬한 스윙", maxLevel: 5, description: "근접 공격 기력 소모 감소", reqPoints: 0, row: 3, col: 0 },
            { id: "c9", name: "스카이 클리어링", maxLevel: 5, description: "드론 근접 대미지 증가", reqPoints: 0, row: 3, col: 2 },
            { id: "c10", name: "쏠쏠한 부수입", maxLevel: 1, description: "강제 개방 시 자원 생성", reqPoints: 0, row: 4, col: 0 },
            { id: "c11", name: "무기 장착 완료", maxLevel: 1, description: "무기 무게 영향 감소", reqPoints: 0, row: 4, col: 2 },
            { id: "c12", name: "쓰러져도 지지 않아", maxLevel: 5, description: "사망 대기 시간 증가", reqPoints: 0, row: 5, col: 0 },
            { id: "c13", name: "엉금엉금 거북이", maxLevel: 5, description: "쓰러짐 상태 대미지 감소", reqPoints: 0, row: 5, col: 2 },

            // Tier 1 (Req 15)
            { id: "c4", name: "깃털 같은 구르기", maxLevel: 1, description: "실드 파괴 후 첫 구르기 기력 소모 0", reqPoints: 15, row: 6, col: 0 },
            { id: "c7", name: "생존자의 기력", maxLevel: 1, description: "치명상 시 기력 자동 회복", reqPoints: 15, row: 6, col: 2 },

            // Tier 2 (Req 36)
            { id: "c14", name: "파리채", maxLevel: 1, description: "근접 공격으로 와스프/포탑 파괴", reqPoints: 36, row: 7, col: 0 },
            { id: "c15", name: "위기 극복", maxLevel: 1, description: "치명상 회복 시 이속 증가/댐감", reqPoints: 36, row: 7, col: 2 }
        ]
    },
    mobility: {
        label: "기동성",
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        skills: [
            { id: "m1", name: "가벼운 발걸음", maxLevel: 5, description: "이동 소음 감소", reqPoints: 0, row: 0, col: 1 },
            { id: "m2", name: "기력 회복", maxLevel: 5, description: "기력 회복 속도 증가", reqPoints: 0, row: 1, col: 0 },
            { id: "m3", name: "날렵한 움직임", maxLevel: 5, description: "장애물 넘기 속도 증가", reqPoints: 0, row: 1, col: 2 },
            { id: "m5", name: "등반 전문가", maxLevel: 5, description: "등반 기력 소모 감소", reqPoints: 0, row: 2, col: 0 },
            { id: "m6", name: "빠른 손놀림", maxLevel: 5, description: "무기 교체 속도 증가", reqPoints: 0, row: 2, col: 2 },
            { id: "m8", name: "은밀한 접근", maxLevel: 5, description: "앉아 이동 소음 감소", reqPoints: 0, row: 3, col: 0 },
            { id: "m9", name: "재빠른 재장전", maxLevel: 5, description: "재장전 속도 증가", reqPoints: 0, row: 3, col: 2 },
            { id: "m10", name: "도약", maxLevel: 1, description: "점프 높이 증가", reqPoints: 0, row: 4, col: 0 },
            { id: "m11", name: "곡예사", maxLevel: 1, description: "낙하 대미지 감소", reqPoints: 0, row: 4, col: 2 },
            { id: "m12", name: "숙련된 조준", maxLevel: 5, description: "조준 시 이속 감소 완화", reqPoints: 0, row: 5, col: 0 },
            { id: "m13", name: "안전 착지", maxLevel: 5, description: "낙하 시 구르기로 대미지 무효", reqPoints: 0, row: 5, col: 2 },

            // Tier 1
            { id: "m4", name: "전력 질주", maxLevel: 1, description: "전력 질주 속도 증가", reqPoints: 15, row: 6, col: 0 },
            { id: "m7", name: "구르기", maxLevel: 1, description: "구르기 거리 증가", reqPoints: 15, row: 6, col: 2 },

            // Tier 2
            { id: "m14", name: "그림자", maxLevel: 1, description: "앉아 이동 시 발각 확률 감소", reqPoints: 36, row: 7, col: 0 },
            { id: "m15", name: "유령", maxLevel: 1, description: "전력 질주 시 발각 확률 감소", reqPoints: 36, row: 7, col: 2 }
        ]
    },
    survival: {
        label: "생존",
        color: "text-red-500",
        bg: "bg-red-500",
        border: "border-red-500",
        skills: [
            { id: "s1", name: "응급 처치", maxLevel: 5, description: "치료 속도 증가", reqPoints: 0, row: 0, col: 1 },
            { id: "s2", name: "추가 탄약", maxLevel: 5, description: "탄약 소지량 증가", reqPoints: 0, row: 1, col: 0 },
            { id: "s3", name: "자원 탐색", maxLevel: 5, description: "자원 컨테이너 감지", reqPoints: 0, row: 1, col: 2 },
            { id: "s5", name: "배낭 확장", maxLevel: 5, description: "인벤토리 공간 증가", reqPoints: 0, row: 2, col: 0 },
            { id: "s6", name: "갈증 해소", maxLevel: 5, description: "물 갈증 해소량 증가", reqPoints: 0, row: 2, col: 2 },
            { id: "s8", name: "탄약 제작", maxLevel: 5, description: "필드 탄약 제작", reqPoints: 0, row: 3, col: 0 },
            { id: "s9", name: "영양 보충", maxLevel: 5, description: "음식 허기 해소량 증가", reqPoints: 0, row: 3, col: 2 },
            { id: "s10", name: "야전 제작", maxLevel: 1, description: "필드 제작 아이템 추가", reqPoints: 0, row: 4, col: 0 },
            { id: "s11", name: "어느 레이더의 폐품", maxLevel: 5, description: "노획 시 제작템 획득", reqPoints: 0, row: 4, col: 2 },
            { id: "s12", name: "태평양 어깨", maxLevel: 5, description: "최대 무게 증가", reqPoints: 0, row: 5, col: 0 },
            { id: "s13", name: "노획자의 행운", maxLevel: 5, description: "동시 감정 (2배 파밍)", reqPoints: 0, row: 5, col: 2 },

            // Tier 1
            { id: "s4", name: "야전 의무병", maxLevel: 1, description: "소생 속도 증가", reqPoints: 15, row: 6, col: 0 },
            { id: "s7", name: "구급 상자", maxLevel: 1, description: "치료 시 추가 체력 회복", reqPoints: 15, row: 6, col: 2 },

            // Tier 2
            { id: "s14", name: "지뢰 해체", maxLevel: 1, description: "폭발물 해체 가능", reqPoints: 36, row: 7, col: 0 },
            { id: "s15", name: "보안 침해", maxLevel: 1, description: "보안 사물함 강제 개방", reqPoints: 36, row: 7, col: 2 }
        ]
    }
};
