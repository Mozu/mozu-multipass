var assert = require('assert');
var delimiter = "|||";

var contextSerializeStrategies = {
  'developer': function(context) {
    assert(context.developerAccountId , context.baseUrl, "In order to retrieve a developer auth ticket, the provided context must have a baseUrl and a developerAccountId.");
    return ['developer',context.baseUrl , context.appKey,context.developerAccountId || 'all',context.developerAccount.emailAddress].join(delimiter);
  },
  'application': function(context) {
    return ['application',context.appKey].join(delimiter)
  },
  'admin-user': function(context) {
    assert(context.tenant && context.adminUser, "In order to retrieve an admin-user auth ticket, the provided context must have a tenant and an adminUser.emailAddress.");
    return ['admin-user',context.baseUrl,context.appKey,context.tenant,(context.adminUser||{}).emailAddress].join(delimiter)
  }
}

var generateCacheKey = module.exports = function(claimType, context) {
  assert(claimType in contextSerializeStrategies, "Unknown claim type " + claimType);
  return contextSerializeStrategies[claimType](context);
}
