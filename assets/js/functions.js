(function($) {
  $.fn.typewriter = function(callback) {
    this.each(function() {
      var root = this;
      var $root = $(this);

      // Thu thập toàn bộ các text node theo đúng thứ tự DOM mà không phá vỡ cấu trúc HTML
      var textQueue = [];
      function walkTextNodes(node) {
        if (node.nodeType === 3) {
          var txt = node.nodeValue;
          if (txt && txt.length > 0) {
            textQueue.push({ node: node, fullText: txt });
            node.nodeValue = "";
          }
        } else if (node.nodeType === 1) {
          for (var i = 0; i < node.childNodes.length; i++) {
            walkTextNodes(node.childNodes[i]);
          }
        }
      }
      walkTextNodes(root);

      if (textQueue.length === 0) {
        if (typeof callback === "function") callback();
        return;
      }

      // Con trỏ nhấp nháy mượt mà
      var cursor = document.createElement("span");
      cursor.className = "typewriter-cursor";
      cursor.textContent = "|";

      var queueIdx = 0;
      var charIdx = 0;
      var speed = 36; // 36ms/ký tự: tốc độ gõ máy chữ tự nhiên, mượt mà và êm ái

      var timer = setInterval(function() {
        if (queueIdx >= textQueue.length) {
          clearInterval(timer);
          if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
          }
          if (typeof callback === "function") {
            callback();
          }
          return;
        }

        var item = textQueue[queueIdx];
        item.node.nodeValue += item.fullText.charAt(charIdx);
        charIdx++;

        // Đặt con trỏ ngay sau text node đang gõ
        if (item.node.parentNode && cursor.parentNode !== item.node.parentNode) {
          item.node.parentNode.insertBefore(cursor, item.node.nextSibling);
        }

        if (charIdx >= item.fullText.length) {
          queueIdx++;
          charIdx = 0;
        }
      }, speed);
    });
    return this;
  };
})(jQuery);

function timeElapse(date) {
  var current = new Date();
  var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
  var days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);
  var hours = Math.floor(seconds / 3600);
  if (hours < 10) hours = "0" + hours;
  seconds = seconds % 3600;
  var minutes = Math.floor(seconds / 60);
  if (minutes < 10) minutes = "0" + minutes;
  seconds = seconds % 60;
  if (seconds < 10) seconds = "0" + seconds;
  var result = "<span class=\"digit\">" + days + "</span> ngày <span class=\"digit\">" + hours + "</span> giờ <span class=\"digit\">" + minutes + "</span> phút <span class=\"digit\">" + seconds + "</span> giây"; 
  $("#clock").html(result);
}
