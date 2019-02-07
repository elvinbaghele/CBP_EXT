sap.ui.define([

	"sap/ui/core/mvc/Controller",
    
], function (Controller) {
	"use strict";

	return Controller.extend("com.teklink.fiori.ZBILLINGDOCUMENTITEM_UI5.controller.fragment.BillingDocumentItem", {
		onInit: function () {
	// url to our odata service from where we are going to select the Entity Set.
            var sServiceUrl = "/sap/opu/odata/sap/Z_I_BILLINGDOCUMENTITEM_CDS/";
		//Adding service to the odata model
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, false);
		//Setting model to the view
			this.getView().setModel(oModel);
		},
		onBeforeExport: function (oEvt) {  // for exporting the selected data as excel
			var mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// UI5 Client Export scenario:
			// Disable Worker as Mockserver is used in explored
			mExcelSettings.worker = false;
		},
		// This function is triggered from the Main Controller 
		onBeforeRebindTable: function(oEvent) {
			
              var mBindingParams = oEvent.getParameter("bindingParams");
              var aFilters = mBindingParams.filters;  // get the filter of Smart Table.
              //console.log(this.getView().byId("smartFilterBar"));
              //console.log(this.getView().byId("smartFilterBar").getFilters());
              //console.log(this.getView().byId("smartFilterBar").getFilterData());
              if(sap.ui.controller("com.teklink.fiori.ZBILLINGDOCUMENTITEM_UI5.controller.Main").itemfilter.length > 0){
              	  aFilters.length = 0;  // set the filters of smart table = null
              	  // push the global filter created in the global variable itemfilter of Main Controller into Smart Table Filters.
                  aFilters.push(sap.ui.controller("com.teklink.fiori.ZBILLINGDOCUMENTITEM_UI5.controller.Main").itemfilter); 
              	  mBindingParams.filters = aFilters; 
              }
              
		}
	});
});