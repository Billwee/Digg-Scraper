$(document).ready(function () {

  //Fades in "Back to Top" button after scrolling
  $(window).scroll(function () {
    if ($(this).scrollTop() > 400) {
      $('#topBtn').fadeIn();
    } else {
      $('#topBtn').fadeOut();
    }
  });

  //Scrape button click function
  $("#scrape").on("click", (event) => {

    $.ajax({
      url: "/scrape",
      type: "GET",
      success: (data) => {
        location.reload();
      },
    });
  });

  //Clear button click function
  $("#clear").on("click", (event) => {
    event.preventDefault();

    $.ajax({
      url: "/clear",
      type: "DELETE",
      success: (data) => {
        console.log(data);
        location.reload();
      },
    });
  });

  //Click function for saving articles
  $("#artDiv").on("click", ".save", function (event) {
    event.preventDefault();
    let id = $(this).attr("data-id");
    $.ajax({
      url: `/save/${id}`,
      type: "POST",
      success: (data) => {
        location.reload();
      }
    });
  });

  //Click function for showing the modal to write a note on
  //a saved article
  $("#saveDiv").on("click", "#writeNoteBtn", function (event) {
    id = $(this).data("id");

    $("#theModal").modal("show");
    $("#saveNoteBtn").show();
    $("#noteSuccess").hide();
    $("#noteFailure").hide();
    $("#saveNoteBtn").attr("data-id", id);
  });

  //Click function to read notes saved
  $("#saveDiv").on("click", "#readNoteBtn", function (event) {
    $("#notesModal").modal("show");
    $("#notesModalBody").empty();
    id = $(this).data("id");
    $.ajax({
      url: `/notes/${id}`,
      type: "GET",
      success: (data) => {
        if (data.length === 0) {
          $("#notesModalBody").append(`<h3>No Notes Found</h3>`);
        } else {
          data.forEach((element) => {
            $("#notesModalBody").append(`<h3>${element.title}</h3>`);
            $("#notesModalBody").append(`<p>${element.note}</p>`);
            $("#notesModalBody").append(
              `<button data-id=${element._id} type="button" class="btn btn-danger btn-sm deleteNote mb-2">Delete Note</button>`
            );
            $("#notesModalBody").append(`<hr>`);
          });
        }
      },
    });
  });

  //Click function for deleting notes
  $("#notesModalBody").on("click", ".deleteNote", function (event) {
    let id = $(this).data("id");
    $("#notesModal").modal("hide");

    $.ajax({
      url: `/deleteNote/${id}`,
      type: "DELETE",
      success: (data) => {
        console.log(data);
      },
    });
  });

  //Click function for saving notes
  $("#saveNoteBtn").on("click", function (event) {
    let title = $("#noteTitle").val().trim();
    let note = $("#noteText").val().trim();
    let id = $("#saveNoteBtn").data("id");
    $("#noteSuccess").hide();
    $("#noteFailure").hide();

    if (!title || !note) {
      $("#noteFailure").show();
    } else {
      $.ajax({
        url: `/savenote/${id}`,
        type: "POST",
        data: {
          title: title,
          note: note,
          artID: id,
        },
        success: (data) => {
          console.log(data);
          if (data) {
            $("#noteSuccess").show();
            $("#saveNoteBtn").hide();
            setTimeout(function () {
              $("#theModal").modal("hide");
              $("#noteTitle").val("");
              $("#noteText").val("");
            }, 1000);
          }
        },
      });
    }
  });

  // Click function for deleting saved articles
  $("#saveDiv").on("click", ".delete", function (event) {
    let id = $($(this)).data("id");

    $.ajax({
      url: `/delete/${id}`,
      type: "DELETE",
      success: () => {
        console.log("deleted");
        location.reload();
      },
    });
  });

});
