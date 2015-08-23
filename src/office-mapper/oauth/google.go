package oauth

import (
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/plus/v1"
	"net/http"
	"office-mapper/config"
)

// Copied and tweaked from https://github.com/google/google-api-go-client/blob/master/examples/main.go#L135
// This is referenced in the docs, but never defined.  Seriously, Google.
func newOAuthClient(ctx context.Context, config *oauth2.Config, token string) *http.Client {
	realToken := &oauth2.Token{AccessToken: token}
	return config.Client(ctx, realToken)
}

func GetMe(token string) (string, error) {
	config := &oauth2.Config{
		ClientID:     config.Settings.Dependencies.OfficeMapperDeps.GoogleApiId,
		ClientSecret: config.Settings.Dependencies.OfficeMapperDeps.GoogleApiSecret,
		Endpoint:     google.Endpoint,
		Scopes:       []string{plus.PlusMeScope}}

	httpClient := newOAuthClient(context.Background(), config, token)

	svc, err := plus.New(httpClient)
	if err != nil {
		return "", err
	}
	person, err := svc.People.Get("me").Do()
	if err != nil {
		return "", err
	}

	return person.Id, nil
}
