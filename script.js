// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // CONFIG
  // ----------------------------
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrvqOszGQyVfextyQVuL3NGQq4xrKH7TCNrLpG0cKl9eopJKyv0hKsDcTi5xn-WcUs/exec";

  // ----------------------------
  // QUANTITY BUTTONS
  // ----------------------------
  const minusBtn = document.querySelector(".quantity-controls button:first-child");
  const plusBtn = document.querySelector(".quantity-controls button:last-child");
  const quantityDisplay = document.querySelector(".quantity-controls span");
  let quantity = Number(quantityDisplay?.textContent) || 1;
  if (quantityDisplay) quantityDisplay.textContent = quantity;

  minusBtn?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });

  plusBtn?.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });

  // ----------------------------
  // SIZE SELECTION
  // ----------------------------
  const sizeButtons = document.querySelectorAll(".size-options button");
  let selectedSize = null;
  sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
      sizeButtons.forEach(b => (b.style.borderColor = "#ccc")); // reset
      button.style.borderColor = "black"; // highlight
      selectedSize = button.textContent.trim();
    });
  });

  // ----------------------------
  // THUMBNAIL IMAGE CLICK
  // ----------------------------
  const thumbnails = document.querySelectorAll(".thumbnail-row img");
  const mainImg = document.querySelector(".main-img");
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", () => {
      mainImg.src = thumbnail.src;
    });
  });

  // ----------------------------
  // POPUP ELEMENTS
  // ----------------------------
  const preOrderBtn = document.getElementById("preOrderBtn") || document.querySelector(".cta button");
  const popup = document.getElementById("popup");
  const popupBox = document.querySelector(".popup-box");
  const closePopup = document.querySelector(".close-popup");
  const submitEmail = document.getElementById("submitEmail");
  const emailInput = document.getElementById("emailInput");

  // popup message area
  let popupMessage = document.getElementById("popupMessage");
  if (!popupMessage && popupBox) {
    popupMessage = document.createElement("div");
    popupMessage.id = "popupMessage";
    popupMessage.style.marginTop = "12px";
    popupMessage.style.fontSize = "14px";
    popupBox.appendChild(popupMessage);
  }

  // success popup
  const successPopup = document.getElementById("successPopup");
  const closeSuccess = document.querySelector(".close-success");

  // ----------------------------
  // OPEN POPUP
  // ----------------------------
  preOrderBtn?.addEventListener("click", () => {
    // Track pre-order button click in Google Analytics (safe check)
    if (typeof gtag === "function") {
      try {
        gtag('event', 'preorder_click', {
          event_category: 'engagement',
          event_label: 'Pre-order Button'
        });
      } catch (e) {
        // fail silently if GA throws for any reason
        console.warn("gtag error:", e);
      }
    }

    if (!selectedSize) {
      if (popupMessage) {
        popupMessage.textContent = "⚠️ Please select a size before pre-ordering!";
        popupMessage.style.color = "red";
      }
    } else {
      if (popupMessage) popupMessage.textContent = "";
    }
    popup.style.display = "flex";
  });

  // ----------------------------
  // SUBMIT EMAIL
  // ----------------------------
  submitEmail?.addEventListener("click", () => {
    const email = (emailInput?.value || "").trim();

    if (!email) {
      popupMessage.textContent = "⚠️ Please enter your email.";
      popupMessage.style.color = "red";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      popupMessage.textContent = "⚠️ Please enter a valid email.";
      popupMessage.style.color = "red";
      return;
    }

    popupMessage.textContent = "Saving your pre-order…";
    popupMessage.style.color = "black";

    const formData = new FormData();
    formData.append("email", email);
    formData.append("size", selectedSize || "");
    formData.append("quantity", String(quantity));

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch(err) {
          popupMessage.textContent = "❌ Invalid response from server.";
          popupMessage.style.color = "red";
          console.error("JSON parse error:", err, text);
          return;
        }

        if (data.status === "success") {
          popup.style.display = "none";
          successPopup.style.display = "flex";
          emailInput.value = "";
          quantity = 1;
          quantityDisplay.textContent = quantity;
          sizeButtons.forEach(b => (b.style.borderColor = "#ccc"));
          selectedSize = null;
        } else {
          popupMessage.textContent = "❌ Error saving: " + (data.message || "Unknown error");
          popupMessage.style.color = "red";
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        popupMessage.textContent = "❌ Something went wrong. Please try again later.";
        popupMessage.style.color = "red";
      });
  });

  // ----------------------------
  // CLOSE POPUPS
  // ----------------------------
  closePopup?.addEventListener("click", () => {
    popup.style.display = "none";
    popupMessage.textContent = "";
  });

  closeSuccess?.addEventListener("click", () => {
    successPopup.style.display = "none";
  });

  // click outside to close
  document.addEventListener("click", e => {
    if (e.target === popup) {
      popup.style.display = "none";
      popupMessage.textContent = "";
    }
    if (e.target === successPopup) {
      successPopup.style.display = "none";
    }
  });

  // ESC key closes popups
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (popup.style.display === "flex") {
        popup.style.display = "none";
        popupMessage.textContent = "";
      }
      if (successPopup.style.display === "flex") {
        successPopup.style.display = "none";
      }
    }
  });

  // ----------------------------
  // DEV WARNINGS
  // ----------------------------
  if (!minusBtn || !plusBtn) console.warn("Quantity buttons missing");
  if (!sizeButtons || sizeButtons.length === 0) console.warn("Size buttons missing");
  if (!preOrderBtn) console.warn("Pre-order button missing");
  if (!submitEmail) console.warn("Submit email button missing");
});

 // JS lighbox code 
 // ----------------------------
// IMAGE LIGHTBOX INTERACTIVITY
// ----------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox?.querySelector("img");

document.querySelectorAll(".product-images img").forEach(img => {
img.addEventListener("click", () => {
  lightboxImg.src = img.src;
  lightbox.style.display = "flex";
});
});

lightbox?.addEventListener("click", (e) => {
if (e.target === lightbox) {
  lightbox.style.display = "none";
}
});

document.addEventListener("keydown", (e) => {
if (e.key === "Escape") {
  lightbox.style.display = "none";
}
});

