$(document).ready(function () {
  $(".dp_dwn_clck").click(function () {
    $(".dp_dwn_clck").removeClass("show_dp_dwn");
    $(this).addClass("show_dp_dwn");
  });

  $(".option_ul li").click(function () {
    let val = $(this).data("value");
    let txt = $.trim($(this).text());
    if (val != "x") {
      $(this)
        .parent()
        .parent()
        .parent()
        .find("[data-selected]")
        .attr("data-selected", val);
      $(this).parent().parent().parent().find("[data-selected]").text(txt);
      setTimeout(() => {
        $(".dp_dwn_clck").removeClass("show_dp_dwn");
      }, 10);
    } else {
      setTimeout(() => {
        $(".dp_dwn_clck").removeClass("show_dp_dwn");
      }, 10);
      $(".custom_player_input_box_overly").css({ display: "flex" });
      $(".custom_player_input").focus();
    }
  });

  $(".custom_player_submit").submit(function (e) {
    e.preventDefault();
    let cstmVal = $.trim($(".custom_player_input").val());
    var numberRegex = /^\d+$/;

    if (cstmVal == "" || !numberRegex.test(cstmVal)) {
      pop_error("Please put a number");
    } else if (Number(cstmVal) <= 0) {
      pop_error("Player must be bigger then 0");
    } else {
      $(".error_box").html("");
      $(".player_selected_span").attr("data-selected", cstmVal);
      $(".player_selected_span").text(
        `${cstmVal} ${cstmVal <= 1 ? "Player" : "Players"}`
      );
      $(".custom_player_input_box_overly").css({ display: "none" });
      $(".custom_player_input").val("");
    }
  });

  $(document).on("click", function (e) {
    outside_close(".dp_dwn_clck", ".dp_dwn_clck", "show_dp_dwn", e);
  });
  $(".close_popup").click(function () {
    $(".custom_player_input_box_overly").css({ display: "none" });
  });
  $(document).on("click", function (e) {
    if (e.target.classList == "custom_player_input_box_overly") {
      $(".custom_player_input_box_overly").css({ display: "none" });
    }
  });

  let gamePlayer,
    gameLabel,
    gameTiles,
    completeTiles = 0,
    storeAllTiles = [],
    openedCount = 0,
    opened1 = "",
    opened2 = "",
    currentPlayer = 1;

  $(".start_game_btn").click(function () {
    resetVariables();

    let errorArr = [];
    uniqueId = 1;
    $("[data-selected]").each(function () {
      if ($(this).attr("data-selected") == "") {
        $(this).parent().addClass("shake_elm");
        setTimeout(() => {
          $(this).parent().removeClass("shake_elm");
        }, 500);
        errorArr.push("error");
      }
    });
    if (errorArr.length === 0) {
      $(".loader").addClass("show");
      gamePlayer = getDataVal(".player_selected_span");
      gameLabel = getDataVal(".player_selected_label");
      gameTiles = getDataVal(".player_selected_tiles");
      createPlayer();
      createTiles();
      startGame();
    }
  });

  function showTooltip() {
    setTimeout(() => {
      let pointBox = $(".player_count_1");
      let pointBoxOffset = pointBox.offset();
      let fromTop = pointBoxOffset.top + pointBox.height() + 20;
      let fromLeft = pointBoxOffset.left + 22;

      $(".change_name_tooltip_box")
        .css({
          top: fromTop + "px",
          left: fromLeft + "px",
        })
        .addClass("show");
      setTimeout(() => {
        $(".change_name_tooltip_box").removeClass("show");
      }, 2000);
    }, 2000);
  }

  let prevTile = "";
  $(document).on("click", ".game_tile_box", function () {
    if (!$(this).hasClass("opened_tile")) {
      $(this).addClass("opened_tile");
      countMoves(currentPlayer);
      openedCount++;
      let openIdData = Number($(this).attr("data-openid"));
      opened1 == ""
        ? ((opened1 = openIdData), (prevTile = $(this)))
        : (opened2 = openIdData);

      if (openedCount >= 2) {
        if (opened1 === opened2 && opened1 !== "" && opened2 !== "") {
          tilesMatched();
          setTimeout(() => {
            animateTiles([$(this), prevTile]);
          }, 400);
        } else {
          changePlayer();
          setTimeout(() => {
            $(".game_tile_box").removeClass("opened_tile");
          }, 500);
        }

        opened1 = "";
        opened2 = "";
        openedCount = 0;
      }
    }
  });

  function countMoves(currentPlyr) {
    let currentMoves = Number(
      $(".player_count_" + currentPlyr + " .player_moves").text()
    );
    let plusOne = currentMoves + 1;
    $(".player_count_" + currentPlyr + " .player_moves").text(plusOne);
  }

  $(".backBtn").click(function () {
    $(".moreOptions_wrap").removeClass("show");
    $(".game_options_box, .game_start_box, .game_tiles_parent_wrap").slideDown(
      200
    );
    $(".game_parent_wrap").removeClass("start");
    $(".game_board_wrap, .game_over_wrap").slideUp(200);
  });

  $(".restartBtn").click(function () {
    restartGame();
  });

  function createTiles() {
    $(".game_tiles_wrap").html("");
    if (gameLabel == "1") {
      let fixedZero = Number((gameTiles / 6).toFixed(0));
      create_box(fixedZero, 3);
    } else if (gameLabel == 2) {
      let fixedTwo = Number((gameTiles / 4).toFixed(0));
      create_box(fixedTwo, 2);
    } else {
      create_box(gameTiles / 2, 1);
    }

    fillArray();
  }

  function startGame() {
    $(".game_options_box, .game_start_box").slideToggle(200);
    $(".game_parent_wrap").addClass("start");
    $(".game_tiles_wrap").append(shuffle(storeAllTiles));
    $(".player_count_1").addClass("active");
    setTimeout(() => {
      $(".game_tiles_wrap")
        .imagesLoaded()
        .done(function () {
          $(".game_board_wrap").slideToggle(200);
          $(".loader").removeClass("show");
          $(".moreOptions_wrap").addClass("show");
          showTooltip();
          // countdownTimeStart();
        });
    }, 500);
    storeAllTiles = [];
  }

  function restartGame() {
    $(".game_board_wrap, .game_over_wrap").slideUp(200);
    $(".loader").addClass("show");
    $(".moreOptions_wrap").removeClass("show");
    $(".player_box .player_points, .player_box .player_moves").text("0");

    resetVariables();
    createTiles();
    $(".game_tiles_wrap").append(shuffle(storeAllTiles));
    $(".player_count_1").addClass("active");
    $(".game_tiles_parent_wrap").slideDown(100);
    setTimeout(() => {
      $(".game_tiles_wrap")
        .imagesLoaded()
        .done(function () {
          $(".game_board_wrap").slideDown(200);
          $(".loader").removeClass("show");
          $(".moreOptions_wrap").addClass("show");
          showTooltip();
          // countdownTimeStart();
          storeAllTiles = [];
        });
    }, 500);
  }

  // let interVal;
  // function countdownTimeStart() {
  //   var countDownDate = new Date().getTime();
  //   interVal = setInterval(function () {
  //     var now = new Date().getTime();

  //     var distance = now - countDownDate;

  //     var hours = Math.floor(
  //       (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //     );
  //     var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //     if (hours > 0) $(".hourSpan").text(hours + "h : ");
  //     if (minutes > 0) $(".minuteSpan").text(minutes + "m : ");
  //     seconds >= 0 ? $(".secondSpan").text(seconds + "s") : null;
  //   }, 1000);
  // }

  function animateTiles(animateElmnts) {
    animateElmnts.forEach(function (elmmt) {
      let elm = ".unique_" + elmmt.attr("data-uniqueid");

      $(elm).css({
        zIndex: "99999",
        pointerEvents: "none",
      });
      let pointBoxOffset = $(".player_count_" + currentPlayer).offset();

      let tileOffset = $(elm).offset();

      let translateY_Is = pointBoxOffset.top - tileOffset.top;
      let translateX_Is = pointBoxOffset.left - tileOffset.left;

      let tl = anime.timeline({
        duration: 200,
        easing: "linear",
      });
      tl.add({
        targets: elm,
        translateY: 0,
        translateX: 0,
        scale: 2,
        duration: 100,
      }).add(
        {
          targets: elm,
          translateY: translateY_Is,
          translateX: translateX_Is,
          scale: 0,
        },
        "+=200"
      );
    });
  }

  function tilesMatched() {
    setTimeout(() => {
      let currentPointElm = $(
        ".player_count_" + currentPlayer + " .player_points"
      );
      let currentPointIs = Number(currentPointElm.text());
      let increasePoint = currentPointIs + 1;
      currentPointElm.text(increasePoint);
      completeTiles += 2;
      if (gameTiles === completeTiles) {
        setTimeout(() => {
          gameOver();
        }, 1000);
      }
    }, 200);
  }

  function gameOver() {
    $(".win_title").text("");
    // clearInterval(interVal);
    let allPoints = [];
    $(".player_box .player_points").each(function () {
      let eachPoint = Number($(this).text());
      allPoints.push(eachPoint);
    });
    let maxPoint = Math.max.apply(null, allPoints);
    if (allPoints.length <= 2 && allPoints[0] === allPoints[1]) {
      $(".win_title").text("This Match is Draw");
    } else {
      allPoints.forEach(function (point, index) {
        if (point === maxPoint) {
          let plusOne = index + 1;
          let playerName = $(
            ".player_count_" + plusOne + " .player_name input"
          ).val();
          $(".win_title").append(playerName + " ");
        }
      });
      $(".win_title").append("is Win");
    }
    $(".game_tiles_parent_wrap").slideToggle(300);
    $(".game_over_wrap").slideToggle(400);
  }

  // function findDuplicates(arr) {
  //   let sorted_arr = arr.slice().sort();
  //   let results = [];
  //   for (let i = 0; i < sorted_arr.length - 1; i++) {
  //     if (sorted_arr[i + 1] == sorted_arr[i]) {
  //       results.push(sorted_arr[i]);
  //     }
  //   }
  //   return results;
  // }

  function resetVariables() {
    $(".hourSpan, .minuteSpan, .secondSpan").text("");
    completeTiles = 0;
    openedCount = 0;
    opened1 = "";
    opened2 = "";
    currentPlayer = 1;
  }

  function changePlayer() {
    $(".player_box").removeClass("active");
    let nextPlayer = currentPlayer + 1 > gamePlayer ? 1 : currentPlayer + 1;
    currentPlayer = nextPlayer;
    $(".player_count_" + nextPlayer).addClass("active");
  }

  function createPlayer() {
    $(".game_players_wrap").html("");
    for (let i = 1; i <= gamePlayer; i++) {
      $(".game_players_wrap").append(
        `<div class="player_box player_count_${i}"><div class="player_points">0</div><div class="player_name"> <input type="text" placeholder="Name" value="Player ${i}" /></div><div class="player_moves"></div></div>`
      );
    }
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array.join("\n");
  }

  function fillArray() {
    let arrLen = storeAllTiles.length;
    if (arrLen < gameTiles) {
      let lessNum = (gameTiles - arrLen) / 2;
      create_box(lessNum, 1);
    } else if (arrLen > gameTiles) {
      let moreNum = (arrLen - gameTiles) / 2;
      for (let s = 1; s <= moreNum; s++) {
        storeAllTiles.shift();
        storeAllTiles.pop();
      }
    }
  }

  let uniqueId = 1;
  function create_box(forEveryLoop, loopCount) {
    let start,
      f,
      i,
      limit = 50,
      randomStart,
      randomEnd;
    if (gameLabel != 3) {
      randomStart = Math.floor(Math.random() * limit);
      if (forEveryLoop + randomStart < limit) {
        randomEnd = forEveryLoop + randomStart;
      } else {
        randomStart = 1;
        randomEnd = randomStart + forEveryLoop;
      }
    } else {
      randomStart = 1;
      randomEnd = randomStart + forEveryLoop;
    }

    for (start = 1; start <= loopCount; start++) {
      for (i = randomStart; i < randomEnd; i++) {
        storeAllTiles.push(
          `<div class="game_tile_box unique_${uniqueId}" data-uniqueid = '${uniqueId}' data-openid = '${i}'><div class="game_tile_img_box"> <img src="./img/${i}.jpg" alt="" /></div><div class="game_tile_top_part"></div></div>`
        );
        uniqueId++;
      }
      for (f = randomStart; f < randomEnd; f++) {
        storeAllTiles.push(
          `<div class="game_tile_box unique_${uniqueId}" data-uniqueid = '${uniqueId}' data-openid = '${f}'><div class="game_tile_img_box"> <img src="./img/${f}.jpg" alt="" /></div><div class="game_tile_top_part"></div></div>`
        );
        uniqueId++;
      }

      // for (d = randomEnd - 1; d >= randomStart; d--) {
      //   storeAllTiles.push(
      //     `<div class="game_tile_box unique_${uniqueId}" data-uniqueid = '${uniqueId}' data-openid = '${d}'><div class="game_tile_img_box"> <img src="./img/${d}.jpg" alt="" /></div><div class="game_tile_top_part"></div></div>`
      //   );
      //   uniqueId++;
      // }
    }
  }

  function outside_close(click_on, close_to, close_class, e) {
    var trigger = $(click_on);
    if (trigger !== e.target && trigger.has(e.target).length === 0) {
      $(close_to).removeClass(close_class);
    }
  }

  function pop_error(error) {
    $(".error_box").html(`<p>${error}</p>`);
  }

  function getDataVal(elmName, dataName) {
    let dtName = dataName ? dataName : "selected";
    return Number($(elmName).attr("data-" + dtName));
  }

  // /**
  //  *
  //  *
  //  * End jQuery
  //  *
  //  *
  //  */
});
