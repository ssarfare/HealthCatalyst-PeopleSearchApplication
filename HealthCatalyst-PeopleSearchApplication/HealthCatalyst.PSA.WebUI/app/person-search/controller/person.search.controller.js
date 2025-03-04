﻿(function () {

	//define controller
	angular.module('psaApp').controller('PersonSearchController', PersonSearchController);
	PersonSearchController.$inject = ['PersonSearchFactory'];
	function PersonSearchController(PersonSearchFactory) {
		const PersonSearchCtrl = this;
		PersonSearchCtrl.appName = "People Search Application";
		PersonSearchCtrl.personList = [];
		PersonSearchCtrl.personListNonPaged = [];
		PersonSearchCtrl.queryString = '';
		PersonSearchCtrl.pager = {};


		PersonSearchCtrl.Range =function (size, startAt) {
			return [...Array(size).keys()].map(i => i + startAt);
		}


		// Code for pagination
		// Reference:https://jasonwatmore.com/post/2016/01/31/angularjs-pagination-example-with-logic-like-google
		PersonSearchCtrl.GetPager = function (totalItems, currentPage, pageSize) {
			// default to first page
			currentPage = currentPage || 1;

			// default page size is 10
			pageSize = pageSize || 10;

			// calculate total pages
			var totalPages = Math.ceil(totalItems / pageSize);

			var startPage, endPage;
			if (totalPages <= 10) {
				// less than 10 total pages so show all
				startPage = 1;
				endPage = totalPages;
			} else {
				// more than 10 total pages so calculate start and end pages
				if (currentPage <= 6) {
					startPage = 1;
					endPage = 10;
				} else if (currentPage + 4 >= totalPages) {
					startPage = totalPages - 9;
					endPage = totalPages;
				} else {
					startPage = currentPage - 5;
					endPage = currentPage + 4;
				}
			}

			// calculate start and end item indexes
			var startIndex = (currentPage - 1) * pageSize;
			var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

			// create an array of pages to ng-repeat in the pager control
			var pages = PersonSearchCtrl.Range(endPage, startPage);

			// return object with all pager properties required by the view
			return {
				totalItems: totalItems,
				currentPage: currentPage,
				pageSize: pageSize,
				totalPages: totalPages,
				startPage: startPage,
				endPage: endPage,
				startIndex: startIndex,
				endIndex: endIndex,
				pages: pages
			};
		}


		PersonSearchCtrl.SetPage =function (page) {
			if (page < 1 || page > PersonSearchCtrl.pager.totalPages) {
				return;
			}

			// get pager object from service
			PersonSearchCtrl.pager = PersonSearchCtrl.GetPager(PersonSearchCtrl.personListNonPaged.length, page);

			// get current page of items
			PersonSearchCtrl.personList = PersonSearchCtrl.personListNonPaged.slice(PersonSearchCtrl.pager.startIndex, PersonSearchCtrl.pager.endIndex + 1);
		}


		PersonSearchCtrl.Search = function () {
			return PersonSearchFactory.Search(PersonSearchCtrl.queryString).then(function (response) {
				if (response.data.length > 0) {
					PersonSearchCtrl.personListNonPaged = response.data;
					PersonSearchCtrl.pager.totalPages = PersonSearchCtrl.personListNonPaged.length;
					PersonSearchCtrl.SetPage(1);
				} else {
					PersonSearchCtrl.personListNonPaged = [];
					PersonSearchCtrl.pager.totalPages = 0;
					PersonSearchCtrl.pager.pages = [];
					PersonSearchCtrl.personList = [];

				}
			});
		}

	}
})();