

function fitToScreen() {
    const wrapper = document.getElementById('main-wrapper');
    if (!wrapper) return;

    const baseWidth = 420;
    const baseHeight = 630;
    const marginRatio = 0.85; 

    const scaleX = (window.innerWidth * marginRatio) / baseWidth;
    const scaleY = (window.innerHeight * marginRatio) / baseHeight;
    
    const scale = Math.min(scaleX, scaleY);
    
    wrapper.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', fitToScreen);
window.addEventListener('DOMContentLoaded', () => {
    fitToScreen();
    initPetting();
});

const ACTIONS = [
    { id: 'meal', name: '식사', icon: '🍚', effect: {hp:10, hap:2, str:3, int:-2}, hidden: {kind:4} },
    { id: 'study', name: '공부', icon: '📚', effect: {int:10, hap:-5, str:-5, hp:-4}, hidden: {diligent:6, curious:4} },
    { id: 'workout', name: '운동', icon: '⚽', effect: {hp:9, hap:2, int:-1, str:4}, hidden: {courage:6, diligent:6} },
    { id: 'draw', name: '그림', icon: '🎨', effect: {hap:6, str:3, hp:-3, int:-1}, hidden: {creative:8, curious:2} },
    { id: 'walk', name: '산책', icon: '🌿', effect: {hap:5, str:5, hp:-2, int:-1}, hidden: {courage:3, curious:5} },
    { id: 'clean', name: '청소', icon: '🧹', effect: {str:4, hap:-1, hp:-5}, hidden: {diligent:7, kind:2} },
    { id: 'cook', name: '요리', icon: '🍳', effect: {hp:5, hap:4, str:2}, hidden: {kind:6, creative:2} },
    { id: 'nap', name: '낮잠', icon: '💤', effect: {hp:12, str:10}, hidden: {} },
    { id: 'job', name: '알바', icon: '💰', effect: {hap:3, hp:-8, str:-8}, hidden: {greed:7, diligent:3} },
    { id: 'internet', name: '인터넷', icon: '💻', effect: {int:5, hap:4, hp:-4, str:-3}, hidden: {curious:6, greed:3} }
];

const TAROT_CARDS = [
    { id: 'sun', name: '태양', icon: '☀️', desc: '밝고 따뜻한 기운이군...', hidden: {kind: 20, creative: 20}, resultText: '강아지의 친절과 창의가 올랐다!' },
    { id: 'strength', name: '힘', icon: '💪', desc: '강인한 힘이 느껴지는군...', hidden: {courage: 20, diligent: 20}, resultText: '강아지의 용기와 성실이 올랐다!' },
    { id: 'magician', name: '마법사', icon: '🪄', desc: '신비로운 마법의 기운이군...', hidden: {curious: 20, greed: 20}, resultText: '강아지의 호기심과 욕심이 올랐다!' },
    { id: 'world', name: '세계', icon: '🌍', desc: '완전한 기운이군...', hidden: {kind: 10, courage: 10, creative: 10, diligent: 10, curious: 10, greed: 10}, resultText: '강아지의 모든 능력이 조금씩 올랐다!' }
];

const ALL_ENDINGS = [
    { id: 'art', name: '현대미술가', icon: '🎨', image: 'pic/job/art.png', reqAction: {draw: 3}, reqHidden: {creative: 45} },
    { id: 'doc', name: '의사', icon: '🩺', image: 'pic/job/doc.png', reqAction: {study: 4}, reqHidden: {kind: 40, diligent: 45} },
    { id: 'astro', name: '우주비행사', icon: '🚀', image: 'pic/job/astro.png', reqAction: {workout: 3}, reqHidden: {courage: 45, curious: 35} },
    { id: 'ceo', name: '사업가', icon: '💼', image: 'pic/job/ceo.png', reqAction: {job: 3, internet: 2}, reqHidden: {greed: 45} },
    { id: 'photo', name: '사진가', icon: '📷', image: 'pic/job/photo.png', reqAction: {walk: 3, draw: 2}, reqHidden: {creative: 40, curious: 40} },
    { id: 'idol', name: '아이돌', icon: '🎤', image: 'pic/job/idol.png', reqAction: {workout: 3, internet: 3}, reqHidden: {greed: 35, diligent: 35, kind: 35} },
    { id: 'dev', name: '개발자', icon: '💻', image: 'pic/job/dev.png', reqAction: {study: 3, internet: 4}, reqHidden: {curious: 45, diligent: 40} },
    { id: 'barista', name: '바리스타', icon: '☕', image: 'pic/job/bar.png', reqAction: {cook: 3, clean: 2}, reqHidden: {kind: 45} },
    { id: 'explorer', name: '탐험가', icon: '🧭', image: 'pic/job/exp.png', reqAction: {walk: 4, workout: 2}, reqHidden: {courage: 40, curious: 45} },
    { id: 'normal', name: '평범한 사람', icon: '😊', image: 'pic/job/normal.png' }
];
const NORMAL_JOB = ALL_ENDINGS.find(e => e.id === 'normal');

const QUOTES = {
    baby: {
        A: ["뭉...", "낑...", "꿍...", "킁..."],
        B: ["좋은 것 같아.", "배가 고파.", "졸려...", "놀고 싶어.", "저건 뭐지?", "무서운 건 싫어.", "안아줬으면 좋겠어.", "기분이 좋아.", "심심해.", "조금 쉬고 싶어.", "맛있는 냄새가 나.", "신기해.", "따뜻해서 좋다.", "누군가 보고 싶어.", "새로운 게 좋아.", "조금 피곤해."]
    },
    child: ["공부는 어렵네.", "밖에 나가고 싶어.", "뭔가 알 것 같아.", "새로운 걸 배우고 싶어.", "오늘은 운이 좋을 것 같아.", "멋진 사람이 되고 싶어.", "산책하고 싶다.", "생각보다 어렵네.", "힘내자.", "도움이 되고 싶어.", "가끔은 아무것도 하기 싫어.", "더 강해지고 싶어.", "맛있는 걸 먹고 싶어.", "저건 어떻게 만드는 걸까?", "조금 긴장된다."],
    adult: ["최선을 다해보자.", "쉬는 것도 중요한 것 같네.", "새로운 도전을 해보고 싶다.", "조금 피곤하지만 괜찮다.", "바람 쐬러 가고 싶다.", "바다 보러 가고 싶네.", "혼자만의 시간도 필요해.", "배가 고프네.", "오늘은 운이 따를 것 같은 거 같아.", "새로운 취미를 가져볼까?", "좀 쉴까.", "어떻게 할까.", "할만한데.", "흠."]
};

const MAX_TURN = 24;
let turn = 1, stats = { hp: 50, int: 50, hap: 50, str: 50 };
let hiddenStats = { kind: 0, courage: 0, creative: 0, diligent: 0, curious: 0, greed: 0 };
let actionCounts = {}, currentEvent = null, normalEndingCount = 0, introStep = 0;
let showAllHintsState = false, photoModeState = false;
let endingTimer = null;
let endingPlaying = false;
let tarotTriggeredThisGame = false;

let hasReceivedPetReward = false; // 한 회차(한 판) 동안 쓰다듬기 보상을 받았는지 여부
let changedHiddenStats = {}; 

let dreamType = null;
let dreamStep = 0;
let dreamAccepted = false;
let dreamTriggered = false;
let dreamCountdown = 0;
let dreamTestResult = null;
let dreamFailJobId = null;
let pendingDreamTrigger = false;
let dreamResultLines = [];
let dreamResultStep = 0;
let dreamResultSuccess = false;

const DREAM_EVENTS = {
    astro: {
        icon: '🚀', name: '우주비행사', target: '적성검사',
        dreamLine: '저... 언젠가 우주에 가 보고 싶어요.',
        yesLine: '좋아! 우주비행사 적성검사까지 열심히 준비해 보자!',
        hintLine: '우주비행사가 되려면 운동, 공부, 산책을 열심히 하고, 스트레스 관리도 해야겠는걸?',
        resultImage: { bg: 'pic/background/astro_end.png' }
    },
    idol: {
        icon: '🎤', name: '아이돌', target: '오디션',
        dreamLine: '저도... 아이돌처럼 무대에 서고 싶어요.',
        yesLine: '좋아! 오디션까지 열심히 연습해 보자!',
        hintLine: '아이돌이 되려면 운동, 인터넷을 열심히 해야 겠는걸?',
        resultImage: { bg: 'pic/background/idol_end.png' }
    }
};

/* ================= 쓰담쓰담 기능 ================= */
let isPetting = false;
let petLastX = 0, petLastY = 0;
let petDir = 0;
let petStrokeCount = 0;

function canPet() {
    const gameView = document.getElementById('view-game');
    if (!gameView || gameView.classList.contains('hidden')) return false;
    if (endingPlaying || tarotActive || dreamStep > 0) return false;
    
    const modalEvent = document.getElementById('modal-event');
    if (modalEvent && !modalEvent.classList.contains('hidden')) return false;
    
    const modalEnding = document.getElementById('modal-ending-select');
    if (modalEnding && !modalEnding.classList.contains('hidden')) return false;
    
    return true;
}

function initPetting() {
    const charArea = document.getElementById('character-img');
    if (!charArea) return;

    charArea.addEventListener('pointerdown', (e) => {
        if (!canPet()) return;
        isPetting = true;
        petLastX = e.clientX;
        petLastY = e.clientY;
        petDir = 0;
        petStrokeCount = 0;
        try { charArea.setPointerCapture(e.pointerId); } catch(err){}
    });

    charArea.addEventListener('pointermove', (e) => {
        if (!isPetting || !canPet()) return;

        const dx = e.clientX - petLastX;
        const dy = e.clientY - petLastY;

        const isVertical = Math.abs(dy) > Math.abs(dx) * 1.3;
        const minThreshold = isVertical ? 65 : 30;

        const mainDelta = isVertical ? dy : dx;
        const currentDir = mainDelta > 0 ? 1 : (mainDelta < 0 ? -1 : 0);

        if (Math.abs(mainDelta) >= minThreshold) {
            if (petDir !== 0 && currentDir !== petDir) {
                petStrokeCount++;
                triggerPetFeedbackSmall();
                if (petStrokeCount >= 6) { 
                    onPetSuccess();
                    resetPettingState();
                    return;
                }
            }
            petDir = currentDir;
            petLastX = e.clientX;
            petLastY = e.clientY;
        }
    });

    const endPet = (e) => {
        if (isPetting) {
            resetPettingState();
            try { charArea.releasePointerCapture(e.pointerId); } catch(err){}
        }
    };

    charArea.addEventListener('pointerup', endPet);
    charArea.addEventListener('pointercancel', endPet);
}

function resetPettingState() {
    isPetting = false;
    petDir = 0;
    petStrokeCount = 0;
}

function triggerPetFeedbackSmall() {
    const charImg = document.getElementById('character-img');
    if (charImg) {
        charImg.style.transform = 'scale(1.05) rotate(3deg)';
        setTimeout(() => {
            charImg.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }
}

function onPetSuccess() {
    // 한 게임(1~24턴) 통틀어 최초 1회 쓰다듬기 시에만 스탯이 오르고,
    // 엔딩을 본 뒤 새 게임을 시작해야만 초기화됩니다.
    if (!hasReceivedPetReward) {
        changedHiddenStats = {};
        applyStats({ hap: 10 });
        applyHiddenStats({ kind: 5, courage: 5, creative: 5, diligent: 5, curious: 5, greed: 5 });
        updateStatUI();
        hasReceivedPetReward = true; 
    }

    // 스탯 상승 여부와 관계없이 하트 및 대사 연출은 언제나 동작합니다.
    const speechBox = document.getElementById('speech-container');
    const speechText = document.getElementById('speech-text');
    if (speechBox && speechText) {
        speechText.textContent = "...!! (쓰담쓰담)";
        speechBox.classList.remove('opacity-0');
        setTimeout(() => {
            speechBox.classList.add('opacity-0');
        }, 1500);
    }

    const charImg = document.getElementById('character-img');
    if (charImg) {
        charImg.style.transform = 'scale(1.18)';
        setTimeout(() => { charImg.style.transform = 'scale(1)'; }, 200);
        showFloatingHeart(charImg);
    }
}

function showFloatingHeart(targetEl) {
    const heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.position = 'absolute';
    heart.style.fontSize = '24px';
    heart.style.left = '50%';
    heart.style.top = '10%';
    heart.style.transform = 'translateX(-50%)';
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'all 0.8s ease-out';
    heart.style.zIndex = '100';
    
    targetEl.style.position = 'relative';
    targetEl.appendChild(heart);

    requestAnimationFrame(() => {
        heart.style.top = '-25px';
        heart.style.opacity = '0';
    });

    setTimeout(() => { heart.remove(); }, 800);
}

let typingIntervals = [];
function stopAllTyping() {
    typingIntervals.forEach(clearInterval);
    typingIntervals = [];
}

function typeWriter(element, text, speed = 30, onComplete) {
    stopAllTyping();
    element.textContent = '';
    if (!text) return;
    let i = 0;
    let interval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (onComplete) onComplete();
        }
    }, speed);
    typingIntervals.push(interval);
}

function pulseIntroDog() {
    const img = document.getElementById('intro-character-container');
    if (img) {
        img.style.transform = 'scale(1.12)';
        setTimeout(() => { img.style.transform = 'scale(1)'; }, 180);
    }
}

function toggleAllHints() {
    showAllHintsState = !showAllHintsState;
    document.getElementById('btn-toggle-all-hints').innerText = showAllHintsState ? "힌트 끄기" : "힌트 켜기";
    showCollection();
}

function togglePhotoMode() {
    photoModeState = !photoModeState;
    const btn = document.getElementById('btn-photo-mode');
    if (photoModeState) {
        btn.textContent = "모드 해제";
        btn.classList.add('bg-purple-200');
    } else {
        btn.textContent = "촬영 모드";
        btn.classList.remove('bg-purple-200');
    }
    showCollection();
}

function clamp(val, min=0, max=100) { return Math.max(min, Math.min(max, val)); }
function shuffle(array) { return array.slice().sort(() => Math.random() - 0.5); }

function loadCollection() {
    let data = localStorage.getItem('moondog_collection');
    if (data) {
        try {
            let parsed = JSON.parse(data);
            return !parsed.items ? { items: parsed, normalCount: 0 } : parsed;
        } catch(e) { return { items: {}, normalCount: 0 }; }
    }
    return { items: {}, normalCount: 0 };
}

function saveToCollection(jobName) {
    let col = loadCollection();
    if (!col.items) col.items = {};
    if (!col.items[jobName]) {
        const date = new Date();
        col.items[jobName] = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    }
    if (jobName === NORMAL_JOB.name) {
        col.normalCount = (col.normalCount || 0) + 1;
        normalEndingCount = col.normalCount;
    }
    localStorage.setItem('moondog_collection', JSON.stringify(col));
}

function onClickGameStart() {
    let col = loadCollection();
    normalEndingCount = col.normalCount || 0;
    let totalCollectedCount = Object.keys(col.items || {}).length;
    if (totalCollectedCount > 0 && confirm("이전에 플레이한 기록이 있습니다. 인트로를 건너뛰고 바로 시작할까요?")) {
        startGameDirectly(); return;
    }
    document.getElementById('view-title').classList.add('hidden');
    document.getElementById('view-intro').classList.remove('hidden');
    introStep = 1; renderIntroStep();
}

function showIntroSpeech(text) {
    const speechBox = document.getElementById('intro-speech-container');
    const speechText = document.getElementById('intro-speech-text');
    speechBox.classList.remove('opacity-0');
    typeWriter(speechText, text, 40);
    pulseIntroDog();
}

function hideIntroSpeech() { document.getElementById('intro-speech-container').classList.add('opacity-0'); }

function handleIntroClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;
    if (introStep < 4) { introStep++; renderIntroStep(); }
}

function renderIntroStep() {
    const descBox = document.getElementById('intro-desc-text');
    const actionArea = document.getElementById('intro-action-area');
    actionArea.innerHTML = '';
    actionArea.className = 'text-center text-pixel-sm text-slate-500 font-bold py-1.5 bg-slate-100 rounded-full';

    if (introStep === 1) { 
        showIntroSpeech("끼웅..."); 
        descBox.textContent = ""; 
        actionArea.textContent = "[ 화면을 클릭하여 계속 ]"; 
    } 
    else if (introStep === 2) { 
        hideIntroSpeech(); 
        typeWriter(descBox, "어디서 강아지 소리가 들린다.", 35); 
        pulseIntroDog();
        actionArea.textContent = "[ 화면을 클릭하여 계속 ]"; 
    }
    else if (introStep === 3) { 
        showIntroSpeech("꾸웅..."); 
        descBox.textContent = ""; 
        actionArea.textContent = "[ 화면을 클릭하여 계속 ]"; 
    }
    else if (introStep === 4) {
        hideIntroSpeech(); 
        typeWriter(descBox, "...어떡하지?", 35); 
        pulseIntroDog();
        actionArea.className = 'grid grid-cols-2 gap-2 mt-1';
        let btnTake = document.createElement('button');
        btnTake.className = 'btn-round-bubble btn-pink py-2 text-pixel-md';
        btnTake.textContent = "데려간다";
        btnTake.onclick = () => { stopAllTyping(); document.getElementById('view-intro').classList.add('hidden'); startGameDirectly(); };
        let btnLeave = document.createElement('button');
        btnLeave.className = 'btn-round-bubble btn-yellow py-2 text-pixel-md text-slate-500';
        btnLeave.textContent = "행운을 빈다";
        btnLeave.onclick = () => {
            stopAllTyping();
            alert("미안, 강아지야...!");
            document.getElementById('view-intro').classList.add('hidden');
            document.getElementById('view-title').classList.remove('hidden');
        };
        actionArea.appendChild(btnTake); actionArea.appendChild(btnLeave);
    }
}

function startGameDirectly() {
    stopAllTyping();
    let col = loadCollection(); normalEndingCount = col.normalCount || 0;
    document.getElementById('view-title').classList.add('hidden');
    document.getElementById('view-intro').classList.add('hidden');
    document.getElementById('view-game').classList.remove('hidden');
    document.getElementById('view-game').classList.add('flex');
    document.getElementById('view-tarot-event').classList.add('hidden');
    
    turn = 1; stats = { hp: 50, int: 50, hap: 50, str: 50 };
    hiddenStats = { kind: 0, courage: 0, creative: 0, diligent: 0, curious: 0, greed: 0 };
    actionCounts = {};
    tarotActive = false;
    tarotTriggeredThisGame = false;
    
    hasReceivedPetReward = false; // 새로운 게임이 시작되면 쓰다듬기 보상 상태 초기화
    changedHiddenStats = {}; 
    
    dreamType = null; dreamStep = 0; dreamAccepted = false; dreamTriggered = false;
    dreamCountdown = 0; dreamTestResult = null; dreamFailJobId = null; pendingDreamTrigger = false;
    dreamResultSuccess = false;

    document.getElementById('dream-action-area').onclick = null;
    document.getElementById('view-dream-event').onclick = handleDreamViewClick;
    document.getElementById('view-dream-event').classList.add('hidden');
    document.getElementById('modal-event').classList.add('hidden');
    hideSpeech(); renderTurn();
}

function startGame() { onClickGameStart(); }

function renderTurn() {
    document.getElementById('txt-turn').textContent = `Turn ${turn}/${MAX_TURN}`;
    document.getElementById('bar-progress').style.width = `${(turn / MAX_TURN) * 100}%`;
    updateStatUI();
    updateDreamCountdown();

    const charImg = document.getElementById('character-img');
    let imgSrc = '';
    if (turn <= 7) imgSrc = 'pic/dog/1.png';
    else if (turn <= 18) imgSrc = 'pic/dog/2.png';
    else imgSrc = 'pic/job/normal.png';

    charImg.innerHTML = `<img src="${imgSrc}" class="mt-3 w-24 h-24 sm:w-28 sm:h-28 object-contain" draggable="false" alt="강아지">`;

    const panel = document.getElementById('action-panel');
    panel.innerHTML = '';
    const btnColors = ['btn-blue', 'btn-pink', 'btn-green', 'btn-purple'];
    let selectedActions = shuffle(ACTIONS).slice(0, 4);

    selectedActions.forEach((act, index) => {
        let btn = document.createElement('button');
        btn.className = `btn-round-bubble ${btnColors[index]} py-1 flex flex-col items-center justify-center h-full relative shadow-none`; 
        btn.style.boxShadow = `0 4px 0 0 var(--color-${btnColors[index]}-shadow)`;

        let nameSpan = document.createElement('span');
        nameSpan.className = 'text-pixel-md flex items-center gap-1 font-bold';
        nameSpan.innerHTML = `<span class="text-base">${act.icon}</span> <span>${act.name}</span>`;
        
        let effectDiv = document.createElement('div');
        effectDiv.className = 'flex flex-wrap justify-center gap-x-1 gap-y-0 opacity-80 font-sans';
        const statMap = { hp: '체력', int: '지능', hap: '행복', str: '멘탈' };
        const statOrder = ['hp', 'int', 'hap', 'str'];
        
        for (let key of statOrder) {
            if (act.effect[key] !== undefined) {
                let val = act.effect[key];
                let span = document.createElement('span');
                let sign = val > 0 ? '+' : '-';
                span.textContent = `${statMap[key]}${sign}`;
                
                span.className = val > 0 
                    ? 'text-[9px] font-light stat-effect-plus transition-all duration-150' 
                    : 'text-[9px] font-light opacity-70';
                    
                effectDiv.appendChild(span);
            }
        }

        btn.appendChild(nameSpan); btn.appendChild(effectDiv);
        btn.onclick = () => doAction(act);

        btn.onmouseenter = () => {
            if (act.hidden) {
                for (let k in act.hidden) {
                    if (act.hidden[k] > 0) {
                        let el = document.getElementById(`hs-${k}`);
                        if (el) el.classList.add('font-bold', 'text-slate-900');
                    }
                }
            }
        };

        btn.onmouseleave = () => {
            if (act.hidden) {
                for (let k in act.hidden) {
                    if (act.hidden[k] > 0) {
                        let el = document.getElementById(`hs-${k}`);
                        if (el) el.classList.remove('font-bold', 'text-slate-900');
                    }
                }
            }
        };

        panel.appendChild(btn);
    });
}

function updateStatUI() {
    stats.hp = clamp(stats.hp); stats.int = clamp(stats.int);
    stats.hap = clamp(stats.hap); stats.str = clamp(stats.str);
    document.getElementById('bar-hp').style.width = `${stats.hp}%`;
    document.getElementById('bar-int').style.width = `${stats.int}%`;
    document.getElementById('bar-hap').style.width = `${stats.hap}%`;
    document.getElementById('bar-str').style.width = `${stats.str}%`;
    
    document.getElementById('bar-hp').style.backgroundColor = stats.hp <= 20 ? '#F88379' : '#4ADE80';
    document.getElementById('bar-int').style.backgroundColor = stats.int <= 20 ? '#F88379' : '#60A5FA';
    document.getElementById('bar-hap').style.backgroundColor = stats.hap <= 20 ? '#F88379' : '#FACC15';
    document.getElementById('bar-str').style.backgroundColor = stats.str <= 20 ? '#F88379' : '#C084FC'; 

    const hsBox = document.getElementById('hidden-stats-bg');
    if (hsBox) {
        const hsNames = ['kind', 'courage', 'creative', 'diligent', 'curious', 'greed'];
        const hsLabels = ['친절', '용기', '창의', '성실', '호기심', '욕심'];
        
        let html = '';
        for (let i = 0; i < hsNames.length; i++) {
            let key = hsNames[i];
            let extraClass = changedHiddenStats[key] ? 'stat-bounce inline-block' : '';
            html += `<span id="hs-${key}" class="transition-colors duration-150 ${extraClass}">${hsLabels[i]}:${hiddenStats[key]}</span>`;
        }
        hsBox.innerHTML = html;
    }
}

function showSpeech() {
    const speechBox = document.getElementById('speech-container');
    const speechText = document.getElementById('speech-text');
    let text = "";
    if (turn <= 7) text = `${QUOTES.baby.A[Math.floor(Math.random() * QUOTES.baby.A.length)]} oO(${QUOTES.baby.B[Math.floor(Math.random() * QUOTES.baby.B.length)]})`;
    else if (turn <= 18) text = `oO(${QUOTES.child[Math.floor(Math.random() * QUOTES.child.length)]})`;
    else text = `oO(${QUOTES.adult[Math.floor(Math.random() * QUOTES.adult.length)]})`;
    speechText.textContent = text;
    speechBox.classList.remove('opacity-0');
    const img = document.getElementById('character-img');
    img.style.transform = 'scale(1.1)';
    setTimeout(() => { img.style.transform = 'scale(1)'; }, 150);
}

function hideSpeech() { document.getElementById('speech-container').classList.add('opacity-0'); }

function doAction(action) {
    if (endingPlaying || dreamStep > 0 || tarotActive || document.getElementById('modal-event').classList.contains('hidden') === false) return;
    
    changedHiddenStats = {};
    
    applyStats(action.effect); applyHiddenStats(action.hidden);
    actionCounts[action.id] = (actionCounts[action.id] || 0) + 1;
    updateStatUI(); showSpeech();
    
    let failReason = checkGameOverCondition();
    if (failReason) { showResult("게임 오버", failReason, "pic/dog/0.png"); return; }
    
    if (shouldTriggerDream()) {
        startDreamEvent();
        return;
    }
    
    if (!tarotTriggeredThisGame && turn >= 3 && Math.random() < 0.15) { 
        tarotTriggeredThisGame = true;
        triggerTarotProposal();
        return;
    }

    proceedNextTurn();
}

function triggerTarotProposal() {
    document.getElementById('event-title').innerHTML = "저희...<br>타로 보러 갈까요?";
    const choicesContainer = document.getElementById('event-choices');
    choicesContainer.innerHTML = '';
    
    let btnYes = document.createElement('button');
    btnYes.className = `btn-round-bubble btn-pink py-2.5 text-pixel-md`;
    btnYes.textContent = "그러자";
    btnYes.onclick = () => {
        document.getElementById('modal-event').classList.add('hidden');
        startTarotEvent();
    };
    
    let btnNo = document.createElement('button');
    btnNo.className = `btn-round-bubble btn-blue py-2.5 text-pixel-md`;
    btnNo.textContent = "다음에 가자";
    btnNo.onclick = () => {
        document.getElementById('modal-event').classList.add('hidden');
        proceedNextTurn();
    };
    
    choicesContainer.appendChild(btnYes);
    choicesContainer.appendChild(btnNo);
    
    document.getElementById('modal-event').classList.remove('hidden');
}

function startTarotEvent() {
    tarotActive = true;
    document.getElementById('view-game').classList.add('hidden');
    document.getElementById('view-game').classList.remove('flex');
    
    const tarotView = document.getElementById('view-tarot-event');
    tarotView.classList.remove('hidden');
    
    const speechText = document.getElementById('tarot-speech-text');
    speechText.innerHTML = '네 개의 카드 중 하나를 고르시오.';
    
    const descText = document.getElementById('tarot-desc-text');
    if (descText) descText.textContent = '';
    
    renderTarotCards();
}

function renderTarotCards() {
    const panel = document.getElementById('tarot-action-panel');
    panel.innerHTML = '';
    panel.className = 'grid grid-cols-4 gap-1 h-full'; 
    
    const shuffledCards = shuffle([...TAROT_CARDS]);
    
    shuffledCards.forEach((card) => {
        let btn = document.createElement('button');
        btn.className = `btn-round-bubble btn-purple py-1 rounded-[6px] flex flex-col items-center justify-center h-full relative text-3xl`;
        btn.innerHTML = `🎴`;
        
        btn.onclick = () => revealTarotCard(card, btn, panel);
        panel.appendChild(btn);
    });
}

function revealTarotCard(card, clickedBtn, panel) {
    Array.from(panel.children).forEach(b => b.onclick = null);
    
    clickedBtn.className = `btn-round-bubble btn-yellow min-h-[12px] py-1 rounded-[6px] flex flex-col items-center justify-center h-full relative fade-in`;
    clickedBtn.innerHTML = `<span class="text-xl sm:text-2xl">${card.icon}</span>`; 
    
    changedHiddenStats = {};
    applyHiddenStats(card.hidden);
    updateStatUI();
    
    const speechText = document.getElementById('tarot-speech-text');
    speechText.innerHTML = card.desc;
    
    const descText = document.getElementById('tarot-desc-text');
    if (descText) {
        descText.innerHTML = `<span class="text-blue-600">${card.resultText}</span>`;
    }
    
    setTimeout(() => {
        panel.innerHTML = '';
        panel.className = 'flex items-center justify-center h-full p-2';
        let returnBtn = document.createElement('button');
        returnBtn.className = 'btn-round-bubble btn-pink py-2 px-4 text-pixel-md w-full max-w-[80%] fade-in';
        returnBtn.textContent = '집으로 복귀';
        returnBtn.onclick = endTarotEvent;
        panel.appendChild(returnBtn);
    }, 2500); 
}

function endTarotEvent() {
    const tarotView = document.getElementById('view-tarot-event');
    tarotView.classList.add('hidden');
    tarotActive = false;
    
    document.getElementById('view-game').classList.remove('hidden');
    document.getElementById('view-game').classList.add('flex');
    
    proceedNextTurn();
}

function shouldTriggerDream() {
    if (dreamTriggered || dreamAccepted || turn < 4 || turn > 6) return false;
    return Math.random() < 0.25;
}

function setDreamBackground(imageSrc = '') {
    const view = document.getElementById('view-dream-event');
    if (!view) return;
    view.style.backgroundImage = imageSrc ? `url('${imageSrc}')` : 'none';
}

function startDreamEvent() {
    dreamTriggered = true;
    dreamType = Math.random() < 0.5 ? 'astro' : 'idol';
    dreamStep = 1;
    stopAllTyping();
    hideSpeech();

    setDreamBackground('');

    document.getElementById('view-game').classList.add('hidden');
    document.getElementById('view-game').classList.remove('flex');
    const view = document.getElementById('view-dream-event');
    view.onclick = handleDreamViewClick;
    document.getElementById('dream-action-area').onclick = null;
    view.classList.remove('hidden');
    document.getElementById('dream-character-container').classList.remove('hidden');
    document.getElementById('dream-speech-container').classList.remove('opacity-0');
    renderDreamStep();
}

function renderDreamStep() {
    const dream = DREAM_EVENTS[dreamType];
    const descBox = document.getElementById('dream-desc-text');
    const actionArea = document.getElementById('dream-action-area');

    actionArea.onclick = null;
    actionArea.innerHTML = '';
    actionArea.className = 'text-center text-pixel-sm text-slate-500 font-bold py-1.5 bg-slate-100 rounded-full';

    if (dreamStep === 1) {
        const speechBox = document.getElementById('dream-speech-container');
        const speechText = document.getElementById('dream-speech-text');
        speechBox.classList.remove('opacity-0');
        typeWriter(speechText, '저...', 40);
        descBox.textContent = '';
        actionArea.textContent = '[ 화면을 클릭하여 계속 ]';
        pulseDreamDog();
    } else if (dreamStep === 2) {
        const speechText = document.getElementById('dream-speech-text');
        typeWriter(speechText, dream.name === '우주비행사' ? '언젠가 우주에 가 보고 싶어요.' : '아이돌처럼 무대에 서고 싶어요.', 40, () => {
            actionArea.textContent = '[ 잠시만 기다려 주세요 ]';
            setTimeout(() => {
                if (dreamStep === 2) openDreamChoicePopup();
            }, 2000);
        });
        descBox.textContent = '';
        actionArea.textContent = '[ 화면을 클릭하여 계속 ]';
        pulseDreamDog();
    }
}

function pulseDreamDog() {
    const img = document.getElementById('dream-character-container');
    if (img) { img.style.transform = 'scale(1.08)'; setTimeout(() => { img.style.transform = 'scale(1)'; }, 180); }
}

function handleDreamViewClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button') || event.target.closest('#modal-event')) return;
    if (dreamStep === 1) {
        stopAllTyping();
        dreamStep = 2;
        renderDreamStep();
    }
}

function openDreamChoicePopup() {
    if (dreamStep !== 2) return;
    const dream = DREAM_EVENTS[dreamType];
    const title = document.getElementById('event-title');
    const choices = document.getElementById('event-choices');
    title.textContent = `${dream.icon} ${dream.name}`;
    choices.innerHTML = '';
    ['응, 그래!', '그건 좀...'].forEach((text, index) => {
        const btn = document.createElement('button');
        btn.className = `btn-round-bubble ${index === 0 ? 'btn-pink' : 'btn-yellow'} py-2.5 text-pixel-md`;
        btn.textContent = text;
        btn.onclick = () => handleDreamChoice(index === 0);
        choices.appendChild(btn);
    });
    const modal = document.getElementById('modal-event');
    modal.style.zIndex = '60';
    modal.classList.remove('hidden');
}

function handleDreamChoice(accepted) {
    const dream = DREAM_EVENTS[dreamType];
    const modal = document.getElementById('modal-event');
    modal.classList.add('hidden'); modal.style.zIndex = '';

    if (!accepted) {
        dreamStep = 0;
        setDreamBackground('');
        document.getElementById('view-dream-event').classList.add('hidden');
        document.getElementById('view-game').classList.remove('hidden');
        document.getElementById('view-game').classList.add('flex');
        renderTurn(); proceedNextTurn();
        return;
    }

    dreamAccepted = true;
    dreamCountdown = Math.max(0, 23 - turn);
    dreamStep = 3;

    const descBox = document.getElementById('dream-desc-text');
    const actionArea = document.getElementById('dream-action-area');
    const view = document.getElementById('view-dream-event');

    typeWriter(descBox, dream.yesLine, 30, () => {
        actionArea.textContent = '[ 화면을 클릭하여 다음 ]';
    });
    actionArea.textContent = '[ 화면을 클릭하여 계속 ]';

    view.onclick = (event) => {
        if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;

        if (dreamStep === 3) {
            stopAllTyping();
            dreamStep = 4;
            typeWriter(descBox, dream.hintLine, 30, () => {
                actionArea.textContent = '[ 화면을 클릭하여 게임으로 ]';
            });
            actionArea.textContent = '[ 화면을 클릭하여 계속 ]';
            return;
        }

        if (dreamStep === 4) {
            stopAllTyping();
            dreamStep = 0;
            setDreamBackground('');
            view.classList.add('hidden');
            document.getElementById('view-game').classList.remove('hidden');
            document.getElementById('view-game').classList.add('flex');
            updateDreamCountdown();
            renderTurn();
            proceedNextTurn();
            view.onclick = handleDreamViewClick;
        }
    };
}

function updateDreamCountdown() {
    const el = document.getElementById('dream-countdown');
    if (!el) return;
    if (!dreamAccepted || dreamCountdown < 0 || turn > 23) {
        el.classList.add('hidden');
        return;
    }
    const dream = DREAM_EVENTS[dreamType];
    const recommended = dreamType === 'astro' ? '추천: 운동, 공부, 산책' : '추천: 운동, 인터넷';
    el.innerHTML = `${dream.icon} ${dream.target}까지 ${Math.max(0, dreamCountdown)}턴<br><span class="text-slate-500">${recommended}</span>`;
    el.classList.remove('hidden');
}

function getDreamMetrics(type) {
    if (type === 'astro') {
        return {
            rows: [
                ['체력', stats.hp, 70, stats.hp >= 70],
                ['용기', hiddenStats.courage, 70, hiddenStats.courage >= 70],
                ['호기심', hiddenStats.curious, 60, hiddenStats.curious >= 60],
                ['스트레스', stats.str, 40, stats.str <= 40]
            ],
            probability: calcDreamProbability(type)
        };
    }
    const charm = clamp(Math.round((stats.hap + hiddenStats.kind * 0.25)));
    return {
        rows: [
            ['체력', stats.hp, 65, stats.hp >= 65],
            ['매력', charm, 75, charm >= 75],
            ['성실함', hiddenStats.diligent, 60, hiddenStats.diligent >= 60]
        ],
        probability: calcDreamProbability(type)
    };
}

function calcDreamProbability(type) {
    const m = type === 'astro'
        ? [stats.hp >= 70, hiddenStats.courage >= 70, hiddenStats.curious >= 60, stats.str <= 40]
        : [stats.hp >= 65, clamp(Math.round(stats.hap + hiddenStats.kind * 0.25)) >= 75, hiddenStats.diligent >= 60];
    const passed = m.filter(Boolean).length;
    const base = type === 'astro' ? [42, 52, 66, 84, 100] : [48, 66, 81, 100];
    return base[passed];
}

function startDreamTest() {
    if (!dreamAccepted || dreamTestResult) return;
    endingPlaying = true;
    dreamTestResult = getDreamMetrics(dreamType);
    dreamFailJobId = dreamType;

    const dream = DREAM_EVENTS[dreamType];
    const view = document.getElementById('view-dream-event');
    const normal = document.getElementById('dream-normal-content');
    const panel = document.getElementById('dream-normal-panel');
    const full = document.getElementById('dream-test-full');

    normal.classList.remove('hidden');
    panel.classList.remove('hidden');
    full.classList.add('hidden');
    view.classList.remove('hidden');
    view.onclick = handleDreamTestClick;

    document.getElementById('dream-speech-container').classList.add('opacity-0');
    document.getElementById('dream-character-container').classList.add('hidden');

    dreamStep = 7;
    showDreamTestIntro(0);
}

function showDreamTestIntro(index) {
    if (index === 0) {
        const bgImg = dreamType === 'astro' ? 'pic/background/astro.png' : 'pic/background/idol.png';
        setDreamBackground(bgImg);
    }

    const descBox = document.getElementById('dream-desc-text');
    const action = document.getElementById('dream-action-area');
    const dream = DREAM_EVENTS[dreamType];
    const lines = dreamType === 'astro'
        ? ['시간이 흘러...', '드디어 우주비행사 적성검사 날.', '강아지는 긴장한 표정으로 시험장 앞에 섰습니다.']
        : ['시간이 흘러...', '드디어 오디션 당일.', '강아지는 떨리는 마음으로 연습실에 들어섰습니다.'];

    if (index < lines.length) {
        typeWriter(descBox, lines[index], 35);
        action.textContent = '[ 화면을 클릭하여 계속 ]';
        dreamStep = 7 + index;
        return;
    }

    descBox.textContent = '';
    action.textContent = '[ 적성 분석 시작 ]';
    dreamStep = 10;
}

function startDreamAnalysis() {
    const normal = document.getElementById('dream-normal-content');
    const panel = document.getElementById('dream-normal-panel');
    const full = document.getElementById('dream-test-full');
    const content = document.getElementById('dream-test-content');
    const action = document.getElementById('dream-test-action');

    normal.classList.add('hidden');
    panel.classList.add('hidden');
    full.classList.remove('hidden');
    content.innerHTML = '';
    action.textContent = '[ 분석 중... ]';
    dreamStep = 12;
    showDreamTestRows(0);
}

function showDreamTestRows(index) {
    const content = document.getElementById('dream-test-content');
    const action = document.getElementById('dream-test-action');
    dreamStep = 12;
    if (index < dreamTestResult.rows.length) {
        const [name, value, req, pass] = dreamTestResult.rows[index];
        const row = document.createElement('div'); row.className = 'dream-test-dialogue fade-in'; row.textContent = `${name} ${value} / ${req} ${pass ? '✓' : '✕'}`; content.appendChild(row);
        setTimeout(() => showDreamTestRows(index + 1), 650); return;
    }
    const line = document.createElement('div'); line.className = 'dream-test-dialogue result fade-in';
    line.innerHTML = `합격 확률<br><span class="text-3xl">${dreamTestResult.probability}%</span>`; content.appendChild(line);
    action.textContent = '[ 화면을 클릭하여 결과 발표 ]'; dreamStep = 11;
}

function handleDreamTestClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;
    if (dreamStep === 7) { showDreamTestIntro(1); return; }
    if (dreamStep === 8) { showDreamTestIntro(2); return; }
    if (dreamStep === 9) { showDreamTestIntro(3); return; }
    if (dreamStep === 10) {
        startDreamAnalysis();
        return;
    }
    if (dreamStep === 11) {
        const success = dreamTestResult.probability >= 70 && dreamTestResult.rows.every(r => r[3]);

        const normal = document.getElementById('dream-normal-content');
        const panel = document.getElementById('dream-normal-panel');
        const full = document.getElementById('dream-test-full');
        const descBox = document.getElementById('dream-desc-text');
        const actionArea = document.getElementById('dream-action-area');

        full.classList.add('hidden');
        normal.classList.remove('hidden');
        panel.classList.remove('hidden');

        descBox.innerHTML = '<div>.</div>';
        actionArea.textContent = '[ 결과 발표 중... ]';
        dreamStep = 13;
        let waitIndex = 1;
        const waitTimer = setInterval(() => {
            waitIndex++;
            descBox.innerHTML = Array(waitIndex).fill('.').map(dot => `<div>${dot}</div>`).join('');
            if (waitIndex >= 3) {
                clearInterval(waitTimer);
                showDreamResult(success);
            }
        }, 1000);
    }
}

function showDreamResult(success) {
    const normal = document.getElementById('dream-normal-content');
    const panel = document.getElementById('dream-normal-panel');
    const full = document.getElementById('dream-test-full');
    const view = document.getElementById('view-dream-event');

    full.classList.add('hidden');
    normal.classList.remove('hidden');
    panel.classList.remove('hidden');
    document.getElementById('dream-speech-container').classList.add('opacity-0');
    document.getElementById('dream-character-container').classList.add('hidden');

    dreamResultLines = dreamType === 'astro'
        ? (success
            ? ['합격입니다.', '...!!', '강아지는 하늘을 올려다보며', '주먹을 꼭 쥐었습니다.', '이제... 정말 우주에 갈 수 있어요.']
            : ['아쉽지만...', '이번에는 함께할 수 없습니다.', '강아지는 하늘을 바라보다가 조용히 주먹을 쥐었습니다...', '"괜찮아요."', '"언젠가는 할 수 있을 거에요."'])
        : (success
            ? ['합격입니다.', '...!!', '먼 훗날, 조명이 켜지고', '수많은 응원봉이 무대를 가득 채울 것입니다.', '강아지는 행복합니다.']
            : ['아쉽지만...', '저희와는 인연이 아닌 것 같네요.', '강아지는 고개를 숙이며 조용히 주먹을 쥐었습니다...', '"그래도"', '"무대는 계속 좋아할 거에요."']);

    dreamResultStep = 0;
    dreamResultSuccess = success;
    view.onclick = handleDreamResultClick;
    renderDreamResultStep();
}

function renderDreamResultStep() {
    const descBox = document.getElementById('dream-desc-text');
    const actionArea = document.getElementById('dream-action-area');

    if (dreamResultStep < dreamResultLines.length) {
        typeWriter(descBox, dreamResultLines[dreamResultStep], 35);
        actionArea.textContent = '[ 화면을 클릭하여 계속 ]';
        actionArea.onclick = null;
        return;
    }

    descBox.textContent = '';
    actionArea.textContent = dreamResultSuccess ? '[ 엔딩으로 ]' : '[ 다른 직업으로 ]';
    actionArea.onclick = e => {
        e.stopPropagation();
        finishDreamTest(dreamResultSuccess);
    };
}

function handleDreamResultClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;
    if (dreamResultStep < dreamResultLines.length) {
        dreamResultStep++;
        renderDreamResultStep();
    }
}

function finishDreamTest(success) {
    const view = document.getElementById('view-dream-event');
    view.onclick = handleDreamViewClick;
    document.getElementById('dream-action-area').onclick = null;

    document.getElementById('view-dream-event').classList.add('hidden'); 
    document.getElementById('dream-test-full').classList.add('hidden');
    if (success) { 
        const job = ALL_ENDINGS.find(e => e.id === dreamType); 
        endingPlaying = false; 
        grantEnding(job, true); 
        return; 
    }
    endingPlaying = false; 
    processEnding(dreamFailJobId);
}

function applyStats(effect) {
    if(!effect) return;
    if(effect.hp) stats.hp += effect.hp; if(effect.int) stats.int += effect.int;
    if(effect.hap) stats.hap += effect.hap; if(effect.str) stats.str += effect.str;
}

function applyHiddenStats(hidden) {
    if(!hidden) return;
    for(let key in hidden) {
        let oldVal = hiddenStats[key];
        hiddenStats[key] = clamp(hiddenStats[key] + hidden[key]);
        if (hiddenStats[key] > oldVal) {
            changedHiddenStats[key] = true;
        }
    }
}

function checkGameOverCondition() {
    if (stats.hp <= 0) return "체력이 모두 소진되었습니다...";
    if (stats.int <= 0) return "지능이 바닥에 떨어졌습니다...";
    if (stats.hap <= 0) return "행복도가 0이 되어 우울해졌습니다...";
    if (stats.str <= 0) return "멘탈이 무너져서 더 이상 진행할 수 없습니다...";
    return null;
}

function proceedNextTurn() {
    if (endingPlaying) return;
    turn++;
    if (dreamAccepted && dreamCountdown > 0) dreamCountdown--;
    if (dreamAccepted && turn >= 23 && dreamCountdown <= 0) {
        startDreamTest();
        return;
    }
    if (turn > MAX_TURN) startEndingAnimation(); else renderTurn();
}

function startEndingAnimation() {
    endingPlaying = true;

    document.getElementById('txt-turn').textContent = `Turn 24/24`;
    document.getElementById('bar-progress').style.width = `100%`;

    const animView = document.getElementById('view-ending-anim');
    animView.classList.remove('hidden');
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            animView.classList.remove('opacity-0');
            animView.classList.add('opacity-100');
        });
    });

    endingTimer = setTimeout(() => {
        processEnding();
    }, 2000);
}

function processEnding(excludeJobId = null) {
    let candidates = [];
    ALL_ENDINGS.forEach(job => {
        if (job.id === 'normal' || job.id === excludeJobId) return;
        let passAction = true;
        if (job.reqAction) for(let k in job.reqAction) if ((actionCounts[k] || 0) < job.reqAction[k]) passAction = false;
        let passHidden = true;
        if (job.reqHidden) for(let k in job.reqHidden) if (hiddenStats[k] < job.reqHidden[k]) passHidden = false;
        if (passAction && passHidden) candidates.push(job);
    });

    if (candidates.length === 0) grantEnding(NORMAL_JOB);
    else if (candidates.length === 1) grantEnding(candidates[0]);
    else {
        const container = document.getElementById('ending-options');
        container.innerHTML = '';
        const optionColors = ['btn-blue', 'btn-pink', 'btn-green', 'btn-purple'];
        candidates.forEach((job, index) => {
            let btn = document.createElement('button');
            btn.className = `btn-round-bubble ${optionColors[index % 4]} py-3 text-pixel-md flex items-center justify-center gap-2`;
            btn.innerHTML = `<span class="text-xl">${job.icon}</span> <span>${job.name}</span>`;
            btn.onclick = () => { document.getElementById('modal-ending-select').classList.add('hidden'); grantEnding(job); };
            container.appendChild(btn);
        });
        document.getElementById('modal-ending-select').classList.remove('hidden');
    }
}

function grantEnding(job, isSpecialSuccess = false) {
    saveToCollection(job.name);
    const animView = document.getElementById('view-ending-anim');
    
    let displayImg = job.image;
    let bgImg = null;

    if ((isSpecialSuccess || dreamResultSuccess) && (job.id === 'astro' || job.id === 'idol')) {
        if (DREAM_EVENTS[job.id]?.resultImage?.bg) {
            bgImg = DREAM_EVENTS[job.id].resultImage.bg;
        }
    }

    showResult(`엔딩: ${job.name}`, "훌륭하게 성장하여 멋진 강아지가 되었습니다!", displayImg, bgImg);

    animView.classList.add('hidden');
    animView.classList.remove('opacity-100');
    animView.classList.add('opacity-0'); 
}

function showResult(title, desc, imageSrc = null, bgImageSrc = null) {
    document.getElementById('view-game').classList.add('hidden');
    document.getElementById('view-game').classList.remove('flex');

    const viewResult = document.getElementById('view-result');
    if (bgImageSrc) {
        viewResult.style.backgroundImage = `url('${bgImageSrc}')`;
    } else {
        viewResult.style.backgroundImage = 'none';
    }

    const resImg = document.getElementById('result-img');
    if (imageSrc) {
        resImg.src = imageSrc;
        resImg.classList.remove('hidden');
    } else {
        resImg.classList.add('hidden');
    }

    document.getElementById('result-title').textContent = title;
    document.getElementById('result-desc').textContent = desc;
    viewResult.classList.remove('hidden');
}

function returnToTitle() {
    endingPlaying = false;
    document.getElementById('view-result').classList.add('hidden');
    document.getElementById('view-title').classList.remove('hidden');
}

function showCollection() {
    document.getElementById('view-title').classList.add('hidden');
    const colView = document.getElementById('view-collection');
    colView.classList.remove('hidden');

    let colData = loadCollection();
    const nCount = colData.normalCount || 0;
    const btnToggleAllHints = document.getElementById('btn-toggle-all-hints');
    
    if (nCount >= 2) {
        btnToggleAllHints.classList.remove('hidden');
    } else {
        btnToggleAllHints.classList.add('hidden');
        showAllHintsState = false;
    }
    
    btnToggleAllHints.textContent = showAllHintsState ? "힌트 끄기" : "힌트 켜기";

    const list = document.getElementById('collection-list');
    list.innerHTML = '';
    const savedItems = colData.items || {};
    let count = 0;

    ALL_ENDINGS.forEach(ending => {
        let item = document.createElement('div');
        item.className = 'flex flex-col bg-white/70 border-2 border-slate-700 p-2.5 rounded-2xl shadow-sm relative';
        
        let isUnlocked = !!savedItems[ending.name];
        if (isUnlocked) count++;

        let topDiv = document.createElement('div');
        topDiv.className = 'flex justify-between items-center mb-1';

        if (isUnlocked) {
            topDiv.innerHTML = `<div class="flex items-center gap-1.5 w-full"><span class="text-lg">${ending.icon}</span><span class="text-slate-800 font-bold text-pixel-md flex-1 break-keep">${ending.name}</span></div>`;
        } else {
            topDiv.innerHTML = `<div class="flex items-center gap-1.5 w-full"><span class="text-lg grayscale opacity-50">❓</span><span class="text-slate-400 font-bold text-pixel-md flex-1">???</span></div>`;
        }
        item.appendChild(topDiv);

        let imageContainer = document.createElement('div');
        imageContainer.className = 'w-full aspect-[3/4] bg-white border-2 border-slate-300 rounded-xl mx-auto flex flex-col items-center justify-center relative overflow-hidden my-1 shadow-inner';
        
        if (isUnlocked) {
            let displayImgSrc = ending.image;
            if (photoModeState && displayImgSrc) {
                displayImgSrc = displayImgSrc.replace('pic/job/', 'pic/job-2/');
            }
            if (displayImgSrc) {
                imageContainer.innerHTML = `<img src="${displayImgSrc}" class="w-full h-full object-contain" alt="${ending.name}" draggable="false">`;
            } else {
                imageContainer.innerHTML = `<div class="text-4xl">${ending.icon}</div>`;
            }
        } else {
            imageContainer.innerHTML = `<div class="text-2xl text-slate-300">🔒</div><span class="text-pixel-sm text-slate-300 mt-1">미해금</span>`;
        }
        item.appendChild(imageContainer);

        if (ending.id !== 'normal' && showAllHintsState) {
            let hintDiv = document.createElement('div');
            hintDiv.className = `pt-1.5 mt-1 border-t border-slate-200 text-pixel-sm text-slate-600 font-sans whitespace-normal break-keep leading-relaxed bg-slate-50 p-1.5 rounded-lg`;
            let reqText = [];
            if (ending.reqAction) {
                const actNames = { meal:'식사', study:'공부', workout:'운동', draw:'그림', walk:'산책', clean:'청소', cook:'요리', nap:'낮잠', job:'알바', internet:'인터넷' };
                for (let k in ending.reqAction) reqText.push(`[행동] ${actNames[k]} ${ending.reqAction[k]}회↑`);
            }
            if (ending.reqHidden) {
                const hideNames = { kind:'친절', courage:'용기', creative:'창의', diligent:'성실', curious:'호기심', greed:'욕심' };
                for (let k in ending.reqHidden) reqText.push(`[성향] ${hideNames[k]} ${ending.reqHidden[k]}↑`);
            }
            hintDiv.innerHTML = `<div class="font-bold text-slate-700 mb-0.5">💡 힌트</div><div class="flex flex-col gap-0.5">${reqText.map(t => `<div>${t}</div>`).join("")}</div>`;
            item.appendChild(hintDiv);
        }
        list.appendChild(item);
    });

    const progressEl = document.getElementById('collection-progress');
    if (progressEl) {
        progressEl.innerHTML = `달성률: <span class="text-blue-600">${count}</span> / ${ALL_ENDINGS.length}`;
    }
}

function hideCollection() {
    if (photoModeState) togglePhotoMode();
    document.getElementById('view-collection').classList.add('hidden');
    document.getElementById('view-title').classList.remove('hidden');
}