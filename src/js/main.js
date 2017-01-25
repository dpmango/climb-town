jQuery(function($) {
  // Mask input
  $("input[name='calcPeople']").mask("99");
  $("input[name='calcAgeFrom']").mask("99");
  $("input[name='calcAgeTo']").mask("99");

  // Define variables across scope
  var type, people, calcAgeFrom, calcAgeTo, options, additional, price

  // Listen form change
  $('.order-calculator').on('change', function(){
    // Get current values
    type = $("input[name='calcType']:checked").val();
    people = $("input[name='calcPeople']").val();
    calcAgeFrom = $("input[name='calcAgeFrom']").val();
    calcAgeTo = $("input[name='calcAgeTo']").val();
    options = $("input[name='calcOpt']:checked").val();
    additional = $("input[name='calcAdditional']:checked").val();
    price = 0;
    // set default pricing - in roubles
    var AnimatorPrice = 20000;
    var InstructorPrice = 10000;
    var PeopleLimitToCount = 10;
    var AnimatorPriceExtraPerson = 1800;
    var InstructorPriceExtraPerson = 1500;
    var MiniChimShow = 1000;
    var StandartShow = 4000;
    var RentChillZone = 3000;
    var OrderMenu = 9000;

    // Show programs depending on the type
    if (type == "animator") {
      $('#calcShows').fadeIn();
      price = AnimatorPrice;
      if (people > PeopleLimitToCount) {
        var extraPeople = people - PeopleLimitToCount
        price = price + (extraPeople * AnimatorPriceExtraPerson)
      }
    } else {
      $('#calcShows').fadeOut();
      price = InstructorPrice;
      if (people > PeopleLimitToCount) {
        var extraPeople = people - PeopleLimitToCount
        price = price + (extraPeople * InstructorPriceExtraPerson)
      }
    }

    // Detect required Options - for animator only
    if (type == "animator") {
      if (options == "miniChimShow") {
        price = price + MiniChimShow
      } else if (options == "No" || options === undefined) {
        // nothing choicen or empty - do nothing
      } else {
        price = price + StandartShow;
      }
    }
    //Detect additional services
    if (additional == "RentChillZone") {
      price = price + RentChillZone
    } else if (additional == "OrderMenu") {
      price = price + OrderMenu
    }

    // display price
    if (price > 0) {
      $('#calcOrderPrice').fadeIn();
      var numberFromAnimate = parseInt($('#calcPutPrice').text().replace(/,/g, ''), 10);
      $('#calcPutPrice').text(price);
      //animate number change
      $('#calcPutPrice').each(function () {
        $(this).prop('Counter', numberFromAnimate).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now)).digits();
            }
        });
      });
    } else {
      $('#calcOrderPrice').fadeOut();
      $('#calcPutPrice').text('0');
    }

    // activate button if all filled
    var condition = (type === undefined || additional === undefined)
    if (type == "animator") {
      condition = (options === undefined || type === undefined || additional === undefined)
    }
    if ( condition ) {
      $('#calcOrderPrice .button').addClass('disabled').removeClass('fancybox');
    } else {
      $('#calcOrderPrice .button').removeClass('disabled').addClass('fancybox');
    }
  });

  // function to set proper numbers
  $.fn.digits = function(){
      return this.each(function(){
          $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
      })
  }
  // Form sending..
  $('#calcOrderPrice .button.disabled').on('click', function(e){
    e.preventDefault();
  });

  $('#popup-calc .popup-order__form-action .button').on('click', function(e){
    var form = $('#popup-calc')
    var popupCalcName = form.find('input[name=popupCalcName]').val();
    var popupCalcPhone = form.find('input[name=popupCalcPhone]').val();
    var popupCalcEmail = form.find('input[name=popupCalcEmail]').val();
    var popupCalcDate = form.find('input[name=popupCalcDate]').val();
    var popupCalcWhereFrom = form.find('input[name=popupCalcWhereFrom]').val();

    // validation
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailIsValid = false;
    var emailIsNotValid = true;
    if(emailRegex.test(popupCalcEmail)){
      emailIsValid = true;
      emailIsNotValid = false;
    } else {
      emailIsValid = false;
      emailIsNotValid = true;
    }
    console.log(emailIsNotValid);
    console.log(popupCalcName == '');
    console.log(popupCalcName.length <= 3);
    console.log(popupCalcPhone == '');
    console.log(popupCalcPhone.length == 0);

    console.log((emailIsNotValid) && (popupCalcName == '') && (popupCalcName.length <= 3) && (popupCalcPhone == '') && (popupCalcPhone.length == 0));

    if(emailIsNotValid || popupCalcName == '' || popupCalcName.length <= 3 || popupCalcPhone == '' || popupCalcPhone.length == 0 ) {
      alert('Пожалуйста заполнитете обзательные поля Имя, Телефон, Email');
      return false;
      e.stopPropagation();
    } else {
      //build message data
      var formData = {
        'name' : popupCalcName,
        'email' : popupCalcEmail,
        'phone' : popupCalcPhone,
        'date' : popupCalcDate,
        'whereFrom' : popupCalcWhereFrom,
        'type' : type,
        'people' : people,
        'calcAgeFrom' : calcAgeFrom,
        'calcAgeTo' : calcAgeTo,
        'options' : options,
        'additional' : additional,
        'price' : price
      };

      console.log(formData);

      // and make ajax call to phpmail
      $.ajax({
        type        : 'POST',
        url         : 'contact.php',
        data        : formData,
        dataType    : 'json',
        encode      : true
      }).done(function(data) {
        // if message is not sucessfull
        if ( data.success) {
          $('#popup-calc').find('.popup-order__form').fadeOut();
          $('#popup-calc').append('<div class="sucess-message">' + data.message + '</div>');
        }
      }).fail(function(data) {
        console.log(data);
      });
    }

    e.preventDefault();
  });

});
