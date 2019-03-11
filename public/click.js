angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
   $scope.buttons=[]; //Initially all was still
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;
   $scope.transactionVoid=transactionVoid;
   $score.userButtons=userButtons;

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }

 function userButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getUserButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load User Buttons:  Database request failed";
          loading=false;
      });
 }

  function buttonClick($event){
     $scope.errorMessage='';
     buttonApi.clickButton($event.target.id)
        .success(function(){})
        .error(function(){$scope.errorMessage="Unable click";});
  }

  function transactionVoid($event){
        $scope.errorMessage='';
        buttonApi.transactionVoid()
          .success(function(data){
             loading=false;
             console.log("success")
          })
          .error(function () {
              $scope.errorMessage="Failed to truncate";
              loading=false;
          });
  }
  userButtons();
  refreshButtons();  //make sure the buttons are loaded

}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    getUserButtons: function(){
      var url = apiUrl + '/users';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    transactionVoid: function(){
      var url = apiUrl + '/void';
      return $http.get(url);
    }
 };
}
