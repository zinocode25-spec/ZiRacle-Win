document.addEventListener("DOMContentLoaded", () => {
  // Initialize charts
  initializeCharts();
  
  // Add real-time updates
  setInterval(updateMetrics, 5000);
});

function initializeCharts() {
  // Confidence Chart
  const confidenceCtx = document.getElementById('confidenceChart').getContext('2d');
  new Chart(confidenceCtx, {
    type: 'doughnut',
    data: {
      labels: ['High Confidence', 'Medium Confidence', 'Low Confidence'],
      datasets: [{
        data: [75, 68, 45],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(244, 67, 54, 0.8)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'white',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });

  // Monthly Performance Chart
  const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(monthlyCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Win Rate %',
        data: [65, 68, 72, 70, 75, 68],
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Profit %',
        data: [8, 12, 15, 18, 22, 12.5],
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'white',
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'white'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'white'
          }
        }
      }
    }
  });

  // Add animations to metrics
  animateMetrics();
}

function animateMetrics() {
  const metricNumbers = document.querySelectorAll('.metric-number');
  
  metricNumbers.forEach(metric => {
    const finalValue = metric.textContent;
    const isPercentage = finalValue.includes('%');
    const isPositive = finalValue.includes('+');
    const numericValue = parseFloat(finalValue.replace(/[^0-9.-]/g, ''));
    
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
      currentValue += increment;
      
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(timer);
      }
      
      let displayValue = currentValue.toFixed(1);
      if (isPercentage) displayValue += '%';
      if (isPositive && currentValue > 0) displayValue = '+' + displayValue;
      
      metric.textContent = displayValue;
    }, 30);
  });
}

function updateMetrics() {
  // Simulate real-time updates
  const winRateElement = document.querySelector('.metric-number');
  const currentWinRate = parseFloat(winRateElement.textContent);
  const newWinRate = currentWinRate + (Math.random() - 0.5) * 2;
  
  if (newWinRate >= 60 && newWinRate <= 80) {
    winRateElement.textContent = newWinRate.toFixed(1) + '%';
  }
}

// Add interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to league stats
  const leagueItems = document.querySelectorAll('.league-item');
  leagueItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'scale(1.05)';
      item.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'scale(1)';
      item.style.background = 'transparent';
    });
  });

  // Add click to expand functionality
  const analyticsCards = document.querySelectorAll('.analytics-card');
  analyticsCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
      } else {
        // Remove expanded class from other cards
        analyticsCards.forEach(c => c.classList.remove('expanded'));
        card.classList.add('expanded');
      }
    });
  });
});

// Add CSS for expanded cards
const style = document.createElement('style');
style.textContent = `
  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .analytics-card {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .analytics-card.expanded {
    grid-column: span 2;
    transform: scale(1.02);
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .metric-item {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .metric-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .metric-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .metric-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .league-stats {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .league-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .league-name {
    font-weight: bold;
  }
  
  .league-winrate {
    color: #4CAF50;
    font-weight: bold;
  }
  
  .streak-info, .bankroll-info {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .streak-item, .bankroll-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
  }
  
  .streak-label, .bankroll-label {
    font-weight: bold;
  }
  
  .streak-value, .bankroll-value {
    font-weight: bold;
  }
  
  .positive {
    color: #4CAF50;
  }
  
  .negative {
    color: #F44336;
  }
  
  @media (max-width: 768px) {
    .analytics-grid {
      grid-template-columns: 1fr;
    }
    
    .analytics-card.expanded {
      grid-column: span 1;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style); 