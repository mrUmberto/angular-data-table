import angular from 'angular';

export class CellController {

  styles(col){
    return {
      width: col.width  + 'px',
      height: col.height  + 'px'
    };
  }

  treeClass(scope){
    return {
      'dt-tree-toggle': true,
      'icon-right': !scope.expanded,
      'icon-down': scope.expanded
    }
  }

  onTreeToggle(evt, scope){
    evt.stopPropagation();
    scope.expanded = !scope.expanded;
    scope.onTreeToggle({ 
      cell: {
        value: scope.value,
        column: scope.column,
        expanded: scope.expanded
      }
    });
  }

};

export function CellDirective($rootScope, $compile, $log){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
    scope: {
      value: '=',
      column: '=',
      expanded: '=',
      hasChildren: '=',
      onTreeToggle: '&'
    },
    template: 
      `<div class="dt-cell" 
            data-title="{{::column.name}}" 
            ng-style="cell.styles(column)">
        <span ng-if="column.isTreeColumn && hasChildren"
              ng-class="cell.treeClass(this)"
              ng-click="cell.onTreeToggle($event, this)"></span>
        <span class="dt-cell-content"></span>
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var content = angular.element($elm[0].querySelector('.dt-cell-content'));
          
          $scope.$watch('value', () => {
            content.empty();
            
            if($scope.column.cellRenderer){
              var elm = angular.element($scope.column.cellRenderer($scope, content));
              content.append($compile(elm)($scope));
            } else {
              var val = $scope.column.cellDataGetter ? 
                $scope.column.cellDataGetter($scope.value) : $scope.value;

              if(val === undefined || val === null) val = '';

              content[0].innerHTML = val;
            }
          });
        }
      }
    }
  };
};
