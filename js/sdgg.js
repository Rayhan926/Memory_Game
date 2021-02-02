$(document).click(function () {
  $(".game_parent_wrap").toggleClass("start");
  $(".game_options_box").slideToggle(200);
  $(".game_start_box").slideToggle(200);
  setTimeout(() => {
    $(".game_board_wrap").slideToggle(200);
  }, 600);
});
let form = document.querySelector(".player_name_form");
let player_1, player_2, game_label;
let p_1_name = document.querySelector(".p_1_name");
let p_1_point = document.querySelector(".p_1_point");
let p_2_name = document.querySelector(".p_2_name");
let p_2_point = document.querySelector(".p_2_point");
let turnIs = 1;
let openCount = 0;
let box_array = [];
let attempt_1 = "";
let attempt_2 = "";

$(".restart_game_btn").click(function () {
  $(".game_over_box").css({ display: "none" });
  $(".game_img_wrap").html("");
  $(".p_1_point").text("0");
  $(".p_2_point").text("0");
  box_array = [];
  turnIs = 1;
  openCount = 0;
  attempt_1 = "";
  attempt_2 = "";
  start_game();
});

$(".back_btn").click(function () {
  $(".game_over_box").css({ display: "none" });
  $(".game_img_wrap").html("");
  $(".p_1_point").text("0");
  $(".p_2_point").text("0");
  box_array = [];
  turnIs = 1;
  openCount = 0;
  attempt_1 = "";
  attempt_2 = "";
  $(".game_start_window_wrap").css({
    display: "flex",
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  validation_init();
  let player_1_inp = document.querySelector(".player_1");
  let player_2_inp = document.querySelector(".player_2");
  let game_label_inp = document.querySelector(".game_label");

  required(player_1_inp, "Player 1 name is required");
  required(player_2_inp, "Player 2 name is required");
  required(game_label_inp, "Please select a label");

  if (is_validate()) {
    player_1 = player_1_inp.value;
    p_1_name.textContent = player_1;
    player_2 = player_2_inp.value;
    p_2_name.textContent = player_2;
    game_label = game_label_inp.value;

    start_game();
  }
});

let prev = "";
$(document).on("click", ".img_box", function (e) {
  let img_bx = $(".img_box");
  let thisElm = $(e.target).parent();
  let thisElmData = thisElm.data("atmpt");
  if (!thisElm.hasClass("opened")) {
    thisElm.addClass("opened");
    openCount++;

    if (attempt_1 == "") {
      attempt_1 = thisElmData;
      prev = thisElm;
    } else {
      attempt_2 = thisElmData;
    }
    if (attempt_1 == attempt_2) {
      prev.addClass("hide_box");
      thisElm.addClass("hide_box");
      attempt_1 = "";
      attempt_2 = "";
      increase_point();
    }
    if (openCount >= 2 && attempt_1 != attempt_2) {
      change_player(turnIs);
    }
    if (openCount >= 2) {
      openCount = 0;
      attempt_1 = "";
      attempt_2 = "";
      img_bx.css({
        pointerEvents: "none",
      });
      setTimeout(() => {
        img_bx.removeClass("opened");
        img_bx.css({
          pointerEvents: "all",
        });

        let open = $(".img_box.hide_box").length;
        let closed = $(".img_box").length;
        if (open > 0 && closed > 0 && open == closed) {
          // alert("Game Over");

          game_over();
        }
      }, 600);
    }
  }
});

function change_player(e) {
  if (e === 1) {
    turnIs = 2;
    $(".first_player_wrap").removeClass("turnOn");
    $(".second_player_wrap").addClass("turnOn");
  } else {
    turnIs = 1;
    $(".first_player_wrap").addClass("turnOn");
    $(".second_player_wrap").removeClass("turnOn");
  }
}

function increase_point() {
  if (turnIs == 1) {
    let pointElm = $(".first_player_wrap .p_1_point");
    pointElm.text(Number(pointElm.text()) + 1);
  } else {
    let pointElm = $(".second_player_wrap .p_2_point");
    pointElm.text(Number(pointElm.text()) + 1);
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function create_box(forEveryLoop, loopCount) {
  let start, d, i;
  for (start = 1; start <= loopCount; start++) {
    for (i = 1; i <= forEveryLoop; i++) {
      box_array.push(
        '<div class="img_box" data-atmpt="' +
          i +
          '"><img src="./img/' +
          i +
          '.jpg" /></div>'
      );
    }
    for (d = forEveryLoop; d >= 1; d--) {
      box_array.push(
        '<div class="img_box"  data-atmpt="' +
          d +
          '"><img src="./img/' +
          d +
          '.jpg" /></div>'
      );
    }
  }
}

function game_over() {
  let p_1_pointIS = Number($(".first_player_wrap .p_1_point").text());
  let p_2_pointIS = Number($(".second_player_wrap .p_2_point").text());
  let p_1_res = player_1 + ": " + p_1_pointIS + " Points";
  let p_2_res = player_2 + ": " + p_2_pointIS + " Points";
  $(".game_over_box .res_1_is").text(p_1_res);
  $(".game_over_box .res_2_is").text(p_2_res);

  if (p_1_pointIS > p_2_pointIS) {
    $(".winPlayer_name").text(
      `${player_1} is win by ${p_1_pointIS - p_2_pointIS} Points`
    );
  } else if (p_1_pointIS < p_2_pointIS) {
    $(".winPlayer_name").text(
      `${player_2} is win by ${p_2_pointIS - p_1_pointIS} Points`
    );
  } else if (p_1_pointIS == p_2_pointIS) {
    $(".winPlayer_name").text("Draw Match");
  }
  $(".game_over_box").css({ display: "flex" });
}

function start_game() {
  $(".first_player_wrap").addClass("turnOn");

  if (game_label == "1") {
    create_box(10, 2);
    create_box(2, 3);
    create_box(1, 1);
  } else if (game_label == "2") {
    create_box(18, 1);
    create_box(4, 2);
    create_box(1, 1);
  } else if (game_label == "3") {
    create_box(26, 1);
    create_box(1, 1);
  }

  let random_box = shuffle(box_array);
  random_box.forEach(function (box) {
    $(".game_img_wrap").append(box);
  });

  $(".game_start_window_wrap").css({
    display: "none",
  });
  $(".game_over_box").css({ display: "none" });
}
