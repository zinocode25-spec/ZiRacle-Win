document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tipForm");
  const previewContainer = document.getElementById("previewTips");
  const today = new Date().toISOString().split("T")[0];

  // Add form validation and enhanced UI
  const confidenceSelect = document.createElement('select');
  confidenceSelect.id = 'confidence';
  confidenceSelect.innerHTML = `
    <option value="">Select Confidence Level</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  `;
  
  const stakeInput = document.createElement('input');
  stakeInput.type = 'text';
  stakeInput.id = 'stake';
  stakeInput.placeholder = 'Stake % (e.g., 2%)';
  stakeInput.required = true;

  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.id = 'time';
  timeInput.required = true;

  // Insert new fields into form
  const reasonField = document.getElementById('reason');
  reasonField.parentNode.insertBefore(confidenceSelect, reasonField.nextSibling);
  reasonField.parentNode.insertBefore(stakeInput, confidenceSelect.nextSibling);
  reasonField.parentNode.insertBefore(timeInput, stakeInput.nextSibling);

  function loadTips() {
    const tips = JSON.parse(localStorage.getItem(today)) || [];
    previewContainer.innerHTML = "";
    
    if (tips.length === 0) {
      previewContainer.innerHTML = '<div class="glass no-tips">No tips added for today yet.</div>';
      return;
    }

    tips.forEach((tip, index) => {
      const div = document.createElement("div");
      div.className = `glass tip-preview ${getConfidenceClass(tip.confidence)}`;
      div.innerHTML = `
        <div class="preview-header">
          <h3>${tip.match}</h3>
          <span class="confidence-badge ${getConfidenceClass(tip.confidence)}">${tip.confidence}</span>
        </div>
        <div class="preview-content">
          <p><strong>Pick:</strong> ${tip.pick}</p>
          <p><strong>Odds:</strong> ${tip.odds}</p>
          <p><strong>Stake:</strong> ${tip.stake}</p>
          <p><strong>Time:</strong> ${tip.time}</p>
          <p><em>${tip.reason}</em></p>
        </div>
        <div class="preview-actions">
          <button class="action-btn delete-btn" onclick="deleteTip(${index})">🗑️ Delete</button>
        </div>
      `;
      previewContainer.appendChild(div);
    });
  }

  function getConfidenceClass(confidence) {
    switch(confidence?.toLowerCase()) {
      case 'high': return 'high-confidence';
      case 'medium': return 'medium-confidence';
      case 'low': return 'low-confidence';
      default: return 'medium-confidence';
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    
    // Form validation
    const match = document.getElementById("match").value.trim();
    const pick = document.getElementById("pick").value.trim();
    const odds = document.getElementById("odds").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const confidence = document.getElementById("confidence").value;
    const stake = document.getElementById("stake").value.trim();
    const time = document.getElementById("time").value;

    if (!match || !pick || !odds || !confidence || !stake || !time) {
      alert('Please fill in all required fields!');
      return;
    }

    // Validate odds format
    if (isNaN(parseFloat(odds)) || parseFloat(odds) <= 1) {
      alert('Please enter valid odds (greater than 1.0)');
      return;
    }

    // Validate stake format
    if (!stake.includes('%')) {
      alert('Please enter stake in percentage format (e.g., 2%)');
      return;
    }

    const tip = {
      match: match,
      pick: pick,
      odds: odds,
      reason: reason,
      confidence: confidence,
      stake: stake,
      time: time
    };

    const tips = JSON.parse(localStorage.getItem(today)) || [];
    tips.push(tip);
    localStorage.setItem(today, JSON.stringify(tips));
    
    // Show success message
    showNotification('Tip added successfully!', 'success');
    
    form.reset();
    loadTips();
  });

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    } else if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #F44336, #FF5722)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #2196F3, #03A9F4)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    .tip-preview {
      margin-bottom: 1rem;
      position: relative;
    }
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .preview-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    .preview-content p {
      margin: 0.3rem 0;
    }
    .preview-actions {
      margin-top: 1rem;
      text-align: right;
    }
    .delete-btn {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }
    .delete-btn:hover {
      background: rgba(244, 67, 54, 0.3);
    }
  `;
  document.head.appendChild(style);

  loadTips();
});

// Global function for deleting tips
function deleteTip(index) {
  const today = new Date().toISOString().split("T")[0];
  const tips = JSON.parse(localStorage.getItem(today)) || [];
  
  if (confirm('Are you sure you want to delete this tip?')) {
    tips.splice(index, 1);
    localStorage.setItem(today, JSON.stringify(tips));
    
    // Reload the tips display
    const previewContainer = document.getElementById("previewTips");
    previewContainer.innerHTML = "";
    
    tips.forEach((tip, newIndex) => {
      const div = document.createElement("div");
      div.className = `glass tip-preview ${getConfidenceClass(tip.confidence)}`;
      div.innerHTML = `
        <div class="preview-header">
          <h3>${tip.match}</h3>
          <span class="confidence-badge ${getConfidenceClass(tip.confidence)}">${tip.confidence}</span>
        </div>
        <div class="preview-content">
          <p><strong>Pick:</strong> ${tip.pick}</p>
          <p><strong>Odds:</strong> ${tip.odds}</p>
          <p><strong>Stake:</strong> ${tip.stake}</p>
          <p><strong>Time:</strong> ${tip.time}</p>
          <p><em>${tip.reason}</em></p>
        </div>
        <div class="preview-actions">
          <button class="action-btn delete-btn" onclick="deleteTip(${newIndex})">🗑️ Delete</button>
        </div>
      `;
      previewContainer.appendChild(div);
    });
    
    if (tips.length === 0) {
      previewContainer.innerHTML = '<div class="glass no-tips">No tips added for today yet.</div>';
    }
  }
}

function getConfidenceClass(confidence) {
  switch(confidence?.toLowerCase()) {
    case 'high': return 'high-confidence';
    case 'medium': return 'medium-confidence';
    case 'low': return 'low-confidence';
    default: return 'medium-confidence';
  }
}