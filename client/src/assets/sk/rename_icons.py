import os
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

renames = {
    # Conditioning
    "imgi_30_used_to_the_weight.png": "거뜬한_무게.png",
    "imgi_32_gentle_pressure.png": "부드러운_압박.png",
    "imgi_34_proficient_pryer.png": "능숙한_탐구자.png",
    "imgi_31_blast_born.png": "폭발_내성.png",
    "imgi_33_fight_or_flight.png": "싸우거나_도망가거나.png",
    "imgi_39_effortless_swing.png": "거뜬한_스윙.png",
    "imgi_42_sky_clearing_swing.png": "스카이_클리어링_스윙.png",
    "imgi_37_a_little_extra.png": "쏠쏠한_부수입.png",
    "imgi_40_loaded_arms.png": "무기_장착_완료.png",
    "imgi_38_downed_but_determined.png": "쓰러져도_지지_않아.png",
    "imgi_41_turtle_crawl.png": "엉금엉금_거북이.png",
    "imgi_36_unburdened_roll.png": "깃털_같은_구르기.png",
    "imgi_35_survivors_stamina.png": "생존자의_기력.png",
    "imgi_44_flyswatter.png": "파리채.png",
    "imgi_43_back_on_your_feet.png": "위기_극복.png",

    # Mobility
    "imgi_51_calming_stroll.png": "차분한_산보.png",
    "imgi_48_youthful_lungs.png": "젊음의_폐.png",
    "imgi_55_vigorous_vaulter.png": "혈기_왕성_뜀박질.png",
    "imgi_45_nimble_climber.png": "날렵한_등반가.png",
    "imgi_57_ready_to_roll.png": "구를_준비_완료.png",
    "imgi_50_carry_the_momentum.png": "추진력을_얻기_위함.png",
    "imgi_56_heroic_leap.png": "영웅적_도약.png",
    "imgi_49_sturdy_ankles.png": "튼튼한_발목.png",
    "imgi_54_off_the_wall.png": "미친_듯_벽_타기.png",
    "imgi_47_slip_and_slide.png": "멀리멀리_슬라이드.png",
    "imgi_46_marathon_runner.png": "마라톤_선수.png",
    "imgi_53_effortless_roll.png": "힘들이지_않고_구르기.png",
    "imgi_52_crawl_before_you_walk.png": "걷기_전에_기기.png",
    "imgi_59_vault_spring.png": "연속_뛰기.png",
    "imgi_58_vaults_on_vaults_on_vaults.png": "넘고_넘고_뛰어넘고.png",

    # Survival
    "imgi_66_good_as_new.png": "새것처럼_쌩쌩.png",
    "imgi_69_stubborn_mule.png": "튼튼한_노새.png",
    "imgi_61_looters_instincts.png": "노획_본능.png",
    "imgi_65_suffer_in_silence.png": "침묵_속의_고통.png",
    "imgi_62_revitalizing_squat.png": "쪼그려서_원기회복.png",
    "imgi_64_in_round_crafting.png": "라운드_중_제작.png",
    "imgi_72_three_deep_breaths.png": "심호흡_세_번.png",
    "imgi_67_traveling_tinkerer.png": "여행자_땜장이.png",
    "imgi_70_one_raiders_scraps.png": "어느_레이더의_폐품.png",
    "imgi_68_broad_shoulders.png": "태평양_어깨.png",
    "imgi_71_looters_luck.png": "노획자의_행운.png",
    "imgi_63_silent_scavenger.png": "침묵의_청소부.png",
    "imgi_74_minesweeper.png": "지뢰_해체.png",
    "imgi_73_security_breach.png": "보안_침해.png",
    "imgi_60_agile_croucher.png": "날렵한_웅크리기.png"
}

for old, new in renames.items():
    if os.path.exists(old):
        try:
            os.rename(old, new)
            print(f"Renamed {old} to {new}")
        except Exception as e:
            print(f"Error renaming {old}: {e}")
    else:
        print(f"Skipping {old}, not found")
