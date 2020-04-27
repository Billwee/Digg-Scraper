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

  $("#artDiv").on("click", ".save", (event) => {
    event.preventDefault();
    let id = $(this).attr("data-id");

    console.log($(this).data("id"));
    console.log($(this).attr(""));
    console.log(id);
    console.log($(this));
  });

  $(".save").on("click", (event) => {
    event.preventDefault();
    let id = $(this).attr("data-id");

    console.log($(this).data("id"));
    console.log($(this).attr(""));
    console.log("wadadaw");
    console.log($(this).attr("data-id"));
  });

  //READY
});
