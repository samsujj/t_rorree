/**
 * Created by samsuj on 29/10/15.
 */


'use strict';

/* App Module */

var tr = angular.module('tr', ['ui.router','ui.bootstrap','ngCookies','angularValidator','ngFileUpload','ui.tinymce','ngclipboard','youtube-embed']);



tr.service('contentservice', function($http, $log, $q) {
// this.data='';
    var d;

    this.getcontent= function(url) {
        //var deferred = $q.defer();
        $http.get(url)
            .success(function(data) {
                /* deferred.resolve({
                 content: data,
                 val:0
                 });*/
                //this.data=data;
                d= data;
                //return data;
            }).error(function(msg, code) {
                //deferred.reject(msg);
                $log.error(msg, code);
            });
        return d;
    }





});



tr.service('carttotal', function($http, $log, $q,$rootScope) {
// this.data='';
    var d;

    this.getcontent= function(url) {
        //var deferred = $q.defer();
        $http.get(url)
            .success(function(data) {
                /* deferred.resolve({
                 content: data,
                 val:0
                 });*/
                //this.data=data;
                d= data;
                //return data;
            }).error(function(msg, code) {
                //deferred.reject(msg);
                $log.error(msg, code);
            });
        return d;
    }




});






tr.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

tr.filter('htmlToPlaintext', function () {
    return function (input, start) {
        return function (text) {
            console.log(text+'text===');
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }
});

tr.run(['$rootScope','$state','contentservice','$cookieStore','carttotal',function($rootScope, $state,contentservice,$cookieStore,carttotal){



    Math.random()
    $rootScope.$on('$stateChangeStart',function(){

        $rootScope.userid=$cookieStore.get('userid');

        $rootScope.carttotal = 0;


        $rootScope.stateIsLoading = true;
        var random=Math.random() * Math.random();
        //$cookieStore.remove('randomid');
        random=random.toString().replace('.','');
        //$cookieStore.put('randomid', random);

        //console.log($cookieStore.get('randomid')+'random');

        if(typeof($cookieStore.get('randomid'))=='undefined'){

            $cookieStore.put('randomid', random);
        }


        if($rootScope.userid == 0)  $rootScope.cartuser=$cookieStore.get('randomid');
        else {
            $rootScope.cartuser = $rootScope.userid;
        }

        $rootScope.carttotal=parseInt(carttotal.getcontent($rootScope.adminUrl+'cart/carttotal?user='+$rootScope.cartuser));



    });


    $rootScope.$on('$stateChangeSuccess',function(ev, to, toParams, from, fromParams){
        setTimeout(function(){

           // $rootScope.userid=$cookieStore.get('userid');

            //console.log($rootScope.userid+'state change user id success ');

            if($rootScope.userid == 0)  $rootScope.cartuser=$cookieStore.get('randomid');
            else {
                $rootScope.cartuser = $rootScope.userid;
            }

            $rootScope.carttotal=parseInt(carttotal.getcontent($rootScope.adminUrl+'cart/carttotal?user='+$rootScope.cartuser));

            //$rootScope.contentdata=(contentservice.getcontent('http://admin.jungledrones.com/contentlist'));



            var x,y;

            /*for (x in $rootScope.contentdata ){
                var contentw='';
                //console.log($rootScope.contentdata[x]);
                //console.log(($rootScope.contentdata[x].content));
                //console.log(($rootScope.contentdata[x].parentid));


                if($rootScope.contentdata[x].ctype!='image') {

                    for (y in $rootScope.contentdata[x].content) {
                        if ($rootScope.contentdata[x].ctype != 'image')
                            contentw += ($rootScope.contentdata[x].content[y]);
                        else {

                            contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                        }
                    }
                    $rootScope.contentdata[x].content=(contentw);
                }
                /!* else{

                 $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

                 //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
                 }*!/


                console.log(($rootScope.contentdata[x].content));
                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
                if($rootScope.contentdata[x].parentid!=0){

                    var z=parseInt($rootScope.contentdata[x].parentid);
                    console.log(z);
                    console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                    $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

                }

                //var model=$parse($rootScope.contentdata[x].id);
                //model.assign($scope, $rootScope.contentdata[x]);
                //.id=$rootScope.contentdata[x];
            }*/




          //  console.log($rootScope.userid+'userid');
            //if($rootScope.userid<1)

                //$('.editableicon').hide();



        },20);

        $rootScope.stateIsLoading = false;
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;


        $(document).scrollTop(0);
    });

}]);

tr.filter("sanitize123", ['$sce', function($sce) {
    return function(htmlCode){
       // console.log(htmlCode);
       // console.log('santize');
        return $sce.trustAsHtml(htmlCode);
    }
}]);


tr.directive('content',['$compile','$sce','$state','$rootScope', function($compile,$sce,$state,$rootScope) {
    var directive = {};
    directive.restrict = 'E';
    //directive.transclude= true;
    //console.log('t--='+student.ctype);
    directive.template = '<div class=newcc ng-bind-html="student.content | sanitize123" editid="student.id| sanitize123"  ></div><button  class = editableicon editid="student.id| sanitize123" ng-click=editcontent("student.name")>Edit</button><div class=clearfix></div>';

    directive.scope = {
        student : "=name"
    }


    directive.compile = function(element, attributes) {
        element.css("display", "block");



        var linkFunction = function($scope, element, attributes) {
           // console.log('content'+student.content);
            //console.log('ctype'+student.ctype);
            $compile($(element).find('.cc'))($scope);
            $compile($(element).find('.editableicon'))($scope);


            console.log('dfg : '+$rootScope.userrole);

            if($rootScope.userrole != 4){
                $(element).find('.editableicon').remove();
            }

            $(element).bind("DOMSubtreeModified",function(){
                setTimeout(function(){
                   // $(element).find('.editableicon').css('position','absolute').css('top',parseFloat($(element).offset().top+$(element).height()-30)).css('left',parseFloat($(element).offset().left+$(element).width()-40));
                    $(element).find('.editableicon').css('position','absolute').css('top',0).css('right',0);
                    //console.log($(element).height());
                    //$compile($(element).next())($scope);

                    $(element).find('.newcc').hover(function(){
                        var cur_n = $(this).next('.editableicon');
                        if($rootScope.userrole != 4){
                            cur_n.hide();
                        }else{
                            cur_n.show();
                        }
                    },function(){
                        $(this).next('.editableicon').hide();
                    })

                    $(element).find('.editableicon').hover(function(){
                        var cur_n = $(this);
                        if($rootScope.userrole != 4){
                            cur_n.hide();
                        }else{
                            cur_n.show();
                        }
                    },function(){
                        $(this).hide();
                    })


                },1000);
            });


            //$(element).find('.cc').css('display','inline-block');
            //$(element).find('.editableicon').text(99);

            $(element).find('.editableicon').on( "click", function() {
                //if($rootScope.userid<1) $( this).hide();
                //$(this).parent().css('display','inline-block');

                $state.go('edit-content',{userId: $( this ).parent().attr('id')});
            });

            //element.html("name: <b>"+$scope.student.name +"</b> , desc00: <b>"+(student.description)+"</b>,type :<b>"+$scope.student.ctype+"</b> ,content :<b>"+$scope.student.content+"</b><br/>");
            //element.css("background-color", "#ffffff");
        }
        return linkFunction;
    }

    return directive;
}]);

tr.directive('autoActive', ['$location', function ($location) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element) {
            function setActive() {
                var path = $location.path();
                if (path) {
                    angular.forEach(element.find('li'), function (li) {
                        var anchor = li.querySelector('a');
                        if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                            angular.element(li).addClass('active');
                        } else {
                            angular.element(li).removeClass('active');
                        }
                    });
                }
            }

            setActive();

            scope.$on('$locationChangeSuccess', setActive);
        }
    }
}]);





tr.config(function($stateProvider, $urlRouterProvider,$locationProvider) {

// For any unmatched url, redirect to /state1
    $urlRouterProvider
        .otherwise("/home");

//
    // Now set up the states
    $stateProvider
        .state('index',{
            url:"/index",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'admin_header'
                },
                'admin_footer': {
                    templateUrl: 'partials/footer.html' ,
                    //controller: 'footer'
                },
                'content': {
                    templateUrl: 'partials/home.html' ,
                    controller: 'index'
                },

            }
        })





        .state('dashboard',{
            url:"/dashboard",
            views: {

                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partials/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partials/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partials/dashboard.html' ,
                     controller: 'dashboard'
                },

            }
        }
    )

        .state('add-admin',{
                url:"/add-admin",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/add_admin.html' ,
                        controller: 'addadmin'
                    },

                }
            }
        )

        .state('edit-admin',{
                url:"/edit-admin/:userId",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/edit_admin.html' ,
                        controller: 'editadmin'
                    },

                }
            }
        )

        .state('admin-list',{
                url:"/admin-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/admin_list.html' ,
                        controller: 'adminlist'
                    },

                }
            }
        )

        .state('add-affiliate',{
                url:"/add-affiliate",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/add_affiliate.html' ,
                        controller: 'addaffiliate'
                    },

                }
            }
        )

        .state('edit-affiliate',{
                url:"/edit-affiliate/:userId",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/edit_affiliate.html' ,
                        controller: 'editaffiliate'
                    },

                }
            }
        )

        .state('affiliate-list',{
                url:"/affiliate-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/affiliate_list.html' ,
                        controller: 'affiliatelist'
                    },

                }
            }
        )

        .state('affiliatetrack', {
            url: "/affiliatetrack",
            views:{
                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html',
                    controller:'admin_header'
                },
                'admin_left':{
                    templateUrl:'partials/admin_left.html',
                    //controller:'admin_header'
                },
                'admin_footer':{
                    templateUrl:'partials/admin_footer.html',
                },

                'content':{
                    templateUrl:'partials/affiliatetrack.html',
                    controller:'affiliatetrack'
                },

            }

        } )

        .state('affiliatetrackdetails', {
            url: "/affiliatetrackdetails/:affiliate_id",
            views:{
                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html',
                    controller:'admin_header'
                },
                'admin_left':{
                    templateUrl:'partials/admin_left.html',
                    //controller:'admin_header'
                },
                'admin_footer':{
                    templateUrl:'partials/admin_footer.html',
                },

                'content':{
                    templateUrl:'partials/affiliatetrackdetails.html',
                    controller:'affiliatetrackdetails'
                },

            }

        } )

        .state('category-list',{
                url:"/category-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/junglecategorylist.html',
                        controller:'junglecategorylist'
                    },

                }
            }
        )

        .state('add-category',{
                url:"/add-category",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/add_category_jungle.html',
                        controller:'addcategoryjungle'
                    },

                }
            }
        )


        .state('edit-category',{
                url:"/edit-category/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/edit_category_jungle.html',
                        controller:'editcategoryjungle'
                    },

                }
            }


        )

        .state('event-list',{
                url:"/event-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/event_list.html',
                        controller:'eventlist'
                    },

                }
            }
        )

        .state('add-event',{
                url:"/add-event",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/add_event.html',
                        controller:'addevent'
                    },

                }
            }
        )

        .state('edit-event',{
                url:"/edit-event/:eventId",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/edit_event.html',
                        controller:'editevent'
                    },

                }
            }
        )


        .state('blog-list',{
                url:"/blog-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/blog_list.html',
                        controller:'bloglist'
                    },

                }
            }
        )

        .state('add-blog',{
                url:"/add-blog",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/add_blog.html',
                        controller:'addblog'
                    },

                }
            }
        )




        .state('edit-blog',{
                url:"/edit-blog/:blogid",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/edit_blog.html',
                        controller:'editblog'
                    },

                }
            }
        )


        .state('testimoniallist',{
            url:"/testimonial-list",
            views: {

                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partials/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partials/admin_footer.html' ,
                },

                'content':{
                    templateUrl:'partials/testimoniallist.html',
                    controller:'testimoniallist'
                },

            }
        }
    )


        .state('product-list',{
                url:"/product-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/jungleproductlist.html',
                        controller:'jungleproductlist'
                    },

                }
            }
        )

        .state('add-product',{
                url:"/add-product",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/add_product_jungle.html',
                        controller:'addproductjungle'
                    },

                }
            }
        )


        .state('edit-product',{
                url:"/edit-product/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },

                    'content':{
                        templateUrl:'partials/edit_product_jungle.html',
                        controller:'editproductjungle'
                    },

                }
            }
        )

        .state('generaluser-list',{
                url:"/generaluser-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/generaluser_list.html' ,
                        controller: 'generaluserlist'
                    },

                }
            }
        )
        .state('order-list',{
                url:"/order-list",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/order_list.html' ,
                        controller: 'orderlist'
                    },

                }
            }
        )
        .state('order-details',{
                url:"/order-details/:orderid",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/admin_top_menu.html' ,
                        controller: 'admin_header'
                    },
                    'admin_left': {
                        templateUrl: 'partials/admin_left.html' ,
                        //  controller: 'admin_left'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/admin_footer.html' ,
                    },
                    'content': {
                        templateUrl: 'partials/order_details.html' ,
                        controller: 'orderdetails'
                    },

                }
            }
        )


        .state('addcontent',{
            url:"/add-content",
            views: {

                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partials/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partials/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partials/add_content.html' ,
                     controller: 'addcontent'
                },

            }
        }
    )
        .state('home',{
            url:"/home",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
               'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/home.html' ,
                    controller: 'index'
                },

            }
        }
    )

        .state('aboutme',{
            url:"/aboutme",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/aboutme.html' ,
                    controller: 'aboutme'
                },

            }
        }
    )

        .state('retreat',{
                url:"/retreat",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/retreat.html' ,
                        controller: 'retreat'
                    },

                }
            }
        )
        .state('blog',{
                url:"/blog",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/blog.html' ,
                        controller: 'blog'
                    },

                }
            }
        )
        .state('event',{
            url:"/event",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/event.html' ,
                    controller: 'event'
                },

            }
        }
    )
        .state('event-details',{
            url:"/event-details/:eventId",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/eventdeatils.html' ,
                    controller: 'eventdetails'
                },

            }
        }
    )

        .state('product-details',{
                url:"/product-details/:id",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/product_details.html' ,
                        controller: 'productdetails'
                    },

                }
            }
        )
        .state('checkout',{
                url:"/checkout",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/checkout.html' ,
                        controller: 'checkout'
                    },

                }
            }
        )



        .state('testimonial',{
                url:"/testimonial",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/testimonial.html' ,
                        controller: 'testimonial'
                    },

                }
            }
        )
        .state('contactme',{
            url:"/contactme",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/contactme.html' ,
                    controller: 'contactme'
                },

            }
        }
    )


        .state('books',{
                url:"/products",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/books.html' ,
                        controller: 'books'
                    },

                }
            }
        )
        .state('productcategory',{
            url:"/product-category",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/productcategory.html' ,
                    controller: 'productcategory'
                },

            }
        }
    )
        .state('productbycategory',{
            url:"/product-by-category/:categoryId",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/productbycategory.html' ,
                    controller: 'productbycategory'
                },

            }
        }
    )
        .state('cart',{
                url:"/cart",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/cart.html' ,
                        controller: 'cart'
                    },

                }
            }
        )
        .state('orderconfirmation',{
                url:"/orderconfirmation",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/order_confirmation.html' ,
                        //controller: 'orderconfirmation'
                    },

                }
            }
        )


        .state('signup',{
                url:"/signup",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/signup.html' ,
                        controller: 'signup'
                    },

                }
            }
        )

        .state('profile',{
                url:"/profile",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                      //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/myprofile.html' ,
                        controller: 'profile'
                    },

                }
            }
        )
        .state('edit-profile',{
                url:"/edit-profile",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/edit_profile.html' ,
                        controller: 'editprofile'
                    },

                }
            }
        )
        .state('user-change-password',{
                url:"/user-change-password",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                         controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/user_change_password.html' ,
                        controller: 'userchangepassword'
                    },

                }
            }
        )


        .state('myaccount-affiliate',{
                url:"/myaccount-affiliate",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/myaccount_affiliate.html' ,
                        controller: 'myaccountaffiliate'
                    },

                }
            }
        )
        .state('myaccount-order-details',{
                url:"/myaccount-order-details/:orderid",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/myaccount_order_details.html' ,
                        controller: 'myaccountorderdetails'
                    },

                }
            }
        )


        .state('myaccount-order',{
                url:"/myaccount-order",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/myaccount_order.html' ,
                        controller: 'myaccountorder'
                    },

                }
            }
        )

        .state('myaccount-order-manager',{
                url:"/myaccount-order-manager",
                views: {

                    'admin_header': {
                        templateUrl: 'partials/myaccount-header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        templateUrl: 'partials/myaccount-footer.html' ,
                        controller:'footer'
                    },
                    'admin_left': {
                        templateUrl: 'partials/myaccount-left.html' ,
                        //  controller:'footer'
                    },

                    'content': {
                        templateUrl: 'partials/myaccount_order_manager.html' ,
                        controller: 'myaccountordermanager'
                    },

                }
            }
        )



        .state('url',{
            url:"/url/:link",
            views: {

                'header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'footer': {
                    templateUrl: 'partials/front_footer.html' ,
                     controller: 'footer'
                },
                'content': {
                    templateUrl: 'partials/signup.html' ,
                    controller: 'url'
                },



            }
        })

        .state('login',{
                url:"/login",
                views: {

                    'admin_header': {
                      //  templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                       // templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/login.html' ,
                        controller: 'login'
                    },

                }
            }
        )
        .state('forgot-password',{
                url:"/forgot-password",
                views: {

                    'admin_header': {
                        //  templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        // templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/forgot_password.html' ,
                        controller: 'forgotpassword'
                    },

                }
            }
        )
        .state('forgot-password-check',{
                url:"/forgot-password-check",
                views: {

                    'admin_header': {
                        //  templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        // templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/forgot_password_check.html' ,
                        controller: 'forgotpasswordcheck'
                    },

                }
            }
        )

        .state('change-password',{
                url:"/change-password",
                views: {

                    'admin_header': {
                        //  templateUrl: 'partials/header.html' ,
                        controller: 'header'
                    },
                    'admin_footer': {
                        // templateUrl: 'partials/front_footer.html' ,
                        controller:'footer'
                    },
                    'content': {
                        templateUrl: 'partials/change_password.html' ,
                        controller: 'change_password'
                    },

                }
            }
        )





        .state('affiliate',{
            url:"/affiliate",
            views: {

                'admin_header': {
                    templateUrl: 'partials/header.html' ,
                    controller: 'header'
                },
                'admin_footer': {
                    templateUrl: 'partials/front_footer.html' ,
                    controller:'footer'
                },
                'content': {
                    templateUrl: 'partials/affiliate.html' ,
                    controller: 'index'
                },

            }
        }
    )
        .state('affiliates', {
            url: "/affiliates/:code",
            views:{
                'admin_header': {
                    // templateUrl: 'partials/admin_top_menu.html',
                    controller:'header'
                },
                'admin_footer':{
                    // templateUrl:'partials/admin_footer.html',
                    controller:'footer'
                },

                'content':{
                    //   templateUrl:'partials/affiliate_list.html',
                    controller:'affiliates'
                },

            }

        } )

        .state('affiliates1', {
            url: "/affiliates1/:pid/:code",
            views:{
                'admin_header': {
                    // templateUrl: 'partials/admin_top_menu.html',
                    controller:'header'
                },
                'admin_footer':{
                    // templateUrl:'partials/admin_footer.html',
                    controller:'footer'
                },

                'content':{
                    //   templateUrl:'partials/affiliate_list.html',
                    controller:'affiliates1'
                },

            }

        } )


        .state('edit-content',{
            url:"/edit-content/:userId",
            views: {

                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partials/admin_left.html' ,
                },
                'admin_footer': {
                    templateUrl: 'partials/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partials/edit_content.html' ,
                    controller: 'editcontent'
                },

            }
        }
    )



        .state('contentlist',{
            url:"/contentlist",
            views: {

                'admin_header': {
                    templateUrl: 'partials/admin_top_menu.html' ,
                    controller: 'admin_header'
                },
                'admin_left': {
                    templateUrl: 'partials/admin_left.html' ,
                    //  controller: 'admin_left'
                },
                'admin_footer': {
                    templateUrl: 'partials/admin_footer.html' ,
                },
                'content': {
                    templateUrl: 'partials/contentlist.html' ,
                    controller: 'contentlist'
                },

            }
        }
    )





    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        hashPrefix:'!'
    });

});

/*
jungledrone.directive('slideToggle', function() {
    return {
        restrict: 'A',
        scope:{
            isOpen: "=slideToggle"
        },
        link: function(scope, element, attr) {
            var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
            scope.$watch('isOpen', function(newVal,oldVal){
                if(newVal !== oldVal){
                    element.stop().slideToggle(slideDuration);
                }
            });
        }
    };
});

jungledrone.directive('myCustomer', function() {
    return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
});*/


tr.controller('ModalInstanceCtrl', function($scope,$state,$cookieStore,$http,$uibModalInstance,$rootScope,Upload,$uibModal,$timeout) {
    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };



    $scope.jungleconfirmcategorydelete=function(){
        $uibModalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletejunglecategory',
            data    : $.param({id: $scope.categorylist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.categorylist.splice(idx,1);
        });
    }

    $scope.jungleconfirmcategorystatus=function(){
        $uibModalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'jungleupdatestatus',
            data    : $.param({id: $scope.categorylist[idx].id,status:$scope.categorylist[idx].status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            $scope.categorylist[idx].status = !$scope.categorylist[idx].status;
        });
    }

    $scope.jungleconfirmproductdelete=function(){
        $uibModalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletejungleproduct',
            data    : $.param({id: $scope.productlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.productlist.splice(idx,1);
        });
    }

    $scope.jungleconfirmproductstatus=function(){
        $uibModalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'jungleproductupdatestatus',
            data    : $.param({id: $scope.productlist[idx].id,status:$scope.productlist[idx].status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            $scope.productlist[idx].status = !$scope.productlist[idx].status;
        });
    }
    $scope.confirmeventdelete = function() {
        $uibModalInstance.dismiss('cancel');
        var idx = $scope.currentindex;
        $http({
            method: 'POST',
            async: false,
            url: $scope.adminUrl + 'deleteevent',
            data: $.param({id: $scope.eventlist[idx].id}),  // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            $rootScope.stateIsLoading = false;
            $scope.eventlist.splice(idx, 1);
            //   $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }

    $scope.confirmblogdelete = function() {
        $uibModalInstance.dismiss('cancel');
        var idx = $scope.currentindex;
        $http({
            method: 'POST',
            async: false,
            url: $scope.adminUrl + 'deleteblog',
            data: $.param({id: $scope.bloglist[idx].id}),  // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            $rootScope.stateIsLoading = false;
            $scope.bloglist.splice(idx, 1);
            //   $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }


    $scope.confirmdeladmin = function(){
        $uibModalInstance.dismiss('cancel');

        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteadmin',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }

/*
    $scope.addYtVideo1= function(item){
        console.log(1);
        console.log(item);

        $scope.form.blog_file=item.id.videoId;

        $scope.ytdialog.close();
    }
*/



    $scope.confirmtestidelete = function() {
        $uibModalInstance.dismiss('cancel');
        var idx = $scope.currentindex;
        $http({
            method: 'POST',
            async: false,
            url: $scope.adminUrl + 'testimonial/delete',
            data: $.param({id: $scope.testimoniallist[idx].id}),  // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            $scope.testimoniallist.splice(idx, 1);
        });
    }


    $scope.$watch('t_user_image', function (files) {
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    t_upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams1 = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function t_upload(file) {
        $scope.errorMsg = null;
        t_uploadUsingUpload(file);
    }

    function t_uploadUsingUpload(file) {
        $scope.up_image = '';
        file.upload = Upload.upload({
            url: $scope.adminUrl+'testimonial/uploaduserimage' + $scope.getReqParams1(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {

           // file.progress = -1;


            $scope.form.image = response.data.image_name;
            $scope.up_image = response.data.image_url;


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.addtestim = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'testimonial/add',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $uibModalInstance.dismiss('cancel');

            $scope.uinsucc = $uibModal.open({
                animation: true,
                templateUrl: 'addtestimonialsuc',
                //controller: 'ModalInstanceCtrl',
                size: 'lg',
                scope:$scope
            });

            $timeout(function(){
              //  $scope.uinsucc.close();
            },3000);

        });
    }


});


tr.controller('index', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {

    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


          //  console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
             //   console.log(z);
              //  console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);





});
tr.controller('aboutme', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    angular.element( document.querySelector( 'content[id="187"]' ) ).css('position','unset');
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);





});
tr.controller('retreat', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

});
tr.controller('blog', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$uibModal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

        }

    },$scope.interval);


    $scope.trustAsHtml=$sce.trustAsHtml;

    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //$scope.friends = orderBy($scope.friends, predicate, $scope.reverse);
    };

    $scope.currentPage=1;
    $scope.perPage=8;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bloglist',
         data    : $.param({type:'front'}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.bloglist=data;


        // $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.blogdetails=function(item){

      $scope.blogdescription=item.blog_description;
        $uibModal.open({
            animation: true,
            templateUrl: 'blogdetails.html',
            controller: 'ModalInstanceCtrl',
            //windowClass: 'thankuPopcls',
            size: 'lg',
            scope:$scope
        });
    }



});
tr.controller('event', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$filter) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.trustAsHtml=$sce.trustAsHtml;

    $scope.predicate = 'id';
    $scope.reverse = true;

    var orderBy = $filter('orderBy');

    $scope.order = function(predicate) {

        // console.log('pre'+predicate);
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.eventlist = orderBy($scope.eventlist, predicate, $scope.reverse);
    };


    $rootScope.integerId= function(val) {
        return parseInt(val, 10);
    };

    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'eventlist',
         data    : $.param({type:'front'}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.eventlist=data;
        // $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.event_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)|| (item.event_desc.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.event_location.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.event_daterange.indexOf($scope.searchkey) != -1)  ){
            return true;
        }
        return false;
    };






});
tr.controller('eventdetails', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,$sce,carttotal,$stateParams) {

    $scope.eventId = $stateParams.eventId;
    $scope.form = {};
    $scope.event_status = false;
    $scope.event_img = false;

    $http({
        method: 'POST',
        async: false,
        url: $scope.adminUrl + 'eventdetails',
        data: $.param({'id': $scope.eventId}),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
        //console.log(data);
        $scope.eventdetails = data;
        if (data.event_timerange == 'all day') {
            $scope.allday = true;
        }
        else {

            var result = data.event_timerange.split('to');


            var sttime = result[0].split(':');
            var sthour = parseInt(sttime[0]);
            var stmin = parseInt(sttime[1]);

            var ettime = result[1].split(':');
            var ethour = parseInt(ettime[0]);
            var etmin = parseInt(ettime[1]);
            var st = new Date();
            //console.log(st.getHours());
            st.setHours(sthour);
            st.setMinutes(stmin);
            var et = new Date();
            //console.log(st.getHours());
            et.setHours(ethour);
            et.setMinutes(etmin);
            $scope.endtime = et;
            $scope.starttime = st;
        }
    })
})

tr.controller('productdetails', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$stateParams,$uibModal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
             //console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
               // console.log(z);
                //console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.trustAsHtml=$sce.trustAsHtml;
    $scope.product_video_src='';
    $scope.product_img_src='';



    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungleproductdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.productdetails=data;
        $scope.is_video=data.is_video;
        $scope.is_video1=data.is_video1;
        $scope.productfiletype = data.productfiletype;
        $scope.productdownloadfiletype = data.productdownloadfiletype;
        if(data.image_url!='') {
            $scope.product_img_src = data.image_url;
            // $scope.productfiletype = 'image';
        }
        if(data.image_url1!='') {
            $scope.product_download_src = data.image_url1;
//
        }



        if($scope.is_video == 1){
            $scope.product_img_src = data.cover_img_url;
            $scope.video_url1222 = data.video_url;
            //  $scope.productfiletype = 'video';
        }
        if($scope.is_video1 == 1){
            //$scope.product_img_src = data.cover_img_url;
            $scope.video_ur_downloadl1222 = data.video_url;
        }

    });
    $scope.addquantity=function(){
       var quan= $('#quantity').val();
        $('#quantity').val(parseInt(quan)+1);
    }
    $scope.removequantity=function(){
        var quan= $('#quantity').val();
        if(quan>1){
            $('#quantity').val(parseInt(quan)-1);
        }

    }
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungleproductlist',
        data    : $.param({'productid':$scope.id,'producttype':'feature'}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.productlist=data;

    });


    $scope.addtocartfromdet = function(pid){


        if($rootScope.userid == 0)  $scope.cartuser=$cookieStore.get('randomid');
        else{
            $scope.cartuser=$rootScope.userid;

            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'cart/updatecartuser',
                data    : $.param({'newuserid':$rootScope.userid,'olduserid':$cookieStore.get('randomid')}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).success(function(data){

            });
        }


        $http({
            method:'POST',
            async:false,
            url:$scope.adminUrl+'cart/addtocart',
            data    : $.param({'pid':pid,'qty':$('#quantity').val(),'userid':$scope.cartuser}),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(data){
            $rootScope.carttotal=parseInt($rootScope.carttotal+parseInt($('#quantity').val()));
        });


    }




    $scope.testimonialuser = $rootScope.userid;

    $scope.addtestimonial = function(){

        $scope.form = {
            user_id : $scope.testimonialuser,
            name1 : '',
            image : '',
            body : '',
        }


        $uibModal.open({
            animation: true,
            templateUrl: 'addtestimonial',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });
    }










});
tr.controller('checkout', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            //console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
              //  console.log(z);
               // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.aff_id = '';

    if(typeof($cookieStore.get('affiliatecode')) != 'undefined'){
        $scope.aff_id = $cookieStore.get('affiliatecode');
    }

    if($rootScope.userid == 0)
        $scope.cartuser=$cookieStore.get('randomid');
    else
        $scope.cartuser=$rootScope.userid;

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'cart/cartdetail',
        data    : $.param({'user':$scope.cartuser}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.cartarray=data;
        $scope.cartarray2=data.cartarr;
    });

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'cart/getPrevAddr',
        data    : $.param({'user':$scope.cartuser}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.addressList=data;
    });

    $scope.changeAddress = function(item){
        $scope.stateList = [];

        if(typeof(item) != 'undefined'){
            $scope.billform = {
                'billshipchk':true,
                'userid':$rootScope.userid,
                'prevaddress1':item.id,
                'prevaddress':{
                    'id':item.id
                },
                'address_title':item.address_title,
                'bname':item.name,
                'company':item.company,
                'address':item.address,
                'address2':item.address2,
                'city':item.city,
                'country':{
                    id: item.country
                },
                'zip':item.zip,
                'phone':item.phone,
                'email':item.email
            }


            if(typeof(item.country) != 'undefined'){
                $http({
                    method:'POST',
                    async:false,
                    url:$scope.adminUrl+'cart/getState',
                    data    : $.param({'country_id':item.country}),
                    headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data){
                    $scope.stateList=data;

                    var pstate = {
                        'state':{
                            id: item.state
                        }
                    }
                    angular.extend($scope.billform, pstate);
                });
            }


        }else{
            $scope.billform = {
                'billshipchk':true,
                'userid':$rootScope.userid,
                'company':'',
                'address2':'',
                'prevaddress1':''
            }
        }
    }

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'cart/getCountry',
    }).success(function(data){
        $scope.countryList=data;
    });

    $scope.stateList = [];

    $scope.cardyear=[2016,2017,2018,2019,2020,2021,2022,2023,2024,20125,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040];

    $scope.shipstateList = [];

    $scope.changeCountry = function(country){
        $scope.stateList = [];
        if(typeof(country.id) != 'undefined'){
            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'cart/getState',
                data    : $.param({'country_id':country.id}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $scope.stateList=data;
            });
        }
    }

    $scope.changeCountry1 = function(country){
        $scope.shipstateList = [];
        if(typeof(country.id) != 'undefined'){
            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'cart/getState',
                data    : $.param({'country_id':country.id}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $scope.shipstateList=data;
            });
        }
    }

    $scope.billform = {
        'userid':$rootScope.userid,
        'company':'',
        'address2':'',
        'prevaddress1':'',
        'billshipchk':true,
    }

    $scope.shipform = {
        'userid':$rootScope.userid,
        'company':'',
        'address2':'',
    }
    $scope.shipform = {
        'userid':$rootScope.userid,
        'company':'',
        'address2':'',
    }

    $scope.errormsg='';
    $scope.checkoutsubmit = function(){

        $scope.form = {
            billform : $scope.billform,
            shipform : $scope.shipform,
            product_det : $scope.cartarray2,
            subtotal : $scope.cartarray.subtotal,
            total : $scope.cartarray.subtotal,
            affiliate_id : $scope.aff_id,
            cartform : $scope.cartform,
        }

         $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'cart/checkout',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            if(data.status=='success') {
                $state.go('orderconfirmation');
                return;
            }
             else{
                $scope.errormsg = 'Transaction process failed!';
                console.log($scope.errormsg);
            }

        });
    }

});

tr.controller('testimonial', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


         //   console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
           //     console.log(z);
          //      console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'testimonial/list',
        data    : $.param({front:1}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.testimoniallist=data;
    });

});


tr.controller('contactme', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$uibModal,$window) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


           // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.contactformsubmit = function(){

        $scope.errormsg='';



        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontact',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                $scope.errormsg='This email already exists';
            }else{
                $scope.contactform.reset();


                var modalInstance =         $uibModal.open({
                    animation: true,
                    templateUrl: 'contactsuccess',
                    controller: 'ModalInstanceCtrl',
                    //windowClass: 'thankuPopcls',
                    size: 'lg',
                    scope:$scope
                });


                setTimeout(function(){
                    modalInstance.dismiss('cancel');
                   // $('.logpopup').hide();

                    $window.location.href = $scope.baseUrl+'home';
                },6000)
            }



        });


    }



});



tr.controller('books', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungleproductlist',
         data    : $.param({'type':'front'}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.productlist=data;
        console.log($scope.countrylist);
    });

    $rootScope.addtocart=function(pid){
        if($rootScope.userid == 0)  $scope.cartuser=$cookieStore.get('randomid');
        else{
            $scope.cartuser=$rootScope.userid;

            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'cart/updatecartuser',
                data    : $.param({'newuserid':$rootScope.userid,'olduserid':$cookieStore.get('randomid')}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).success(function(data){

            });
        }


        $http({
            method:'POST',
            async:false,
            url:$scope.adminUrl+'cart/addtocart',
            data    : $.param({'pid':pid,'qty':1,'userid':$scope.cartuser}),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(data){
            $rootScope.carttotal=parseInt($rootScope.carttotal)+1;
        });
    }

});



tr.controller('productbycategory', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$stateParams) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            //console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
             //   console.log(z);
            //    console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);


    $scope.categoryId = $stateParams.categoryId;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungle_product/listbycategory',
        data    : $.param({'categoryId':$scope.categoryId}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.productlist=data.productlist;
        $scope.category_name=data.category_name;
    });

    $rootScope.addtocart=function(pid){
        if($rootScope.userid == 0)  $scope.cartuser=$cookieStore.get('randomid');
        else{
            $scope.cartuser=$rootScope.userid;

            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'cart/updatecartuser',
                data    : $.param({'newuserid':$rootScope.userid,'olduserid':$cookieStore.get('randomid')}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).success(function(data){

            });
        }


        $http({
            method:'POST',
            async:false,
            url:$scope.adminUrl+'cart/addtocart',
            data    : $.param({'pid':pid,'qty':1,'userid':$scope.cartuser}),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(data){
            $rootScope.carttotal=parseInt($rootScope.carttotal)+1;
        });
    }

});




tr.controller('productcategory', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


          //  console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
             //   console.log(z);
             //   console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);



    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungle_category/frontcatlist',
      //  data    : $.param({'type':'front'}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.categoryList=data;
    });

});
tr.controller('cart', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$uibModal) {
    $scope.trustAsHtml=$sce.trustAsHtml;
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/

            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);





    if($rootScope.userid == 0)  $scope.cartuser=$cookieStore.get('randomid');
    else
        $scope.cartuser=$rootScope.userid;

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'cart/cartdetail',
        data    : $.param({'user':$scope.cartuser}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productidss=[];


        $scope.cartarray=data;


        $scope.cartarray2=data.cartarr;


        angular.forEach(data.cartarr,function(value, key){
            if(value.product_id){
                if($scope.productidss.length==0)
                    $scope.productidss=[value.product_id];
                else
                    $scope.productidss.push(value.product_id)  ;


            }
            console.log($scope.productidss);
        })
        console.log($scope.productidss);
        $scope.productidss=$scope.productidss.toString();
        console.log($scope.productidss);
        $http({
            method  : 'POST',
            async:   false,
            url     :     $scope.adminUrl+'jungleproductlist',
            data    : $.param({'carttype':'cart',productidss:$scope.productidss}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $scope.productlist=data;

        });





    });
    $scope.delcart=function(val){
        console.log(val);

        var idx = $scope.cartarray2.indexOf(val);

        $http({
            method:'POST',
            async:false,
            url:$scope.adminUrl+'cart/deletecartbyid',
            data    : $.param({'pid':val.pid,'userid':$scope.cartuser}),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(data){

            $rootScope.carttotal=parseInt($rootScope.carttotal-parseInt(val.qty));
            $scope.cartarray.quantity=$scope.cartarray.quantity-parseInt(val.qty);
            $scope.cartarray.subtotal=($scope.cartarray.subtotal-parseFloat(val.subtotal)).toFixed(2);
            console.log($rootScope.carttotal);
            console.log($scope.cartarray.subtotal);
            $scope.cartarray2.splice(idx,1);



        });



    }


    $scope.chklogin = function(){
        if($rootScope.userid == 0){

            $rootScope.goafterlogin = 'checkout';

            $uibModal.open({
                animation: true,
                templateUrl: 'chkloginpopup',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                scope:$scope
            });
        }else{
            $state.go('checkout');
            return
        }
    }


});

tr.controller('profile', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval = 600;
    $scope.contentupdated = false;
    var myVar = setInterval(function () {

        $rootScope.contentdata = contentservice.getcontent($scope.adminUrl + 'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if (typeof ($rootScope.contentdata) != 'undefined' && $scope.contentupdated) {

            $scope.interval = 999990;

            clearInterval(myVar);
        }

        $scope.contentupdated = true;
        for (x in $rootScope.contentdata) {
            var contentw = '';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if ($rootScope.contentdata[x].ctype != 'image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content = (contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname + $rootScope.contentdata[x].id] = $rootScope.contentdata[x];
            if ($rootScope.contentdata[x].parentid != 0) {

                var z = parseInt($rootScope.contentdata[x].parentid);
               // console.log(z);
               // console.log($rootScope.contentdata[x].cname + $rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname + $rootScope.contentdata[x].parentid] = $rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    }, $scope.interval);

    if (typeof ($cookieStore.get('userid')) != 'undefined') {

        $scope.userid = $cookieStore.get('userid');

        if (typeof ($cookieStore.get('userrole')) != 'undefined') {
            $scope.userrole=$cookieStore.get('userrole');
            //console.log($scope.userrole);
        }


    $http({
        method: 'POST',
        async: false,
        url: $scope.adminUrl + 'admindetails',
        data: $.param({'uid': $scope.userid}),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
        $scope.userdetails = data;

    });
}
 /*   $scope.update = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('admin-list');
            return
        });
    }
*/
});
tr.controller('myaccountaffiliate', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$uibModal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


           // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                //console.log(z);
               // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);
    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.userid=$cookieStore.get('userid');

    }


    $scope.affiliatestring='';

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'getgrabcode',
         data    : $.param({user_id:$rootScope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.affiliatestring=data;
        //$scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.accountaffiliatecode = function(code){
        $scope.productcode=$scope.baseUrl+'affiliates/'+$scope.affiliatestring;
        //$('.url_text').val('http://influx.spectrumiq.com/products/'+item.product_affiliate_code);
//console.log('http://influx.spectrumiq.com/products/'+item.product_affiliate_code);
        $uibModal.open({
            animation: true,
            templateUrl: 'accountffiliate.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });
    }


    $scope.productlist = [{'id':0,'product_name':'Product Page'}];

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist',
        data    : $.param({'type':'front'}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=$scope.productlist.concat(data);
    });
    $scope.productaffiliatecode=function(id){
        $scope.productcode=$scope.baseUrl+'affiliates1/'+id+'/'+$scope.affiliatestring;

        $uibModal.open({
            animation: true,
            templateUrl: 'accountffiliate.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });
    }



});

tr.controller('myaccountorder', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


           // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
              //  console.log(z);
               // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.form = {
        from_date:'',
        to_date:'',
    }

    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.to_date) != 'undefined'){
            $scope.maxDate = new Date($scope.form.to_date);
        }
    }

    $scope.setDate = function(){
        if(typeof($scope.form.from_date) != 'undefined'){
            $scope.minDate1 = new Date($scope.form.from_date);
        }
    }

    $scope.open11 = function() {
        $scope.opened1 = true;
    };

    $scope.open1 = function() {
        $scope.opened = true;
    };


    $rootScope.type='affiliate';
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist?type='+$rootScope.type,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.affiliatelist=data;
        //$scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });
    $scope.searchbyaffiliate=function(item){
        if(typeof(item)!='undefined'){
            $scope.searchkey = item.uid;
        }
        else{
            $scope.searchkey = '';
        }

    }
    $scope.searchbyOrderStatus=function(item){
        console.log(item);
        if(typeof(item)!='undefined'){
            $scope.searchkey1 = item.id;
        }
        else{
            $scope.searchkey1 = '';
        }

    }


    $scope.orderstatuslist = [
        {
            'id':1,
            'text':'Pending'
        },
        {
            'id':2,
            'text':'In Progress'
        },
        {
            'id':3,
            'text':'Confirmed'
        },
        {
            'id':4,
            'text':'Canceled'
        }

    ]

    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.userid=$cookieStore.get('userid');

    }
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=8;

    $scope.totalItems = 0;


    $scope.filterResult = [];    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'orderlist',
         data    : $.param({userid:$rootScope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.orderlist=data;
        // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.searchkey1 = '';
    $scope.search = function(item){

        if ( (item.affiliate_id.toString().indexOf($scope.searchkey.toString()) != -1 )){
            return true;
        }
        return false;
    };

    $scope.search1 = function(item){

        if ( ( item.order_status.toString().indexOf($scope.searchkey1.toString()) != -1)){
            return true;
        }
        return false;
    };
    $scope.searchdate = function(item){

        var from_time = 0;
        var to_time = 0;
        if($scope.form.from_date != null && typeof($scope.form.from_date) != 'undefined' && $scope.form.from_date != ''){
            var from_date1 = $scope.form.from_date;
            var from_date = from_date1.getDate();
            var from_mon = from_date1.getMonth();
            var from_year = from_date1.getFullYear();
            var d = new Date(from_year, from_mon, from_date, 0, 0, 0);
            from_time = d.getTime()/1000;
        }
        if($scope.form.to_date != null && typeof($scope.form.to_date) != 'undefined' && $scope.form.to_date != ''){
            var to_date1 = $scope.form.to_date;
            var to_date = to_date1.getDate();
            var to_mon = to_date1.getMonth();
            var to_year = to_date1.getFullYear();
            var d = new Date(to_year, to_mon, to_date, 23, 59, 59);
            to_time = d.getTime()/1000;

        }
        if(from_time == 0 && to_time == 0){


            return true;
        }
        else if(to_time == 0){
            if  (item.order_time > from_time) {
                return true;
            }else{
                return false;
            }
        }
        else if(from_time == 0){
            if (item.order_time < to_time){
                return true;
            }else{
                return false;
            }
        }else{
            if ( (item.order_time > from_time && item.order_time < to_time) ){
                return true;
            }else{
                return false;
            }
        }

    };

});
tr.controller('myaccountordermanager', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                //  console.log(z);
                // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.form = {
        from_date:'',
        to_date:'',
    }

    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.to_date) != 'undefined'){
            $scope.maxDate = new Date($scope.form.to_date);
        }
    }

    $scope.setDate = function(){
        if(typeof($scope.form.from_date) != 'undefined'){
            $scope.minDate1 = new Date($scope.form.from_date);
        }
    }

    $scope.open11 = function() {
        $scope.opened1 = true;
    };

    $scope.open1 = function() {
        $scope.opened = true;
    };


    $rootScope.type='affiliate';
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist?type='+$rootScope.type,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.affiliatelist=data;
        //$scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });
    $scope.searchbyaffiliate=function(item){
        if(typeof(item)!='undefined'){
            $scope.searchkey = item.uid;
        }
        else{
            $scope.searchkey = '';
        }

    }
    $scope.searchbyOrderStatus=function(item){
        console.log(item);
        if(typeof(item)!='undefined'){
            $scope.searchkey1 = item.id;
        }
        else{
            $scope.searchkey1 = '';
        }

    }


    $scope.orderstatuslist = [
        {
            'id':1,
            'text':'Pending'
        },
        {
            'id':2,
            'text':'In Progress'
        },
        {
            'id':3,
            'text':'Confirmed'
        },
        {
            'id':4,
            'text':'Canceled'
        }

    ]

    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.userid=$cookieStore.get('userid');

    }
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=8;

    $scope.totalItems = 0;


    $scope.filterResult = [];    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'orderlist',
        data    : $.param({affiliateid:$rootScope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.orderlist=data;
        // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.searchkey1 = '';
    $scope.search = function(item){

        if ( (item.affiliate_id.toString().indexOf($scope.searchkey.toString()) != -1 )){
            return true;
        }
        return false;
    };

    $scope.search1 = function(item){

        if ( ( item.order_status.toString().indexOf($scope.searchkey1.toString()) != -1)){
            return true;
        }
        return false;
    };
    $scope.searchdate = function(item){

        var from_time = 0;
        var to_time = 0;
        if($scope.form.from_date != null && typeof($scope.form.from_date) != 'undefined' && $scope.form.from_date != ''){
            var from_date1 = $scope.form.from_date;
            var from_date = from_date1.getDate();
            var from_mon = from_date1.getMonth();
            var from_year = from_date1.getFullYear();
            var d = new Date(from_year, from_mon, from_date, 0, 0, 0);
            from_time = d.getTime()/1000;
        }
        if($scope.form.to_date != null && typeof($scope.form.to_date) != 'undefined' && $scope.form.to_date != ''){
            var to_date1 = $scope.form.to_date;
            var to_date = to_date1.getDate();
            var to_mon = to_date1.getMonth();
            var to_year = to_date1.getFullYear();
            var d = new Date(to_year, to_mon, to_date, 23, 59, 59);
            to_time = d.getTime()/1000;

        }
        if(from_time == 0 && to_time == 0){


            return true;
        }
        else if(to_time == 0){
            if  (item.order_time > from_time) {
                return true;
            }else{
                return false;
            }
        }
        else if(from_time == 0){
            if (item.order_time < to_time){
                return true;
            }else{
                return false;
            }
        }else{
            if ( (item.order_time > from_time && item.order_time < to_time) ){
                return true;
            }else{
                return false;
            }
        }

    };

});

tr.controller('myaccountorderdetails', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$stateParams) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                //  console.log(z);
                // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);

    $scope.orderid=$stateParams.orderid;
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'orderdetails',
        data    : $.param({orderid:$scope.orderid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.orderdetails=data;

    });


});



tr.controller('editprofile', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/

            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'countryList',
        // data    : $.param({'uid':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.countrylist=data;
    });

    $scope.format = 'MM/dd/yyyy';
    $scope.open1 = function() {
        $scope.opened = true;
    };

    $scope.form={'dob':new Date()};


    if (typeof ($cookieStore.get('userid')) != 'undefined') {

        $scope.userid = $cookieStore.get('userid');

        if (typeof ($cookieStore.get('userrole')) != 'undefined') {
            $scope.userrole=$cookieStore.get('userrole');
            //console.log($scope.userrole);
        }


        $http({
            method: 'POST',
            async: false,
            url: $scope.adminUrl + 'admindetails',
            data: $.param({'uid': $scope.userid}),  // pass in data as strings
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            $scope.userdetails = data;
            $scope.form = {
                uid: data.uid,
                fname: data.fname,
                lname: data.lname,
                bname: data.bname,
                email: data.email,
                address: data.address,
                phone_no: data.phone_no,
                mobile_no: data.mobile_no,
                country: data.country,
                state: data.state,
                gender: data.gender,
                dob: data.dobedit,

            }


        });
    }
    $scope.clientgenderValidator=function(){
        if($scope.editprofileform.$submitted){

            if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.clientgenderValidatorerror=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.clientgenderValidatorerror=true;
                return '';

            }

        }

    }

    $scope.editprofileformsubmit = function () {

     $rootScope.stateIsLoading = true;
     $http({
     method  : 'POST',
     async:   false,
     url     : $scope.adminUrl+'adminupdates',
     data    : $.param($scope.form),  // pass in data as strings
     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
     }) .success(function(data) {
     $rootScope.stateIsLoading = false;
     $state.go('profile');
     return
     });
     }




});



tr.controller('signup', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$uibModal,$window) {
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'countryList',
       // data    : $.param({'uid':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.countrylist=data;
    });
    $scope.format = 'MM/dd/yyyy';
    $scope.open1 = function() {
        $scope.opened = true;
    };

    $scope.form={'dob':new Date()};
    $rootScope.usertype='generaluser';

    $scope.clientgenderValidator=function(){
        if($scope.signup.$submitted){

            if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.clientgenderValidatorerror=false;
                return true ;
            }
            else {
                $scope.clientgenderValidatorerror=true;
                return '';

            }

        }

    }
    $scope.submitsignupForm = function(){

        $scope.errormsg='';



        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addadmin?type='+$rootScope.usertype,
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                $scope.errormsg='This email already exists';
            }else{
                $scope.signup.reset();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'signupsuccess.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    scope:$scope
                });

                setTimeout(function(){
                    modalInstance.dismiss('cancel');
                     $('.logpopup').hide();

                    $window.location.href = $scope.baseUrl+'home';
                },4000)
            }



        });


    }

});

tr.controller('url', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,contentservice,$uibModal,$timeout) {
    $scope.link=$stateParams.link;
if(typeof($scope.link)!='undefined' && $scope.link!='') {
    $http({
        method: 'POST',
        async: false,
        url: $scope.adminUrl + 'updatestatus',
        data: $.param({uid: $scope.link, linktype: 'front'}),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
        if(data.status=='success'){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'acountsuccess.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                scope: $rootScope
            });

            setTimeout(function () {
                modalInstance.dismiss('cancel');
                $state.go('login');
            }, 4000)

            // $rootScope.stateIsLoading = false;
            // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        }
        else{
            $state.go('index');
        }
    });



}

$scope.cancel1=function(){
    modalInstance.dismiss('cancel');
}



});

tr.controller('login', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {
    $scope.adminloginsubmit = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminlogin',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $cookieStore.put('userid',data.userdetails.id);
                $cookieStore.put('useremail',data.userdetails.email);
                $cookieStore.put('userfullname',data.userdetails.fname+' '+data.userdetails.lname);
                $cookieStore.put('username',data.userdetails.username);

                if(typeof (data.userdetails.roles[4]) != 'undefined')
                    $cookieStore.put('userrole',4);

                if(typeof (data.userdetails.roles[5]) != 'undefined')
                    $cookieStore.put('userrole',5);
                if(typeof (data.userdetails.roles[6]) != 'undefined')
                    $cookieStore.put('userrole',6);
                //if(typeof (data.userdetails.roles[7]) != 'undefined')
                //    $cookieStore.put('userrole',7);
                console.log(data.userdetails.roles[5]);
                console.log(data.userdetails.roles[4]);


                if(typeof($rootScope.goafterlogin) != 'undefined'){
                    if($rootScope.goafterlogin != ''){
                        $state.go($rootScope.goafterlogin);
                        return
                    }

                }



                if(data.userdetails.roles[5] == 'generaluser'){
                    $state.go('profile');
                }
                if(data.userdetails.roles[6] == 'affiliate'){
                    $state.go('profile');
                }

                if(data.userdetails.roles[4] == 'siteadmin'){
                    $state.go('dashboard');
                }


            }
            else{
                $scope.errormsg = data.msg;
            }

        });
    }

});

tr.controller('forgotpassword', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.forgotpasssubmit = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'forgotpass',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $cookieStore.put('user_id',data.userdetails.user_id);
                $cookieStore.put('user_email',data.userdetails.email);

                $rootScope.user_id=$cookieStore.get('user_id');
                $rootScope.user_email=$cookieStore.get('user_email');

                // console.log($rootScope.user_email);
                // console.log($rootScope.user_id);
                //console.log($rootScope.refferalcodes);

                $state.go('forgot-password-check');


            }else{
                $scope.errormsg = data.msg;
            }

        });
    }
});
tr.controller('forgotpasswordcheck', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.form={email:$rootScope.user_email}
    $scope.forgotpasschecksubmit = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'forgotpassaccesscheck',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $state.go('change-password');
                return

            }else{
                $scope.errormsg = data.msg;
            }

        });
    }
});

tr.controller('change_password', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.form={email:$rootScope.user_email,user_id:$rootScope.user_id}
    $scope.changepassFormSubmit = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'changepassword',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $state.go('login');
                return

            }else{
                $scope.errormsg = data.msg;
            }

        });
    }
});
tr.controller('userchangepassword', function($scope,$state,$http,$cookieStore,$rootScope) {
    if (typeof ($cookieStore.get('userid')) != 'undefined') {

        $scope.userid = $cookieStore.get('userid');
    }
    $scope.errormsg='';
        $scope.form={user_id:$scope.userid}
    $scope.changepasswordsubmit = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'userchangepassword',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $state.go('profile');


            }else{
                $scope.errormsg = 'Old password does not exists';
            }

        });
    }
});


tr.controller('affiliate', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {

    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');

        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';

            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
             $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

        }

    },$scope.interval);





});

tr.controller('affiliates', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$stateParams,$window) {

    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');

        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';

            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

        }


    },$scope.interval);


    $scope.code=$stateParams.code;
    $cookieStore.put('affiliatecode',$scope.code);
    // $window.location.href = $scope.baseUrl+'home';

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'addaffiliatehit',
        data    : $.param({'code':$scope.code}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data.affiliate_hit_id);
        if(data.affiliate_hit_id>0){
            $window.location.href = $scope.baseUrl+'home';
        }


    });



});

tr.controller('affiliates1', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal,$stateParams,$window) {

    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');

        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';

            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
                console.log(z);
                console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

        }


    },$scope.interval);


    $scope.pid=$stateParams.pid;
    $scope.code=$stateParams.code;
    $cookieStore.put('affiliatecode',$scope.code);
    // $window.location.href = $scope.baseUrl+'home';

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'addaffiliatehit',
        data    : $.param({'code':$scope.code}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data.affiliate_hit_id);
        if(data.affiliate_hit_id>0){

            if($scope.pid > 0){
                $window.location.href = $scope.baseUrl+'product-details/'+$scope.pid;
            }else{
                $window.location.href = $scope.baseUrl+'products';
            }


        }


    });



});






tr.controller('header', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,carttotal) {





    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');

        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';

            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

        }



    },$scope.interval);


    setTimeout(function(){

        if($rootScope.userid == 0)  $rootScope.cartuser=$cookieStore.get('randomid');
        else {
            $rootScope.cartuser = $rootScope.userid;
        }

        $rootScope.carttotal=parseInt(carttotal.getcontent($scope.adminUrl+'cart/carttotal?user='+$rootScope.cartuser));

    },2000);



    $rootScope.userrole=0;
    $rootScope.userfullname=0;
    $rootScope.userid=0;
    $rootScope.userrole=0;

    if(typeof ($cookieStore.get('userrole')!='undefined'))
        $rootScope.userrole=$cookieStore.get('userrole');
    $rootScope.userfullname=$cookieStore.get('userfullname');
    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.userid=$cookieStore.get('userid');

    }

    $rootScope.userrole=$cookieStore.get('userrole');

    //console.log($rootScope.userid+'--userid');
    $rootScope.logout = function () {
        $cookieStore.remove('userid');
        $cookieStore.remove('username');
        $cookieStore.remove('useremail');
        $cookieStore.remove('userfullname');
        $cookieStore.remove('userrole');

        $rootScope.userrole=0;
        $rootScope.userfullname=0;
        $rootScope.userid=0;
        $rootScope.userrole=0;

       // console.log($rootScope.userid+'userid');

        //console.log('in logout');
        $rootScope.userid=0;
        $state.go('home');
    }


    $scope.gotosignup=function(){

        $('html, body').animate({
            scrollTop: $('form[name="signupForm"]').offset().top
        }, 2000);
    }


    setTimeout(function(){
        $('.dropdown-menu').hide(500);
        $scope.toggledropdown=function(){

            console.log('uuuu');
            if($('.dropdown-menu').css('display')=='none'){

                $('.dropdown-menu').show();
                $('.dropdown-menu').stop(true, true).delay(400).show();

            }
            else{

                $('.dropdown-menu').hide();
                $('.dropdown-menu').stop(true, true).delay(400).hide();
            }


        }

        $('ul.nav li.dropdown').hover(function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
        }, function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        });


    },2000);



});


tr.controller('addcontent', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams) {



    //console.log(contentservice.getcontent($scope.adminUrl+'contentlist'));
   // $scope.contentdata=(contentservice.getcontent($scope.adminUrl+'contentlist'));

    $rootScope.editcontent= function (evalue) {

        //console.log(evalue);
    }




        $scope.interval=600;
        $scope.contentupdated=false;
        var myVar =setInterval(function(){

            $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


            //console.log('in setInterval'+$scope.interval);
            //console.log( $rootScope.contentdata);
            var x;
            var y;
            if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

                $scope.interval=999990;

                clearInterval(myVar);
            }

            $scope.contentupdated=true;
            for (x in $rootScope.contentdata ){
                var contentw='';
                //console.log($rootScope.contentdata[x]);
                //console.log(($rootScope.contentdata[x].content)+'c----n');
                //console.log(($rootScope.contentdata[x].parentid));


                if($rootScope.contentdata[x].ctype!='image') {

                    for (y in $rootScope.contentdata[x].content) {
                        if ($rootScope.contentdata[x].ctype != 'image')
                            contentw += ($rootScope.contentdata[x].content[y]);
                        else {

                            contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                        }
                    }
                    $rootScope.contentdata[x].content=(contentw);
                }
                /* else{

                 $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

                 //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
                 }*/


                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
                if($rootScope.contentdata[x].parentid!=0){

                    var z=parseInt($rootScope.contentdata[x].parentid);

                    $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

                }

                //var model=$parse($rootScope.contentdata[x].id);
                //model.assign($scope, $rootScope.contentdata[x]);
                //.id=$rootScope.contentdata[x];
            }

            //console.log('----'+$scope);


        },$scope.interval);


        setTimeout(function(){

            if($rootScope.userid == 0)  $rootScope.cartuser=$cookieStore.get('randomid');
            else {
                $rootScope.cartuser = $rootScope.userid;
            }

            $rootScope.carttotal=parseInt(carttotal.getcontent('http://admin.jungledrones.com/carttotal?user='+$rootScope.cartuser));

        //    console.log($rootScope.userid+'state change user id header ');

        },2000);





        /* console.log($scope.contentdata.$$state.status);
         console.log($scope.contentdata.$$state);
         console.log(Object.keys($scope.contentdata).length);
         console.log(Object.keys($scope.contentdata.$$state).length);
         console.log($scope.contentdata.$$state.value);
         var x;
         for(x in $scope.contentdata.$$state){

             console.log(x+'===='+$scope.contentdata.$$state[x]);

         }*/
    /*$scope.Mahesh = {};
    $scope.Mahesh.name = "Mahesh Parashar";
    $scope.Mahesh.id  = 1;
    $scope.Mahesh.content  = 4;

    $scope.Piyush = {};
    $scope.Piyush.name = "Piyush Parashar";
    $scope.Piyush.id  = 2;
    $scope.Piyush.content  = 2;*/

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
        valid_elements : "a[href|target|ui-sref|active-link],strong,b,img,div[align|class],br,span,label,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen]",
        force_p_newlines : false,
        forced_root_block:'',
        extended_valid_elements : "label,span,i[class]"
    };

    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;


    $scope.caclismultiple=function(){

        if($scope.form.ismultiple=='yes'){

            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;

    }

    $scope.delcopy=function(ev){

      //  console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }

        if($scope.ctext==true || $scope.chtml==true){
         //   console.log($(target).prev().prev().attr('indexval'));
           // $scope.form.ctext.splice($(target).prev().attr('indexval'),1);
           // /delete $scope.form.ctext.$(target).prev().attr('indexval');
            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
               ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }

        }








    }
    $scope.addcopy=function(ev){



        var target = ev.target || ev.srcElement || ev.originalTarget;





        //console.log($( target).parentsUntil('.copyarea').html());
        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                /*console.log($(target).parent().find('.clearfix1').last().find('.copyarea').last().index());
                console.log($(target).prev().find('.copyarea').last().html());
                console.log($(target).prev().html());
                console.log($(target).prev().attr('class'));
*/
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

               /* $(target).parent().find('.clearfix1').last().html("<div class='form-group' ng-show='chtml'>\
            <label >Put Html Content  :</label>\
            \<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'  required-message='content can not be blank' \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix clearfix1'></div>\
               \</div>");*/



                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");


                /*$(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');*/

                //var res=$('form').find('div[ng-show="chtml"]').html();
                //$('div[ng-show="chtml"]').find('textarea').last().attr('ui-tinymce',$scope.tinymceOptions);
                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
                //$rootScope.$digest();


            }
        }
        else {
            $('input.uploadbtn').click();
            //console.log($('button.uploadbtn').text());
        }



        //$( target).appendTo($( target).parentsUntil(".form-group" ))
        //$( target).parentsUntil('.copyarea').after(chtml);



        /*if($scope.chtml==true) {
            $('.add-content').last().wysihtml5({
                toolbar: {
                    "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                    "emphasis": true, //Italics, bold, etc. Default true
                    "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                    "html": true, //Button which allows you to edit the generated HTML. Default false
                    "link": true, //Button to insert a link. Default true
                    "image": true, //Button to insert an image. Default true,
                    "color": true, //Button to change color of font
                    "blockquote": true, //Blockquote
                }
            });
        }*/
    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;


    $scope.ctype=function(ctype){

        //console.log(ev);

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        //$('textarea').removeAttr('required');

        if(ctype=='html') {

           // $('textarea[name^="chtml"]').attr('required','');
            $scope.chtml=true;
        }
        if(ctype=='text') {
            //$('textarea[name^="ctext"]').attr('required','');
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;

        //$compile($('.chtml'))($scope);
        //$compile($('.ctext'))($scope);



    }








    /*file upload part start */


    /*setTimeout(function(){

        $('.add-content').wysihtml5({
            toolbar: {
                "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                "emphasis": true, //Italics, bold, etc. Default true
                "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                "html": true, //Button which allows you to edit the generated HTML. Default false
                "link": true, //Button to insert a link. Default true
                "image": true, //Button to insert an image. Default true,
                "color": true, //Button to change color of font
                "blockquote": true, //Blockquote
            }
        });

    },2000);*/


    $scope.$watch('event_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $rootScope.stateIsLoading = true;
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadcontent' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            if($scope.form.ismultiple=='yes'){

                $scope.form.resumearrn.push(response.data.image_name);
                $scope.form.resumearrp.push(response.data.image_url);

                $scope.form.resume = null;
                $scope.form.event_image = null;

            }
            else {

                $scope.form.resume = response.data.image_url;
                $scope.form.event_image = response.data.image_name;
                $scope.form.contenturl = response.data.contenturl;

                $scope.form.resumearrn.length=0;
                $scope.form.resumearrp.length=0;
            }
            $rootScope.stateIsLoading = false;

            //$('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            // $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */


    setTimeout(function(){
        $scope.form.country={};
        $scope.form.country.s_name='Belize';
        $('#country').val(20);
    },2000);



    $scope.contentValidator=function(){


       // console.log('in gender validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());



        if($scope.add_Admin.$submitted){

            /*if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.gender_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.gender_error=true;
                return '';

            }*/


           // if()




            if($scope.form.ismultiple=='yes'){



                //console.log($scope.chtml);



                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;



            //console.log($scope.form.ismultiple);

            if(typeof ($scope.form.ismultiple)!='undefined') return true;

            else return 'Required !' ;

        }

    }
    $scope.contenetv=function(){


       // console.log('in gender validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());



        if($scope.add_Admin.$submitted){

            /*if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.gender_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.gender_error=true;
                return '';

            }*/
            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);


           // if()

            console.log('in cont validator');






        }

    }

    $scope.submitadminForm=function(){


        if($scope.chtml == true ){

            var chtmlarr= new Array();
            chtmlarr=[];
            //$scope.form.chtml=null;

            /*$('textarea[name^="chtml"]').each(function(){

                console.log($(this).val());

                //chtmlarr.push($(this).val());


            });

            $scope.form.chtml = JSON.stringify(chtmlarr);*/


        }
        /*if($scope.ctext == true ){

            var chtmlarr= new Array();
            chtmlarr=[];
            $scope.form.ctext=null;

            $('textarea[name="ctext"]').each(function(){

                //console.log($(this).val());

                chtmlarr.push($(this).val());


            });

            $scope.form.ctext = JSON.stringify(chtmlarr);


        }*/

        console.log($scope.form);
        console.log($.param($scope.form));


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$('#employmentmodal').modal('show');
            console.log(data);
           // $scope.employmentform.reset();
           // $scope.form={};

            // $('#employmentmodal').modal('show');
            setTimeout(function(){


              //  $scope.form.country={};
              //  $scope.form.country.s_name='Belize';
              //  $('#country').val(20);
               // $('#employmentmodal').modal('hide');

            },3000);



    });

    }

    $scope.employmentsubmit=function(){



        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addemployement',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $('#employmentmodal').modal('show');
            //console.log($scope.signupForm)
            $scope.employmentform.reset();
            $scope.form={};

            // $('#employmentmodal').modal('show');
            setTimeout(function(){


                $scope.form.country={};
                $scope.form.country.s_name='Belize';
                $('#country').val(20);
                $('#employmentmodal').modal('hide');

            },3000);














        });





    }




});
tr.controller('editcontent', function($compile,$scope,contentservice,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams) {



    //console.log(contentservice.getcontent($scope.adminUrl+'contentlist'));
   // $scope.contentdata=(contentservice.getcontent($scope.adminUrl+'contentlist'));

    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;

    $scope.userid=$stateParams.userId;


    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'contentlistbyid',
        data    : $.param({'id':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        //console.log($scope.form);
        console.log('after form');
        $scope.form = {
            //id: data.id,
            //refferal_code: data.refferal_code,
            cname: data.cname,
            ctype: data.ctype,
            description: data.description,
            parentid:data.parentid
            //ismultiple: data.content.length,
        }

        if(data.content.length>1) $scope.form.ismultiple='yes';
        else $scope.form.ismultiple='no';
        if(data.ctype=='html') {
            $scope.chtml=true;
            $scope.form.chtml=data.content;
        }
        if(data.ctype=='text') {
            $scope.form.ctext=data.content;
            $scope.ctext=true;
        }
        if(data.ctype=='image'){
            $scope.form.cimage=data.content;
            $scope.form.resume=data.contenturl;
            $scope.form.image_url_url=data.contenturl;
            $scope.cimage=true;
            $scope.form.ismultiple='no';

        }



        console.log($scope.form);
        console.log('after form');
    });





   /* console.log($scope.contentdata.$$state.status);
    console.log($scope.contentdata.$$state);
    console.log(Object.keys($scope.contentdata).length);
    console.log(Object.keys($scope.contentdata.$$state).length);
    console.log($scope.contentdata.$$state.value);
    var x;
    for(x in $scope.contentdata.$$state){

        console.log(x+'===='+$scope.contentdata.$$state[x]);

    }*/
    /*$scope.Mahesh = {};
    $scope.Mahesh.name = "Mahesh Parashar";
    $scope.Mahesh.id  = 1;
    $scope.Mahesh.content  = 4;

    $scope.Piyush = {};
    $scope.Piyush.name = "Piyush Parashar";
    $scope.Piyush.id  = 2;
    $scope.Piyush.content  = 2;*/

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        valid_elements : "a[href|target|ui-sref|active-link],strong,b,img[src|alt],div[align|class],p,br,span,label,h3,h4,h2,h1,strong,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen]",
        extended_valid_elements : "label,p,span,i[class]",
        'force_p_newlines'  : false,
        'forced_root_block' : '',
    };




    $scope.caclismultiple=function(){

        if($scope.form.ismultiple=='yes'){

            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;

    }

    $scope.delcopy=function(ev){

        console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }

        if($scope.ctext==true || $scope.chtml==true){
            console.log($(target).prev().prev().attr('indexval'));
           // $scope.form.ctext.splice($(target).prev().attr('indexval'),1);
           // /delete $scope.form.ctext.$(target).prev().attr('indexval');
            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
               ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }

        }








    }
    $scope.addcopy=function(ev){



        var target = ev.target || ev.srcElement || ev.originalTarget;





        //console.log($( target).parentsUntil('.copyarea').html());
        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                /*console.log($(target).parent().find('.clearfix1').last().find('.copyarea').last().index());
                console.log($(target).prev().find('.copyarea').last().html());
                console.log($(target).prev().html());
                console.log($(target).prev().attr('class'));
*/
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

               /* $(target).parent().find('.clearfix1').last().html("<div class='form-group' ng-show='chtml'>\
            <label >Put Html Content  :</label>\
            \<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'  required-message='content can not be blank' \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix clearfix1'></div>\
               \</div>");*/



                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");


                /*$(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');*/

                //var res=$('form').find('div[ng-show="chtml"]').html();
                //$('div[ng-show="chtml"]').find('textarea').last().attr('ui-tinymce',$scope.tinymceOptions);
                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
                //$rootScope.$digest();


            }
        }
        else {
            $('input.uploadbtn').click();
            console.log($('button.uploadbtn').text());
        }



        //$( target).appendTo($( target).parentsUntil(".form-group" ))
        //$( target).parentsUntil('.copyarea').after(chtml);



        /*if($scope.chtml==true) {
            $('.add-content').last().wysihtml5({
                toolbar: {
                    "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                    "emphasis": true, //Italics, bold, etc. Default true
                    "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                    "html": true, //Button which allows you to edit the generated HTML. Default false
                    "link": true, //Button to insert a link. Default true
                    "image": true, //Button to insert an image. Default true,
                    "color": true, //Button to change color of font
                    "blockquote": true, //Blockquote
                }
            });
        }*/
    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;


    $scope.ctype=function(ctype){

        //console.log(ev);

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        //$('textarea').removeAttr('required');

        if(ctype=='html') {

           // $('textarea[name^="chtml"]').attr('required','');
            $scope.chtml=true;
        }
        if(ctype=='text') {
            //$('textarea[name^="ctext"]').attr('required','');
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;

        //$compile($('.chtml'))($scope);
        //$compile($('.ctext'))($scope);



    }








    /*file upload part start */

/*
    setTimeout(function(){

        $('.add-content').wysihtml5({
            toolbar: {
                "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                "emphasis": true, //Italics, bold, etc. Default true
                "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                "html": true, //Button which allows you to edit the generated HTML. Default false
                "link": true, //Button to insert a link. Default true
                "image": true, //Button to insert an image. Default true,
                "color": true, //Button to change color of font
                "blockquote": true, //Blockquote
            }
        });

    },2000);*/


    $scope.$watch('event_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $rootScope.stateIsLoading = true;
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadcontent' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            if($scope.form.ismultiple=='yes'){

                $scope.form.resumearrn.push(response.data.image_name);
                $scope.form.resumearrp.push(response.data.image_url);

                $scope.form.resume = null;
                $scope.form.event_image = null;

            }
            else {

                $scope.form.resume = response.data.image_url;
                $scope.form.image_url_url = response.data.image_url_url;
                $scope.form.event_image = response.data.image_name;

                $scope.form.resumearrn=new Array();
                $scope.form.resumearrp=new Array();
            }
            $rootScope.stateIsLoading = false;

            //$('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            // $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */


    setTimeout(function(){
        $scope.form.country={};
        $scope.form.country.s_name='Belize';
        $('#country').val(20);
    },2000);



    $scope.contentValidator=function(){


       // console.log('in gender validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());



        if($scope.add_Admin.$submitted){

            /*if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.gender_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.gender_error=true;
                return '';

            }*/


           // if()




            if($scope.form.ismultiple=='yes'){



                //console.log($scope.chtml);



                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;



            //console.log($scope.form.ismultiple);

            if(typeof ($scope.form.ismultiple)!='undefined') return true;

            else return 'Required !' ;

        }

    }
    $scope.contenetv=function(){


       // console.log('in gender validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());



        if($scope.add_Admin.$submitted){

            /*if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.gender_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.gender_error=true;
                return '';

            }*/
            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);


           // if()

            console.log('in cont validator');






        }

    }

    $scope.submitadminForm=function(){


        if($scope.chtml == true ){

            var chtmlarr= new Array();
            chtmlarr=[];
            //$scope.form.chtml=null;

            /*$('textarea[name^="chtml"]').each(function(){

                console.log($(this).val());

                //chtmlarr.push($(this).val());


            });

            $scope.form.chtml = JSON.stringify(chtmlarr);*/


        }
        /*if($scope.ctext == true ){

            var chtmlarr= new Array();
            chtmlarr=[];
            $scope.form.ctext=null;

            $('textarea[name="ctext"]').each(function(){

                //console.log($(this).val());

                chtmlarr.push($(this).val());


            });

            $scope.form.ctext = JSON.stringify(chtmlarr);


        }*/

        console.log($scope.form);
        console.log($.param($scope.form));


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$('#employmentmodal').modal('show');
            console.log(data);

            if(typeof ($rootScope.previousState)!='undefined') $state.go($rootScope.previousState);
           // $scope.employmentform.reset();
           // $scope.form={};

            // $('#employmentmodal').modal('show');
            setTimeout(function(){


              //  $scope.form.country={};
              //  $scope.form.country.s_name='Belize';
              //  $('#country').val(20);
               // $('#employmentmodal').modal('hide');

            },3000);



    });

    }

    $scope.employmentsubmit=function(){



        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addemployement',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $('#employmentmodal').modal('show');
            //console.log($scope.signupForm)
            $scope.employmentform.reset();
            $scope.form={};

            // $('#employmentmodal').modal('show');
            setTimeout(function(){


                $scope.form.country={};
                $scope.form.country.s_name='Belize';
                $('#country').val(20);
                $('#employmentmodal').modal('hide');

            },3000);














        });





    }




});




/*tr.controller('login', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.login = function(){
        $rootScope.stateIsLoading = true;
        console.log(1);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminlogin',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'success'){
                $cookieStore.put('userid',data.userdetails.id);
                $cookieStore.put('useremail',data.userdetails.email);
                $cookieStore.put('userfullname',data.userdetails.fname+' '+data.userdetails.lname);
                $cookieStore.put('userfname',data.userdetails.fname);
                $cookieStore.put('userlname',data.userdetails.lname);
                $cookieStore.put('username',data.userdetails.username);
                $cookieStore.put('userrole',data.userdetails.userrole);

                if(typeof (data.userdetails.roles[4]) != 'undefined')
                    $cookieStore.put('userrole',4);
                if(typeof (data.userdetails.roles[5]) != 'undefined')
                    $cookieStore.put('userrole',5);
                if(typeof (data.userdetails.roles[6]) != 'undefined')
                    $cookieStore.put('userrole',6);
                if(typeof (data.userdetails.roles[7]) != 'undefined')
                    $cookieStore.put('userrole',7);
                console.log($cookieStore.get('userid'));
                console.log($cookieStore.get('useremail'));
                console.log($cookieStore.get('userfullname'));



                //console.log($rootScope.userrole);

                $state.go('dashboard');

                /!*


                 if(typeof($cookieStore.get('idea_det_id')) != 'undefined' && $cookieStore.get('idea_det_id')>0) {
                 $scope.idea_det_id = $cookieStore.get('idea_det_id');
                 $cookieStore.remove('idea_det_id');
                 $state.go('ideadetails',{ideaId: $scope.idea_det_id});
                 return
                 }else{
                 *!/
                //   $state.go('dashboard');
                //  return
                // }

            }else{
                $rootScope.stateIsLoading = false;
                $scope.errormsg = data.msg;

                console.log('in error'+$rootScope.stateIsLoading );
            }

        });
    }
});*/

tr.controller('addadmin', function($scope,$state,$http,$cookieStore,$rootScope) {
    // $state.go('login');
    $scope.contact=['Anytime','Early morning','Mid morning','Afternoon','Early evening','Late evening'];
    $scope.submitadminForm = function(){

        console.log($scope.adminUrl+'addadmin');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addadmin',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                console.log(data);
                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
            }else{
                $state.go('admin-list');
                return;
            }



        });


    }

    //console.log('in add admin form ');
});
tr.controller('imagesizeadd', function($scope,$state,$http,$cookieStore,$rootScope) {
    // $state.go('login');
    //$scope.contact=['Anytime','Early morning','Mid morning','Afternoon','Early evening','Late evening'];
    $scope.submitadminForm = function(){

        console.log($scope.adminUrl+'imagesizeadd');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagesizeadd',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                console.log(data);
                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
            }else{
                $state.go('imagesize-list');
                return;
            }



        });


    }

    //console.log('in add admin form ');
});


tr.controller('editadmin', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams){

    $scope.userid=$stateParams.userId;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'admindetails',
        data    : $.param({'uid':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            uid: data.uid,
            refferal_code: data.refferal_code,
            fname: data.fname,
            lname: data.lname,
            bname: data.bname,
            email: data.email,
            address: data.address,
            phone_no: data.phone_no,
            mobile_no: data.mobile_no,
            contact_time: data.contact_time,
        }
    });
    $scope.update = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('admin-list');
            return
        });
    }


})
tr.controller('editimagesize', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams){

    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'imagesizedetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            id: data.id,
            sizename: data.sizename,
            height: data.height,
            width: data.width,
            priority: data.priority,
            status: data.status,
            style_id: data.style_id

        }
    });
    $scope.update = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagesizeupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('imagesize-list');
            return
        });
    }


})


tr.controller('adminlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $scope.predicate = 'uid';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.mail.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }
/*
    $scope.deladmin = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteadmin',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }
*/

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.userlist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.userlist[idx].status = 0;
            }
           // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }




    //console.log('in add admin form ');
});
tr.controller('addaffiliate', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {

    $scope.submitadminForm = function(){
        $rootScope.usertype='affiliate';
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addadmin?type='+$rootScope.usertype,
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if(data.status == 'error'){
                console.log(data);
                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
            }else{
                $state.go('affiliate-list');
                return;
            }



        });


    }


})
tr.controller('affiliatelist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $rootScope.type='affiliate';
    $scope.predicate = 'uid';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];



    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist?type='+$rootScope.type,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.mail.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.commission_type.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.commission.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }


    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.userlist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.userlist[idx].status = 0;
            }
            // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }
    $scope.productaffiliatecode = function(item,size){
    $scope.productcode=$scope.baseUrl+'affiliates/'+item.product_affiliate_code;
    //$('.url_text').val('http://influx.spectrumiq.com/products/'+item.product_affiliate_code);
//console.log('http://influx.spectrumiq.com/products/'+item.product_affiliate_code);
    $uibModal.open({
        animation: true,
        templateUrl: 'productaffiliate.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        scope:$scope
    });
}


    //console.log('in add admin form ');
});
tr.controller('editaffiliate', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$stateParams) {
    $scope.userid=$stateParams.userId;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'admindetails',
        data    : $.param({'uid':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form = {
            uid: data.uid,
            refferal_code: data.refferal_code,
            fname: data.fname,
            lname: data.lname,
            bname: data.bname,
            email: data.email,
            address: data.address,
            phone_no: data.phone_no,
            mobile_no: data.mobile_no,
            contact_time: data.contact_time,
            commission_type: data.commission_type,
            commission: data.commission,
        }
    });
    $scope.update = function () {

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adminupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('affiliate-list');
            return
        });
    }




    //console.log('in add admin form ');
});
tr.controller('affiliatetrack',function($scope,$state,$http,$cookieStore,$rootScope,$uibModal){
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'affiliatetracklist',
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.affiliatelist=data;
        $scope.getArray =data;
        $scope.filename='affiliatetrackinglist';


    })
    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.affiliate_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.user_id.indexOf($scope.searchkey) != -1) ||(item.total_hit.indexOf($scope.searchkey) != -1)){
            return true;
        }
        return false;
    };

})
tr.controller('affiliatetrackdetails',function($scope,$stateParams,$state,$http,$cookieStore,$rootScope,$uibModal){
    $scope.predicate = 'affiliate_hit_id';
    $scope.reverse = true;
    $scope.affiliate_id=$stateParams.affiliate_id;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];
    $scope.id=$stateParams.id;


    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'affiliatetrackdetailslist1',
        data    : $.param({'affiliate_id':$scope.affiliate_id}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.affiliatelist=data;
        $scope.getArray =data;
        $scope.filename='affiliatetrackingdetailslist';


    })
    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.affiliate_hit_id.indexOf($scope.searchkey) != -1) || (item.affiliate_hit_ip.indexOf($scope.searchkey) != -1) ||(item.hit_time.indexOf($scope.searchkey) != -1)){
            return true;
        }
        return false;
    };

    $scope.affiliatehitdel=function(item,size){

        $scope.currentindex=$scope.affiliatelist.indexOf(item);
        $uibModal.open({
            animation: true,
            templateUrl: 'affiliatetrackdetailsdelconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });

    }

})

tr.controller('addcategoryjungle',function($scope,$state,$http,$cookieStore,$rootScope,Upload){

    $http({
        method  :   'POST',
        async   :   false,

        url :       $scope.adminUrl+'parentcategorylist',
        // data    : $.param($scope.form),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

    })

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };

    $scope.form= {cat_image:''};
    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('cat_upload', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });


    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjunglecategoryimage' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                if(response.data.image_url!='') {
                    $scope.cat_img_src = response.data.image_url;
                }

                $scope.form.cat_image = response.data.image_name;



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }




    $scope.addcategorysubmit=function() {


        $http({
            method  :   'POST',
            async   :   false,

            url :       $scope.adminUrl+'addjunglecategory',
            data    : $.param($scope.form),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(){
            $state.go('category-list');

        })

    }




})




tr.controller('junglecategorylist',function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$sce,$filter){
    $scope.trustAsHtml=$sce.trustAsHtml;

    $scope.predicate = 'id';
    $scope.reverse = true;

    var orderBy = $filter('orderBy');

    $scope.order = function(predicate) {

        console.log('pre'+predicate);
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.categorylist = orderBy($scope.categorylist, predicate, $scope.reverse);
    };


    $rootScope.integerId= function(val) {
        return parseInt(val, 10);
    };

    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'junglecategorylist',
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;


    })
    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.cat_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.cat_desc.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||  (item.priority.toString().indexOf($scope.searchkey.toString()) != -1) ||  (item.status.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.parent_cat_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.jungledelcategory = function(item,size){

        $scope.currentindex=$scope.categorylist.indexOf(item);


        $uibModal.open({
            animation: true,
            templateUrl: 'junglecategorydelconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }

    $scope.changestatus = function(item,size){

       // $uibModalInstance.dismiss('cancel');
        $scope.currentindex=$scope.categorylist.indexOf(item);
        $rootScope.stateIsLoading = true;
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'jungleupdatestatus',
            data    : $.param({id: $scope.categorylist[idx].id,status:$scope.categorylist[idx].status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if($scope.categorylist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.categorylist[idx].status = 0;
            }

        });

 /*       $uibModal.open({
            animation: true,
            templateUrl: 'junglecategorystatusfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
*/    }



})


tr.controller('editcategoryjungle', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,Upload){

    $http({
        method  :   'POST',
        async   :   false,

        url :       $scope.adminUrl+'parentcategorylist',
        // data    : $.param($scope.form),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

    })

    $scope.form= {cat_image:''};

    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'junglecategorydetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.form = {
            id: data.id,

            cat_name: data.cat_name,
            cat_desc: data.cat_desc,
            parent_cat: {
                id:data.parent_cat
            },
            type: data.type,
            priority: data.priority,
            cat_image: data.cat_image,


        }

        $scope.cat_img_src=data.image_url;
    });
    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('cat_upload', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });


    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjunglecategoryimage' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;


                $scope.cat_img_src = response.data.image_url;


                $scope.form.cat_image = response.data.image_name;



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.editcategorysubmit = function () {
        console.log(1);
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'junglecategoryupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('category-list');
            return;
        });
    }


})

tr.controller('eventlist',function($scope,$state,$http,$cookieStore,$rootScope,$sce,$filter,$uibModal){
    $scope.trustAsHtml=$sce.trustAsHtml;


    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //$scope.friends = orderBy($scope.friends, predicate, $scope.reverse);
    };

    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'eventlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.eventlist=data;
       // $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.event_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)|| (item.event_description.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.event_location.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.event_daterange.toString().indexOf($scope.searchkey.toString()) != -1)  ){
            return true;
        }
        return false;
    };

    $scope.delevent = function(item){

        $scope.currentindex=$scope.eventlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'eventconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });

    }


    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.eventlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updateeventstatus',
            data    : $.param({id: $scope.eventlist[idx].id,event_status: $scope.eventlist[idx].event_status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.eventlist[idx].event_status == 0){
                $scope.eventlist[idx].event_status = 1;
            }else{
                $scope.eventlist[idx].event_status = 0;
            }
        });
    }






});

tr.controller('addevent',function($scope,$state,$http,$cookieStore,$rootScope,$log,Upload){

    $scope.form={};
    $scope.event_status=false;
    $scope.event_img=false;


    if (typeof($cookieStore.get('userid')) != 'undefined' && $cookieStore.get('userid') > 0) {
        $scope.form.user_id = $cookieStore.get('userid');
    }


    /*file upload part start */



    $scope.$watch('event_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadeventbanner' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            $scope.event_img = response.data.image_url;
            $scope.form.event_image = response.data.image_name;

            $('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */








    setTimeout(function(){
        jQuery('input[name="event_daterange"]').daterangepicker({
            /* timePicker: true,
             timePickerIncrement: 30,*/
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        });

        /*
         $('#timepicker1').timepicker({
         minuteStep: 1,
         template: 'modal',
         appendWidgetTo: 'body',
         showSeconds: true,
         showMeridian: false,
         defaultTime: false
         });
         */

    },4000);


    $scope.addeventsForm=function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addevent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            $state.go('event-list');
            console.log(data);
            /* if(data.status == 'error'){
             console.log(data);
             $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
             }else{
             //console.log(data);
             //$cookieStore.put('user_insert_id',data);

             $state.go('finder-list');
             return;
             //console.log(data);
             }*/

        });



    }


    $scope.toggletimerange=function(){
        //console.log($scope.allday);
    }
    $scope.custom=function(){
        //console.log($scope.form);
        $scope.timeerror=false;
        $scope.form.event_status=$scope.event_status;
        //console.log($scope.timediff()+"test custom");
        if($scope.allday) {

            angular.element('#timeval').val('all day');
            $scope.form.timer='all day';

            return true;
        }
        if($scope.timediff()>0){
            $scope.form.timer=angular.element('input[ng-model="hours"]').eq(0).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()) +" to "+angular.element('input[ng-model="hours"]').eq(1).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(1).val());

            angular.element('#timeval').val(angular.element('input[ng-model="hours"]').eq(0).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()) +" to "+angular.element('input[ng-model="hours"]').eq(1).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(1).val()));
            return true ;
        }

        else {
            $scope.timeerror=true;
            return "Please set a correct time range for your event !!" ;
        }

        return true;
    }

    $scope.timediff= function () {

        /*console.log('td-'+parseInt($scope.endtime.getHours()-$scope.starttime.getHours()));
         console.log('md-'+parseInt($scope.endtime.getMinutes()-$scope.starttime.getMinutes()));*/


        ////console.log('td1-'+angular.element('input[ng-model="hours"]').eq(0).val());
        // console.log('td1-'+angular.element('input[ng-model="hours"]').eq(1).val());
        //console.log('md2-'+parseInt($scope.minutes));

        var totalst=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(0).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()));
        var totalet=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(1).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(1).val()));


        console.log('timediff'+parseInt(totalet-totalst));

        return parseInt(totalet-totalst);

        //
        /* console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(0).val());
         console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(1).val());*/
        //console.log('md2-'+parseInt($scope.minutes));
    }


    $scope.showtime=false;

    $scope.toggletimepicker=function(){

        console.log("before"+$scope.showtime);
        $scope.showtime=! $scope.showtime ;
        console.log("after"+$scope.showtime);
    }


    var st=new Date();
    //console.log(st.getHours());
    st.setHours(st.getHours());
    var et=new Date();
    //console.log(st.getHours());
    et.setHours(et.getHours()+1);
    $scope.endtime = et;
    $scope.starttime = st;

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = false;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.starttime = d;
        d.setHours( 15 );
        d.setMinutes( 0 );
        $scope.endtime = d;
    };

    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.starttime);
    };

    $scope.clear = function() {
        $scope.starttime = null;
    };




});
tr.controller('editevent', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,Upload,$log) {

    $scope.eventId = $stateParams.eventId;
    $scope.form={};
    $scope.event_status=false;
    $scope.event_img=false;

    $http({
        method: 'POST',
        async: false,
        url: $scope.adminUrl + 'eventdetails',
        data: $.param({'id': $scope.eventId}),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {
        console.log(data);
        if(data.event_timerange=='all day') {
            $scope.allday=true;
        }
        else{

            var result = data.event_timerange.split('to');


            var sttime=result[0].split(':');
            var sthour=parseInt(sttime[0]);
            var stmin=parseInt(sttime[1]);

            var ettime=result[1].split(':');
            var ethour=parseInt(ettime[0]);
            var etmin=parseInt(ettime[1]);
            var st=new Date();
            //console.log(st.getHours());
            st.setHours(sthour);
            st.setMinutes(stmin);
            var et=new Date();
            //console.log(st.getHours());
            et.setHours(ethour);
            et.setMinutes(etmin);
            $scope.endtime = et;
            $scope.starttime = st;
        }

        $scope.form = {
            id: data.id,
            event_name: data.event_name,
            event_description: data.event_description,
            event_location: data.event_location,
            event_image: data.event_image,
            //event_status: data.event_status,
            event_daterange: data.event_daterange,
            event_timerange: data.event_timerange,
            phone_no: data.phone_no,
            mobile_no: data.mobile_no,
            contact_time: data.contact_time,
        }

        $scope.event_img=data.image_url;

        if(data.event_status == 1 ) {
            $scope.form.event_status=true;
            $scope.event_status=true;
        }
        else{
            $scope.form.event_status=false;
            $scope.event_status=false;


        }
    });

console.log($scope.form);
    $scope.$watch('event_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadeventbanner' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            $scope.event_img = response.data.image_url;
            $scope.form.event_image = response.data.image_name;

            $('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    /*file upload end */








    setTimeout(function(){
        jQuery('input[name="event_daterange"]').daterangepicker({
            /* timePicker: true,
             timePickerIncrement: 30,*/
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        });

        /*
         $('#timepicker1').timepicker({
         minuteStep: 1,
         template: 'modal',
         appendWidgetTo: 'body',
         showSeconds: true,
         showMeridian: false,
         defaultTime: false
         });
         */

    },4000);


    $scope.addeventsForm=function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'eventupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            $state.go('event-list');
            console.log(data);
            /* if(data.status == 'error'){
             console.log(data);
             $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
             }else{
             //console.log(data);
             //$cookieStore.put('user_insert_id',data);

             $state.go('finder-list');
             return;
             //console.log(data);
             }*/

        });



    }


    $scope.toggletimerange=function(){
        //console.log($scope.allday);
    }
    $scope.custom=function(){
        //console.log($scope.form);
        $scope.timeerror=false;
        $scope.form.event_status=$scope.event_status;
        //console.log($scope.timediff()+"test custom");
        if($scope.allday) {

            angular.element('#timeval').val('all day');
            $scope.form.timer='all day';

            return true;
        }
        if($scope.timediff()>0){

            console.log($scope.form.timer);
            $scope.form.timer=angular.element('input[ng-model="hours"]').eq(0).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()) +" to "+angular.element('input[ng-model="hours"]').eq(1).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(1).val());

            angular.element('#timeval').val(angular.element('input[ng-model="hours"]').eq(0).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()) +" to "+angular.element('input[ng-model="hours"]').eq(1).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(1).val()));
            return true ;
        }

        else {
            $scope.timeerror=true;
            return "Please set a correct time range for your event !!" ;
        }

        return true;
    }

    $scope.timediff= function () {

        /*console.log('td-'+parseInt($scope.endtime.getHours()-$scope.starttime.getHours()));
         console.log('md-'+parseInt($scope.endtime.getMinutes()-$scope.starttime.getMinutes()));*/


        ////console.log('td1-'+angular.element('input[ng-model="hours"]').eq(0).val());
        // console.log('td1-'+angular.element('input[ng-model="hours"]').eq(1).val());
        //console.log('md2-'+parseInt($scope.minutes));

        var totalst=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(0).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()));
        var totalet=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(1).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(1).val()));


        console.log('timediff'+parseInt(totalet-totalst));

        return parseInt(totalet-totalst);

        //
        /* console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(0).val());
         console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(1).val());*/
        //console.log('md2-'+parseInt($scope.minutes));
    }


    $scope.showtime=false;

    $scope.toggletimepicker=function(){

        console.log("before"+$scope.showtime);
        $scope.showtime=! $scope.showtime ;
        console.log("after"+$scope.showtime);
    }


    var st=new Date();
    //console.log(st.getHours());
    st.setHours(st.getHours());
    var et=new Date();
    //console.log(st.getHours());
    et.setHours(et.getHours()+1);
    $scope.endtime = et;
    $scope.starttime = st;

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = false;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.starttime = d;
        d.setHours( 15 );
        d.setMinutes( 0 );
        $scope.endtime = d;

        console.log('st'+$scope.starttime);
        console.log('et'+$scope.endtime);
    };

    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.starttime);
    };

    $scope.clear = function() {
        $scope.starttime = null;
    };




})

tr.controller('testimoniallist',function($scope,$state,$http,$cookieStore,$rootScope,$sce,$filter,$uibModal){
    $scope.trustAsHtml=$sce.trustAsHtml;


    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //$scope.friends = orderBy($scope.friends, predicate, $scope.reverse);
    };

    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'testimonial/list',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.testimoniallist=data;
    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.user_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ){
            return true;
        }
        return false;
    };

    $scope.deltestimonial = function(item){

        $scope.currentindex=$scope.testimoniallist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'testimonialconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });

    }


    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.testimoniallist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'testimonial/updatestatus',
            data    : $.param({id: $scope.testimoniallist[idx].id,status: $scope.testimoniallist[idx].testimonial_status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.testimoniallist[idx].testimonial_status == 0){
                $scope.testimoniallist[idx].testimonial_status = 1;
            }else{
                $scope.testimoniallist[idx].testimonial_status = 0;
            }
        });
    }






});



tr.controller('bloglist',function($scope,$state,$http,$cookieStore,$rootScope,$sce,$filter,$uibModal){
    $scope.trustAsHtml=$sce.trustAsHtml;


    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //$scope.friends = orderBy($scope.friends, predicate, $scope.reverse);
    };

    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bloglist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.bloglist=data;
        // $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.blog_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)|| (item.blog_description.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.blog_asset.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)  ){
            return true;
        }
        return false;
    };

    $scope.delblog = function(item){

        $scope.currentindex=$scope.bloglist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'blogconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope
        });

    }


    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.bloglist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updateblogstatus',
            data    : $.param({id: $scope.bloglist[idx].id,blog_status: $scope.bloglist[idx].blog_status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.bloglist[idx].blog_status == 0){
                $scope.bloglist[idx].blog_status = 1;
            }else{
                $scope.bloglist[idx].blog_status = 0;
            }
        });
    }






});

tr.controller('addblog',function($scope,$state,$http,$cookieStore,$rootScope,$log,Upload,$uibModal,$timeout){
     $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
         console.log($scope.youtubeTxt);
        if(typeof($scope.youtubeTxt) == 'undefined'){

            $scope.Commentmsg = $uibModal.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = $uibModal.open({
                    templateUrl: 'youtubeVideo111',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }


    $scope.form={'blog_file':''};
    $scope.blog_status=false;
    $scope.blog_img=false;
    $scope.blog_video_url=false;


    if (typeof($cookieStore.get('userid')) != 'undefined' && $cookieStore.get('userid') > 0) {
        $scope.form.user_id = $cookieStore.get('userid');
    }


    /*file upload part start */



    $scope.$watch('blog_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadblogbanner' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            $scope.blog_img = response.data.image_url;
            $scope.form.blog_file = response.data.image_name;

            $('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */

    $scope.addYtVideo1= function(item){

        console.log(item);

        $scope.blog_video_url=$scope.form.blog_file=item.id.videoId;

        $scope.ytdialog.close();
    }







    $scope.addblogformsubmit=function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addblog',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            $state.go('blog-list');

        });



    }







});
tr.controller('editblog', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,Upload,$log) {

    $scope.blogid = $stateParams.blogid;
    $scope.form={};

    $scope.blog_img=false;
    $scope.blog_video_url=false;

    $http({
        method: 'POST',
        async: false,
        url: $scope.adminUrl + 'blogdetails',
        data: $.param({'id': $scope.blogid}),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data) {

        $scope.form = {
            id: data.id,
            user_id: data.user_id,
            blog_name: data.blog_name,
            blog_description: data.blog_description,
            blog_asset: data.blog_asset,
            blog_file: data.blog_file,
            blog_status: data.blog_status,
        }

        $scope.blog_img=data.image_url;
        $scope.blog_video_url=data.blog_file;

    });

    $scope.youtubesearch = function(){
        $scope.youtubeTxt= $scope.form.search_youtube;
        console.log($scope.youtubeTxt);
        if(typeof($scope.youtubeTxt) == 'undefined'){

            $scope.Commentmsg = $uibModal.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = $uibModal.open({
                    templateUrl: 'youtubeVideo111',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }




    if (typeof($cookieStore.get('userid')) != 'undefined' && $cookieStore.get('userid') > 0) {
        $scope.form.user_id = $cookieStore.get('userid');
    }


    /*file upload part start */



    $scope.$watch('blog_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadblogbanner' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            $scope.blog_img = response.data.image_url;
            $scope.form.blog_file = response.data.image_name;

            $('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */

    $scope.addYtVideo1= function(item){

        console.log(item);

        $scope.blog_video_url=$scope.form.blog_file=item.id.videoId;

        $scope.ytdialog.close();
    }







    $scope.editblogformsubmit=function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'blogupdates',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            $state.go('blog-list');

        });



    }



})


tr.controller('addproductjungle',function($scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$uibModal){
    $scope.trustAsHtml=$sce.trustAsHtml;
    $http({
        method  :   'POST',
        async   :   false,

        url :       $scope.adminUrl+'junglecategorylist',
        // data    : $.param($scope.form),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

    })

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };


    $scope.product_video_src='';
    $scope.product_img_src='';
    $scope.productfiletype='';
    $scope.form= {product_file:''};
    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('product_upload', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });


    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjungleproductimage' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                /*if(response.data.video_url!='') {
                 $sce.trustAsResourceUrl(response.data.video_url);
                 $scope.product_video_src = response.data.video_url;
                 }*/

                $scope.is_video=response.data.is_video;
                if(response.data.image_url!='') {
                    $scope.product_img_src = response.data.image_url;
                    $scope.productfiletype = 'image';
                }

                if($scope.is_video == 1){
                    $scope.form.product_file = response.data.video_name;
                    $scope.video_url1222 = response.data.video_url1222;
                    $scope.productfiletype = 'video';
                }else{
                    $scope.form.product_file = response.data.image_name;
                }






                if(typeof($scope.product_video_src)!='undefined') {
                    setTimeout(function () {

                        angular.element(document.querySelector('#maintvDiv')).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + $scope.product_video_src + '" type="video/mp4">\
            </video>');
                    }, 2000);

                }



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.showvideo = function(video_url1222){
        $uibModal.open({
            animation: true,
            template: '<div style="position: relative;"><a href="javascript:void(0);" style="position: absolute; top: 0; right: 0; color:#fff; background-color: #000; width:40px; font-size: 40px; text-align:center;" ng-click="cancel()">&times;</a><video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + video_url1222 + '" type="video/mp4">\
            </video></div>',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope

        });
    }
            /*-----------File Upload end----------------*/


/*------------------------Downloadable file upload Start-----------------------*/
    $scope.productdownloadfiletype='';
    $scope.product_download_src='';
    $scope.form= {productdownload_file:''};

    $scope.$watch('product_download', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });


    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjungleproductimage1' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                /*if(response.data.video_url!='') {
                 $sce.trustAsResourceUrl(response.data.video_url);
                 $scope.product_video_src = response.data.video_url;
                 }*/

                $scope.is_video1=response.data.is_video;
                if(response.data.image_url!='') {
                    $scope.product_download_src = response.data.image_url;
                    $scope.productdownloadfiletype = response.data.productdownloadfiletype;
                }

                if($scope.is_video == 1){
                    $scope.form.productdownload_file = response.data.video_name;
                    $scope.video_ur_downloadl1222 = response.data.video_url1222;
                    $scope.productdownloadfiletype = 'video';
                }else{
                    $scope.form.productdownload_file = response.data.image_name;
                }






                if(typeof($scope.product_video_src)!='undefined') {
                    setTimeout(function () {

                        angular.element(document.querySelector('#maintvDiv')).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + $scope.product_video_src + '" type="video/mp4">\
            </video>');
                    }, 2000);

                }



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.showvideo1 = function(video_ur_downloadl1222){
        $uibModal.open({
            animation: true,
            template: '<div style="position: relative;"><a href="javascript:void(0);" style="position: absolute; top: 0; right: 0; color:#fff; background-color: #000; width:40px; font-size: 40px; text-align:center;" ng-click="cancel()">&times;</a><video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + video_ur_downloadl1222 + '" type="video/mp4">\
            </video></div>',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope

        });
    }
    /*------------------End Downloadable file upload-------------------*/



    $scope.addproductsubmit=function() {


        console.log($scope.form);


        $scope.form.category_id=JSON.stringify($scope.form.category_id);
        if (typeof($cookieStore.get('userid')) != 'undefined' && $cookieStore.get('userid') > 0) {
            $scope.form.userid = $cookieStore.get('userid');
        }

        $http({
            method  :   'POST',
            async   :   false,

            url :       $scope.adminUrl+'addjungleproduct',
            data    : $.param($scope.form),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(){
            $state.go('product-list');

        })

    }




})


tr.controller('jungleproductlist',function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$sce){
    $scope.trustAsHtml=$sce.trustAsHtml;

    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        //$scope.friends = orderBy($scope.friends, predicate, $scope.reverse);
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist',
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=data;
    })
    $scope.searchkey = '';
    $scope.search = function(item){


        console.log(item)

        if ( (item.product_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||  (item.status.toString().indexOf($scope.searchkey) != -1) || (item.cat_name.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.product_desc.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.payout.toString().indexOf($scope.searchkey) != -1) || (item.credits.toString().indexOf($scope.searchkey) != -1) ){
            return true;
        }
        return false;
    };

    $scope.jungledelproduct = function(item,size){

        $scope.currentindex=$scope.productlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'jungleproductdelconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }

    $scope.changeproductstatus = function(item,size){

        $scope.currentindex=$scope.productlist.indexOf(item);
        var idx = $scope.currentindex;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'jungleproductupdatestatus',
            data    : $.param({id: $scope.productlist[idx].id,status:$scope.productlist[idx].status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            $scope.productlist[idx].status = !$scope.productlist[idx].status;
        });


 /*       $uibModal.open({
            animation: true,
            templateUrl: 'jungleproductstatusfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
*/    }



})

tr.controller('editproductjungle', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams,$sce,Upload,$uibModal){
    $scope.trustAsHtml=$sce.trustAsHtml;
    $scope.product_video_src='';
    $scope.product_img_src='';

    $http({
        method  :   'POST',
        async   :   false,

        url :       $scope.adminUrl+'junglecategorylist',
        // data    : $.param($scope.form),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

    })

    $scope.id=$stateParams.id;

    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'jungleproductdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {


        $scope.is_video=data.is_video;
        $scope.is_video1=data.is_video1;
        $scope.productfiletype = data.productfiletype;
        $scope.productdownloadfiletype = data.productdownloadfiletype;
        if(data.image_url!='') {
            $scope.product_img_src = data.image_url;
           // $scope.productfiletype = 'image';
        }
        if(data.image_url1!='') {
            $scope.product_download_src = data.image_url1;
//
        }



        if($scope.is_video == 1){
            $scope.product_img_src = data.cover_img_url;
            $scope.video_url1222 = data.video_url;
          //  $scope.productfiletype = 'video';
        }
        if($scope.is_video1 == 1){
            //$scope.product_img_src = data.cover_img_url;
            $scope.video_ur_downloadl1222 = data.video_url;
        }

        $scope.form = {
            id: data.id,

            product_name: data.product_name,
            product_desc: data.product_desc,
            /*category_id: {
             id:data.category_id,
             type:data.type,
             },*/
            category_id:JSON.parse(data.category_id),
            product_file: data.product_file,
            productdownload_file: data.productdownload_file,
            is_download: data.is_download,
            priority: data.priority,
            price: data.price,
            payout: data.payout,
            credits: data.credits,

        }
    });


    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
    };


/*
    $scope.product_video_src='';
    $scope.product_img_src='';

    $scope.form= {product_file:''};
    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('product_upload', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });


    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjungleproductimage' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;
                if(response.data.video_url!='') {
                    $sce.trustAsResourceUrl(response.data.video_url);
                    $scope.product_video_src = response.data.video_url;
                }
                if(response.data.image_url!='') {
                    $scope.product_img_src = response.data.image_url;
                }

                $scope.form.product_file = response.data.image_name;
                console.log($scope.product_video_src);

                if(typeof($scope.product_video_src)!='undefined') {

                    console.log(11);
                    setTimeout(function () {

                        angular.element(document.querySelector('#maintvDiv')).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + $scope.product_video_src + '" type="video/mp4">\
            </video>');
                    }, 2000);

                }



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
*/



    $scope.product_video_src='';
    $scope.product_img_src='';
    $scope.form= {product_file:''};
    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('product_upload', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });


    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjungleproductimage' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                /*if(response.data.video_url!='') {
                 $sce.trustAsResourceUrl(response.data.video_url);
                 $scope.product_video_src = response.data.video_url;
                 }*/

                $scope.is_video=response.data.is_video;
                if(response.data.image_url!='') {
                    $scope.product_img_src = response.data.image_url;
                    $scope.productfiletype = 'image';
                }

                if($scope.is_video == 1){
                    $scope.form.product_file = response.data.video_name;
                    $scope.video_url1222 = response.data.video_url1222;
                    $scope.productfiletype = 'video';
                }else{
                    $scope.form.product_file = response.data.image_name;
                }






                if(typeof($scope.product_video_src)!='undefined') {
                    setTimeout(function () {

                        angular.element(document.querySelector('#maintvDiv')).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + $scope.product_video_src + '" type="video/mp4">\
            </video>');
                    }, 2000);

                }



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.showvideo = function(video_url1222){
        $uibModal.open({
            animation: true,
            template: '<div style="position: relative;"><a href="javascript:void(0);" style="position: absolute; top: 0; right: 0; color:#fff; background-color: #000; width:40px; font-size: 40px; text-align:center;" ng-click="cancel()">&times;</a><video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + video_url1222 + '" type="video/mp4">\
            </video></div>',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope

        });
    }
    /*-----------File Upload end----------------*/


    /*------------------------Downloadable file upload Start-----------------------*/
    //$scope.productdownloadfiletype='';
   // $scope.product_download_src='';
    //$scope.form= {productdownload_file:''};

    $scope.$watch('product_download', function (files) {
        $('.errormsg').html('');
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });


    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {

        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadjungleproductimage1' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            // console.log(response.data.status);
            if(response.data.status=='error'){
                $('.errormsg').html('Invalid file type.');
            }
            else {
                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                /*if(response.data.video_url!='') {
                 $sce.trustAsResourceUrl(response.data.video_url);
                 $scope.product_video_src = response.data.video_url;
                 }*/

                $scope.is_video=response.data.is_video;
                if(response.data.image_url!='') {
                    $scope.product_download_src = response.data.image_url;
                    $scope.productdownloadfiletype = response.data.productdownloadfiletype;
                }

                if($scope.is_video == 1){
                    $scope.form.productdownload_file = response.data.video_name;
                    $scope.video_ur_downloadl1222 = response.data.video_urll1222;
                    $scope.productdownloadfiletype = 'video';
                }else{
                    $scope.form.productdownload_file = response.data.image_name;
                }






                if(typeof($scope.product_video_src)!='undefined') {
                    setTimeout(function () {

                        angular.element(document.querySelector('#maintvDiv')).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + $scope.product_video_src + '" type="video/mp4">\
            </video>');
                    }, 2000);

                }



            }


        }, function (response) {
            console.log(response.status);
            if(response.data.status>0) {

                //  $scope.errorMsg = response.status + ': ' + response.data;
            }

        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.showvideo1 = function(video_ur_downloadl1222){
        $uibModal.open({
            animation: true,
            template: '<div style="position: relative;"><a href="javascript:void(0);" style="position: absolute; top: 0; right: 0; color:#fff; background-color: #000; width:40px; font-size: 40px; text-align:center;" ng-click="cancel()">&times;</a><video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + video_ur_downloadl1222 + '" type="video/mp4">\
            </video></div>',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope

        });
    }
    /*------------------End Downloadable file upload-------------------*/


    $scope.editproductsubmit=function() {

        $scope.form.category_id=JSON.stringify($scope.form.category_id);

        $http({
            method  :   'POST',
            async   :   false,

            url :       $scope.adminUrl+'jungleproductupdates',
            data    : $.param($scope.form),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(){
            $state.go('product-list');

        })

    }

    $scope.showvideo = function(video_url1222){
        $uibModal.open({
            animation: true,
            template: '<div style="position: relative;"><a href="javascript:void(0);" style="position: absolute; top: 0; right: 0; color:#fff; background-color: #000; width:40px; font-size: 40px; text-align:center;" ng-click="cancel()">&times;</a><video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="' + video_url1222 + '" type="video/mp4">\
            </video></div>',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            scope:$scope

        });
    }



})
tr.controller('generaluserlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $rootScope.type='generaluser';
    $scope.predicate = 'uid';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist?type='+$rootScope.type,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.lname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.mail.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.mobile_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)||(item.phone_no.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ||(item.address.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1)){
            return true;
        }
        return false;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.userlist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.userlist[idx].status = 0;
            }
            // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }




    //console.log('in add admin form ');
});
tr.controller('orderlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $scope.form = {
        from_date:'',
        to_date:'',
    }

    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.to_date) != 'undefined'){
            $scope.maxDate = new Date($scope.form.to_date);
        }
    }

    $scope.setDate = function(){
        if(typeof($scope.form.from_date) != 'undefined'){
            $scope.minDate1 = new Date($scope.form.from_date);
        }
    }

    $scope.open11 = function() {
        $scope.opened1 = true;
    };

    $scope.open1 = function() {
        $scope.opened = true;
    };


    $rootScope.type='affiliate';
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'adminlist?type='+$rootScope.type,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.affiliatelist=data;
        //$scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });
    $scope.searchbyaffiliate=function(item){
        if(typeof(item)!='undefined'){
            $scope.searchkey = item.uid;
        }
        else{
            $scope.searchkey = '';
        }

    }
    $scope.searchbyOrderStatus=function(item){
        console.log(item);
        if(typeof(item)!='undefined'){
            $scope.searchkey1 = item.id;
        }
        else{
            $scope.searchkey1 = '';
        }

    }


    $scope.orderstatuslist = [
        {
            'id':1,
            'text':'Pending'
        },
        {
            'id':2,
            'text':'In Progress'
        },
        {
            'id':3,
            'text':'Confirmed'
        },
        {
            'id':4,
            'text':'Canceled'
        }

    ]
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'orderlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.orderlist=data;
       // $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.searchkey1 = '';
    $scope.search = function(item){

        if ( (item.affiliate_id.toString().indexOf($scope.searchkey.toString()) != -1 )){
            return true;
        }
        return false;
    };

    $scope.search1 = function(item){

        if ( ( item.order_status.toString().indexOf($scope.searchkey1.toString()) != -1)){
            return true;
        }
        return false;
    };
    $scope.searchdate = function(item){

        var from_time = 0;
        var to_time = 0;
        if($scope.form.from_date != null && typeof($scope.form.from_date) != 'undefined' && $scope.form.from_date != ''){
            var from_date1 = $scope.form.from_date;
            var from_date = from_date1.getDate();
            var from_mon = from_date1.getMonth();
            var from_year = from_date1.getFullYear();
            var d = new Date(from_year, from_mon, from_date, 0, 0, 0);
            from_time = d.getTime()/1000;
        }
        if($scope.form.to_date != null && typeof($scope.form.to_date) != 'undefined' && $scope.form.to_date != ''){
            var to_date1 = $scope.form.to_date;
            var to_date = to_date1.getDate();
            var to_mon = to_date1.getMonth();
            var to_year = to_date1.getFullYear();
            var d = new Date(to_year, to_mon, to_date, 23, 59, 59);
            to_time = d.getTime()/1000;

        }
        if(from_time == 0 && to_time == 0){


            return true;
        }
        else if(to_time == 0){
            if  (item.order_time > from_time) {
                return true;
            }else{
                return false;
            }
        }
        else if(from_time == 0){
            if (item.order_time < to_time){
                return true;
            }else{
                return false;
            }
        }else{
            if ( (item.order_time > from_time && item.order_time < to_time) ){
                return true;
            }else{
                return false;
            }
        }

    };


    $scope.changeOrderStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.orderlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'orderupdatestatus',
            data    : $.param({id: $scope.orderlist[idx].id,status:$scope.orderlist[idx].dd_order_status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
        });
    }
    $scope.duplicate_mail=function(id){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'cart/duplicatemail',
            data    : $.param({id: id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
        });

    }
});
tr.controller('orderdetails', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal,$stateParams) {

    $scope.orderid=$stateParams.orderid;
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'orderdetails',
         data    : $.param({orderid:$scope.orderid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.orderdetails=data;
        console.log($scope.orderdetails.productdet);

    });

});



tr.controller('contentlist', function($scope,$state,$http,$cookieStore,$rootScope) {




    $scope.getTextToCopy = function() {
        return "ngClip is awesome!";
    }
    $scope.doSomething = function () {
        console.log("NgClip...");
    }

    var clipboard = new Clipboard('.btn');


    $scope.currentPage=1;
    $scope.perPage=3;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'contentlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        //console.log(data);
        var x;
        var y;

        for (x in data ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content));
            //console.log(($rootScope.contentdata[x].parentid));


            if(data[x].ctype!='image') {

                for (y in data[x].content) {
                    if (data[x].ctype != 'image')
                        contentw += (data[x].content[y]);
                    else {

                        contentw += "<img src=" + data[x].content[y] + " />";
                    }
                }
                data[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


            //console.log(($rootScope.contentdata[x].content));
            $scope[data.cname+data[x].id]=data[x];
            if(data[x].parentid!=0){

                var z=parseInt(data[x].parentid);
                console.log(z);
                console.log(data[x].cname+data[x].parentid);

                $scope[data[x].cname+data[x].parentid]=data[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }


        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.cname.indexOf($scope.searchkey) != -1) || (item.content.indexOf($scope.searchkey) != -1) ){
            return true;
        }
        return false;

        //return true;
    };
    $scope.deladmin = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteadmin',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }




    //console.log('in add admin form ');
});


tr.controller('imagesizelist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=3;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'imagesizelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.sizename.indexOf($scope.searchkey) != -1) || (item.height.indexOf($scope.searchkey) != -1) ||(item.width.indexOf($scope.searchkey) != -1)||(item.mobile_no.indexOf($scope.searchkey) != -1)||(item.phone_no.indexOf($scope.searchkey) != -1) ||(item.address.indexOf($scope.searchkey) != -1)){
            return true;
        }
        return false;
    };
    $scope.deladmin = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deleteimagesizeupdate',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'imagesizeupdatestatus',
            data    : $.param({id: $scope.userlist[idx].id,status:$scope.userlist[idx].status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist[idx].status = 1-$scope.userlist[idx].status;
        });
    }




    //console.log('in add admin form ');
});


tr.controller('signupuserlist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=2;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'contactuserlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.indexOf($scope.searchkey) != -1) || (item.lname.indexOf($scope.searchkey) != -1) ||(item.email.indexOf($scope.searchkey) != -1)||(item.phone.indexOf($scope.searchkey) != -1)||(item.country.indexOf($scope.searchkey) != -1) ||(item.city.indexOf($scope.searchkey) != -1)||(item.message.indexOf($scope.searchkey) != -1)){
            return true;
        }
        return false;
    };
    $scope.delcontactuser = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletecontactuser',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }






    //console.log('in add admin form ');
});

tr.controller('contactlist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=4;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'contactlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.name.indexOf($scope.searchkey) != -1) || (item.email.indexOf($scope.searchkey) != -1) ||(item.phone.indexOf($scope.searchkey) != -1)||(item.message.indexOf($scope.searchkey) != -1)||(item.subject.indexOf($scope.searchkey) != -1) ){
            return true;
        }
        return false;
    };
    $scope.delcontact = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletecontact',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }






    //console.log('in add admin form ');
});


tr.controller('employementlist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=4;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'employementlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.indexOf($scope.searchkey) != -1) || (item.lname.indexOf($scope.searchkey) != -1) ||(item.phone.indexOf($scope.searchkey) != -1)||(item.email.indexOf($scope.searchkey) != -1)||(item.country.indexOf($scope.searchkey) != -1)||(item.city.indexOf($scope.searchkey) != -1) ){
            return true;
        }
        return false;
    };
    $scope.delcontact = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletecontact',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }






    //console.log('in add admin form ');
});

tr.controller('pilotlist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=4;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'pilotlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.indexOf($scope.searchkey) != -1) || (item.lname.indexOf($scope.searchkey) != -1) ||(item.phone.indexOf($scope.searchkey) != -1)||(item.email.indexOf($scope.searchkey) != -1)||(item.country.indexOf($scope.searchkey) != -1)||(item.city.indexOf($scope.searchkey) != -1) ){
            return true;
        }
        return false;
    };
    $scope.delcontact = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletecontact',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }






    //console.log('in add admin form ');
});



tr.controller('eventrsvplist', function($scope,$state,$http,$cookieStore,$rootScope) {
    $scope.currentPage=1;
    $scope.perPage=4;
    $scope.begin=0;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(){
        console.log($scope.currentPage);
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'admineventrsvp',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.userlist=data;
        $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fname.indexOf($scope.searchkey) != -1) || (item.lname.indexOf($scope.searchkey) != -1) ||(item.phone.indexOf($scope.searchkey) != -1)||(item.email.indexOf($scope.searchkey) != -1)||(item.event_name.indexOf($scope.searchkey) != -1)){
            return true;
        }
        return false;
    };
    $scope.delcontact = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'deletecontact',
            data    : $.param({id: $scope.userlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.userlist.splice(idx,1);
            $scope.userlistp = $scope.userlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }


$scope.exporttable=function(){
    console.log('export');
    exportTableToCSV.apply($('#example1'), [$('#example1'), 'export.csv']);
}

setTimeout(function(){
    $(".export").on('click', function (event) {
        // CSV
        console.log('export click');
        exportTableToCSV.apply(this, [$('#example1'), 'export'+Date.now()+'.csv']);

        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });
},2000);

   $scope.exportTableToCSV= function ($table, filename) {

        var $rows = $table.find('tr:has(td)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                    var $row = $(row),
                        $cols = $row.find('td');

                    return $cols.map(function (j, col) {
                        var $col = $(col),
                            text = $col.text();

                        return text.replace(/"/g, '""'); // escape double quotes

                    }).get().join(tmpColDelim);

                }).get().join(tmpRowDelim)
                    .split(tmpRowDelim).join(rowDelim)
                    .split(tmpColDelim).join(colDelim) + '"',

        // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
                'download': filename,
                'href': csvData,
                'target': '_blank'
            });
    }







    //console.log('in add admin form ');
});





tr.controller('addflight',function($scope,$state,$http,$cookieStore,$rootScope,$log,Upload,uibDateParser){


    $scope.format = 'yyyy/MM/dd';
    $scope.date = new Date();
    $scope.open = function() {
        $scope.opened = true;
    };

    $scope.tdif=3600;


    $scope.addanother=function(){
        $scope.isaddanother=true;
    }
    $scope.psubmit=function(){
        $scope.isaddanother=false;
    }

    $scope.form={};
    $scope.form.first_flight= $cookieStore.get('userfname');
    $scope.form.last_flight= $cookieStore.get('userlname');

    setTimeout(function(){

        $('input[name="first_flight"]').val($cookieStore.get('userfname'));
        $('input[name="last_flight"]').val($cookieStore.get('userlname'));


        console.log( $('input[name="first_flight"]').val()+'f val');
        console.log( $('input[name="last_flight"]').val()+'l val');

    },1500);


    $scope.event_status=false;
    $scope.form.user_id=$rootScope.userid;
    $scope.event_img=false;




    /*file upload part start */



    $scope.$watch('event_imgupload', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        $('#loaderDiv').addClass('ng-hide');
        file.upload = Upload.upload({
            url: $scope.adminUrl+'uploadeventbanner' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'id':$rootScope.createIdeaId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').removeClass('ng-hide');
            file.result = response.data;

            $scope.event_img = response.data.image_url;
            $scope.form.event_image = response.data.image_name;

            $('#loaderDiv').addClass('ng-hide');


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            $('#loaderDiv').removeClass('ng-hide');

            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    /*file upload end */








    setTimeout(function(){
        jQuery('input[name="event_daterange"]').daterangepicker({
            /* timePicker: true,
             timePickerIncrement: 30,*/
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        });

        /*
         $('#timepicker1').timepicker({
         minuteStep: 1,
         template: 'modal',
         appendWidgetTo: 'body',
         showSeconds: true,
         showMeridian: false,
         defaultTime: false
         });
         */

    },4000);


    $scope.addeventsForm=function(){


        $scope.form.flight_daterangeorg=($scope.form.flight_daterange);
        $scope.form.flight_daterange=convert($scope.form.flight_daterange);

        console.log($.param($scope.form));

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addflight',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$rootScope.stateIsLoading = false;
            if($scope.isaddanother){


                $scope.df=$scope.form.flight_daterangeorg;
                $scope.add_event.reset();
                $scope.form.flight_daterange=$scope.df;
                $('input[name="flight_daterange"]').val($scope.df);

                $scope.form.first_flight= $cookieStore.get('userfname');
                $scope.form.last_flight= $cookieStore.get('userlname');



                $('input[name="first_flight"]').val($cookieStore.get('userfname'));
                $('input[name="last_flight"]').val($cookieStore.get('userlname'));

                $('select').val('');
            }else{
                $state.go('flight-list');
            }
            console.log(data);
            /* if(data.status == 'error'){
             console.log(data);
             $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
             }else{
             //console.log(data);
             //$cookieStore.put('user_insert_id',data);

             $state.go('finder-list');
             return;
             //console.log(data);
             }*/

        });



    }


    $scope.toggletimerange=function(){
        //console.log($scope.allday);
    }
    $scope.custom=function(){
        //console.log($scope.form);
        $scope.timeerror=false;
        $scope.form.event_status=$scope.event_status;
        //console.log($scope.timediff()+"test custom");
        if($scope.allday) {

            angular.element('#timeval').val('all day');
            $scope.form.timer='all day';

            return true;
        }
        if($scope.timediff()>0){
            //$scope.form.timer=angular.element('input[ng-model="hours"]').eq(0).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()) +" to "+angular.element('input[ng-model="hours"]').eq(1).val()+' : ' +parseInt(angular.element('input[ng-model="minutes"]').eq(1).val());

            $scope.form.timer=$scope.timediff();
            angular.element('#timeval').val($scope.timediff());
            return true ;
        }

        else {
            $scope.timeerror=true;
            return "Please set a correct time range for your event !!" ;
        }

        return true;
    }

    $scope.timediff= function () {




        console.log($scope.endtime+'et'+
        $scope.starttime+'st');

        /*console.log('td-'+parseInt($scope.endtime.getHours()-$scope.starttime.getHours()));
         console.log('md-'+parseInt($scope.endtime.getMinutes()-$scope.starttime.getMinutes()));*/


        ////console.log('td1-'+angular.element('input[ng-model="hours"]').eq(0).val());
        // console.log('td1-'+angular.element('input[ng-model="hours"]').eq(1).val());
        //console.log('md2-'+parseInt($scope.minutes));

        var totalst=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(0).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(0).val()));
        var totalet=parseInt(parseInt(angular.element('input[ng-model="hours"]').eq(1).val()*60)+parseInt(angular.element('input[ng-model="minutes"]').eq(1).val()));


        console.log('timediff'+$scope.tdif);

        return $scope.tdif;

        //
        /* console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(0).val());
         console.log('td1-'+angular.element('input[ng-model="minutes"]').eq(1).val());*/
        //console.log('md2-'+parseInt($scope.minutes));
    }


    $scope.showtime=false;

    $scope.toggletimepicker=function(){

        console.log("before"+$scope.showtime);
        $scope.showtime=! $scope.showtime ;
        console.log("after"+$scope.showtime);
    }


    var st=new Date();
    //console.log(st.getHours());
    st.setHours(st.getHours());
    var et=new Date();
    //console.log(st.getHours());
    et.setHours(et.getHours()+1);
    $scope.endtime = et;
    $scope.starttime = st;

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.starttime = d;
        d.setHours( 15 );
        d.setMinutes( 0 );
        $scope.endtime = d;

        console.log('st changed'+$scope.starttime);
        console.log('et changed'+$scope.endtime);
    };

    $scope.changed = function (s,e) {
        $log.log('ST changed to: ' + $scope.starttime);
        $log.log('ET changed to: ' + $scope.endtime);
        $log.log('ET changed to: ' +s+'====--=='+e);

        $scope.tdif=parseInt(convert(e)-convert(s));
    };

    $scope.clear = function() {
        $scope.starttime = null;
    };




});



tr.controller('flightlist',function($scope,$state,$http,$cookieStore,$rootScope,uibDateParser){





    $scope.format = 'yyyy/MM/dd';
    $scope.date = new Date();
    $scope.open = function(opened) {
        //$event.preventDefault();
        //$event.stopPropagation();

        $scope[opened] = true;
    };


    $scope.resetdaterange=function(){

        $scope.edate=null;
        $scope.sdate=null;
        $('input[name="edate"]').val('');
        $('input[name="sdate"]').val('');
    }

    $scope.currentPage=1;
    $scope.perPage=3;
    $scope.begin=0;

    $scope.predicate = 'realdatef';
    $scope.reverse = false;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
        console.log($scope.currentPage);
    };


    $scope.order = function(predicate) {
        console.log('in sort section');
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.pageChanged = function(){
        $scope.begin=parseInt($scope.currentPage-1)*$scope.perPage;
        $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));
    }
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'flightlist'+'?userid='+$rootScope.userid+'&role='+$rootScope.userrole,
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        console.log(data);
        $scope.eventlist=data;
        $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));


    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.fflight.indexOf($scope.searchkey) != -1) || (item.lflight.indexOf($scope.searchkey) != -1) || (item.datef.indexOf($scope.searchkey) != -1)  ){
            return true;
        }
        return false;
    };


    $scope.setdata = function(item){

        /*console.log('daterange'+item);

        console.log('in set data ');
        console.log($scope.sdate+'in set data s');
        console.log($scope.edate+'in set data  e');*/

        $scope.nedate=convert($scope.edate);
        $scope.nsdate=convert($scope.sdate);
        if(typeof ($scope.edate)!='undefined' && typeof ($scope.sdate)!='undefined' && $scope.edate!=null && $scope.sdate!=null) {

            console.log($scope.nedate + 'ed');
            console.log($scope.nsdate + 'sd');
            console.log(item.realdatef + 'red');
            //if ($scope.edate.lenght > 0 && $scope.sdate.length > 0) {



                if (item.realdatef <= $scope.nedate && item.realdatef >= $scope.nsdate)
                    return true;
                else return false;
          //  }

            //return false;
        }
        else{
            return true;
        }
    };

    $scope.delflight = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.eventlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'delflight?role='+$rootScope.userrole,
            data    : $.param({id: $scope.eventlist[idx].id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.eventlist.splice(idx,1);
            $scope.eventlistp = $scope.eventlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        });
    }


    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.eventlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updateeventstatus',
            data    : $.param({id: $scope.eventlist[idx].id,event_status: $scope.eventlist[idx].event_status}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.eventlist[idx].status = !$scope.eventlist[idx].status;
        });
    }






});

tr.controller('admin_header', function($scope,$state,$http,$cookieStore,$rootScope) {
    if (typeof($cookieStore.get('userrole')) != 'undefined' && $cookieStore.get('userrole') > 0) {
        $rootScope.userrole=$cookieStore.get('userrole');
        if($rootScope.userrole!=4){
            $state.go('home');
        }

    }
    // $state.go('login');
    angular.element('head').append('<link id="home" href="css/admin_style.css" rel="stylesheet">');
    $scope.sdfsdfsd = function(){
        //console.log(1212);
        if(angular.element( document.querySelector( 'body' ) ).hasClass('sidebar-collapse')){
            angular.element( document.querySelector( 'body' ) ).removeClass('sidebar-collapse');
        }else{
            angular.element( document.querySelector( 'body' ) ).addClass('sidebar-collapse');
        }
    }


    $scope.toggledropdown=function(){

        //angular.element('.user-manu-dropdown').toggleClass('open');
      //  console.log('in user login');
    }


    //angular.element('head').append('<script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>');
    //angular.element('head').append('<script src="ng-js/ui-bootstrap-tpls-0.14.3.min.js"></script>');
    /*    if(angular.element('head').find('script[src="plugins/fastclick/fastclick.min.js"]').length==0)
        angular.element('head').append('<script src="plugins/fastclick/fastclick.min.js"></script>');
   if(angular.element('head').find('script[src="dist/js/app.min.js"]').length==0)
        angular.element('head').append('<script src="dist/js/app.min.js"></script>');
    if(angular.element('head').find('script[src="plugins/sparkline/jquery.sparkline.min.js"]').length==0)
        angular.element('head').append('<script src="plugins/sparkline/jquery.sparkline.min.js"></script>');
    if(angular.element('head').find('script[src="plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"]').length==0)
        angular.element('head').append('<script src="plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>');
    if(angular.element('head').find('script[src="plugins/jvectormap/jquery-jvectormap-world-mill-en.js"]').length==0)
        angular.element('head').append('<script src="plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>');
    if(angular.element('head').find('script[src="plugins/slimScroll/jquery.slimscroll.min.js"]').length==0)
        angular.element('head').append('<script src="plugins/slimScroll/jquery.slimscroll.min.js"></script>');
    if(angular.element('head').find('script[src="dist/js/pages/dashboard2.js"]').length==0)
        angular.element('head').append('<script src="dist/js/pages/dashboard2.js"></script>');
    if(angular.element('head').find('script[src="dist/js/demo.js"]').length==0)
        angular.element('head').append('<script src="dist/js/demo.js"></script>');*/
    /*
     angular.element('head').append('<script>+setTimeout(function(){
     $('input[name="event_daterange"]').daterangepicker({
     timePicker: true,
     timePickerIncrement: 30,
     locale: {
     format: 'MM/DD/YYYY h:mm A'
     }
     });
     }, 2000);)+'</script>'
     */



    $rootScope.logout = function () {
        $cookieStore.remove('userid');
        $cookieStore.remove('username');
        $cookieStore.remove('userrole');
        $cookieStore.remove('useremail');
        $cookieStore.remove('userfullname');

        $rootScope.userrole=0;
        $rootScope.userfullname='';
        $rootScope.userid=0;
        $rootScope.userrole=0;

       // console.log('in logout');
        $state.go('home');
    }

    if (typeof($cookieStore.get('userid')) != 'undefined' && $cookieStore.get('userid') > 0) {

        $rootScope.userfullname=$cookieStore.get('userfullname');
        $rootScope.userid=$cookieStore.get('userid');
        $rootScope.userrole=$cookieStore.get('userrole');
       //console.log($rootScope.userfullname);
    }
    else{
        $rootScope.userid=0;

       // console.log('you are not logged in !');
        //$state.go('login');
    }





// console.log('in admin header');
});
tr.controller('footer', function($scope,$state,$http,$cookieStore,$rootScope,contentservice) {


    $scope.interval=600;
    $scope.contentupdated=false;
    var myVar =setInterval(function(){

        $rootScope.contentdata=contentservice.getcontent( $scope.adminUrl+'contentlist');


        //console.log('in setInterval'+$scope.interval);
        //console.log( $rootScope.contentdata);
        var x;
        var y;
        if(typeof ($rootScope.contentdata)!='undefined' && $scope.contentupdated){

            $scope.interval=999990;

            clearInterval(myVar);
        }

        $scope.contentupdated=true;
        for (x in $rootScope.contentdata ){
            var contentw='';
            //console.log($rootScope.contentdata[x]);
            //console.log(($rootScope.contentdata[x].content)+'c----n');
            //console.log(($rootScope.contentdata[x].parentid));


            if($rootScope.contentdata[x].ctype!='image') {

                for (y in $rootScope.contentdata[x].content) {
                    if ($rootScope.contentdata[x].ctype != 'image')
                        contentw += ($rootScope.contentdata[x].content[y]);
                    else {

                        contentw += "<img src=" + $rootScope.contentdata[x].content[y] + " />";
                    }
                }
                $rootScope.contentdata[x].content=(contentw);
            }
            /* else{

             $rootScope.contentdata[x].content = "< img src = " + $rootScope.contentdata[x].content + " >";

             //$rootScope.contentdata[x].content=$rootScope.contentdata[x].content.replace('["','').replace.(']"','');
             }*/


           // console.log(($rootScope.contentdata[x].content));
            $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].id]=$rootScope.contentdata[x];
            if($rootScope.contentdata[x].parentid!=0){

                var z=parseInt($rootScope.contentdata[x].parentid);
               // console.log(z);
               // console.log($rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid);

                $scope[$rootScope.contentdata[x].cname+$rootScope.contentdata[x].parentid]=$rootScope.contentdata[x];

            }

            //var model=$parse($rootScope.contentdata[x].id);
            //model.assign($scope, $rootScope.contentdata[x]);
            //.id=$rootScope.contentdata[x];
        }

        //console.log('----'+$scope);


    },$scope.interval);



// console.log('in admin header');
});


tr.controller('services', function($scope,$state,$http,$cookieStore,$rootScope) {
    // $state.go('login');
    angular.element('head').append('<link id="home" href="css/admin_style.css" rel="stylesheet">');

    setTimeout(function(){

        $('.vmtog').click(function(){

            //console.log('in');
            //$(this).css('margin-top','-20px');
            $(this).prev('div').stop(true, true).delay(500).toggleClass('ng-hide');
            $(this).prev().prev('p').stop(true, true).delay(500).toggleClass('ng-hide');

            var text = $(this).html() == 'View more' ? 'Close' : 'View more';
            $(this).html(text);
        });


},2000);
});



tr.controller('productdetails1', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams) {


    $scope.categorylist = {};

    $scope.categoryid = {};
    $scope.categoryid.id = $stateParams.id;
    $scope.catid = $stateParams.id;
    $scope.pid = $stateParams.id;


    $scope.cart = {};

   // console.log($scope.cart);
    //$cookieStore.put('cart',$scope.cart);

    $rootScope.addtocart=function(pid){

       // console.log($rootScope.userid+'userid..');

        if($rootScope.userid == 0)  $scope.cartuser=$cookieStore.get('randomid');
        else {
            $scope.cartuser=$rootScope.userid;

            $http({
                method:'POST',
                async:false,
                url:$scope.adminUrl+'updatecartuser',
                data    : $.param({'newuserid':$rootScope.userid,'olduserid':$cookieStore.get('randomid')}),
                headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).success(function(data){






            });
        }



        $http({
            method:'POST',
            async:false,
            url:$scope.adminUrl+'addtocart',
            data    : $.param({'pid':pid,'qty':$scope.pqty,'userid':$scope.cartuser}),
            headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).success(function(data){

            $rootScope.carttotal=parseInt($rootScope.carttotal+parseInt($scope.pqty));



        });



    }

    $scope.type='General';
    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'junglecategorylist?filter=status',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

        $scope.categorylist[0]=
        {
            id: 0,
            cat_name: 'All'
        };

        //$scope.categorylist[0].category_id='All';
        //console.log($scope.categorylist);
        /*
         angular.forEach(data, function(value, key){
         console.log(value.type);
         if(value.type == "Stock Image") {
         $scope.categorylist.push(value);
         }
         });
         console.log($scope.categorylist);
         */
    });



    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist?filter='+$scope.pid,
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=data;
        //$scope.productlist=data;
       // console.log(data[$scope.pid].product_name+'pname');
       // console.log($scope.productlist);

        $scope.pname=data[$scope.pid].product_name;
        $scope.pdesc=data[$scope.pid].product_desc;
        $scope.productdetailmain=data[$scope.pid].productdetailmain;
        $scope.pprice=data[$scope.pid].price;
        $scope.image_url=data[$scope.pid].image_url;
    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( ((item.product_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) || ((item.product_desc.indexOf($scope.searchkey) != -1) && item.type==$scope.type)|| ((item.cat_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) ) {
            return true;
        }
        return false;
    };








    setTimeout(function(){
       $('.slider2').bxSlider({
           slideWidth: 230,
           minSlides: 2,
           maxSlides: 5,
           slideMargin: 10
       });

       $('.slider3').bxSlider({
           slideWidth: 343,
           minSlides: 3,
           maxSlides: 3,
           slideMargin: 10
       });
   },2000);


});
tr.controller('stockphoto', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams) {
    // $state.go('login');
   //  $scope.categorylist=[];

    $scope.categoryid={};
    $scope.categoryid.id=$stateParams.id;

    $scope.type='Stock Image';
    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'junglecategorylist',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

        $scope.categorylist[0]=
        {
            id: 0,
            cat_name: 'All'
        };

        //$scope.categorylist[0].category_id='All';
        console.log($scope.categorylist);
/*
        angular.forEach(data, function(value, key){
            console.log(value.type);
            if(value.type == "Stock Image") {
                $scope.categorylist.push(value);
            }
        });
        console.log($scope.categorylist);
*/
    });



    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=data;
    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( ((item.product_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) || ((item.product_desc.indexOf($scope.searchkey) != -1) && item.type==$scope.type)|| ((item.cat_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) ) {
            return true;
        }
        return false;
    };




    $rootScope.showmodal=function($ev){

        var target = $ev.target || $ev.srcElement || $ev.originalTarget;

        console.log($(target).html());
        console.log($(target).attr('class'));
        $('#gallerymodal').find('h2').find('img').attr('src','');
        $('#gallerymodal').find('h2').find('img').attr('src',$(target).attr('imgsrc'));

        $('#gallerymodal').modal('show');
        // $(event.target).parent().parent().css('display','none');


    }

});
tr.controller('products', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams) {
    // $state.go('login');
     $scope.categorylist={};

    $scope.categoryid={};
    $scope.categoryid.id=$stateParams.id;
    $scope.catid=$stateParams.id;

    $scope.type='General';
    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'junglecategorylist?filter=status',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;

        $scope.categorylist[0]=
        {
            id: 0,
            cat_name: 'All'
        };

        //$scope.categorylist[0].category_id='All';
        console.log($scope.categorylist);
/*
        angular.forEach(data, function(value, key){
            console.log(value.type);
            if(value.type == "Stock Image") {
                $scope.categorylist.push(value);
            }
        });
        console.log($scope.categorylist);
*/
    });



    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=data;
        console.log($scope.productlist);
    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( ((item.product_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) || ((item.product_desc.indexOf($scope.searchkey) != -1) && item.type==$scope.type)|| ((item.cat_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) ) {
            return true;
        }
        return false;
    };




    $rootScope.showmodal=function($ev){

        var target = $ev.target || $ev.srcElement || $ev.originalTarget;

        console.log($(target).html());
        console.log($(target).attr('class'));
        $('#gallerymodal').find('h2').find('img').attr('src','');
        $('#gallerymodal').find('h2').find('img').attr('src',$(target).attr('imgsrc'));

        $('#gallerymodal').modal('show');
        // $(event.target).parent().parent().css('display','none');


    }

});

tr.controller('stockdetail', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams) {


    $scope.id=$stateParams.id;

    console.log($scope.id+'sid');

     $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'jungleproductlist?filter=1',
        data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.productlist=data;
        $scope.pname=data[$scope.id].product_name;
        $scope.pdesc=data[$scope.id].product_desc;
        $scope.image_url=data[$scope.id].image_url;

         console.log(data);
         console.log(data[9].product_name);
    });


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'imagesizelist?filter=1',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.imagesizelist=data;
        $rootScope.stateIsLoading = false;


    });
    $('script[src="ng-js/ui-bootstrap-tpls-0.14.3.min.js"]').remove();

    $scope.clickable=0;
    $scope.sizechoiceval=false;


    $rootScope.showmodal=function($ev){

        var target = $ev.target || $ev.srcElement || $ev.originalTarget;

        console.log($(target).html());
        console.log($(target).attr('class'));
        $('#gallerymodal').find('h2').find('img').attr('src','');
        $('#gallerymodal').find('h2').find('img').attr('src',$(target).attr('imgsrc'));

        $('#gallerymodal').modal('show');
        // $(event.target).parent().parent().css('display','none');


    }

    $rootScope.pad=function  (str, max) {
        str = str.toString();
        return str.length < max ? $rootScope.pad("0" + str, max) : str;
    }

    $scope.pidvar=$rootScope.pad($scope.id,7);

    $scope.sizechoice=function(val,$ev1){

        var target1 = $ev1.target1 || $ev1.srcElement || $ev1.originalTarget;

        $(target1).addClass('darkar');
        console.log($(target1).html());

        $('.trc').removeClass('darkar');
        $('.trc'+val).addClass('darkar');

        console.log(val);

        $scope.clickable=1;
        $scope.sizechoiceval=false;
        $scope.sizeid=val;
        $('.tabdownloadbtn').attr('href','http://admin.jungledrones.com/filedownload/id/'+$scope.id+'/'+$scope.sizeid);
        $('.tabdownloadbtn').attr('target','_blank');

    }

    $scope.clicktodownload=function($ev){
        var target = $ev.target || $ev.srcElement || $ev.originalTarget;

        if($(target).attr('clickable')==0) $scope.sizechoiceval=true;

    }

    setTimeout(function(){

        //$('#myCarousel').carousel({
        //    interval: 10000
        //});

        //var wd=parseInt($(window).width()/5);
        var wd;
        console.log($(window).width());
        if($(window).width()>1300) wd =263;
        if($(window).width()>1400) wd =306;
        if($(window).width()>1600) wd =375;

        $('.slider1').bxSlider({
            slideWidth: wd,
            minSlides: 2,
            maxSlides: 5,
            slideMargin: 10
        });


    },1000);


});
tr.controller('stockcategory', function($scope,$state,$http,$cookieStore,$rootScope,$stateParams) {
    // $state.go('login');
    //  $scope.categorylist=[];

    if($stateParams.type=='image')
    $scope.type='Stock Image';
    if($stateParams.type=='video')
    $scope.type='Stock Video';

    $http({
        method:'POST',
        async:false,
        url:$scope.adminUrl+'junglecategorylist',
        //data    : $.param({'type':$scope.type}),
        headers :   { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).success(function(data){
        $scope.categorylist=data;
        // console.log($scope.categorylist);
        /*
         angular.forEach(data, function(value, key){
         console.log(value.type);
         if(value.type == "Stock Image") {
         $scope.categorylist.push(value);
         }
         });
         console.log($scope.categorylist);
         */
    })



    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.cat_name.indexOf($scope.searchkey) != -1) && item.type==$scope.type) {
            return true;
        }
        return false;
    };


 /*   $scope.showmodal=function($ev){

        var target = $ev.target || $ev.srcElement || $ev.originalTarget;

        console.log($(target).html());
        console.log($(target).attr('class'));
        $('#gallerymodal').find('h2').find('img').attr('src','');
        $('#gallerymodal').find('h2').find('img').attr('src',$(target).attr('imgsrc'));

        $('#gallerymodal').modal('show');
        // $(event.target).parent().parent().css('display','none');


    }
*/
});


tr.controller('dashboard', function($scope,$state,$http,$cookieStore,$rootScope) {
    // $state.go('login');


    $scope.logout = function () {
        $cookieStore.remove('userid');
        $cookieStore.remove('username');
        $cookieStore.remove('useremail');
        $cookieStore.remove('userfullname');
        $state.go('home');
    }


});


tr.controller('pilotregistration', function($scope,$state,$http,$cookieStore,$rootScope) {
    // $state.go('login');

   /* $scope.logout = function () {
        $cookieStore.remove('userid');
        $cookieStore.remove('username');
        $cookieStore.remove('useremail');
        $cookieStore.remove('userfullname');
        $state.go('index');
    }*/


    $scope.form={};
    $scope.form.country={};

    setTimeout(function(){
        $('#country').val(20);
    },2000);
    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'countryList',
        data    : $.param({'uid':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data);
        $scope.form.country={};
        $scope.form.country.s_name='Belize';
        $('#country').val(20);
        $scope.countrylist=data;
    });

    $scope.form={};
    $scope.drone_error= false;
    $scope.gender_error= false;
    $scope.dronerace_error= false;


    $scope.openlogin=function(){

        $('#pilotsuccess').modal('hide');

        setTimeout(function(){

            $state.go('login');

        },1200);

    }

    $scope.sub1 = function(){

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addpilot',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $('#pilotsuccess').modal('show');
            $scope.signupForm.reset();


            setTimeout(function(){

                $scope.form.country={};
                $scope.form.country.s_name='Belize';
                $('#country').val(20);

            },3000);
            //$scope.signupForm={fname:'',lname:''};


        });






    }

    $scope.droneValidator=function(){


        //console.log('in drone validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());

        if($scope.signupForm.$submitted){

            if(typeof ($("input[name='drone']:checked").val()) != 'undefined' )
            {
                $scope.drone_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.drone_error=true;
                return '';

            }

        }

    }

    $scope.genderValidator=function(){


        //console.log('in drone validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());

        if($scope.signupForm.$submitted){

            if(typeof ($("input[name='gender']:checked").val()) != 'undefined' )
            {
                $scope.gender_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.gender_error=true;
                return '';

            }

        }

    }
    $scope.dronraceeValidator=function(){


        //console.log('in drone validator');
        //console.log($scope.signupForm.$submitted);
        //console.log($("input[name='drone']:checked").val());

        if($scope.signupForm.$submitted){

            if(typeof ($("input[name='dron_race']:checked").val()) != 'undefined' )
            {
                $scope.dronerace_error=false;
                //console.log('in true');
                return true ;
            }
            else {
                //console.log('in false');
                $scope.dronerace_error=true;
                return '';

            }

        }

    }



});



function exportTableToCSV ($table, filename) {

    var $rows = $table.find('tr:has(td)'),

    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

    // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

    // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

    // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    $(this)
        .attr({
            'download': filename,
            'href': csvData,
            'target': '_blank'
        });
}




function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
   // return [ date.getFullYear(), mnth, day ].join("-");
    return new Date(date).getTime() / 1000
}





