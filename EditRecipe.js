angular.module('recipe', ['patternfly', 'patternfly.views', 'patternfly.notification']).controller('CardViewCtrl', ['$scope', '$http',
    function ($scope, $http) {
       $scope.eventText = '';
       var handleSelect = function (item, e) {
         $scope.eventText = item.name + ' selected\n' + $scope.eventText;
       };
       var handleSelectionChange = function (selectedItems, e) {
         $scope.eventText = selectedItems.length + ' items selected\n' + $scope.eventText;
       };
       var handleClick = function (item, e) {
         $scope.eventText = item.name + ' clicked\n' + $scope.eventText;
       };
       var handleDblClick = function (item, e) {
         $scope.eventText = item.name + ' double clicked\n' + $scope.eventText;
       };
       var handleCheckBoxChange = function (item, selected, e) {
         $scope.eventText = item.name + ' checked: ' + item.selected + '\n' + $scope.eventText;
       };

       var checkDisabledItem = function(item) {
         return $scope.showDisabled && (item.name === "John Smith");
       };

       $scope.selectType = 'checkbox';
       $scope.updateSelectionType = function() {
         if ($scope.selectType === 'checkbox') {
           $scope.config.selectItems = false;
           $scope.config.showSelectBox = true;
         } else if ($scope.selectType === 'card') {
           $scope.config.selectItems = true;
           $scope.config.showSelectBox = false;
         } else {
           $scope.config.selectItems = false
           $scope.config.showSelectBox = false;
         }
       };

       $scope.showDisabled = false;

       $scope.config = {
        selectItems: false,
        multiSelect: false,
        dblClick: false,
        selectionMatchProp: 'name',
        selectedItems: [],
        checkDisabled: checkDisabledItem,
        showSelectBox: false,
        onSelect: handleSelect,
        onSelectionChange: handleSelectionChange,
        onCheckBoxChange: handleCheckBoxChange,
        onClick: handleClick,
        onDblClick: handleDblClick
       };

// gets module metadata for list of available components
      fetchModuleList();
      function fetchModuleList(){
        $http.get(composer_api_host+"/api/v0/module/list")
        .then(function(response){ $scope.items = response.data.modules; });
      }
     }
]).controller( 'ToastNotificationListDemoCtrl', function( $scope, $rootScope, Notifications ) {
    $scope.message = 'Default Message.';

    var typeMap = { 'Info': 'info',
                    'Process': 'process',
                    'Success': 'success',
                    'Warning': 'warning',
                    'Danger': 'danger' };

    $scope.types = Object.keys(typeMap);

    $scope.type = $scope.types[0];
    $scope.header = 'Recipe Y:';
    $scope.message = 'Creating composition.';
    $scope.showClose = true;
    $scope.persistent = true;

    $scope.primaryAction = '';

    $scope.showMenu = false;
    var performAction = function (menuAction, data) {
      $scope.actionText += menuAction.name +  ": " + data.message + '\n';
    };
    $scope.menuActions = [
       {
         name: 'Action',
         title: 'Perform an action',
         actionFn: performAction
       },
       {
         name: 'Another Action',
         title: 'Do something else',
         actionFn: performAction
       },
       {
         name: 'Disabled Action',
         title: 'Unavailable action',
         actionFn: performAction,
         isDisabled: true
       },
       {
         name: 'Something Else',
         title: '',
         actionFn: performAction
       },
       {
         isSeparator: true
       },
       {
         name: 'Grouped Action 1',
         title: 'Do something',
         actionFn: performAction
       },
       {
         name: 'Grouped Action 2',
         title: 'Do something similar',
         actionFn: performAction
       }
     ];

    $scope.actionText = "";

    $scope.handleAction = function (data) {
      $scope.actionText = $scope.primaryAction + ": " + data.message + '\n' + $scope.actionText;
    };
    $scope.handleClose = function (data) {
      $scope.actionText = "Closed: " + data.message + '\n'+ $scope.actionText;
      Notifications.remove(data);
    };
    $scope.updateViewing = function (viewing, data) {
      Notifications.setViewing(data, viewing);
    };

    $scope.notify = function () {
      Notifications.message (
        typeMap[$scope.type],
        $scope.header,
        $scope.message,
        $scope.persistent,
        $scope.handleClose,
        $scope.primaryAction,
        $scope.handleAction,
        ($scope.showMenu ? $scope.menuActions : undefined)
      );
    }

    $scope.notifications = Notifications.data;
});
