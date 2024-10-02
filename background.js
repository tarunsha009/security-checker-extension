// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && tab.url) {
//       checkSecurity(tab.url, tabId);
//     }
//   });
  
//   function checkSecurity(url, tabId) {
//     const urlObj = new URL(url);
  
//     // Clear previous status for every new URL check
//     chrome.storage.local.set({ status: '', message: '' });
  
//     // Check if the site uses HTTPS
//     if (urlObj.protocol === 'https:') {
//       // Check SSL status via SSL Labs API
//       checkSSLStatus(urlObj.hostname);
//       // Check security headers
//       checkSecurityHeaders(url);
//     } else {
//       notifyUser('This site does not use HTTPS', 'insecure');
//       showNotification('This site does not use HTTPS');
//     }
//   }
  
//   function checkSSLStatus(hostname, retryCount = 3) {
//     const apiURL = `https://api.ssllabs.com/api/v3/analyze?host=${hostname}&fromCache=on&all=done`;
  
//     fetch(apiURL)
//       .then(response => response.json())
//       .then(data => {
//         if (data.status === 'READY') {
//           // Check the grade of the SSL certificate
//           const grade = data.endpoints[0].grade;
//           if (grade === 'A' || grade === 'A+') {
//             notifyUser(`This site is secure (SSL Grade: ${grade})`, 'secure');
//           } else if (grade === 'B') {
//             notifyUser('This site has moderate SSL security (SSL Grade: B)', 'warning');
//           } else {
//             notifyUser(`This site has SSL issues (SSL Grade: ${grade})`, 'insecure');
//             showNotification(`This site has SSL issues (SSL Grade: ${grade})`);
//           }
//         } else if (data.status === 'IN_PROGRESS' && retryCount > 0) {
//           console.log(`SSL analysis in progress for ${hostname}, retrying...`);
//           setTimeout(() => checkSSLStatus(hostname, retryCount - 1), 5000); // Retry after 5 seconds
//         } else {
//           notifyUser('Unable to determine SSL status', 'insecure');
//         }
//       })
//       .catch(error => {
//         console.error('Error checking SSL status:', error);
//         notifyUser('Error checking SSL certificate', 'insecure');
//       });
//   }
  
//   function checkSecurityHeaders(url) {
//     fetch(url).then(response => {
//       const csp = response.headers.get('Content-Security-Policy');
//       const hsts = response.headers.get('Strict-Transport-Security');
  
//       if (!csp) {
//         console.log('CSP Header is missing');
//         notifyUser('This site is missing Content-Security-Policy header', 'insecure');
//         showNotification('This site is missing Content-Security-Policy header');
//       }
  
//       if (!hsts) {
//         console.log('HSTS Header is missing');
//         notifyUser('This site is missing Strict-Transport-Security header', 'insecure');
//         showNotification('This site is missing Strict-Transport-Security header');
//       }
//     }).catch(error => {
//       console.error('Error fetching security headers:', error);
//     });
//   }
  
//   function notifyUser(message, status) {
//     // Log the current message for debugging
//     console.log(`Security Status: ${message}`);
  
//     // Update the popup with the current status message
//     chrome.storage.local.set({ status, message });
//   }
  
//   function showNotification(message) {
//     chrome.notifications.create({
//       type: 'basic',
//       iconUrl: 'icons/icon48.png',
//       title: 'Security Checker',
//       message: message
//     });
//   }
  

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      checkSecurity(tab.url, tabId);
    }
  });
  
  function checkSecurity(url, tabId) {
    const urlObj = new URL(url);
  
    // Clear previous status for every new URL check
    chrome.storage.local.set({ status: '', message: '' });
  
    // Check if the site uses HTTPS
    if (urlObj.protocol === 'https:') {
      // Check SSL status via SSL Labs API
      checkSSLStatus(urlObj.hostname);
    } else {
      chrome.storage.local.set({ status: 'insecure', message: 'This site does not use HTTPS' });
    }
  }
  
  function checkSSLStatus(hostname, retryCount = 3) {
    const apiURL = `https://api.ssllabs.com/api/v3/analyze?host=${hostname}&fromCache=on&all=done`;
  
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'READY') {
          const grade = data.endpoints[0].grade;
          if (grade === 'A' || grade === 'A+') {
            chrome.storage.local.set({ status: 'secure', message: `This site is secure (SSL Grade: ${grade})` });
          } else {
            chrome.storage.local.set({ status: 'insecure', message: `This site has SSL issues (SSL Grade: ${grade})` });
          }
        } else if (data.status === 'IN_PROGRESS' && retryCount > 0) {
          setTimeout(() => checkSSLStatus(hostname, retryCount - 1), 5000);
        } else {
          chrome.storage.local.set({ status: 'insecure', message: 'Unable to determine SSL status' });
        }
      })
      .catch(error => {
        console.error('Error checking SSL status:', error);
        chrome.storage.local.set({ status: 'insecure', message: 'Error checking SSL certificate' });
      });
  }
  
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      const headers = details.responseHeaders;
      let cspFound = false;
      let hstsFound = false;
  
      headers.forEach(header => {
        if (header.name.toLowerCase() === 'content-security-policy') {
          cspFound = true;
        }
        if (header.name.toLowerCase() === 'strict-transport-security') {
          hstsFound = true;
        }
      });
  
      if (!cspFound) {
        chrome.storage.local.set({ status: 'insecure', message: 'This site is missing Content-Security-Policy header' });
      }
  
      if (!hstsFound) {
        chrome.storage.local.set({ status: 'insecure', message: 'This site is missing Strict-Transport-Security header' });
      }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
  