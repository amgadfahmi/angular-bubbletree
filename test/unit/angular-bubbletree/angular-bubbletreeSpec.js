'use strict';

describe('initialize', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('angular-bubbletree');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('angular-bubbletree.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('angular-bubbletree.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('angular-bubbletree.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('angular-bubbletree.services')).to.be.ok;
  });
  

  
    it('should load controllers module', function() {
      expect(hasModule('angular-bubbletree.controllers')).to.be.ok;
    });
  

});
