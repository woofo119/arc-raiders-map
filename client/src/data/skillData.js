export const SKILL_DATA = {
    conditioning: {
        id: 'conditioning',
        label: '컨디셔닝',
        color: '#4ade80', // Green
        description: '신체적 회복력과 전투 효율성 강화',
        skills: [
            { id: 'c1', name: '무게에 익숙함', description: '방패를 착용해도 속도가 크게 느려지지 않습니다.', maxPoints: 5, isMajor: true },
            { id: 'c2', name: '폭발 내성', description: '근처 폭발에 청력이 덜 영향을 받습니다.', maxPoints: 5, isMajor: false },
            { id: 'c3', name: '부드러운 압력', description: '돌파 시 소음이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'c4', name: '싸우거나 도망치거나', description: '전투 중 부상을 입으면 일정량의 스태미나를 회복합니다. 사용 사이에 재사용 대기시간이 있습니다.', maxPoints: 5, isMajor: false },
            { id: 'c5', name: '숙련된 개방가', description: '문과 컨테이너를 여는 데 걸리는 시간이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'c6', name: '생존자의 스태미나', description: '치명상을 입었을 때 스태미나 재생 속도가 빨라집니다.', maxPoints: 1, isMajor: true },
            { id: 'c7', name: '부담 없는 구르기', description: '방패가 파괴되면 몇 초 내의 첫 번째 회피 구르기는 스태미나를 소모하지 않습니다.', maxPoints: 1, isMajor: true },
            { id: 'c8', name: '약간의 추가 획득', description: '물체를 열면 자원이 생성됩니다.', maxPoints: 5, isMajor: false },
            { id: 'c9', name: '쓰러졌지만 단호함', description: '쓰러졌을 때 완전히 쓰러지기까지 걸리는 시간이 길어집니다.', maxPoints: 5, isMajor: false },
            { id: 'c10', name: '힘들이지 않는 휘두르기', description: '근접 공격 스태미나 소모량이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'c11', name: '가벼운 무장', description: '장착한 무기가 과적에 미치는 영향이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'c12', name: '거북이 기어가기', description: '쓰러진 상태에서 받는 피해가 줄어듭니다.', maxPoints: 1, isMajor: false },
            { id: 'c13', name: '하늘을 가르는 휘두르기', description: '드론에게 더 많은 근접 피해를 줍니다.', maxPoints: 5, isMajor: false },
            { id: 'c14', name: '다시 일어서기', description: '치명상을 입었을 때 체력이 일정 한도까지 재생됩니다.', maxPoints: 1, isMajor: true },
            { id: 'c15', name: '파리채', description: '한 번의 근접 공격으로 틱, 팝, 와스프, 터렛을 파괴합니다.', maxPoints: 1, isMajor: true }
        ]
    },
    mobility: {
        id: 'mobility',
        label: '기동성',
        color: '#facc15', // Yellow
        description: '전장에서의 움직임과 민첩성 마스터',
        skills: [
            { id: 'm1', name: '날렵한 등반가', description: '더 빠르게 오르고 넘을 수 있습니다.', maxPoints: 5, isMajor: true },
            { id: 'm2', name: '마라톤 주자', description: '이동 시 스태미나 소모량이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'm3', name: '미끄러지기', description: '더 멀리, 더 빠르게 미끄러질 수 있습니다.', maxPoints: 5, isMajor: false },
            { id: 'm4', name: '젊은 폐활량', description: '최대 스태미나를 증가시킵니다.', maxPoints: 5, isMajor: false },
            { id: 'm5', name: '튼튼한 발목', description: '치명적이지 않은 높이에서 떨어질 때 낙하 피해를 덜 받습니다.', maxPoints: 5, isMajor: false },
            { id: 'm6', name: '기세 유지', description: '질주 회피 구르기 후 짧은 시간 동안 질주가 스태미나를 소모하지 않습니다. 사용 사이에 재사용 대기시간이 있습니다.', maxPoints: 1, isMajor: true },
            { id: 'm7', name: '차분한 산책', description: '걷는 동안 스태미나가 가만히 서 있을 때처럼 재생됩니다.', maxPoints: 1, isMajor: true },
            { id: 'm8', name: '걷기 전 기어가기', description: '쓰러졌을 때 더 빨리 기어갑니다.', maxPoints: 5, isMajor: false },
            { id: 'm9', name: '힘들이지 않는 구르기', description: '회피 구르기 스태미나 소모량이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 'm10', name: '벽 타기', description: '벽 점프를 더 멀리 할 수 있습니다.', maxPoints: 5, isMajor: false },
            { id: 'm11', name: '활기찬 도약가', description: '지쳤을 때 더 이상 넘기가 느려지지 않습니다.', maxPoints: 1, isMajor: false },
            { id: 'm12', name: '영웅적인 도약', description: '질주 회피 구르기를 더 멀리 할 수 있습니다.', maxPoints: 5, isMajor: false },
            { id: 'm13', name: '구를 준비 완료', description: '떨어질 때 회복 구르기를 수행할 수 있는 타이밍 창이 증가합니다.', maxPoints: 5, isMajor: false },
            { id: 'm14', name: '끝없는 도약', description: '넘기가 더 이상 스태미나를 소모하지 않습니다.', maxPoints: 1, isMajor: true },
            { id: 'm15', name: '도약 점프', description: '넘기 끝에 점프할 수 있습니다.', maxPoints: 1, isMajor: true }
        ]
    },
    survival: {
        id: 'survival',
        label: '생존',
        color: '#f87171', // Red
        description: '탐색 및 현장 제작 능력 개발',
        skills: [
            { id: 's1', name: '민첩한 웅크리기', description: '웅크린 상태에서의 이동 속도가 증가합니다.', maxPoints: 5, isMajor: true },
            { id: 's2', name: '약탈자의 본능', description: '컨테이너를 수색할 때 전리품이 더 빨리 드러납니다.', maxPoints: 5, isMajor: false },
            { id: 's3', name: '활력 웅크리기', description: '웅크린 상태에서의 스태미나 재생이 증가합니다.', maxPoints: 5, isMajor: false },
            { id: 's4', name: '조용한 약탈자', description: '약탈 시 소음이 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 's5', name: '현장 제작', description: '지상에서 아이템을 현장 제작할 수 있는 능력을 잠금 해제합니다.', maxPoints: 1, isMajor: false },
            { id: 's6', name: '침묵 속 고통', description: '치명상을 입었을 때 움직임 소음이 줄어듭니다.', maxPoints: 1, isMajor: true },
            { id: 's7', name: '새것처럼', description: '치유 효과를 받는 동안 스태미나 재생이 증가합니다.', maxPoints: 1, isMajor: true },
            { id: 's8', name: '여행하는 땜장이', description: '현장 제작할 수 있는 추가 아이템을 잠금 해제합니다.', maxPoints: 1, isMajor: false },
            { id: 's9', name: '넓은 어깨', description: '운반할 수 있는 최대 아이템 양을 증가시킵니다.', maxPoints: 5, isMajor: false },
            { id: 's10', name: '고집 센 노새', description: '과적으로 인한 스태미나 재생 감소 효과가 줄어듭니다.', maxPoints: 5, isMajor: false },
            { id: 's11', name: '한 레이더의 고철', description: '레이더 컨테이너를 약탈할 때 추가 현장 제작 아이템을 찾을 확률이 약간 있습니다.', maxPoints: 5, isMajor: false },
            { id: 's12', name: '약탈자의 행운', description: '약탈 중 한 번에 두 배의 아이템을 드러낼 확률이 있습니다.', maxPoints: 1, isMajor: false },
            { id: 's13', name: '세 번의 깊은 숨', description: '능력이 스태미나를 소모한 후 더 빨리 회복합니다.', maxPoints: 5, isMajor: false },
            { id: 's14', name: '보안 돌파', description: '보안 사물함을 열 수 있습니다.', maxPoints: 1, isMajor: true },
            { id: 's15', name: '지뢰 제거자', description: '가까이 있을 때 지뢰와 폭발물을 해체할 수 있습니다.', maxPoints: 1, isMajor: true }
        ]
    }
};
