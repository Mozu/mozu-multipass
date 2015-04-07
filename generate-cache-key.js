var assert = require('assert');
var delimiter = "|||";

var contextSerializeStrategies = {
  'developer': function(context) {
    assert(context.developerAccountId && context.developerAccount && context.developerAccount.emailAddress, "In order to retrieve a developer auth ticket, the provided context must have a developerAccountId and developerAccount.emailAddress.");
    return ['developer',context.appKey,context.developerAccountId,context.developerAccount.emailAddress].join(delimiter);
  },
  'application': function(context) {
    return ['application',context.appKey].join(delimiter)
  },
  'admin-user': function(context) {
    assert(context.tenant && context.adminUser && context.adminUser.emailAddress, "In order to retrieve an admin-user auth ticket, the provided context must have a tenant and an adminUser.emailAddress.");
    return ['admin-user',context.appKey,context.tenant,context.adminUser.emailAddress].join(delimiter)
  }
}

var generateCacheKey = module.exports = function(claimType, context) {
  assert(context.appKey, "In order to use Mozu Multipass, the provided context must have an appKey.");
  assert(claimType in contextSerializeStrategies, "Unknown claim type " + claimType);
  return contextSerializeStrategies[claimType](context);
}