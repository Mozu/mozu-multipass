# Mozu Multipass

![](multipass.jpg)

```js
var Multipass = require('mozu-multipass');
var MozuNodeSDK = require('mozu-node-sdk');
var multipass = Multipass();
var client = MozuNodeSDK.client(null, { authenticationStorage: multipass })
```

The above gives you a Mozu Node SDK client that stores all its authentication tickets persistently in your home directory. This speeds up access, helps you avoid storing plaintext passwords, and in the best of circumstances, will ask you for your password maximum once every twenty-four hours.

It implements an API that the Mozu Node SDK will accept as an `authenticationStorage` parameter in the second argument to `MozuNodeSDK.client()`. The SDK's default `authenticationStorage` is in-memory, and does not persist between sessions or get shared between processes. Multipass fixes this by reimplementing the `get` and `set` methods with a backing store in your home directory, a file called `.mozu.authentication-cache.json`. This is invisible to the SDK and they work perfectly together. They're newlyweds. Just met. You know how it is. They bumped into each other, sparks happen.


### Methods
Don't use these directly. They're here for illustrative purposes. They should plug into the SDK.

#### Get
```js
// Three types of claim: developer, admin-user, application
// All require an app key in the context.
// developer requires a developerAccountId and developerAccount.emailAddress.
// admin-user requires a tenant and adminUser.emailAddress
multipass.get('developer', client.context, function(err, ticket) {
    // if no valid ticket exists, `ticket` will simply be undefined
});
```

#### Set
```js
multipass.set('admin-user', client.context, ticket, function(err) {

});
```