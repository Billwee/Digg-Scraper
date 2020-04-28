$(document).ready(function () {
  // $(window).bind("pageshow", function (event) {
  //   if (event.originalEvent.persisted) {
  //     window.location.reload();
  //   }
  // });

  $("#scrape").on("click", (event) => {
    event.preventDefault();

    $.ajax({
      url: "/scrape",
      type: "GET",
      success: (data) => {
        location.reload();
      },
    });
  });

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

  $("#artDiv").on("click", ".save", function (event) {
    event.preventDefault();
    let id = $(this).attr("data-id");
    $.ajax({
      url: `/save/${id}`,
      type: "POST",
      success: (data) => {},
    });
    location.reload();
  });

  $("#saveDiv").on("click", "#writeNoteBtn", function (event) {
    console.log("AWdawd");
    id = $(this).data("id");

    $("#theModal").modal("show");
    $("#saveNoteBtn").show();
    $("#noteSuccess").hide();
    $("#noteFailure").hide();
    $("#saveNoteBtn").attr("data-id", id);
  });

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
              `<button data-id=${element._id} type="button" class="btn btn-danger btn-sm deleteNote">Delete</button>`
            );
          });
        }
      },
    });
  });

  $("#notesModalBody").on("click", ".deleteNote", function (event) {
    let id = $(this).data("id");
    $("#notesModal").modal("hide");
    // $("#myModal").modal("handleUpdate");

    $.ajax({
      url: `/deleteNote/${id}`,
      type: "DELETE",
      success: (data) => {
        console.log(data);
      },
    });
  });

  $("#saveNoteBtn").on("click", function (event) {
    // event.preventDefault();
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

  //READY
});
