GPlusUserList =  Backbone.Model.extend({
  defaults: {
    list: null,
    lastRequest: null,
  },
  listAsJson: function() {
    return list;
  },
  getUserList: function(callback) {
    this.set("list", []);
    gapi.client.load('admin', 'directory_v1', _.bind(function() {
          // Step 5: Assemble the API request
          console.log(gapi.client);
          this.executeRecursiveRequest({}, callback);
        }, this));
  },

  executeRecursiveRequest: function(extraArguments, callback) {
    var request = gapi.client.directory.users.list($.extend({
              customer: "my_customer",
              viewType: "domain_public",
              maxResults: 500,
              fields:"etag,kind,nextPageToken,users(creationTime,id,name,primaryEmail,thumbnailPhotoUrl)"
            }, extraArguments));


    // Step 6: Execute the API request
    request.execute(_.bind(function(resp) {
      console.log("request complete.");

      var newList = this.get("list").concat(resp.users);
      this.set("list", newList);
      this.set("lastRequest", resp);
      if(resp.nextPageToken) {
        this.executeRecursiveRequest({"pageToken": resp.nextPageToken}, callback);
      } else {
        console.log("calling back");
        callback(newList);
      }
    }, this));
  }
});