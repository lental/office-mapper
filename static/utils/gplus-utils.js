
function renderButton() {
  pageState.set("gplusLoaded", true);
  gapi.signin2.render('signin', {
    'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/admin.directory.user.readonly',
    'width': 230,
    'height': 45,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

function auth(){
  gapi.auth.authorize(
    {'client_id':"805151204913-evi7t6cva0ijo71m2rggel6fgtlg3v82.apps.googleusercontent.com",'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/admin.directory.user.readonly'},
    _.bind(onAuthSuc, this)
    );
}

function onAuthSuc(googleUser) {
  console.log("test");
  if(googleUser.g)
  gplus.set('googleUser',googleUser);
  debugger;
}

function onSuccess(googleUser) {
  if (googleUser.getAuthResponse().access_token){
    console.log("putting new token in storage");
    localStorage.setItem('authToken', googleUser.getAuthResponse().access_token);
  } 
  var token = localStorage.getItem('authToken');
  if (token) {
    console.log("got Token from stroage");
    gplus.set('authToken',token);
  } else {
    console.log("No Token available even after success");
    gapi.load('auth2', function(){
      gapi.auth2.getAuthInstance().signOut();
    });
  }
  gplus.set('googleUser',googleUser);
  // auth();
}
function onFailure(error) {
  console.log(error);
  gplus.set('error',error);
}

function gplusSignOut() {
  gapi.auth2.getAuthInstance().signOut();
}