'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Mopup App', function () {

    beforeEach(function () {
        browser().navigateTo('/');
    });


    it('should automatically redirect to /health when location hash/fragment is empty', function () {
        expect(browser().location().url()).toBe("/health");
    });

    describe('health', function(){
        beforeEach(function () {
            browser().navigateTo('/500/health');
        });

        it('should render the nmis list', function () {
            expect(element('section#nmis_list').count()).toEqual(1);
        });

        it("should set the selected row's class to active when clicked", function(){
            element('section#nmis_list tbody tr:nth(2)').click();
            expect(element('section#nmis_list tbody tr:nth(2).active').count()).toEqual(1);
        });
    });
});
