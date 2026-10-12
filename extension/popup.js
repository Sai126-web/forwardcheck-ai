document.addEventListener("DOMContentLoaded", async () => {
  const claimInput = document.getElementById("claim-input");
  const urlInput = document.getElementById("url-input");
  const captureBtn = document.getElementById("capture-btn");
  const verifyBtn = document.getElementById("verify-btn");
  const statusMsg = document.getElementById("status-message");

  // Automatically attempt to populate current tab URL
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.startsWith("http")) {
      urlInput.value = tab.url;
    }
  } catch (e) {
    console.warn("Could not query active tab:", e);
  }

  // Grab highlighted text on active tab
  captureBtn.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) return;

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });

      if (results && results[0] && results[0].result) {
        claimInput.value = results[0].result.trim();
        showStatus("Captured highlighted text from page!", false);
      } else {
        showStatus("No text currently highlighted on the page. You can paste directly.", true);
      }
    } catch (err) {
      showStatus("Could not extract selection. Please paste text directly.", true);
    }
  });

  // Verify button - handoff to web app
  verifyBtn.addEventListener("click", () => {
    const text = claimInput.value.trim();
    const url = urlInput.value.trim();

    if (!text && !url) {
      showStatus("Please enter or highlight content to verify.", true);
      return;
    }

    const appBaseUrl = "http://localhost:3000/investigations/new";
    const params = new URLSearchParams();
    if (text) params.set("content", text);
    if (url) params.set("url", url);

    const targetUrl = `${appBaseUrl}?${params.toString()}`;
    chrome.tabs.create({ url: targetUrl });
  });

  function showStatus(msg, isError) {
    statusMsg.textContent = msg;
    statusMsg.classList.remove("hidden");
    if (isError) {
      statusMsg.style.borderColor = "#E56D68";
      statusMsg.style.color = "#E56D68";
      statusMsg.style.backgroundColor = "rgba(229, 109, 104, 0.15)";
    } else {
      statusMsg.style.borderColor = "#35AA9E";
      statusMsg.style.color = "#35AA9E";
      statusMsg.style.backgroundColor = "rgba(53, 170, 158, 0.15)";
    }
  }
});
