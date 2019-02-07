/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/teklink/fiori/ZBILLINGDOCUMENTITEM_UI5/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});