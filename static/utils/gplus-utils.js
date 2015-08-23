
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
function onSuccess(googleUser) {
  gplus.set('googleUser',googleUser);
}
function onFailure(error) {
  console.log(error);
  gplus.set('error',error);
}