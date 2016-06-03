(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angular-bubbletree.config', [])
      .value('angular-bubbletree.config', {
          debug: true
      });

  // Modules
  
  angular.module('angular-bubbletree.directives', []);
  
  
  angular.module('angular-bubbletree.filters', []);
  
  
  angular.module('angular-bubbletree.services', []);
  
  
    angular.module('angular-bubbletree.controllers', []);
  
  angular.module('angular-bubbletree',
      [
        'angular-bubbletree.config',
        'angular-bubbletree.directives',
        'angular-bubbletree.filters',
        'angular-bubbletree.services',
        'angular-bubbletree.controllers'
      ]);

})(angular);
