<?php

$errors         = array();      // array to hold validation errors
$data           = array();      // array to pass back data

// validate the variables ======================================================
    // if any of these variables don't exist, add an error to our $errors array

    if (empty($_POST['message']))
        $errors['message'] = 'Message is required.';

    if (empty($_POST['email']))
        $errors['email'] = 'Email is required.';

    // if (empty($_POST['superheroAlias']))
    //     $errors['superheroAlias'] = 'Superhero alias is required.';

// return a response ===========================================================

    // if there are any errors in our errors array, return a success boolean of false
    if ( ! empty($errors)) {
      // if there are items in our errors array, return those errors
      $data['success'] = false;
      $data['errors']  = $errors;
    } else {

      $email_to = "xs290@me.com";
      $email_subject = "Contact from my site";

      $email_message = "Form details below.\n\n";
      function clean_string($string) {
        $bad = array("content-type","bcc:","to:","cc:","href");
        return str_replace($bad,"",$string);
      }

      $email_message .= "Message: ".clean_string($_POST['message'])."\n";
      $email_message .= "Email: ".clean_string($_POST['email'])."\n";


      $headers = 'From: '.$email_from."\r\n".
      'Reply-To: '.$email_from."\r\n" .
      'X-Mailer: PHP/' . phpversion();

      @mail($email_to, $email_subject, $email_message, $headers);


      // show a message of success and provide a true success variable
      $data['success'] = true;
      $data['message'] = 'Thank you! I will be in touch with you as soon as possible. Have an nice day!';
    }

    // return all our data to an AJAX call
    echo json_encode($data);
