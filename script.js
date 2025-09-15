// QUANTITY BUTTONS
const minusBtn = document.querySelector(".quantity-controls button:first-child");
const plusBtn = document.querySelector(".quantity-controls button:last-child");
const quantityDisplay = document.querySelector(".quantity-controls span");

let quantity = 1;

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});

plusBtn.addEventListener("click", () => {
  quantity++;
  quantityDisplay.textContent = quantity;
});

// SIZE SELECTION
const sizeButtons = document.querySelectorAll(".size-options button");
let selectedSize = null;

sizeButtons.forEach(button => {
  button.addEventListener("click", () => {
    sizeButtons.forEach(btn => btn.style.borderColor = "#ccc"); // reset
    button.style.borderColor = "black"; // highlight selected
    selectedSize = button.textContent;
  });
});

// THUMBNAIL IMAGE CLICK
const thumbnails = document.querySelectorAll(".thumbnail-row img");
const mainImg = document.querySelector(".main-img");

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener("click", () => {
    mainImg.src = thumbnail.src;
  });
});

// ADD TO CART / PRE-BOOK
const addToCartBtn = document.querySelector(".cta button");

addToCartBtn.addEventListener("click", () => {
  if (!selectedSize) {
    alert("Please select a size before adding to cart!");
    return;
  }

  alert(`Added to cart:\nProduct: SOMETIMES ALL YOU NEED...\nSize: ${selectedSize}\nQuantity: ${quantity}`);
});
