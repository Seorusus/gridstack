/**
 * Created by bob on 21.09.17.
 */
mbcApp.service('PageService', ['$http',
    function($http){

        this.getPages = function(callback){
            $http.get('/api/mbc-pages')
            // On success, pass the results to the view via the scope object
                .then(function(response){
                    var resData = response.data;
                    callback(resData);
                });
        };
        this.loadPage = function (nid, callback) {
            $http.get('/node/' + nid + '?_format=hal_json')
            // On success, pass the results to the view via the scope object
                .then(function(response){
                    var resData = response.data;
                    callback(resData);
                });
        }
        this.addPage = function(package, csrf, baseUrl){
            return $http({
                url: baseUrl + '/entity/node?_format=hal_json',
                method: 'POST',
                data: package, // pass the data object as defined above
                headers: {
                   // "Authorization": "Basic YWRtaW4vYWRtaW4=", // encoded user/pass
                    "X-CSRF-Token": csrf,
                    "Content-Type": "application/hal+json",
                },
            })
        };
        this.updatePage = function(package, csrf, baseUrl, nid){
            return $http({
                url: baseUrl + '/node/' + nid + '?_format=hal_json',
                method: 'PATCH',
                data: package, // pass the data object as defined above
                headers: {
                    // "Authorization": "Basic YWRtaW4vYWRtaW4=", // encoded user/pass
                    "X-CSRF-Token": csrf,
                    "Content-Type": "application/hal+json",
                },
            })
        };
        this.deletePage = function(id, csrf){
            return $http({
                url: '/node/' + id,
                method: 'DELETE',
                headers: {
                   // "Authorization": "Basic YWRtaW4vYWRtaW4=", // encoded user/pass
                        "X-CSRF-Token": csrf,
                    "Content-Type": "application/hal+json",
                },
            })
        }
        this.gridStack = function() {
            return  {
                value: '',
            }
        }
    }]);
