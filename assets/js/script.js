// ==========================================================================
// DIEU BI MAT - Core Animation & Interaction Controller
// ==========================================================================

// Responsive Stage Scaling (Tối ưu chuẩn xác cho cả iPhone 14 landscape & màn hình PC)
function adjustStageScale() {
  var winW = window.innerWidth || document.documentElement.clientWidth;
  var winH = window.innerHeight || document.documentElement.clientHeight;
  var targetW = 1100;
  var targetH = 680;

  var isMobileLand = (winW > winH) && (winH <= 600 || winW <= 1024);

  var scale;
  if (isMobileLand) {
    // Trên điện thoại xoay ngang (ví dụ iPhone 14: ~844 x 310-390px Safari)
    // Cân đối để toàn bộ 680px chiều cao luôn nằm gọn 100% trong khung nhìn, không bị cắt xén chân trang/ngôi nhà
    var scaleH = (winH * 0.93) / targetH;
    var scaleW = (winW * 0.95) / targetW;
    scale = Math.min(scaleW, scaleH);
    if (scale < 0.32) scale = 0.32;
    if (scale > 0.60) scale = 0.60;
  } else {
    // Màn hình desktop hoặc tablet
    var scaleX = (winW * 0.96) / targetW;
    var scaleY = (winH * 0.92) / targetH;
    scale = Math.min(scaleX, scaleY);
    if (scale < 0.28) scale = 0.28;
    if (scale > 1.25) scale = 1.25;
  }

  document.documentElement.style.setProperty('--stage-scale', scale);
}

// Xử lý chuyển đổi hướng màn hình chính xác và triệt để
function updateOrientationState() {
  var winW = window.innerWidth || document.documentElement.clientWidth;
  var winH = window.innerHeight || document.documentElement.clientHeight;
  var isLandscape = winW > winH;

  if (isLandscape) {
    document.body.classList.add("is-landscape");
    document.body.classList.remove("is-portrait");

    // Khi người dùng xoay ngang máy, lập tức tắt sạch toàn bộ thông báo/modal dọc
    // để trả lại trọn vẹn màn hình cây hoa nở cho người dùng
    var pModal = document.getElementById("portrait-letter-modal");
    var rModal = document.getElementById("rotate-to-portrait-modal");
    if (pModal && pModal.classList.contains("open")) {
      pModal.classList.remove("open");
    }
    if (rModal && rModal.classList.contains("open")) {
      rModal.classList.remove("open");
    }
    pendingVideoIndex = null;
    pendingGiftElement = null;
  } else {
    document.body.classList.add("is-portrait");
    document.body.classList.remove("is-landscape");
  }
}

window.addEventListener('resize', function () {
  adjustStageScale();
  updateOrientationState();
});
window.addEventListener('orientationchange', function () {
  setTimeout(function () {
    adjustStageScale();
    updateOrientationState();
  }, 50);
  setTimeout(function () {
    adjustStageScale();
    updateOrientationState();
  }, 200);
  setTimeout(function () {
    adjustStageScale();
    updateOrientationState();
  }, 400);
});
adjustStageScale();
updateOrientationState();

// Audio Controller
var audio = document.getElementById("myAudio");
var musicBtn = document.getElementById("music-btn");

function updateMusicBtnState() {
  if (!musicBtn || !audio) return;
  if (!audio.paused) {
    musicBtn.classList.add("playing");
    musicBtn.setAttribute("aria-label", "Tạm dừng nhạc");
  } else {
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-label", "Phát nhạc");
  }
}

function playAudio() {
  var vModal = document.getElementById("video-modal");
  if (vModal && vModal.classList.contains("open")) {
    return;
  }
  if (audio && audio.paused) {
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          updateMusicBtnState();
        })
        .catch(function () {
          // Autoplay policy prevented playback until explicit user interaction
        });
    }
  }
}

if (musicBtn) {
  musicBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(updateMusicBtnState);
    } else {
      audio.pause();
      updateMusicBtnState();
    }
  });
}

document.addEventListener("click", playAudio);
document.addEventListener("touchstart", playAudio);

// Portrait Mode Direct Letter Reader (Bảo vệ tuyệt đối: Không cho đọc thư trước nếu chưa xem xong animation)
var isAnimationFinished = false;
var btnReadPortrait = document.getElementById("btn-read-portrait");
var portraitModal = document.getElementById("portrait-letter-modal");
var btnClosePortrait = document.getElementById("btn-close-portrait");

if (btnReadPortrait && portraitModal) {
  btnReadPortrait.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!isAnimationFinished) return; // Chặn đọc trước khi animation chưa xong
    portraitModal.classList.add("open");
    playAudio();
  });
}

if (btnClosePortrait && portraitModal) {
  btnClosePortrait.addEventListener("click", function (e) {
    e.stopPropagation();
    portraitModal.classList.remove("open");
  });
}

// ==========================================================================
// Sequential Gift Boxes & Runner Vector Character & Fullscreen Video
// ==========================================================================
var videoModal = document.getElementById("video-modal");
var playerVideo = document.getElementById("player-video");
var videoTitle = document.getElementById("video-title");
var btnCloseVideo = document.getElementById("btn-close-video");
var btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen");
var rotateModal = document.getElementById("rotate-to-portrait-modal");
var promptGiftLabel = document.getElementById("prompt-gift-label");
var btnForcePlay = document.getElementById("btn-force-play-video");
var btnCancelPrompt = document.getElementById("btn-cancel-prompt");

var pendingVideoIndex = null;
var pendingGiftElement = null;
var wasMusicPlayingBeforeVideo = false;
var isRunnerActive = false;

// Web tĩnh 100%: Dọn sạch storage để mỗi lần mở trang hoặc reload (F5 / Ctrl+F5) luôn mới tinh
try {
  sessionStorage.clear();
  localStorage.clear();
} catch (e) {}

// Quản lý trạng thái thuần in-memory (Reset sạch sẽ mỗi lần tải lại trang)
var currentUnlockedGift = 1;
var openedGifts = {};

// Các câu chúc dễ thương và lời thoại hài hước cho từng món quà
var giftGreetings = {
  1: {
    name: "🌸 Mấy bèo ơi",
    title: "🌸 Chúc mấy bèo 20/10 siêu cấp vui vẻ nheeee ✨",
    prompt: "🌸 Món quà xinh xắn cho mấy bèo nè",
    speechRun: "Tớ từ trong nhà phi ra mở quà 1 cho mấy bèo nè! 🏃‍♂️💨",
    speechMid: "Sắp tới rồiii, ráng đợi tớ xíu nhenn! 🏃‍♂️💨",
    speechOpen: "Tadaaa! Mấy bèo mở mắt to đón quà nhen! 🌸🎉",
    stageHint: "✨ Có món quà đầu tiên cho mấy bèo nè! Bấm mở liền tay 👇",
    portraitHint: "🎁 Mở món quà đầu tiên cho mấy bèo nè:"
  },
  2: {
    name: "🌹 Mãi xinh tươi",
    title: "🌹 Chúc mấy bèo mãi xinh tươi & cười toe toét cả ngày 🥰",
    prompt: "🌹 Món quà tươi rói tiếp theo nè",
    speechRun: "Tớ từ nhà phi ra mở quà 2 tới đêyyy! 🏃‍♂️💨",
    speechMid: "Vèo vèo vèo... tớ đến ngay đây! 🏃‍♂️💨",
    speechOpen: "Bùm chíu! Nụ cười tỏa nắng xuất hiện nè! 🌹✨",
    stageHint: "🎉 Tuyệt vời! Món quà số 2 đã lộ diện, bấm mở tiếp để cười toe toét nàoo! 👇",
    portraitHint: "🎉 Món quà thứ hai đã sẵn sàng rồi nè! 👇"
  },
  3: {
    name: "👑 Trùm cuối nè",
    title: "👑 Trùm cuối: Chúc mấy bèo luôn rạng rỡ & ngập tràn hạnh phúc! 💖",
    prompt: "👑 Món quà trùm cuối siêu đặc biệt",
    speechRun: "Trùm cuối xịn sò tới đêyyy, tớ phóng từ nhà ra nè! 🚀✨",
    speechMid: "Tăng tốc hết cỡ nàooo... vùuuu! 🚀💨",
    speechOpen: "Úm ba la xì bùa! Trùm cuối xuất hiện chói lóa luôn! 👑💖",
    stageHint: "🌟 TRÙM CUỐI ĐÂY RỒI: Món quà bất ngờ nhất đã xuất hiện! Mở ngay kẻo lỡ 👇",
    portraitHint: "🌟 Trùm cuối đã lộ diện! Mở liền thôi mấy bèo ơi! 👇"
  }
};

// Cập nhật giao diện tuần tự của các hộp quà
function updateGiftProgressionUI() {
  var stageHint = document.getElementById("gift-hint-text");
  var portraitTitle = document.getElementById("portrait-gifts-title");

  var allOpened = openedGifts[1] && openedGifts[2] && openedGifts[3];

  if (allOpened) {
    if (stageHint) {
      stageHint.textContent = "💖 Mấy bèo đã mở trọn vẹn cả 3 món quà rồi! Chúc mấy bèo 20/10 ngập tràn niềm vui & hạnh phúc nheee! 🌸👑✨";
    }
    if (portraitTitle) {
      portraitTitle.textContent = "💖 Trọn bộ quà tặng đã mở xong! Chúc mấy bèo 20/10 siêu hạnh phúc nhen! 🌸✨";
    }
  } else if (giftGreetings[currentUnlockedGift]) {
    if (stageHint) {
      stageHint.textContent = giftGreetings[currentUnlockedGift].stageHint;
    }
    if (portraitTitle) {
      portraitTitle.textContent = giftGreetings[currentUnlockedGift].portraitHint;
    }
  }

  // Cập nhật cả 2 danh sách hộp quà (trên sân khấu và trong modal dọc)
  var allGiftBoxes = document.querySelectorAll(".gift-box");
  allGiftBoxes.forEach(function (box) {
    var num = parseInt(box.getAttribute("data-video"), 10) || 1;
    var badge = box.querySelector(".gift-status-badge");

    if (num <= currentUnlockedGift) {
      box.classList.remove("locked");
      box.classList.add("unlocked");

      if (openedGifts[num]) {
        box.classList.add("opened");
        if (badge) {
          badge.className = "gift-status-badge badge-opened";
          badge.textContent = "✓ Đã xem";
        }
      } else {
        box.classList.remove("opened");
        if (badge) {
          badge.className = "gift-status-badge badge-new";
          badge.textContent = (num === currentUnlockedGift) ? "MỞ NGAY ✨" : "MỚI ✨";
        }
      }
    } else {
      box.classList.remove("unlocked", "opened");
      box.classList.add("locked");
    }
  });
}

// Khởi tạo trạng thái ban đầu
updateGiftProgressionUI();

function isMobileLandscape() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  var hasTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  var isLandscape = window.innerWidth > window.innerHeight;
  var isMobileSize = window.innerWidth <= 1024 && window.innerHeight <= 600;
  return (isMobileUA || (hasTouch && isMobileSize)) && isLandscape;
}

// Fullscreen API toggle
function toggleFullscreenMode() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    var targetEl = videoModal || document.documentElement;
    if (targetEl.requestFullscreen) {
      targetEl.requestFullscreen().catch(function () {});
    } else if (targetEl.webkitRequestFullscreen) {
      targetEl.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function updateFullscreenIcon() {
  var enterIcon = document.querySelector(".fs-icon-enter");
  var exitIcon = document.querySelector(".fs-icon-exit");
  if (!enterIcon || !exitIcon) return;

  if (document.fullscreenElement || document.webkitFullscreenElement) {
    enterIcon.style.display = "none";
    exitIcon.style.display = "block";
  } else {
    enterIcon.style.display = "block";
    exitIcon.style.display = "none";
  }
}

document.addEventListener("fullscreenchange", updateFullscreenIcon);
document.addEventListener("webkitfullscreenchange", updateFullscreenIcon);

if (btnToggleFullscreen) {
  btnToggleFullscreen.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleFullscreenMode();
  });
}

// Nhân vật que vui nhộn chui ra từ ngôi nhà chạy tới mở hộp quà (kéo dài thêm 50% ở lần đầu: ~2.85s chạy + ~2.25s mở = 5.1s)
function runVectorCharacterToBox(videoIndex, giftBoxEl, callback) {
  var isPortrait = !giftBoxEl.closest("#gift-boxes-stage");
  var runner = isPortrait ? document.getElementById("runner-portrait") : document.getElementById("runner-stage");
  var bubbleText = isPortrait ? document.getElementById("runner-portrait-text") : document.getElementById("runner-text");
  var house = isPortrait ? document.getElementById("house-portrait") : document.getElementById("house-stage");

  if (!runner || isRunnerActive) {
    if (callback) callback();
    return;
  }

  isRunnerActive = true;
  var isFirstTime = !openedGifts[videoIndex];
  var greeting = giftGreetings[videoIndex] || giftGreetings[1];

  // Mở cửa ngôi nhà nhỏ để người que chui ra
  if (house) {
    house.classList.add("door-open");
  }

  // Thời gian chạy và mở: Lần đầu kéo dài thêm 50% (~2.85s chạy + ~2.25s mở = 5.1s). Đã xem: nhanh mượt (~0.4s + ~0.35s = 0.75s)
  var runDuration = isFirstTime ? 2850 : 400;
  var openDuration = isFirstTime ? 2250 : 350;

  if (isFirstTime) {
    runner.classList.remove("fast-run");
    if (bubbleText) {
      bubbleText.textContent = greeting.speechRun;
    }
    // Lời thoại giữa chặng đường cho sinh động
    setTimeout(function () {
      if (isRunnerActive && runner.classList.contains("running") && bubbleText) {
        bubbleText.textContent = greeting.speechMid;
      }
    }, 1400);
    setTimeout(function () {
      if (isRunnerActive && runner.classList.contains("running") && bubbleText) {
        bubbleText.textContent = "Tới chân hộp quà rồi nèee! 🏃‍♂️💨";
      }
    }, 2200);
  } else {
    runner.classList.add("fast-run");
    if (bubbleText) {
      bubbleText.textContent = "Tớ phi ra mở lại ngay đâyyy! ⚡";
    }
  }

  // Tính vị trí tương đối từ cửa nhà đến hộp quà (chuẩn xác ở mọi tỷ lệ scale của sân khấu)
  var containerRect = runner.parentElement.getBoundingClientRect();
  var giftRect = giftBoxEl.getBoundingClientRect();
  var runnerBaseLeft = isPortrait ? 14 : 18;
  var currentScale = 1;
  if (!isPortrait) {
    currentScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale')) || 1;
  }
  var diffX = (giftRect.left - containerRect.left) / currentScale;
  var targetX = diffX - runnerBaseLeft - 32;
  if (targetX < 24) targetX = 24;

  // 1. Chạy tới hộp quà
  runner.classList.remove("opening-jump");
  runner.classList.add("visible", "running");
  runner.style.transform = "translateX(" + targetX + "px)";

  setTimeout(function () {
    // 2. Dừng lại và nhảy lên mở nắp
    runner.classList.remove("running");
    runner.classList.add("opening-jump");
    if (bubbleText) {
      bubbleText.textContent = isFirstTime ? greeting.speechOpen : "Mở lạiii nè! ✨";
    }

    giftBoxEl.classList.add("box-popping");

    // Rung nhẹ điện thoại nếu hỗ trợ
    if (navigator.vibrate) {
      try { navigator.vibrate(60); } catch (e) {}
    }

    setTimeout(function () {
      runner.classList.remove("visible", "opening-jump", "fast-run");
      runner.style.transform = "translateX(0)";
      giftBoxEl.classList.remove("box-popping");
      if (house) {
        house.classList.remove("door-open");
      }
      isRunnerActive = false;

      if (callback) callback();
    }, openDuration);
  }, runDuration);
}

var currentPlayingVideoNum = 1;

function playGiftVideo(index) {
  var videoNum = parseInt(index, 10) || 1;
  currentPlayingVideoNum = videoNum;
  if (!playerVideo || !videoModal) return;

  // Tạm dừng nhạc nền khi chiếu video
  if (audio && !audio.paused) {
    wasMusicPlayingBeforeVideo = true;
    audio.pause();
    updateMusicBtnState();
  } else {
    wasMusicPlayingBeforeVideo = false;
  }

  // Nạp video tương ứng (1.mp4, 2.mp4, 3.mp4)
  playerVideo.src = "./assets/video/" + videoNum + ".mp4";
  playerVideo.currentTime = 0;

  if (videoTitle) {
    var greeting = giftGreetings[videoNum];
    videoTitle.textContent = greeting ? greeting.title : ("🎁 Món quà đặc biệt số " + videoNum);
  }

  if (rotateModal) {
    rotateModal.classList.remove("open");
  }
  pendingVideoIndex = null;
  pendingGiftElement = null;

  document.body.classList.add("video-playing");
  videoModal.classList.add("open");

  var playPromise = playerVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(function () {
      // User can click native play control if browser requires gesture
    });
  }
}

// Khi video kết thúc, tự động mở khóa món quà tiếp theo
if (playerVideo) {
  playerVideo.addEventListener("ended", function () {
    openedGifts[currentPlayingVideoNum] = true;
    if (currentUnlockedGift === currentPlayingVideoNum && currentUnlockedGift < 3) {
      currentUnlockedGift++;
    }
    updateGiftProgressionUI();
  });
}

function closeGiftVideo() {
  document.body.classList.remove("video-playing");

  if (playerVideo) {
    playerVideo.pause();
    playerVideo.removeAttribute("src");
    playerVideo.load();
  }

  if (videoModal) {
    videoModal.classList.remove("open");
  }

  // Thoát browser fullscreen nếu đang bật
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  // Đánh dấu video đã xem và mở khóa quà tiếp theo
  openedGifts[currentPlayingVideoNum] = true;
  if (currentUnlockedGift === currentPlayingVideoNum && currentUnlockedGift < 3) {
    currentUnlockedGift++;
  }
  updateGiftProgressionUI();

  // Tiếp tục phát nhạc nền nếu trước đó đang phát
  if (audio && wasMusicPlayingBeforeVideo) {
    audio.play().then(updateMusicBtnState).catch(function () {});
  }

  // Cập nhật trạng thái hướng màn hình ngay khi đóng video
  updateOrientationState();
}

function handleGiftClick(videoIndex, element) {
  var num = parseInt(videoIndex, 10) || 1;
  // Nếu hộp quà này chưa được mở khóa, không làm gì
  if (num > currentUnlockedGift) return;

  if (isMobileLandscape()) {
    // Trên mobile đang xoay ngang: nhắc xoay dọc lại màn hình
    pendingVideoIndex = num;
    pendingGiftElement = element;
    if (promptGiftLabel) {
      var greeting = giftGreetings[num];
      promptGiftLabel.textContent = greeting ? greeting.name : ("Món quà " + num);
    }
    if (rotateModal) {
      rotateModal.classList.add("open");
    }
  } else {
    // Trên PC hoặc mobile đã xoay dọc: chạy nhân vật que rồi mở video
    runVectorCharacterToBox(num, element, function () {
      playGiftVideo(num);
    });
  }
}

// Bắt sự kiện xoay màn hình: khi người dùng xoay dọc lại, TỰ ĐỘNG PHÁT VIDEO NGAY LẬP TỨC toàn màn hình
function checkPendingVideoRotation() {
  if (pendingVideoIndex !== null && window.innerHeight > window.innerWidth) {
    var vIndex = pendingVideoIndex;
    pendingVideoIndex = null;
    pendingGiftElement = null;

    if (rotateModal) {
      rotateModal.classList.remove("open");
    }

    // Tự động phát video luôn, không cần thêm bất kỳ bước thao tác hay bấm bảng nào
    playGiftVideo(vIndex);
  }
}

window.addEventListener("resize", checkPendingVideoRotation);
window.addEventListener("orientationchange", function () {
  setTimeout(checkPendingVideoRotation, 100);
  setTimeout(checkPendingVideoRotation, 300);
});

// Nút xem luôn ở màn hình ngang (trong trường hợp người dùng khóa xoay màn hình)
if (btnForcePlay) {
  btnForcePlay.addEventListener("click", function (e) {
    e.stopPropagation();
    if (pendingVideoIndex !== null) {
      var vIndex = pendingVideoIndex;
      var targetEl = pendingGiftElement;
      pendingVideoIndex = null;
      pendingGiftElement = null;

      if (rotateModal) {
        rotateModal.classList.remove("open");
      }

      if (targetEl) {
        runVectorCharacterToBox(vIndex, targetEl, function () {
          playGiftVideo(vIndex);
        });
      } else {
        playGiftVideo(vIndex);
      }
    }
  });
}

// Nút hủy nhắc xoay
if (btnCancelPrompt) {
  btnCancelPrompt.addEventListener("click", function (e) {
    e.stopPropagation();
    pendingVideoIndex = null;
    pendingGiftElement = null;
    if (rotateModal) {
      rotateModal.classList.remove("open");
    }
  });
}

// Đóng video modal (Chỉ đóng khi bấm nút X hoặc phím ESC, tránh văng video khi xoay màn hình chạm phải mép)
if (btnCloseVideo) {
  btnCloseVideo.addEventListener("click", function (e) {
    e.stopPropagation();
    closeGiftVideo();
  });
}

// Bấm phím ESC để đóng modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.keyCode === 27) {
    if (videoModal && videoModal.classList.contains("open")) {
      closeGiftVideo();
    } else if (rotateModal && rotateModal.classList.contains("open")) {
      pendingVideoIndex = null;
      pendingGiftElement = null;
      rotateModal.classList.remove("open");
    } else if (portraitModal && portraitModal.classList.contains("open")) {
      portraitModal.classList.remove("open");
    }
  }
});

// Gán sự kiện click cho các nút hộp quà (cả trên sân khấu chính và modal đọc thư dọc)
$(document).on("click", ".gift-box", function (e) {
  e.stopPropagation();
  var videoIdx = $(this).data("video") || $(this).attr("data-video");
  handleGiftClick(videoIdx, this);
});

// Tree Blossom & Heart Canvas Controller
(function () {
  var canvas = $("#canvas");

  if (!canvas[0].getContext) {
    $("#error").show();
    return false;
  }

  var width = canvas.width();
  var height = canvas.height();
  canvas.attr("width", width);
  canvas.attr("height", height);

  var opts = {
    seed: {
      x: width / 2 - 20,
      color: "rgb(190, 26, 37)",
      scale: 2,
    },
    branch: [
      [ 535, 680, 570, 250, 500, 200, 30, 100,
        [
          [ 540, 500, 455, 417, 340, 400, 13, 100,
            [[450, 435, 434, 430, 394, 395, 2, 40]],
          ],
          [ 550, 445, 600, 356, 680, 345, 12, 100,
            [[578, 400, 648, 409, 661, 426, 3, 80]],
          ],
          [539, 281, 537, 248, 534, 217, 3, 40],
          [ 546, 397, 413, 247, 328, 244, 9, 80,
            [
              [427, 286, 383, 253, 371, 205, 2, 40],
              [498, 345, 435, 315, 395, 330, 4, 60],
            ],
          ],
          [ 546, 357, 608, 252, 678, 221, 6, 100,
            [[590, 293, 646, 277, 648, 271, 2, 80]],
          ],
        ],
      ],
    ],
    bloom: {
      num: 700,
      width: 1080,
      height: 650,
    },
    footer: {
      width: 1200,
      height: 5,
      speed: 10,
    },
  };

  var tree = new Tree(canvas[0], width, height, opts);
  var seed = tree.seed;
  var foot = tree.footer;
  var hold = 1;

  function checkSeedClick(pageX, pageY) {
    var rect = canvas[0].getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    var scrollX = window.pageXOffset || window.scrollX || 0;
    var scrollY = window.pageYOffset || window.scrollY || 0;
    var scale = rect.width / width;

    var canvasX = (pageX - (rect.left + scrollX)) / scale;
    var canvasY = (pageY - (rect.top + scrollY)) / scale;

    // Check pixel hit
    if (seed.hover(canvasX, canvasY)) {
      return true;
    }

    // Touch hit area expansion (85px proximity around heart center for effortless tapping on mobile)
    var heartX = seed.heart.point.x;
    var heartY = seed.heart.point.y;
    var dist = Math.hypot(canvasX - heartX, canvasY - heartY);
    if (dist <= 85) {
      return true;
    }

    return false;
  }

  canvas
    .click(function (e) {
      if (checkSeedClick(e.pageX, e.pageY)) {
        hold = 0;
        canvas.unbind("click touchstart mousemove");
        canvas.removeClass("hand");
        playAudio();
      }
    })
    .on("touchstart", function (e) {
      var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
      if (touch && checkSeedClick(touch.pageX, touch.pageY)) {
        hold = 0;
        canvas.unbind("click touchstart mousemove");
        canvas.removeClass("hand");
        playAudio();
      }
    })
    .mousemove(function (e) {
      var isHover = checkSeedClick(e.pageX, e.pageY);
      canvas.toggleClass("hand", isHover);
    });

  var seedAnimate = eval(
    Jscex.compile("async", function () {
      seed.draw();
      while (hold) {
        $await(Jscex.Async.sleep(10));
      }
      while (seed.canScale()) {
        seed.scale(0.95);
        $await(Jscex.Async.sleep(10));
      }
      while (seed.canMove()) {
        seed.move(0, 2);
        foot.draw();
        $await(Jscex.Async.sleep(10));
      }
    })
  );

  var growAnimate = eval(
    Jscex.compile("async", function () {
      do {
        tree.grow();
        $await(Jscex.Async.sleep(10));
      } while (tree.canGrow());
    })
  );

  var flowAnimate = eval(
    Jscex.compile("async", function () {
      do {
        tree.flower(2);
        $await(Jscex.Async.sleep(10));
      } while (tree.canFlower());
    })
  );

  var moveAnimate = eval(
    Jscex.compile("async", function () {
      tree.snapshot("p1", 240, 0, 610, 680);
      while (tree.move("p1", 500, 0)) {
        foot.draw();
        $await(Jscex.Async.sleep(10));
      }
      foot.draw();
      tree.snapshot("p2", 500, 0, 610, 680);

      canvas
        .parent()
        .css("background", "url(" + tree.toDataURL("image/png") + ")");
      canvas.css("background", "#ffe");
      $await(Jscex.Async.sleep(300));
      canvas.css("background", "none");
    })
  );

  var jumpAnimate = eval(
    Jscex.compile("async", function () {
      var ctx = tree.ctx;
      while (true) {
        tree.ctx.clearRect(0, 0, width, height);
        tree.jump();
        foot.draw();
        $await(Jscex.Async.sleep(33));
      }
    })
  );

  var textAnimate = eval(
    Jscex.compile("async", function () {
      $("#text").addClass("visible-card");
      $("#code").show().typewriter(function () {
        isAnimationFinished = true;
        $("#gift-boxes-stage").addClass("revealed");
        var btnP = document.getElementById("btn-read-portrait");
        if (btnP) {
          btnP.style.display = "flex";
        }
      });
      if ($("#clock-box").length) {
        $("#clock-box").fadeIn(500);
        var together = new Date();
        together.setFullYear(2024, 9, 20);
        together.setHours(0);
        together.setMinutes(0);
        together.setSeconds(0);
        together.setMilliseconds(0);
        while (true) {
          timeElapse(together);
          $await(Jscex.Async.sleep(1000));
        }
      }
    })
  );

  var runAsync = eval(
    Jscex.compile("async", function () {
      $await(seedAnimate());
      $await(growAnimate());
      $await(flowAnimate());
      $await(moveAnimate());

      textAnimate().start();

      $await(jumpAnimate());
    })
  );

  runAsync().start();
})();