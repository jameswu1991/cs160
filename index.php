<html>
<head>
<title>Grocer</title>
<script src="lib/jquery.js"></script>
<script src="lib/jquery.cookie.js"></script>
<script src="lib/jquery.autocomplete.js"></script>
<script src="lib/underscore.js"></script>
<script src="lib/backbone.js"></script>

<script src="models.js"></script>
<script src="requests.js"></script>
<script src="document.js"></script>

<link rel="stylesheet" type="text/css" href="style.css">
<link rel="stylesheet" type="text/css" href="lib/jquery.autocomplete.css">
</head>
<body>

<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '160573777341292', // App ID
      channelUrl : 'http://grocerapp.nfshost.com/', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      oauth      : true, // enable OAuth 2.0
      xfbml      : true  // parse XFBML
    });

    // Additional initialization code here
  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     d.getElementsByTagName('head')[0].appendChild(js);
   }(document));
   
</script>

</body>
</html>