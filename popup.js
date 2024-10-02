document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['status', 'message'], function (result) {
      const statusDiv = document.getElementById('status');
      statusDiv.textContent = result.message;
  
      if (result.status === 'secure') {
        statusDiv.classList.add('secure');
      } else if (result.status === 'warning') {
        statusDiv.classList.add('warning');
      } else {
        statusDiv.classList.add('insecure');
      }
    });
  });
  