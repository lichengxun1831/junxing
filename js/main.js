// # 交互逻辑（筛选、Banner切换等）

// 轮播图逻辑（新增）
const carouselItems = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const readFullBtns = document.querySelectorAll('.read-full-btn');
let currentIndex = 0;

// 切换轮播项函数
function switchCarousel(index) {
  // 隐藏当前项
  carouselItems[currentIndex].classList.remove('active');
  indicators[currentIndex].classList.remove('active');
  // 显示目标项
  currentIndex = index;
  carouselItems[currentIndex].classList.add('active');
  indicators[currentIndex].classList.add('active');
}

// 下一张
nextBtn.addEventListener('click', () => {
  let nextIndex = currentIndex + 1;
  if (nextIndex >= carouselItems.length) nextIndex = 0;
  switchCarousel(nextIndex);
});

// 上一张
prevBtn.addEventListener('click', () => {
  let prevIndex = currentIndex - 1;
  if (prevIndex < 0) prevIndex = carouselItems.length - 1;
  switchCarousel(prevIndex);
});

// 指示器点击
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    switchCarousel(index);
  });
});

// 阅读全文按钮：跳转到当前轮播项的详情链接（新增）
readFullBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 获取当前激活轮播项的data-detail-link
    const activeItem = document.querySelector('.carousel-item.active');
    const detailLink = activeItem.getAttribute('data-detail-link');
    window.open(detailLink, '_blank');  // 新窗口打开
  });
});
// 初始化筛选条件（默认选中“全部”）筛选功能核心逻辑
const filterConditions = {
  industry: "all",
  scale: "all",
  nature: "all",
  scene: "all"
};

// 2. 标签点击事件：切换样式 + 更新筛选条件 + 筛选卡片
document.querySelectorAll('.filter-tag').forEach(tag => {
  tag.addEventListener('click', function () {
    // 跳过下拉菜单的父按钮（避免重复触发）
    if (this.classList.contains('dropdown-btn')) return;

    // 获取当前标签的筛选类型和值
    const type = this.getAttribute('data-type');
    const value = this.getAttribute('data-value');

    // 移除同类型标签的active类（样式切换，替代原有筛选标签代码）
    document.querySelectorAll(`.filter-tag[data-type="${type}"]`).forEach(t => {
      t.classList.remove('active');
    });
    // 给当前标签加active
    this.classList.add('active');

    // 更新筛选条件
    filterConditions[type] = value;

    // 执行筛选：隐藏/显示卡片
    filterCaseCards();
  });
});

// 3. 筛选函数：根据条件匹配卡片
function filterCaseCards() {
  const caseCards = document.querySelectorAll('.case-card');

  caseCards.forEach(card => {
    // 获取卡片的筛选属性（需确保HTML中卡片有data-industry/data-scale等属性）
    const cardIndustry = card.getAttribute('data-industry');
    const cardScale = card.getAttribute('data-scale');
    const cardNature = card.getAttribute('data-nature');
    const cardScene = card.getAttribute('data-scene');

    // 判断是否符合所有筛选条件
    const isMatch =
      (filterConditions.industry === "all" || filterConditions.industry === cardIndustry) &&
      (filterConditions.scale === "all" || filterConditions.scale === cardScale) &&
      (filterConditions.nature === "all" || filterConditions.nature === cardNature) &&
      (filterConditions.scene === "all" || filterConditions.scene === cardScene);

    // 显示/隐藏卡片（需确保CSS中有.case-card.hidden { display: none; }）
    if (isMatch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// 4. 新增：搜索框功能（关键词搜索标题/描述）
document.querySelector('.search-btn')?.addEventListener('click', function () {
  const searchText = document.querySelector('.search-input').value.trim().toLowerCase();
  searchCaseCards(searchText);
});

// 按Enter键搜索
document.querySelector('.search-input')?.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const searchText = this.value.trim().toLowerCase();
    searchCaseCards(searchText);
  }
});

// 搜索函数
function searchCaseCards(text) {
  const caseCards = document.querySelectorAll('.case-card');
  // 若无搜索内容，恢复筛选条件
  if (!text) {
    filterCaseCards();
    return;
  }
  // 按关键词筛选
  caseCards.forEach(card => {
    const title = card.querySelector('h6').textContent.toLowerCase();
    const desc = card.querySelector('.case-card-desc').textContent.toLowerCase();
    if (title.includes(text) || desc.includes(text)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// 分页按钮切换
document.querySelectorAll('.page-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});