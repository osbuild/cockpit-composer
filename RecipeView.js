angular.module('recipe', ['patternfly', 'patternfly.views', 'patternfly.notification']).controller('ViewCtrl', ['$scope', '$http',
    function ($scope, $http) {
      $scope.eventText = '';
      var handleSelect = function (item, e) {
        $scope.eventText = item.name + ' selected\r\n' + $scope.eventText;
      };
      var handleSelectionChange = function (selectedItems, e) {
        $scope.eventText = selectedItems.length + ' items selected\r\n' + $scope.eventText;
      };
      var handleClick = function (item, e) {
        $scope.eventText = item.name + ' clicked\r\n' + $scope.eventText;
      };
      var handleDblClick = function (item, e) {
        $scope.eventText = item.name + ' double clicked\r\n' + $scope.eventText;
      };
      var handleCheckBoxChange = function (item, selected, e) {
        $scope.eventText = item.name + ' checked: ' + item.selected + '\r\n' + $scope.eventText;
      };

      var checkDisabledItem = function(item) {
        return $scope.showDisabled && (item.name === "John Smith");
      };

      $scope.enableButtonForItemFn = function(action, item) {
        return (action.name !=='Action 2') || (item.name !== "Frank Livingston");
      };

      $scope.updateMenuActionForItemFn = function(action, item) {
        if (action.name === 'Another Action') {
          action.isVisible = (item.name !== "John Smith");
        }
      };

      $scope.selectType = 'checkbox';
      $scope.updateSelectionType = function() {
        if ($scope.selectType === 'checkbox') {
          $scope.config.selectItems = false;
          $scope.config.showSelectBox = true;
        } else if ($scope.selectType === 'row') {
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
       showSelectBox: true,
       onSelect: handleSelect,
       onSelectionChange: handleSelectionChange,
       onCheckBoxChange: handleCheckBoxChange,
       onClick: handleClick,
       onDblClick: handleDblClick
      };
      fetchModules();
      function fetchModules(){
        $http.get(composer_api_host+"/api/v0/module/list")
        .then(function(response){ $scope.items = response.data.modules; });
      }

      // $scope.items = [
      //   {
      //     name: "Fred Flintstone",
      //     summary: "20 Dinosaur Way",
      //     version: "Bedrock",
      //     release: "Washingstone",
      //     requires: "2"
      //   },
      //   {
      //     name: "John Smith",
      //     summary: "20 Dinosaur Way",
      //     version: "Bedrock",
      //     release: "Washingstone",
      //     requirements: "2"
      //   },
      //   {
      //     name: "Frank Livingston",
      //     summary: "20 Dinosaur Way",
      //     version: "Bedrock",
      //     release: "Washingstone",
      //     requirements: "2"
      //   },
      //   {
      //     name: "Linda McGovern",
      //     summary: "20 Dinosaur Way",
      //     version: "Bedrock",
      //     release: "Washingstone",
      //     requirements: "2"
      //   },
      //   {
      //     name: "Jim Beam",
      //     summary: "20 Dinosaur Way",
      //     version: "Bedrock",
      //     release: "Washingstone",
      //     requirements: "2"
      //   },
      // ];

      var performAction = function (action, item) {
        $scope.eventText = item.name + " : " + action.name + "\r\n" + $scope.eventText;
      };

      // $scope.actionButtons = [
      //   {
      //     name: 'Action 1',
      //     title: 'Perform an action',
      //     actionFn: performAction
      //   },
      //   {
      //     name: 'Action 2',
      //     title: 'Do something else',
      //     actionFn: performAction
      //   }
      // ];
      $scope.menuActions = [
        {
          name: 'View',
          title: 'View Contents',
          actionFn: performAction
        },
        {
          name: 'Update',
          title: 'Update Version',
          actionFn: performAction
        },
        // {
        //   name: 'Disabled Action',
        //   title: 'Unavailable action',
        //   actionFn: performAction,
        //   isDisabled: true
        // },
        // {
        //   name: 'Something Else',
        //   title: '',
        //   actionFn: performAction
        // },
        {
          isSeparator: true
        },
        {
          name: 'Remove',
          title: 'Remove Component',
          actionFn: performAction
        }
      ];
    }
  ]).controller( 'ToastNotificationDemoCtrl', function( $scope, Notifications ) {
  $scope.types = ['success','info','danger', 'warning'];
  $scope.type = $scope.types[0];
  $scope.showClose = false;

  $scope.header = 'Default Header.';
  $scope.message = 'Default Message.';
  $scope.primaryAction = '';

  $scope.showMenu = false;
  var performAction = function (menuAction) {
    $scope.actionText += menuAction.name + '\n';
  };
  var menuActions = [
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

  $scope.$watch('showMenu',  function () {
     if ($scope.showMenu) {
       $scope.menuActions = menuActions;
     } else {
       $scope.menuActions = undefined;
     }
  });

  $scope.actionText = "";

  $scope.handleAction = function () {
    $scope.actionText = $scope.primaryAction + '\n' + $scope.actionText;
  };
  $scope.closeCallback = function () {
    $scope.actionText = "Close" + '\n' + $scope.actionText;
  };
});
