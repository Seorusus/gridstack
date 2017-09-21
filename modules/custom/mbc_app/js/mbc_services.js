/**
 * Created by bob on 21.09.17.
 */
mbcApp.service('PageService', ['$http',
    function($http){

        this.getPages = function(callback){
            $http.get('/api/mbc-pages')
            // On success, pass the results to the view via the scope object
                .success(function(data){
                    callback(data);
                });
        };
        this.addPage = function(package){
            return $http({
                url: '/entity/node',
                method: 'POST',
                data: package, // pass the data object as defined above
                headers: {
                    //"Authorization": "Basic YWRtaW46MTIzcXdl", // encoded user/pass
                    "Content-Type": "application/hal+json",
                },
            })
        };
        this.deletePage = function(id){
            return $http({
                url: '/node/' + id,
                method: 'DELETE',
                headers: {
                    //"Authorization": "Basic YWRtaW46MTIzcXdl", // encoded user/pass
                    "Content-Type": "application/hal+json",
                },
            })
        }
    }]);
