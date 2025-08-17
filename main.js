document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split('T')[0];
  const tipsContainer = document.getElementById("tipsContainer");

  const localTips = JSON.parse(localStorage.getItem(today) || "[]");

  if (localTips.length > 0) {
    renderTips(localTips);
  } else {
    // fallback: load from JSON file
    fetch("../json/tips.json")
      .then(res => res.json())
      .then(data => {
        const dailyTips = data[today] || [];
        renderTips(dailyTips);
      });
    }
    // RenderTips function from localStorage
    function renderTips(tips) {
      tipsContainer.innerHTML = "";
      tips.forEach((tip) => {
        const tipElement = document.createElement("div");
        tipElement.classList.add("tip");
        tipElement.innerHTML = `
        <h2>${tip.title}</h2>
        <p>${tip.description}</p>
        `;
        tipsContainer.appendChild(tipElement);
        });
        }
        


  



  // --- HOMEPAGE ENHANCEMENTS ---
  populateLiveScores();
  populateFeaturedMatch();
  populateRecentResults();
  populateLatestNews();
  populateExpertTipsters();
  populatePopularMarkets();
  populateFeaturedLeagues();

  // Add date navigation
  const header = document.querySelector('.header');
  const dateNav = document.createElement('div');
  dateNav.className = 'date-navigation';
  dateNav.innerHTML = `
    <button id="prevDate" class="date-btn">← Previous</button>
    <span id="currentDate" class="current-date">${formatDate(today)}</span>
    <button id="nextDate" class="date-btn">Next →</button>
  `;
  header.appendChild(dateNav);

  let currentDate = today;
  let tipsData = {};

  // Load tips data
  fetch("../json/tips.json")
    .then(res => res.json())
    .then(data => {
      tipsData = data;
      displayTips(currentDate);
      updateStats();
      // Update live scores and featured match with real data if available
      updateLiveScoresWithTips(tipsData[currentDate] || []);
      updateFeaturedMatchWithTips(tipsData[currentDate] || []);
    })
    .catch(error => {
      console.error('Error loading tips:', error);
      tipsContainer.innerHTML = `<div class="glass error">Error loading tips. Please try again later.</div>`;
    });

  // Date navigation event listeners
  document.getElementById('prevDate').addEventListener('click', () => {
    const prevDate = getPreviousDate(currentDate);
    if (tipsData[prevDate]) {
      currentDate = prevDate;
      displayTips(currentDate);
      updateCurrentDate();
      updateLiveScoresWithTips(tipsData[currentDate] || []);
      updateFeaturedMatchWithTips(tipsData[currentDate] || []);
    }
  });

  document.getElementById('nextDate').addEventListener('click', () => {
    const nextDate = getNextDate(currentDate);
    if (tipsData[nextDate]) {
      currentDate = nextDate;
      displayTips(currentDate);
      updateCurrentDate();
      updateLiveScoresWithTips(tipsData[currentDate] || []);
      updateFeaturedMatchWithTips(tipsData[currentDate] || []);
    }
  });

  function displayTips(date) {
    const dailyTips = tipsData[date] || [];
    
    if (dailyTips.length === 0) {
      tipsContainer.innerHTML = `
        <div class="glass no-tips">
          <h2>📅 ${formatDate(date)}</h2>
          <p>No tips available for this date.</p>
          <p>Check back tomorrow for fresh predictions!</p>
        </div>`;
    } else {
      tipsContainer.innerHTML = `<h2 class="date-title">📅 ${formatDate(date)}</h2>`;
      
      dailyTips.forEach((tip, index) => {
        const card = document.createElement("div");
        card.className = `glass tip-card ${getConfidenceClass(tip.confidence)}`;
        card.innerHTML = `
          <div class="tip-header">
            <h3>${tip.match}</h3>
            <span class="confidence-badge ${getConfidenceClass(tip.confidence)}">${tip.confidence}</span>
          </div>
          <div class="tip-content">
            <div class="pick-section">
              <strong>Pick:</strong> <span class="pick-text">${tip.pick}</span>
            </div>
            <div class="odds-section">
              <strong>Odds:</strong> <span class="odds-text">${tip.odds}</span>
              <span class="stake-badge">Stake: ${tip.stake}</span>
            </div>
            <div class="reason-section">
              <p><em>${tip.reason}</em></p>
            </div>
            <div class="time-section">
              <span class="time-badge">⏰ ${tip.time}</span>
            </div>
          </div>
          <div class="tip-actions">
            <button class="action-btn bookmark-btn" onclick="toggleBookmark(${index})">🔖</button>
            <button class="action-btn share-btn" onclick="shareTip('${tip.match}', '${tip.pick}', ${tip.odds})">📤</button>
          </div>
        `;
        tipsContainer.appendChild(card);
      });
    }
  }

  function updateStats() {
    if (tipsData.stats) {
      const statsSection = document.createElement('section');
      statsSection.className = 'stats-section glass';
      statsSection.innerHTML = `
        <h2>📊 Performance Stats</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${tipsData.stats.total_tips}</span>
            <span class="stat-label">Total Tips</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${tipsData.stats.win_rate}</span>
            <span class="stat-label">Win Rate</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${tipsData.stats.avg_odds}</span>
            <span class="stat-label">Avg Odds</span>
          </div>
          <div class="stat-item">
            <span class="stat-number ${tipsData.stats.profit_loss.startsWith('+') ? 'positive' : 'negative'}">${tipsData.stats.profit_loss}</span>
            <span class="stat-label">P&L</span>
          </div>
        </div>
      `;
      tipsContainer.appendChild(statsSection);
    }
  }

  function updateCurrentDate() {
    document.getElementById('currentDate').textContent = formatDate(currentDate);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function getPreviousDate(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  function getNextDate(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  function getConfidenceClass(confidence) {
    switch(confidence?.toLowerCase()) {
      case 'high': return 'high-confidence';
      case 'medium': return 'medium-confidence';
      case 'low': return 'low-confidence';
      default: return 'medium-confidence';
    }
  }

  // --- HOMEPAGE SECTION FUNCTIONS ---
  function populateLiveScores() {
    const el = document.getElementById('liveScoresContainer');
    if (el) {
      el.innerHTML = `<div class="live-score-placeholder">Live scores for today's predictions will appear here. <br><span style="font-size:0.9em;opacity:0.7;">(API integration coming soon)</span></div>`;
    }
  }
  function updateLiveScoresWithTips(tips) {
    const el = document.getElementById('liveScoresContainer');
    if (el && tips.length > 0) {
      el.innerHTML = tips.map(tip => `
        <div class="live-score-match">
          <span class="live-match">${tip.match}</span>
          <span class="live-status">FT</span>
          <span class="live-score">-</span>
        </div>
      `).join('');
    }
  }
  /* Live Match Start */
  function checkMatchStart() {
    const now = new Date();

    matches.forEach(match => {
      const startTime = new Date(match.time);
      /* if match is within 1 minute of starting or already live */
     if(
      (match.status === 'scheduled' && now >= startTime) ||
      match.status === 'live'
     ) {
      updateLiveScoresWithTips(match.id);
     }
    });
  }
  // check every 30 seconds
  setInterval(checkMatchStart, 30000);
  
  function populateFeaturedMatch() {
    const el = document.getElementById('featuredMatchContainer');
    if (el) {
      el.innerHTML = `<div class="featured-match-placeholder">Featured match analysis will be shown here.<br><span style="font-size:0.9em;opacity:0.7;">(Auto-picks from today's tips)</span></div>`;
    }
  }
  function updateFeaturedMatchWithTips(tips) {
    const el = document.getElementById('featuredMatchContainer');
    if (el && tips.length > 0) {
      const tip = tips[0];
      el.innerHTML = `
        <div class="featured-match">
          <h3>${tip.match}</h3>
          <p><strong>Pick:</strong> ${tip.pick} <span class="odds-text">@ ${tip.odds}</span></p>
          <p><em>${tip.reason}</em></p>
          <p><span class="time-badge">⏰ ${tip.time}</span> <span class="confidence-badge ${getConfidenceClass(tip.confidence)}">${tip.confidence}</span></p>
        </div>
      `;
    }
  }
  function populateRecentResults() {
    const el = document.getElementById('recentResultsContainer');
    if (el) {
      el.innerHTML = `<ul class="recent-results-list">
        <li>Manchester City 2-1 Liverpool <span class="result-badge win">Win</span></li>
        <li>Real Madrid 1-1 Barcelona <span class="result-badge draw">Draw</span></li>
        <li>Bayern Munich 0-2 Dortmund <span class="result-badge loss">Loss</span></li>
      </ul>`;
    }
  }
  function populateLatestNews() {
    const el = document.getElementById('latestNewsContainer');
    if (el) {
      el.innerHTML = `<ul class="latest-news-list">
        <li><a href="#"><span class="news-title">Premier League:</span> Title race heats up as City edge Liverpool</a></li>
        <li><a href="#"><span class="news-title">Spanish Laliga:</span> Barcelona sign new striker ahead of El Clasico</a></li>
        <li><a href="#"><span class="news-title">Champions League:</span> Quarterfinals draw announced</a></li>
      </ul>`;
    }
  }
  function populateExpertTipsters() {
    const el = document.getElementById('expertTipstersContainer');
    if (el) {
      el.innerHTML = `<div class="tipster-list">
        <div class="tipster-card"><strong>Alex</strong><br>Head Analyst<br>10+ years experience</div>
        <div class="tipster-card"><strong>Sam</strong><br>Data Scientist<br>AI prediction engine</div>
        <div class="tipster-card"><strong>Maria</strong><br>Community Manager<br>Transparency & support</div>
      </div>`;
    }
  }
  function populatePopularMarkets() {
    const el = document.getElementById('popularMarketsContainer');
    if (el) {
      el.innerHTML = `<ul class="market-list">
        <li>Match Winner (1X2)</li>
        <li>Over/Under Goals</li>
        <li>Both Teams to Score</li>
        <li>Asian Handicap</li>
        <li>Correct Score</li>
        <li>Double Chance</li>
      </ul>`;
    }
  }
  function populateFeaturedLeagues() {
    const el = document.getElementById('featuredLeaguesContainer');
    if (el) {
      el.innerHTML = `<div class="league-list">
        <span class="league-badge">Premier League</span>
        <span class="league-badge">La Liga</span> <br>
        <span class="league-badge">Bundesliga</span>
        <span class="league-badge">Serie A</span><br>
        <span class="league-badge">Ligue 1</span>
        <span class="league-badge">Champions League</span> <br>
        <span class="league-badge">Saudi Pro League</span>
      </div>`;
    }
  }
});

// Global functions for tip actions
function toggleBookmark(index) {
  // Implementation for bookmarking tips
  console.log('Bookmarking tip:', index);
}

function shareTip(match, pick, odds) {
  const text = `⚽ Soccer Tip: ${match} - ${pick} @ ${odds} odds\nCheck out more tips at ZiRacle Win!`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Soccer Tip',
      text: text
    });
  } else {
    // Fallback to copying to clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert('Tip copied to clipboard!');
    });
  }
}





