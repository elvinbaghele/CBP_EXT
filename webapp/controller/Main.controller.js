sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel"
], function (jQuery, Fragment, Controller, JSONModel, Popover, Button) {
	"use strict";

	return Controller.extend("com.teklink.fiori.ZBILLINGDOCUMENTITEM_UI5.controller.Main", {
		model: new sap.ui.model.json.JSONModel(),
		data: {
			navigation: [{
				title: "Billing Document",
				icon: "sap-icon://employee",
				expanded: true,
				key: "root1",
				items: [{
					title: "Billing Document Items",
					key: "page1"
				}, {
					title: "Child Item 2",
					key: "page2"
				}]
			}, {
				title: "Root Item 2",
				icon: "sap-icon://building",
				key: "root2"
			}, {
				title: "Root Item 3",
				icon: "sap-icon://card",
				expanded: false,
				items: [{
					title: "Child Item"
				}, {
					title: "Child Item"
				}, {
					title: "Child Item"
				}]
			}],
			fixedNavigation: [{
				title: "Fixed Item 1",
				icon: "sap-icon://employee"
			}, {
				title: "Fixed Item 2",
				icon: "sap-icon://building"
			}, {
				title: "Fixed Item 3",
				icon: "sap-icon://card"
			}],
			headerItems: [{
				text: "File"
			}, {
				text: "Edit"
			}, {
				text: "View"
			}, {
				text: "Settings"
			}, {
				text: "Help"
			}]
		},
		onInit: function () {
			this.model.setData(this.data);
			this.getView().setModel(this.model);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);

		},
/*               Functions Related to the navigation drawer */
		onItemSelect: function (oEvent) {
			var item = oEvent.getParameter("item");
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
		},
		handleUserNamePress: function (event) {
			var popover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content: [
					new Button({
						text: "Feedback",
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: "Help",
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: "Logout",
						type: sap.m.ButtonType.Transparent
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
			popover.openBy(event.getSource());
		},
		onSideNavButtonPress: function () {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		_setToggleButtonTooltip: function (bLarge) {
			var toggleButton = this.byId("sideNavigationToggleButton");
			if (bLarge) {
				toggleButton.setTooltip("Large Size Navigation");
			} else {
				toggleButton.setTooltip("Small Size Navigation");
			}
		},

		/*********************************************Billing Document Table Functions **********************************************************/
		//this function hide and unhide the infoToolBar
		onToggleInfoToolbar: function (oEvent) {
			var oTable = this.byId("table0");
			oTable.getInfoToolbar().setVisible(!oEvent.getParameter("pressed"));
		},
	/*   Filters    */	
	    filter:[],  // global variable to hold table filters
	    itemfilter:[], // global filter to hold filter for the billing document item table
		handleBillDocFilter: function (oEvent) {
			// create popover: Open a popover with a Filter Fragment which have combobox when clicked on Billing Document Column Heading
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("com.teklink.fiori.ZBILLINGDOCUMENTITEM_UI5.fragment.FilterDialog.BillingDocument", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		/* This event is fired after the filters in the popover are selected and the popover is closed : and this function adds the selected documents to the global filter variables.*/
		afterSelectBillDoc:function(oEvent){
		 //console.log(oEvent.getSource().getSelectedKeys().length);	
		 var selections = oEvent.getSource().getSelectedKeys();
		 for(var i=0;i<oEvent.getSource().getSelectedKeys().length;i++){ 
		    this.filter.push(new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.EQ,selections[i] ));  // adding filter to global array variable filter
		 }
		   var viewId = this.getView().getId();
			var table = sap.ui.getCore().byId(viewId + "--table0");
		   table.getBinding("items").filter(this.filter);  // 
		},
	/*    Navigations: when click on billing document no in Billing Document Table    */
	    onBillingDocumentClick:function(oEvent){
	    //	console.log(oEvent.getSource().getText()); 
	    	var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--page1");
			var oSmartTable = sap.ui.getCore().byId("__xmlview1--billingDocumentItemTable");
			this.itemfilter.length = 0;
			this.itemfilter.push(new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.EQ,oEvent.getSource().getText()));  // sets the global variable with the filters for 
																																			//the Billing Document Item Table
			//console.log(this.itemfilter);
		    oSmartTable.rebindTable(); // And this will rebind the billing Document item table, and before rebind we have a function in its Controller which will bind the above filters to the table.
	    },
		onExit : function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		}
		/*,
		FilterBillingDocument: new sap.m.MultiComboBox({
			id:"BillingDocument",
			width: "200px",
			placeholder: "Filter",
			items: {
				path: "BillDocItem_model>/I_BillingDocument",
				parameters:{select:this.id},
				template: new sap.ui.core.ListItem({
					key: "{BillDocItem_model>BillingDocument}",
					text: "{BillDocItem_model>BillingDocument}"
				}),
				templateShareable:false
			}
		}),
		handleBillingDocumentPress: function (event) {
			 this.id = event.getSource().getText(); 
			var popover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content: [
					this.FilterBillingDocument
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			popover.openBy(event.getSource());
		},
		id:""*/,
		
	});
});