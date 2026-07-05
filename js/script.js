(function () {
  "use strict";

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var galleryImages = document.querySelectorAll(".gallery img");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  galleryImages.forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // 画像が未配置の場合にプレースホルダー表示へフォールバック
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      img.style.objectFit = "contain";
      img.style.padding = "12px";
      img.style.background = "#e9e7e1";
      img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
            '<rect width="100%" height="100%" fill="#e9e7e1"/>' +
            '<text x="50%" y="50%" font-size="16" fill="#8a8a8a" text-anchor="middle" dy=".3em">Image coming soon</text>' +
            "</svg>"
        );
    });
  });
})();
