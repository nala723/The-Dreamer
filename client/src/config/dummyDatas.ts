type ObjType = [
    {
        [index: string] : string[]
        자연:  string[]
    },
    {
        [index: string] : string[]
        인물:  string[]
    },
    {
        [index: string] : string[]
        동물:  string[]
    },
    {
        [index: string] : string[]
        식물:  string[]
    },
    {
        [index: string] : string[]
        물건:  string[]
    },
    {
        [index: string] : string[]
        신체:  string[]
    },
    {
        [index: string] : string[]
        장소:  string[]
    },
    {
        [index: string] : string[]
        행동:  string[]
    },
    {
        [index: string] : string[]
        기타:  string[]
    },

]


export const dummyDatas: ObjType = 
[
    {
        자연: [ '하늘', '물', '산', '구름', '바다', '숲', '달', '땅', '바람', '별', '빛', '강물', '바위', '안개', '흙', '벼락', '무지개', '연기']
    },
    {    
        인물: [ '자신', '부모', '친구', '사람', '부부', '여자', '남자', '조상', '아이', '갓난아이', '가족', '연인', '대통령', '시체', '도둑', '환자',
        '강도', '귀신', '군중']
    },
    {   
        동물: [ '개', '개구리', '거북', '고래', '곤충', '곰', '고양이', '까마귀', '까치', '나비', '늑대', '닭', '돼지', '말', '물고기', '뱀', '벌레',
        '봉황', '비둘기', '사슴', '사자', '양', '여우', '원숭이', '잉어', '제비', '쥐', '지렁이', '코끼리', '토끼', '파랑새', '표범', '학', '호랑이']
    },    
    {   
        식물: [ '나무', '해초', '호박', '고구마', '감자', '꽃', '곡식', '카네이션', '백합', '사과', '레몬', '과일']
    },
    {      
        물건: [ '안경', '선물', '모자', '보석', '옷', '편지', '식기']
    },
    {    
        신체: [ '몸', '머리', '손', '배', '얼굴', '눈', '목', '모습', '입', '알몸', '털', '귀', '코', '머리카락', '가슴', '수염', '발', '손가락', '팔', '어깨', '혀']
    },
    {    
        장소: [ '집', '길', '방', '다리', '밖', '화장실', '무덤', '공중', '우물', '지붕', '절', '밭', '건물', '가운데', '상가', '동굴', '고향', '감옥', '산속',
        '들판']
    },
    {    
        행동: [ '보는', '받는', '타는', '먹는', '보이는', '잡는', '앉는', '되는', '얻는', '들어가는', '죽는', '보는', '입는', '떨어지는', '올라가는', '사는',
        '우는', '빠지는', '나는', '씻는', '숨는']
    },
    {    
        기타: [ '생각', '변신', '숫자', '부처', '예수', '여행', '수술', '벌', '노래', '경기', '승천']
    }    
];

export const colors = [
    '#B30000', '#FF0000', '#FF6600', '#FF9933', '#FFCC00', '#FFFF00', '#87EB24', '#33CC33', '#009900', '#00E673',
    '#000000', '#FFFFFF', '#8F8F8F', '#CC00CC', '#6600CC', '#3333CC', '#0000FF', '#0099FF', '#33CCFF', '#00FFFF'
];

export const cursors = [
    'url(/images/brush.cur), pointer', 'url(/images/eraser.cur), pointer', 'url(/images/bucket.cur), pointer'
];

export const emotionList = [
    {
        name : 'soso',
        img: '../assets/face-soso.svg', 
      },
    {
        name : 'wink',
        img: '../assets/face-wink.svg',  
      },
    {
      name : 'happy',
      img: '../assets/face-happy.svg', 
    },
    {
      name : 'bad',
      img: '../assets/face-bad.svg'
    },
    {
     name : 'what',
     img: '../assets/face-what.svg'
    }
]