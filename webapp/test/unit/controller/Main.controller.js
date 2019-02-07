/*global QUnit*/

sap.ui.define([
	"com/teklink/fiori/ZBILLINGDOCUMENTITEM_UI5/controller/Main.controller"
], function (oController) {
	"use strict";

	QUnit.module("Main Controller");

	QUnit.test("I should test the Main controller", function (assert) {
		var oAppController = new oController();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});