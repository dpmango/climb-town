<?php

$errors         = array();      // array to hold validation errors
$data           = array();      // array to pass back data

// validate the variables ======================================================
    // if any of these variables don't exist, add an error to our $errors array

    if (empty($_POST['phone']))
        $errors['phone'] = 'Phone is required.';

    if (empty($_POST['email']))
        $errors['email'] = 'Email is required.';

// return a response ===========================================================

    // if there are any errors in our errors array, return a success boolean of false
    if ( ! empty($errors)) {
      // if there are items in our errors array, return those errors
      $data['success'] = false;
      $data['errors']  = $errors;
    } else {

      $email_to = "kidstown.rt@gmail.com, rtclimb@gmail.com, xs290@me.com";
      $email_subject = "Оформлена заявка на праздник";

      $email_message = "Детали заявки ниже.\n\n";
      function clean_string($string) {
        $bad = array("content-type","bcc:","to:","cc:","href");
        return str_replace($bad,"",$string);
      }

      $email_message .= "Тип: ".clean_string($_POST['type'])."\n";
      $email_message .= "Количество: ".clean_string($_POST['people'])."\n";
      $email_message .= "Возраст: ".clean_string($_POST['calcAgeFrom'])." - ".clean_string($_POST['calcAgeTo'])."\n";
      $email_message .= "Шоу: ".clean_string($_POST['options'])."\n";
      $email_message .= "Дополнительно: ".clean_string($_POST['additional'])."\n";

      $email_message .= "Имя: ".clean_string($_POST['name'])."\n";
      $email_message .= "Телефон: ".clean_string($_POST['phone'])."\n";
      $email_message .= "Email: ".clean_string($_POST['email'])."\n";
      $email_message .= "Дата: ".clean_string($_POST['date'])."\n";
      $email_message .= "Откуда узанали: ".clean_string($_POST['whereFrom'])."\n";

      $email_message .= "Стоимость на сайте: ".clean_string($_POST['price'])."\n";

      $headers = 'From: '.$email_from."\r\n".
      'Reply-To: '.$email_from."\r\n" .
      'X-Mailer: PHP/' . phpversion();

      @mail($email_to, $email_subject, $email_message, $headers);


      // show a message of success and provide a true success variable
      $data['success'] = true;
      $data['message'] = 'Спасибо! <br> Мы перезвоним вам <br> в течение дня. ';
    }

    // return all our data to an AJAX call
    echo json_encode($data);
