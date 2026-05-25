// ==================== 全局变量 ====================
let notices = [];
let members = [];

// ==================== 新增：幻市签名言库 (20句) ====================
const fortuneQuotes = [
    "🌟 以民为本，方能行稳致远。",
    "🏛️ 公正廉洁，幻市之基。",
    "🌿 绿水青山就是金山银山。",
    "📚 教育兴市，文化铸魂。",
    "🚀 创新驱动未来，合作共赢幻市。",
    "💡 每一份建议都是城市进步的阶梯。",
    "🌈 和谐包容，共建温暖家园。",
    "⚖️ 法治是城市最坚固的铠甲。",
    "🌱 今日的努力，是明日幻市的风景。",
    "🎋 心怀市民，脚下有路。",
    "🔧 匠心服务，筑梦幻市。",
    "📈 开放纳言，繁荣可期。",
    "🕊️ 团结互信，无惧风浪。",
    "🏆 每一位市民都是幻市的荣耀。",
    "🌙 夜以继日，只为更好的明天。",
    "☀️ 阳光政务，清澈如幻市河水。",
    "🎯 瞄准幸福，建设高品质之城。",
    "💪 困难面前，幻市人从不退缩。",
    "🤝 与邻为善，与市共荣。",
    "✨ 初心如磐，奋楫笃行。"
];

// ==================== 辅助函数 ====================
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ==================== 角色映射 ====================
function getRoleClass(role) {
    if (role === "市长") return "role-mayor";
    if (role === "副市长") return "role-deputy";
    return "role-member";
}

function getPermClass(perm) {
    if (perm === "操作员") return "perm-operator";
    if (perm === "成员") return "perm-member";
    return "perm-guest";
}

// ==================== 渲染成员列表 ====================
function renderMembers() {
    const container = document.getElementById('memberListContainer');
    if (!container) return;
    let html = '';
    for (let m of members) {
        const hasAvatar = m.avatar && m.avatar.trim() !== "";
        const avatarImgHtml = hasAvatar ? `<img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : '';
        const placeholderDisplayStyle = hasAvatar ? 'display: none;' : 'display: flex;';
        html += `
            <div class="member-card">
                <div class="member-avatar">
                    ${avatarImgHtml}
                    <div class="avatar-placeholder" style="${placeholderDisplayStyle} align-items:center; justify-content:center; width:100%; height:100%;">${escapeHtml(m.name.charAt(0))}</div>
                </div>
                <div class="member-info">
                    <div class="member-name-row">
                        <span class="member-name">${escapeHtml(m.name)}</span>
                        <span class="role-badge ${getRoleClass(m.role)}">${escapeHtml(m.role)}</span>
                        <span class="perm-badge ${getPermClass(m.permission)}">${escapeHtml(m.permission)}</span>
                    </div>
                    <div class="member-bio">${escapeHtml(m.bio)}</div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ==================== 轮播图功能 ====================
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const slidesContainer = document.getElementById('carouselSlides');
const dotsContainer = document.getElementById('carouselDots');
let autoTimer = null;

function updateCarousel() {
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
    resetAutoTimer();
}

function prevSlide() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
    resetAutoTimer();
}

function resetAutoTimer() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 5000);
}

function initCarousel() {
    if (slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoTimer();
        });
        dotsContainer.appendChild(dot);
    }
    updateCarousel();
    resetAutoTimer();

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
}

// ==================== 公告功能 ====================
function renderNotices() {
    const container = document.getElementById('noticeList');
    if (!container) return;
    let html = '';
    for (let n of notices) {
        html += '<div class="notice-card">' +
            '<div class="notice-header">' +
                '<div class="notice-title">' + escapeHtml(n.title) + '</div>' +
                '<div class="notice-meta">' +
                    '<span class="notice-author">' + escapeHtml(n.author) + '</span>' +
                    '<span class="notice-date">' + escapeHtml(n.date) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="notice-content">' + n.content + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
}

function renderMiniNotices() {
    const container = document.getElementById('miniNoticeList');
    if (!container) return;
    const latest4 = notices.slice(0, 4);
    let html = '';
    for (let i = 0; i < latest4.length; i++) {
        const n = latest4[i];
        html += `
            <div class="mini-notice-item" data-index="${i}">
                <span class="mini-notice-title">${escapeHtml(n.title)}</span>
                <span class="mini-notice-meta">${escapeHtml(n.author)} · ${escapeHtml(n.date)}</span>
            </div>
        `;
    }
    container.innerHTML = html;

    const items = document.querySelectorAll('.mini-notice-item');
    items.forEach((item, idx) => {
        item.addEventListener('click', () => {
            window.location.hash = '#noticeView';
            setTimeout(() => {
                const noticeCards = document.querySelectorAll('#noticeList .notice-card');
                if (noticeCards[idx]) {
                    noticeCards[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);
        });
    });
}

// ==================== 页面导航 ====================
function setActiveButton() {
    let hash = window.location.hash || '#homeView';
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('href') === hash) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function showPage() {
    let hash = window.location.hash;
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    if (hash === '#aboutView') {
        document.getElementById('aboutView').style.display = 'block';
    } else if (hash === '#noticeView') {
        document.getElementById('noticeView').style.display = 'block';
        renderNotices();
    } else if (hash === '#membersView') {
        document.getElementById('membersView').style.display = 'block';
        renderMembers();
    } else if (hash === '#contactView') {
        document.getElementById('contactView').style.display = 'block';
    } else if (hash === '#feedbackView') {
        document.getElementById('feedbackView').style.display = 'block';
    } else {
        document.getElementById('homeView').style.display = 'block';
        if (!window.location.hash || window.location.hash === '#homeView') {
            // keep
        } else {
            window.location.hash = '#homeView';
        }
    }
    setActiveButton();
}

// ==================== 幻市签功能 ====================
function drawRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortuneQuotes.length);
    return fortuneQuotes[randomIndex];
}

function updateFortuneDisplay() {
    const fortuneTextSpan = document.getElementById('fortuneText');
    if (fortuneTextSpan) {
        const newQuote = drawRandomFortune();
        fortuneTextSpan.textContent = newQuote;
    }
}

// ==================== 意见反馈跳转 ====================
function bindFeedbackJump() {
    const feedbackCard = document.getElementById('feedbackJumpBtn');
    if (feedbackCard) {
        const TARGET_URL = "https://uxlbc8.fanqier.cn/f/379aauto";
        feedbackCard.addEventListener('click', () => {
            window.open(TARGET_URL, '_blank');
        });
    }
}

// ==================== 数据加载 ====================
async function loadData() {
    try {
        // 加载公告数据
        const noticesRes = await fetch('notices.json');
        if (noticesRes.ok) {
            notices = await noticesRes.json();
            console.log(`✅ 已加载 ${notices.length} 条公告`);
        } else {
            console.warn('⚠️ notices.json 加载失败');
        }

        // 加载成员数据
        const membersRes = await fetch('members.json');
        if (membersRes.ok) {
            members = await membersRes.json();
            console.log(`✅ 已加载 ${members.length} 名成员`);
        } else {
            console.warn('⚠️ members.json 加载失败');
        }

        // 初始化页面
        initCarousel();
        renderMiniNotices();
        showPage();
        bindFeedbackJump();

        const gotoNoticeBtn = document.getElementById('gotoNoticeBtn');
        if (gotoNoticeBtn) {
            gotoNoticeBtn.addEventListener('click', function() {
                window.location.hash = '#noticeView';
                renderNotices();
            });
        }

        const drawBtn = document.getElementById('drawFortuneBtn');
        if (drawBtn) drawBtn.addEventListener('click', updateFortuneDisplay);

    } catch (error) {
        console.error('❌ 数据加载失败:', error);
    }
}

// ==================== 页面切换监听 ====================
window.addEventListener('hashchange', function() {
    showPage();
    if (window.location.hash === '#noticeView') {
        renderNotices();
    }
    if (window.location.hash === '#membersView') {
        renderMembers();
    }
    setTimeout(renderMiniNotices, 100);
});

// ==================== 启动应用 ====================
loadData();