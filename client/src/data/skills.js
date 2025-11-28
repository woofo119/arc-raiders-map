export const SKILL_DATA = {
    conditioning: {
        label: "컨디셔닝",
        color: "text-green-500",
        bg: "bg-green-500",
        border: "border-green-500",
        skills: [
            // Tier 0 (No Requirement) - Bottom Rows
            { id: "c1", name: "거뜬한 무게", maxLevel: 5, description: "실드 착용 시 이동속도 페널티 감소", reqPoints: 0, x: 25, y: 75, icon: "/sk/imgi_30_used_to_the_weight.png" },
            { id: "c2", name: "부드러운 압박", maxLevel: 5, description: "강제 개방 소음 감소", reqPoints: 0, x: 30, y: 65, icon: "/sk/imgi_32_gentle_pressure.png" },
            { id: "c3", name: "능숙한 탐구자", maxLevel: 5, description: "강제 개방 속도 증가", reqPoints: 0, x: 30, y: 55, icon: "/sk/imgi_34_proficient_pryer.png" },
            { id: "c5", name: "폭발 내성", maxLevel: 5, description: "폭발 청력 영향 감소", reqPoints: 0, x: 20, y: 65, icon: "/sk/imgi_31_blast_born.png" },
            { id: "c6", name: "싸우거나 도망가거나", maxLevel: 5, description: "피격 시 기력 회복", reqPoints: 0, x: 20, y: 55, icon: "/sk/imgi_33_fight_or_flight.png" },
            { id: "c8", name: "거뜬한 스윙", maxLevel: 5, description: "근접 공격 기력 소모 감소", reqPoints: 0, x: 30, y: 35, icon: "/sk/imgi_39_effortless_swing.png" },
            { id: "c9", name: "스카이 클리어링", maxLevel: 5, description: "드론 근접 대미지 증가", reqPoints: 0, x: 30, y: 25, icon: "/sk/imgi_42_sky_clearing_swing.png" },
            { id: "c10", name: "쏠쏠한 부수입", maxLevel: 1, description: "강제 개방 시 자원 생성", reqPoints: 0, x: 25, y: 35, icon: "/sk/imgi_37_a_little_extra.png" },
            { id: "c11", name: "무기 장착 완료", maxLevel: 1, description: "무기 무게 영향 감소", reqPoints: 0, x: 25, y: 25, icon: "/sk/imgi_40_loaded_arms.png" },
            { id: "c12", name: "쓰러져도 지지 않아", maxLevel: 5, description: "사망 대기 시간 증가", reqPoints: 0, x: 20, y: 35, icon: "/sk/imgi_38_downed_but_determined.png" },
            { id: "c13", name: "엉금엉금 거북이", maxLevel: 5, description: "쓰러짐 상태 대미지 감소", reqPoints: 0, x: 20, y: 25, icon: "/sk/imgi_41_turtle_crawl.png" },

            // Tier 1 (Req 15)
            { id: "c4", name: "깃털 같은 구르기", maxLevel: 1, description: "실드 파괴 후 첫 구르기 기력 소모 0", reqPoints: 15, x: 30, y: 45, icon: "/sk/imgi_36_unburdened_roll.png" },
            { id: "c7", name: "생존자의 기력", maxLevel: 1, description: "치명상 시 기력 자동 회복", reqPoints: 15, x: 20, y: 45, icon: "/sk/imgi_35_survivors_stamina.png" },

            // Tier 2 (Req 36)
            { id: "c14", name: "파리채", maxLevel: 1, description: "근접 공격으로 와스프/포탑 파괴", reqPoints: 36, x: 30, y: 15, icon: "/sk/imgi_44_flyswatter.png" },
            { id: "c15", name: "위기 극복", maxLevel: 1, description: "치명상 회복 시 이속 증가/댐감", reqPoints: 36, x: 20, y: 15, icon: "/sk/imgi_43_back_on_your_feet.png" }
        ]
    },
    mobility: {
        label: "기동성",
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        skills: [
            { id: "m1", name: "가벼운 발걸음", maxLevel: 5, description: "이동 소음 감소", reqPoints: 0, x: 55, y: 45, icon: "/sk/imgi_51_calming_stroll.png" },
            { id: "m2", name: "기력 회복", maxLevel: 5, description: "기력 회복 속도 증가", reqPoints: 0, x: 45, y: 55, icon: "/sk/imgi_48_youthful_lungs.png" },
            { id: "m3", name: "날렵한 움직임", maxLevel: 5, description: "장애물 넘기 속도 증가", reqPoints: 0, x: 50, y: 25, icon: "/sk/imgi_55_vigorous_vaulter.png" },
            { id: "m5", name: "등반 전문가", maxLevel: 5, description: "등반 기력 소모 감소", reqPoints: 0, x: 50, y: 75, icon: "/sk/imgi_45_nimble_climber.png" },
            { id: "m6", name: "빠른 손놀림", maxLevel: 5, description: "무기 교체 속도 증가", reqPoints: 0, x: 55, y: 25, icon: "/sk/imgi_57_ready_to_roll.png" },
            { id: "m9", name: "재빠른 재장전", maxLevel: 5, description: "재장전 속도 증가", reqPoints: 0, x: 45, y: 45, icon: "/sk/imgi_50_carry_the_momentum.png" },
            { id: "m10", name: "도약", maxLevel: 1, description: "점프 높이 증가", reqPoints: 0, x: 45, y: 25, icon: "/sk/imgi_56_heroic_leap.png" },
            { id: "m11", name: "곡예사", maxLevel: 1, description: "낙하 대미지 감소", reqPoints: 0, x: 55, y: 55, icon: "/sk/imgi_49_sturdy_ankles.png" },
            { id: "m12", name: "숙련된 조준", maxLevel: 5, description: "조준 시 이속 감소 완화", reqPoints: 0, x: 55, y: 35, icon: "/sk/imgi_54_off_the_wall.png" },
            { id: "m13", name: "안전 착지", maxLevel: 5, description: "낙하 시 구르기로 대미지 무효", reqPoints: 0, x: 55, y: 65, icon: "/sk/imgi_47_slip_and_slide.png" },

            // Tier 1
            { id: "m4", name: "전력 질주", maxLevel: 1, description: "전력 질주 속도 증가", reqPoints: 15, x: 45, y: 65, icon: "/sk/imgi_46_marathon_runner.png" },
            { id: "m7", name: "구르기", maxLevel: 1, description: "구르기 거리 증가", reqPoints: 15, x: 45, y: 35, icon: "/sk/imgi_53_effortless_roll.png" },

            // Tier 2
            { id: "m14", name: "그림자", maxLevel: 1, description: "앉아 이동 시 발각 확률 감소", reqPoints: 36, x: 50, y: 35, icon: "/sk/imgi_52_crawl_before_you_walk.png" },
            { id: "m15", name: "유령", maxLevel: 1, description: "전력 질주 시 발각 확률 감소", reqPoints: 36, x: 55, y: 15, icon: "/sk/imgi_59_vault_spring.png" },
            { id: "m16", name: "곡예", maxLevel: 1, description: "추가", reqPoints: 0, x: 45, y: 15, icon: "/sk/imgi_58_vaults_on_vaults_on_vaults.png" }
        ]
    },
    survival: {
        label: "생존",
        color: "text-red-500",
        bg: "bg-red-500",
        border: "border-red-500",
        skills: [
            { id: "s1", name: "응급 처치", maxLevel: 5, description: "치료 속도 증가", reqPoints: 0, x: 80, y: 45, icon: "/sk/imgi_66_good_as_new.png" },
            { id: "s2", name: "추가 탄약", maxLevel: 5, description: "탄약 소지량 증가", reqPoints: 0, x: 80, y: 35, icon: "/sk/imgi_69_stubborn_mule.png" },
            { id: "s3", name: "자원 탐색", maxLevel: 5, description: "자원 컨테이너 감지", reqPoints: 0, x: 70, y: 65, icon: "/sk/imgi_61_looters_instincts.png" },
            { id: "s5", name: "배낭 확장", maxLevel: 5, description: "인벤토리 공간 증가", reqPoints: 0, x: 70, y: 45, icon: "/sk/imgi_65_suffer_in_silence.png" },
            { id: "s6", name: "갈증 해소", maxLevel: 5, description: "물 갈증 해소량 증가", reqPoints: 0, x: 80, y: 65, icon: "/sk/imgi_62_revitalizing_squat.png" },
            { id: "s8", name: "탄약 제작", maxLevel: 5, description: "필드 탄약 제작", reqPoints: 0, x: 80, y: 55, icon: "/sk/imgi_64_in_round_crafting.png" },
            { id: "s9", name: "영양 보충", maxLevel: 5, description: "음식 허기 해소량 증가", reqPoints: 0, x: 80, y: 25, icon: "/sk/imgi_72_three_deep_breaths.png" },
            { id: "s10", name: "야전 제작", maxLevel: 1, description: "필드 제작 아이템 추가", reqPoints: 0, x: 75, y: 35, icon: "/sk/imgi_67_traveling_tinkerer.png" },
            { id: "s11", name: "어느 레이더의 폐품", maxLevel: 5, description: "노획 시 제작템 획득", reqPoints: 0, x: 75, y: 25, icon: "/sk/imgi_70_one_raiders_scraps.png" },
            { id: "s12", name: "태평양 어깨", maxLevel: 5, description: "최대 무게 증가", reqPoints: 0, x: 70, y: 35, icon: "/sk/imgi_68_broad_shoulders.png" },
            { id: "s13", name: "노획자의 행운", maxLevel: 5, description: "동시 감정 (2배 파밍)", reqPoints: 0, x: 70, y: 25, icon: "/sk/imgi_71_looters_luck.png" },

            // Tier 1
            { id: "s4", name: "야전 의무병", maxLevel: 1, description: "소생 속도 증가", reqPoints: 15, x: 70, y: 55, icon: "/sk/imgi_63_silent_scavenger.png" },

            // Tier 2
            { id: "s14", name: "지뢰 해체", maxLevel: 1, description: "폭발물 해체 가능", reqPoints: 36, x: 80, y: 15, icon: "/sk/imgi_74_minesweeper.png" },
            { id: "s15", name: "보안 침해", maxLevel: 1, description: "보안 사물함 강제 개방", reqPoints: 36, x: 70, y: 15, icon: "/sk/imgi_73_security_breach.png" },

            // Added based on coordinates
            { id: "s16", name: "은밀한 접근", maxLevel: 5, description: "앉아 이동 소음 감소", reqPoints: 0, x: 75, y: 75, icon: "/sk/imgi_60_agile_croucher.png" }
        ]
    }
};
