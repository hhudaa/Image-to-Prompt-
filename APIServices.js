$(document).ready(function () {
  $("#btn-my").click(function () {
    $("#editor").html("");
    var pro = document.getElementById("progress");
    pro.style.display = "block";

    var formData = new FormData();
    var imageFile = $("#imageInput")[0].files[0];

    if (!imageFile) {
      pro.style.display = "none";
      // Display an error message or take further action as needed
      $("#error-image-message")
        .html("⚠️ Select image first")
        .css("color", "red");
      return;
    }

    formData.append("imageFile", imageFile);

    $.ajax({
      url: "http://localhost:5000/api/UploadImage",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        pro.style.display = "none";
        $("#editor").html(response);
      },
      error: function (xhr, status, error) {
        pro.style.display = "none";
        if (xhr.status === 400) {
          console.log("No image file provided");
        } else {
          console.log("Error uploading image:", error);
        }
      },
    });
  });
});
