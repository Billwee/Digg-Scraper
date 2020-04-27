$(document).ready(function () {
  $("#scrape").on("click", (event) => {
    event.preventDefault();

    // $.get("/scrape", (data) => {
    //   console.log(data);
    //   location.reload();
    // });
    $.ajax({
      url: "/scrape",
      type: "GET",
      success: (data) => {
        console.log(data);
        console.log("wdada");
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

  //READY
});
