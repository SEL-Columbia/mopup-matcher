'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
    var rootScope, scope, rootCtrl, nmisCtrl, lgsCtrl, pairedListCtrl, routeParams;
    beforeEach(module('myApp'));
    beforeEach(inject(function ($rootScope, $controller) {
        rootScope = $rootScope.$new();
        scope = $rootScope.$new();
        routeParams = {lgaid: 500};
    }));
    beforeEach(function () {
        rootCtrl = new RootCtrl('health')(scope, rootScope, routeParams);
    });

    it('isMatched should return true if the specified id is in the matched list or false otherwise', inject(function () {
        rootScope.localMatch = ['abc1234', 'def5678', 'ghi9012'];
        expect(scope.isMatched('abc1234')).toBeTruthy();
        expect(scope.isMatched('not-in-list')).toBeFalsy();
    }));

    it('should ....', inject(function () {
        //spec body
    }));
});
