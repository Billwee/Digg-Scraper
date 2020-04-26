$("#scrape").on("click", (event) => {
  event.preventDefault();

  $.get("/scrape", (data) => {
    console.log(data);
    location.reload();
  });
});

$("#clear").on("click", (event) => {
  event.preventDefault();

  $.ajax({
    url: "/clear",
    type: "DELETE",
    success: function (data) {
      console.log(data);
      location.reload();
    },
  });
});
