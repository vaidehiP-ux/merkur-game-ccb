

$(document).ready(function() {

    //declare selector dropdowns
    var displayContainer = $(".js-container-filter");
    var displaySports = $(".js-sport-filter");
    var displayCountry = $(".js-country-filter");
    var displayLeague = $(".js-league-filter");
    var displayUrl = $(".js-url-filter");
    var displayLanguage = $(".js-language-filter");
    var gameDropdownResources = $(".js-game-dropdown");


    //Global Variables
    var gameResult = [];
    var filterResult = [];
    var selectedUrl = "";
    var selectedLanguage = "";
    var requestParam = "";
    var targetSportId = "";
    const urlFilterArray = [ {url: "https://www.merkur-sports.de"}, {url: "https://www.betcenter.be"}, {url: "https://www.cashpoint.at"},{url: "https://www.cashpoint.dk"} ];
    const languageFilterArray = [ {type: "de"}, {type: "en"}, {type: "nl"}, {type: "fr"} ];
    const MARKET_TEXT = [
      {
        type: "Soccer",
        da: "Hvem vinder kampen?",
        de: "Wer gewinnt das Spiel?",
        en: "Who will win the match?",
        fr: "Qui remportera le match?",
        nl: "Wie wint de wedstrijd?",
        pl: "Wynik meczu?"
      }, {
        type: "Tennis",
        da: "Hvem vinder kampen?",
        de: "Wer gewinnt das Spiel?",
        en: "Who will win the match?",
        fr: "Qui va gaganer le match?",
        nl: "Wie wint het spel?",
        pl: "Wynik meczu?"
      }, {
        type: "Basketball",
        da: "Vinder (inkl. OT)",
        de: "Sieg (inkl. OT)",
        en: "Win (incl. OT)",
        fr: "Victoire (incl. OProlong.)",
        nl: "Winst (incl. OT)",
        pl: "Końcowe zwycięstwo"
      }, {
        type: "Football",
        da: "Hvem vinder kampen?",
        de: "Wer gewinnt das Spiel?",
        en: "Who will win the match?",
        fr: "Qui va gaganer le match?",
        nl: "Wie wint het spel?",
        pl: "Wynik meczu?"
      }
      
    ];

    //initializations
    $("#game-dropdown").hide();
    $("#selection-result").hide();
    $("#incorrect-selection-container").hide();
    $("#btnClearText").hide();
    document.getElementById("btnClearText").innerHTML = "";
    $("#sport-filter").attr('disabled',false);
    $("#country-filter").attr('disabled',false);
    $("#container-filter").attr('disabled',false);
    $("#league-filter").attr('disabled',false);
    
    
    $('#container-filter').change(onChangeEvent);
    $('#country-filter').change(onChangeEvent);
    $('#sport-filter').change(onChangeEvent);
    $('#league-filter').change(onChangeEvent);
    $('#url-filter').change(languageValidation);
    $('#language-filter').change(languageValidation);
    

    //get Merkur feed filters
    $.ajax({
      type: "GET",
      url: "https://www.cashpoint.com/blog/ajax/salesforce/marketing-cloud/en/getFilters",
      success: function(result) {

        console.log(result);
        filterResult = result;

        //Feed selector: member variables
        var containerOutput = "<option></option>";
        var sportOutput = "<option></option>";
        var countryOutput = "<option></option>";
        var leagueOutput = "<option></option>";
       
       //Container-dropdown
        for (var i in result.containers) {
          containerOutput +=
            "<option value='" +
            result.containers[i].name +
            "' data-Name='" +
            result.containers[i].name +
            "' data-filter-id='" +
            result.containers[i].id +
            "'>" +
            result.containers[i].name +
            "</option>";
        }
        displayContainer.html(containerOutput);


        //Sports-dropdown
        for (var i in result.sports) {
          sportOutput +=
            "<option value='" +
            result.sports[i].name +
            "' data-Name='" +
            result.sports[i].name +
            "' data-filter-id='" +
            result.sports[i].id +
            "'>" +
            result.sports[i].name +
            "</option>";
        }
        displaySports.html(sportOutput);


        //Countries-dropdown
        for (var i in result.countries) {
          countryOutput +=
            "<option value='" +
            result.countries[i].name +
            "' data-Name='" +
            result.countries[i].name +
            "' data-filter-id='" +
            result.countries[i].id +
            "'>" +
            result.countries[i].name +
            "</option>";
        }
        displayCountry.html(countryOutput);


        //Leagues-dropdown
        for (var i in result.leagues) {
          leagueOutput +=
            "<option value='" +
            result.leagues[i].name +
            "' data-Name='" +
            result.leagues[i].name +
            "' data-filter-id='" +
            result.leagues[i].id +
            "'>" +
            result.leagues[i].name +
            "</option>";
        }
        displayLeague.html(leagueOutput);

        
      }
    });


    var urlOutput = "<option></option>";
    var languageOutput = "<option></option>";

    //Base Url-dropdown
    for (var i in urlFilterArray) {
      urlOutput +=
        "<option value='" +
        urlFilterArray[i].url +
        "' data-Name='" +
        urlFilterArray[i].url +
        "'>" +
        urlFilterArray[i].url +
        "</option>";
    }
    displayUrl.html(urlOutput);

    //Language-dropdown
    for (var i in languageFilterArray) {
      languageOutput +=
        "<option value='" +
        languageFilterArray[i].type +
        "' data-Name='" +
        languageFilterArray[i].type +
        "'>" +
        languageFilterArray[i].type +
        "</option>";
    }
    displayLanguage.html(languageOutput);

    //Dropdown: custom CSS
    $('.js-container-select').select2({
      placeholder: 'Select an option',
      width: '100%',
    });
    $('.js-game-select').select2({
      placeholder: 'Select an option',
      width: '100%'
    });
    $('.js-sport-select').select2({
      placeholder: 'Select an option',
      width: '100%',
      margin: '20px'
    });
    $('.js-country-select').select2({
      placeholder: 'Select an option',
      width: '100%'
    });
    $('.js-league-select').select2({
      placeholder: 'Select an option',
      width: '100%'
    });
    $('.js-url-select').select2({
      placeholder: 'Select an option',
      width: '100%'
    });
    $('.js-language-select').select2({
      placeholder: 'Select an option',
      width: '100%'
    });

   

    


  function onChangeEvent() {

    //if exist already clear fields
    if (document.getElementById('game-select').value) {
      document.getElementById("btnClearText").innerHTML = "Clear all fields to begin feed selection";
      $("#btnClearText").show();
    } else {
      if(document.getElementById('container-filter').value) {
        var targetItem = $(this).find(':selected');

        $(".btn-causas .active input").attr('d')

        var targetId = targetItem.attr("data-filter-id");
        requestParam = "containerId=" + targetId;
        $("#sport-filter").attr('disabled',true);
        $("#country-filter").attr('disabled',true);
        $("#league-filter").attr('disabled',true);
        languageValidation();
      } else if ( (document.getElementById('sport-filter').value) ) {
        if (targetSportId === "") {
          var targetItem = $(this).find(':selected');
          targetSportId = targetItem.attr("data-filter-id");
        }

        //check for dependeant feed
        if((document.getElementById('country-filter').value)) {
          $(".js-country-select").each(function() {
            $(this).siblings(".select2-container").removeClass( 'border' );
          });

          var targetItem = $(this).find(':selected');
          var targetCountryId = targetItem.attr("data-filter-id");
          requestParam = "sportId=" + targetSportId + "|" + "countryId=" + targetCountryId;
          languageValidation();
        } else {
          //alert("Please select country to meet feed criteria");
          $(".js-country-select").each(function() {
            $(this).siblings(".select2-container").addClass( 'border' );
          });
        }
        $("#container-filter").attr('disabled',true);
        $("#league-filter").attr('disabled',true);
      } else if (document.getElementById('league-filter').value) {
        var targetItem = $(this).find(':selected');
        var targetId = targetItem.attr("data-filter-id");
        requestParam = "leagueIds=" + targetId;
        languageValidation();
        $("#sport-filter").attr('disabled',true);
        $("#country-filter").attr('disabled',true);
        $("#container-filter").attr('disabled',true);
      }
    }
  }

  function languageValidation() {
    var targetLanguage;

    if (document.getElementById('game-select').value) {
      document.getElementById("btnClearText").innerHTML = "Clear all fields to begin feed selection";
      $("#btnClearText").show();
    } else {
    if (!requestParam) {
      //alert("Please select either one of the above three options['Conatiner' OR 'Sport And Country' OR 'League'] to meet filter creiteria");
      $(".selections").each(function() {
        $(this).siblings(".select2-container").addClass( 'border' );
      });
    } else {
      if(!(document.getElementById('url-filter').value) || !(document.getElementById('language-filter').value)) {
      //alert("Please select Base Url to meet feed criteria");
      $(".js-url-select").each(function() {
        $(this).siblings(".select2-container").addClass( 'border' );
      });
      $(".js-language-select").each(function() {
        $(this).siblings(".select2-container").addClass( 'border' );
      });
      } else {
        //clear CSS
        $(".js-url-select").each(function() {
          $(this).siblings(".select2-container").removeClass( 'border' );
        });
        $(".js-language-select").each(function() {
          $(this).siblings(".select2-container").removeClass( 'border' );
        });
        var targetItem = $(this).find(':selected');
        targetLanguage = targetItem.attr("data-name");
        selectedUrl = document.getElementById('url-filter').value
        getGameData(requestParam, targetLanguage, selectedUrl);
      }
    }
  }
  }

  function getGameData(requestObject, languageParam, selectedUrl) {

    console.log("gamedata: ", requestObject, languageParam, selectedUrl);

    //initialization
    $("#incorrect-selection-container").hide();
    document.getElementById("noRecordText").innerHTML = ";"
    $.ajax({
      type: "GET",
      url: "https://www.cashpoint.com/blog/ajax/salesforce/marketing-cloud/" + languageParam + "/getGames/" + requestObject,
      success: function(result) {
        if (result.length > 0) {
          console.log(result);
         
          gameResult = result;
          var gameOutput = "<option></option>";
         
          for (var i in result) {
            gameOutput +=
              "<option value='" +
              result[i].teams[0].name +
              "-" +
              result[i].teams[1].name +
              "' data-Name='" +
              result[i].teams[0].name +
              "-" +
              result[i].teams[1].name +
              "' data-id='" +
              result[i].id +
              "' data-gameInfo='" +
              result[i].gameInfo.score +
              "' data-leagueInfo='" +
              result[i].leagueInfo.name +
              "'>" +
              result[i].teams[0].name +
              " - " +
              result[i].teams[1].name +
              "</option>";
          }
          gameDropdownResources.html(gameOutput);
          $(".js-game-select").each(function() {
            $(this).siblings(".select2-container").addClass( 'border' );
          });
           $("#game-dropdown").show();
         } else {
            document.getElementById("errorText").innerHTML = result.status? result.status: "No games found";
            document.getElementById("noRecordText").innerHTML = "Try selecting a different combimation of either 'Container', 'Sport and Country' or 'League'. Hit clear to enable a new selection";
            $("#incorrect-selection-container").show();
          
         }
      }
    });
  }

  $("#btnClear").click(function(){
    $("#country-filter").val($("#country-filter option:first").val());
    $("#sport-filter").val($("#sport-filter option:first").val());
    $("#country-filter").val($("#country-filter option:first").val());
    $("#league-filter").val($("#league-filter option:first").val());
    $("#url-filter").val($("#url-filter option:first").val());
    $("#language-filter").val($("#language-filter option:first").val());
    $("#game-select").val($("#game-select option:first").val());
    $("#game-dropdown").hide();
    $("#selection-result").hide();
    $("#incorrect-selection-container").hide();
    document.getElementById("btnClearText").innerHTML = "";
    $("#btnClearText").hide();
    selectedUrl = "";
    selectedLanguage = "";
    targetSportId = "";
    requestParam = "";
  });

  function clearMarketData() {
    document.getElementById("field").innerHTML = "";
    document.getElementById("team").innerHTML = "";
    document.getElementById("id").innerHTML = "";
    document.getElementById("team1").innerHTML = "";
    document.getElementById("team2").innerHTML = "";
    document.getElementById("startTime").innerHTML = "";
    document.getElementById("leagueInfo").innerHTML = "";
    document.getElementById("leagueid").innerHTML = "";
    document.getElementById("bet1Link").innerHTML = "";
    document.getElementById("betXLink").innerHTML = "";
    document.getElementById("bet2Link").innerHTML = "";
    document.getElementById("baseUrl").innerHTML = "";
    document.getElementById("tip1id").innerHTML = "";
    document.getElementById("tipXid").innerHTML = "";
    document.getElementById("tip2id").innerHTML = "";
    document.getElementById("sportid").innerHTML = "";
  }


  $("#game-select").change(function() {

    //initialization
    $("#selection-result").hide();
    $("#incorrect-selection-container").hide();
    clearMarketData();
    document.getElementById("noRecordText").innerHTML = ""

    if(!(document.getElementById('url-filter').value)) {
        alert("Please select Bse Url!");
      } else {
        
        $(".js-game-select").each(function() {
          $(this).siblings(".select2-container").removeClass( 'border' );
        });
    var selectedGameItem = $(this).find(':selected');
    var gameId = selectedGameItem.attr("data-id");
    var selectedGame = {};
    var gameSport = "";
    var languageInput = "";

    if(gameResult.length > 0) {
      var abort = false;
      for (var i in gameResult) {
        if(gameResult[i].id == gameId) {
          
        //loop to identify sport type
        for (var index in filterResult.sports) {
          if(filterResult.sports[index].id === gameResult[i].sport) {
            gameSport = filterResult.sports[index].name;

            // identify market
            for (var a = 0, len = gameResult[i].markets.length; a < len && !abort; a++) { 
              for (var j = 0, len2 = MARKET_TEXT.length; j < len2 && !abort; j++) { 
                if (( (gameResult[i].markets[a].text === MARKET_TEXT[j].da || 
                  gameResult[i].markets[a].text === MARKET_TEXT[j].de || gameResult[i].markets[a].text === MARKET_TEXT[j].en || 
                  gameResult[i].markets[a].text === MARKET_TEXT[j].fr|| gameResult[i].markets[a].text === MARKET_TEXT[j].nl || 
                  gameResult[i].markets[a].text === MARKET_TEXT[j].pl))) {
                  console.log("match", gameResult[i].markets[a]);

                  var linkPrefix = selectedUrl;
                  let marketData = {
                    id: "",
                    team1: "",
                    team2: "",
                    startTime: "",
                    leagueInfo: "",
                    betText: "",
                    bet1Odd: "",
                    bet1Link: "",
                    betXOdd: "",
                    betXLink:  "",
                    bet2Odd:  "",
                    bet2Link: "",
                    tip1id: "",
                    tipXid: "",
                    tip2id: "",
                    leagueid: "",
                    sport: "",
                    linkPrefix: "",
                    language: ""
                  }

                  marketData.id = gameResult[i].id;
                  marketData.team1 = gameResult[i].teams[0];
                  marketData.team2 = gameResult[i].teams[1];
                  marketData.startTime = gameResult[i].startTime;
                  marketData.leagueInfo = gameResult[i].leagueInfo;
                  marketData.betText = gameResult[i].markets[a].text;

                  for (var x in gameResult[i].markets[a].tips) {
                    if (gameResult[i].markets[a].tips[x].text === "1") {
                      marketData.bet1Odd = gameResult[i].markets[a].tips[x].prettyOdd;
                      marketData.bet1Link = gameResult[i].markets[a].tips[x].deeplink;
                      marketData.tip1id = gameResult[i].markets[a].tips[x].id;
                    } else if(gameResult[i].markets[a].tips[x].text === "2") {
                      marketData.bet2Odd = gameResult[i].markets[a].tips[x].prettyOdd;
                      marketData.bet2Link = gameResult[i].markets[a].tips[x].deeplink;
                      marketData.tip2id = gameResult[i].markets[a].tips[x].id;
                    } else if (gameResult[i].markets[a].tips[x].text === "X") {
                      marketData.betXOdd = gameResult[i].markets[a].tips[x].prettyOdd;
                      marketData.betXLink = gameResult[i].markets[a].tips[x].deeplink;
                      marketData.tipXid = gameResult[i].markets[a].tips[x].id;
                    }
                  }

                  marketData.leagueid = gameResult[i].leagueInfo.id;
                  marketData.sport = gameResult[i].sport;
                  marketData.linkPrefix = selectedUrl;
                  marketData.language = selectedLanguage; 
                    
                  

                  marketData["bet1Link_full"] = linkPrefix + marketData.bet1Link;
                  marketData["betXLink_full"] = linkPrefix + marketData.betXLink;
                  marketData["bet2Link_full"] = linkPrefix + marketData.bet2Link;

                  //localStorage.setItem("marketData", JSON.stringify(marketData));

                  //set marketData for view
                  console.log("dgfjdfgg: ", gameResult[i]);
                  document.getElementById("field").innerHTML = gameResult[i].leagueInfo.name;
                  document.getElementById("team").innerHTML = gameResult[i].teams[0].name + " - " + gameResult[i].teams[1].name;
                  document.getElementById("id").innerHTML = marketData.id;
                  document.getElementById("team1").innerHTML = marketData.team1.name;
                  document.getElementById("team2").innerHTML = marketData.team2.name;
                  document.getElementById("startTime").innerHTML = marketData.startTime;
                  document.getElementById("leagueInfo").innerHTML = marketData.leagueInfo.name;
                  document.getElementById("leagueid").innerHTML = marketData.leagueInfo.id;
                  document.getElementById("bet1Link").innerHTML = marketData.bet1Link;
                  document.getElementById("betXLink").innerHTML = marketData.betXLink;
                  document.getElementById("bet2Link").innerHTML = marketData.bet2Link;
                  document.getElementById("baseUrl").innerHTML = marketData.linkPrefix;
                  document.getElementById("tip1id").innerHTML = marketData.tip1id;
                  document.getElementById("tipXid").innerHTML = marketData.tipXid;
                  document.getElementById("tip2id").innerHTML = marketData.tip2id;
                  document.getElementById("sportid").innerHTML = marketData.sport;

                  $("#selection-result").show();
                  abort = true;

                  //clear no records as active record found
                    document.getElementById("noRecordText").innerHTML = "";
                    $("#incorrect-selection-container").hide();
                } else { 
                  if(!abort) {
                    clearMarketData();
                    document.getElementById("noRecordText").innerHTML = "Try selecting a different game entity";
                    $("#incorrect-selection-container").show();
                  }
                }
              }
            }
          }
        }
      }
    }
  }
      }

    
  
  });

});