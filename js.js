function clearTextArea() {
  var editor = document.getElementById("editor");
  editor.textContent = "";
}

//-----------------------------------------------------------------------------

//copied all text
const btnCopyAll = document.getElementById("btnCopiedAll");
const tooltip = document.getElementById("myTooltip");

btnCopyAll.addEventListener("click", () => {
  var editor = document.getElementById("editor");
  var textarea = document.createElement("textarea");
  textarea.value = editor.textContent;
  console.log(textarea.value);
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  // Show the tooltip
  tooltip.innerHTML = "Text Copied!";
  tooltip.style.visibility = "visible";
  // Hide the tooltip after 3 seconds
  setTimeout(() => {
    tooltip.style.visibility = "hidden";
  }, 3000);
});

tooltip.style.visibility = "hidden";
//-----------------------------------------------------------------------------

// popup handlers for share
let popupshare = document.getElementById("pop-share");
let popupexport = document.getElementById("pop-export");
let currentPopup = null;

function openPopupShare() {
  closeCurrentPopup();
  // sharing buttons
  const link = encodeURI(window.location.href);
  var editor = document.getElementById("editor");
  var textarea = document.createElement("textarea");
  textarea.value = editor.textContent;
  const msg = encodeURIComponent(
    "Hey, I generated this amazing caption using ImageSpeak read now:" +
      textarea.value
  );
  const title = encodeURIComponent("ImageSpeak Tool");

  const fb = document.querySelector(".facebook");
  fb.href = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.SDIPrompts.com.pk%2F&title=Read%20Now&quote=${msg}`;

  const twitter = document.querySelector(".twitter");
  twitter.href = `http://twitter.com/share?&url=${link}&text=${msg}&hashtags=javascript,programming`;

  const reddit = document.querySelector(".reddit");
  reddit.href = `http://www.reddit.com/submit?url=${link}&title=${title}`;

  const whatsapp = document.querySelector(".whatsapp");
  whatsapp.href = `https://api.whatsapp.com/send?text=${msg}: ${link}`;

  const telegram = document.querySelector(".telegram");
  telegram.href = `https://telegram.me/share/url?url=${link}&text=${msg}`;

  popupshare.classList.add("open-popup");
  currentPopup = popupshare;
}

function closePopup() {
  popupshare.classList.remove("open-popup");
}

// popup handlers for export
const pdfBtn = document.getElementById("pdf-btn");
const docBtn = document.getElementById("doc-btn");
const textBtn = document.getElementById("text-btn");
const textarea = document.querySelector("editorCopy");

// popup export
function openPopupExport() {
  closeCurrentPopup();
  pdfBtn.addEventListener("click", () => {
    var editor = document.getElementById("editor");
    var text = editor.textContent;
    var encodedtext = encodeURIComponent(text);

    const blob = new Blob([encodedtext], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "sdiprompts-pdf-output";
    link.href = fileUrl;
    link.click();
  });

  docBtn.addEventListener("click", () => {
    var editor = document.getElementById("editor");
    var text = editor.textContent;
    var encodedtext = encodeURIComponent(text);

    const blob = new Blob([encodedtext], { type: "application/msword" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "sdiprompts-doc-output";
    link.href = fileUrl;
    link.click();
  });

  textBtn.addEventListener("click", () => {
    var editor = document.getElementById("editor");
    var text = editor.textContent;
    const blob = new Blob([text], { type: "text/plain" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "sdiprompts-txt-output";
    link.href = fileUrl;
    link.click();
  });

  popupexport.classList.add("open-popup-export");
  currentPopup = popupexport;
}

function closeCurrentPopup() {
  if (currentPopup) {
    currentPopup.classList.remove("open-popup");
    currentPopup = null;
  }
}

function closePopup() {
  closeCurrentPopup();
}

function closePopupExport() {
  popupexport.classList.remove("open-popup-export");
}

//text editor
jQuery(document).ready(function ($) {
  $("#editControls a").click(function (e) {
    e.preventDefault();
    switch ($(this).data("role")) {
      case "h1":
      case "h2":
      case "h3":
      case "p":
        document.execCommand("formatBlock", false, $(this).data("role"));
        break;
      default:
        document.execCommand($(this).data("role"), false, null);
        break;
    }

    var textval = $("#editor").html();
    $("#editorCopy").val(textval);
  });

  $("#editor")
    .keyup(function () {
      var value = $(this).html();
      $("#editorCopy").val(value);
    })
    .keyup();

  $("#checkIt").click(function (e) {
    e.preventDefault();
    alert($("#editorCopy").val());
  });
});
