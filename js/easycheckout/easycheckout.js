if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

var Easycheckout=Class.create();
Easycheckout.prototype={
    initialize:function(a){
	     //alert("In easycheckout");
        this.loadWaitingReview=this.loadWaitingPayment=this.loadWaitingShippingMethod=false;
        this.failureUrl=a.failure;this.reloadReviewUrl=a.reloadReview;
        this.reloadPaymentUrl=a.reloadPayment;
        this.successUrl=a.success;
        this.response=[]
        },
        ajaxFailure:function(){

            location.href=this.failureUrl
        },
        processRespone:function(a){

            var b;
            if(a&&a.responseText)
            try{
                b=a.responseText.evalJSON()

                }
            catch(c){
                b={}
            }

            if(b.redirect){ 
                location.href=b.redirect;}
            else if(b.error){

		        if(b.fields){
		            a=b.fields.split(",");
		            for(var d=0;d<a.length;d++)
		            null==$(a[d])&&Validation.ajaxError(null,b.error)
		        }
		        else{ 
				if(b.error && b.payment){
					this.updatePayment();billing.initWhatIsCvvListeners()
					}
				else{
		    			alert(Translator.translate(b.error_messages));
				}
			}
		}
		else if(b.response_status_detail){
		    alert(Translator.translate(b.response_status_detail));
		}
            else{
                this.response=b;

                if(b.shippingMethod)
		{
                    this.updateShippingMethod();}
                else if(b.payment){

                    this.updatePayment();billing.initWhatIsCvvListeners()
                }
                else{

                this.updateReview()}
            }
        },
        setLoadWaitingShippingMethod:function(a){
            this.loadWaitingShippingMethod=a;
            if(a==true){
                $('easycheckout-ajax-loader-text').update(ShippingMethods_Loading_Text);
                $("easycheckout-ajax-loader")&&Element.show("easycheckout-ajax-loader");
                $("checkout-shipping-method-loadaction")&&Element.hide("checkout-shipping-method-loadaction")
            }
            else{
                if($("billing:use_for_shipping_yes") && $("billing:use_for_shipping_yes").checked==true){
                    $("easycheckout-ajax-loader")&&Element.hide("easycheckout-ajax-loader");
                }
                $("checkout-shipping-method-loadaction")&&Element.show("checkout-shipping-method-loadaction")
            }
          
        },
        resetLoadWaitingShippingMethod:function(){
            this.setLoadWaitingShippingMethod(false)
        },
        updateShippingMethod:function(){
            if($("checkout-shipping-method-loadaction")){

                $("checkout-shipping-method-loadaction").update(this.response.shippingMethod);
                this.resetLoadWaitingShippingMethod();
                if($$("#checkout-shipping-method-loadaction .no-display input").length!=0){
                    $$("#checkout-shipping-method-loadaction .no-display input")[0].checked==true&&billing.saveShippingMethod();
		}
                else if($$("#checkout-shipping-method-loadaction input").length!=0) {
		    var a=false;
		    $$("#checkout-shipping-method-loadaction input").each(function(b){
			if(b.checked==true)
			   { a=true;
			    }
		    });
		    if(!a){
			 $$("#checkout-shipping-method-loadaction input").each(function(b){
			    b.checked=true;
			    a=true;
			    throw $break;
			});
		    }
		    a==true?billing.saveShippingMethod():this.reloadPayment();
		}else{
                    this.response.payment&&this.reloadPayment()}
            }
            else{

                this.response.payment&&this.reloadPayment()
	    }
        },
        setLoadWaitingPayment:function(a){
            this.loadWaitingPayment=a;
             if(a==true){
                $('easycheckout-ajax-loader-text').update(Payment_Loading_Text);
                $("easycheckout-ajax-loader")&& Element.show("easycheckout-ajax-loader");
                $("checkout-payment-method-load")&&Element.hide("checkout-payment-method-load")
            }
            else{
                $("checkout-payment-method-load")&&Element.show("checkout-payment-method-load")
            }
        },
        resetLoadWaitingPayment:function(){
            this.setLoadWaitingPayment(false)
        },
        updatePayment:function(){
            $("checkout-payment-method-load").update(this.response.payment);
            this.resetLoadWaitingPayment();
            billing.switchMethod(billing.currentMethod);
            if($$("#checkout-payment-method-load .no-display input").length!=0)
                $$("#checkout-payment-method-load .no-display input")[0].checked==true&&billing.savePayment();
            else{
                
                var a=false;
                $$("#checkout-payment-method-load input").each(function(b){
                    if(b.checked==true)
                       { a=true;
			}
                });
                if(!a){
                     $$("#checkout-payment-method-load input").each(function(b){
                        b.checked=true;
                        a=true;
                        throw $break;
                    });
                }
                a==true?billing.savePayment():this.reloadReview()
            }
        },
        setLoadWaitingReview:function(a){
            this.loadWaitingReview=a;
              if(a==true){
                $('easycheckout-ajax-loader-text').update(Review_Loading_Text);
                $("easycheckout-ajax-loader")&&Element.show("easycheckout-ajax-loader");
                $("easycheckout-review-loadaction")&&Element.hide("easycheckout-review-loadaction")
            }
             else if(a=='saving_order'){
               $('easycheckout-ajax-loader-text').update(Review_Submitting_Text);
                $("easycheckout-ajax-loader")&&Element.show("easycheckout-ajax-loader");
            }
             else{
                $("easycheckout-ajax-loader")&&Element.hide("easycheckout-ajax-loader");
                $("easycheckout-review-loadaction")&&Element.show("easycheckout-review-loadaction")
            }
        },
        resetLoadWaitingReview:function(){
            this.setLoadWaitingReview(false)
        },
        updateReview:function(){
            $("easycheckout-review-loadaction").update(this.response.review);
            this.resetLoadWaitingReview();
            if(this.response.success)
            location.href=this.successUrl
        },
        reloadReview:function(){
            this.setLoadWaitingReview(true);
            new Ajax.Updater('',this.reloadReviewUrl,{
                        method:"post",
                        onComplete:this.resetLoadWaitingReview,
                        onSuccess:this.processRespone.bind(this),
                        onFailure:this.ajaxFailure.bind(this)
                    })
        },
        reloadPayment:function(){
            this.setLoadWaitingPayment(true);
            new Ajax.Updater('',this.reloadPaymentUrl,{
                method:"post",
                onComplete:this.resetLoadWaitingPayment,
                onSuccess:this.processRespone.bind(this),
                onFailure:this.ajaxFailure.bind(this)
            })
        },
        showOptionsList:function(a,b){
            if(a){
                new Effect.toggle(b,"appear");
                new Effect.toggle(a.id,"appear");
                console.log(a.id.substring(0,10));
                if(a.id.substring(0,10)=="option-exp")
                    new Effect.toggle("option-clo-"+a.id.substring(11));
                else
                    new Effect.toggle("option-exp-"+a.id.substring(11))
            }
        }
    };     
    var Billing=Class.create();
    Billing.prototype={
        initialize:function(a,b,c,d){
		//alert("In Billing");
            this.useBilling=a;
            this.saveCountryUrl=b;
            this.switchMethodUrl=c;
            this.addressUrl=d
        },
		shippinginit:function(a,b){
		//alert("In Shipping");
            this.saveCountryUrlShip=a;
            this.addressUrlShip=b
        },
		paymentinit:function(a){
            this.saveUrlpayment=a;	 
	      this.form;
	      this.saveUrlpayment=a;
	      this.onComplete;
	      this.currentMethod;
	    },
		shippingmethodinit:function(a,b){ //alert("In shipping method");
        this.saveUrl=a;
        this.isReloadPayment=b
    },
	 reviewinit:function(a,b,c){ //alert("In Review");
                this.formreview=a;
                this.saveUrlreview=b;
                this.agreementsForm=c;
		this.formdata = '';
                this.onestepcheckourForm=new VarienForm(this.formreview)
            },
			cartupdateinit:function(a){
	     // alert("in cart update");
            this.CartUrl=a;
	   // this.reload=false;
            this.response=[]
        },
        enalbleShippingAddress:function(){
            this.setStepNumber();
            if($("billing:use_for_shipping_yes").checked==true){
                Element.show("shipping-address-form");
                this.useBilling=false;
                $("shipping-address-select")?billing.setAddress_ship($("shipping-address-select").value):billing.saveCountry_ship();
               
            }else{
                Element.hide("shipping-address-form");
                this.useBilling=true;
                this.saveCountry()
            }
        },
        saveCountry:function(){
            var a=$("billing:country_id").value,
            b=$("billing:postcode").value,
	    c=$("billing:region_id").value;
            if(this.useBilling){
                easycheckout.setLoadWaitingShippingMethod(true);
                new Ajax.Updater('',this.saveCountryUrl,{
                    parameters:{country_id:a,postcode:b,region_id:c,use_for:"billing"},
                    method:"post",
                    onComplete:easycheckout.resetLoadWaitingShippingMethod.bind(easycheckout),
                    onSuccess:easycheckout.processRespone.bind(easycheckout),
                    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                })
                
            }else{
                easycheckout.setLoadWaitingShippingMethod(true);
                new Ajax.Updater('',this.saveCountryUrl,{
                    parameters:{country_id:a,postcode:b,region_id:c,use_for:"shipping"},
                    method:"post",
                    onComplete:easycheckout.resetLoadWaitingPayment.bind(easycheckout),
                    onSuccess:easycheckout.processRespone.bind(easycheckout),
                    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                })
               
            }
        },
        register:function(){
            var a="";
            if($("billing:register").checked==true&&$("billing:register").value==1){
                Element.show("register-customer-password");
                a="register"
            }else{
                Element.hide("register-customer-password");
                a="guest"
            }
            a&&new Ajax.Updater('',this.switchMethodUrl,{
                parameters:{method:a},
                method:"post",
                onFailure:easycheckout.ajaxFailure.bind(easycheckout)
            })
        },
        setAddress:function(a){
            if(a)request=new Ajax.Updater('',this.addressUrl+a,{
                method:"get",
                onSuccess:this.fillForm.bindAsEventListener(this),
                onFailure:easycheckout.ajaxFailure.bind(easycheckout)
            })
        },
        newAddress:function(a){
            if(a){
                this.resetSelectedAddress();
                Element.show("billing-new-address-form")
            }else
                Element.hide("billing-new-address-form")
        },
        resetSelectedAddress:function(){
            var a=$("billing-address-select");
            if(a)a.value=""
        },
        fillForm:function(a){
            var b={};
            if(a&&a.responseText)
            try{
                b=a.responseText.evalJSON()
            }
            catch(c){
                b={}
            }else
                this.resetSelectedAddress();
                arrElements=Form.getElements(billing.formreview);
                for(var d in arrElements)
                if(arrElements[d].id){
                    a=arrElements[d].id.replace(/^billing:/,"");
                    if(b[a]!=undefined&&b[a])
                    arrElements[d].value=b[a]
                }
                this.saveCountry()
        },
        setStepNumber:function(){
            steps=$$("#easycheckout-number");
            for(var a=0;a<steps.length;a++)
                if(steps[a].className!="step-1"&&steps[a].className!="step-review")
                    if($("billing:use_for_shipping_yes").checked==true){
                        steps[a].className!="shipping"&&steps[a].removeClassName("step-"+a);
                        steps[a].addClassName("step-"+(a+1))
                    }else{
                        steps[a].className!="step-2"&&steps[a].addClassName("step-"+a);
                        steps[a].removeClassName("step-"+(a+1))
                    }
        },
		// SHIPPNG ======= STARTS
      saveCountry_ship:function(){
            if(billing.useBilling==false){
                var a=$("shipping:country_id").value,
                b=$("shipping:postcode").value,
		c=$("shipping:region_id").value;
                easycheckout.setLoadWaitingShippingMethod(true);
                new Ajax.Updater('',this.saveCountryUrlShip,{
                    parameters:{country_id:a,postcode:b,region_id:c},
                    method:"post",
                    onComplete:easycheckout.resetLoadWaitingPayment.bind(easycheckout),
                    onSuccess:easycheckout.processRespone.bind(easycheckout),
                    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                })
            }
        },
        setAddress_ship:function(a){
            if(a)request=new Ajax.Updater('',this.addressUrlShip+a,{
                method:"get",
                onSuccess:this.fillForm_ship.bindAsEventListener(this),
                onFailure:easycheckout.ajaxFailure.bind(easycheckout)
            })
        },
        newAddress_ship:function(a){
            if(a){
                this.resetSelectedAddress_ship();
                Element.show("shipping-new-address-form")
            }else
            Element.hide("shipping-new-address-form");
            billing.setSameAsBilling_ship(false)
        },
        resetSelectedAddress_ship:function(){
            var a=$("shipping-address-select");
            if(a)a.value=""
        },
        setSameAsBilling_ship:function(a){
            ($("shipping:same_as_billing").checked=a)&&this.syncWithBilling_ship()
        },
        syncWithBilling_ship:function(){
            $("billing-address-select")&&this.newAddress_ship(!$("billing-address-select").value);
            $("shipping:same_as_billing").checked=true;
            if(!$("billing-address-select")||!$("billing-address-select").value){
                arrElements=Form.getElements(billing.formreview);
                for(var a in arrElements)if(arrElements[a].id){
                    var b=$(arrElements[a].id.replace(/^shipping:/,"billing:"));
                    if(b)
                    arrElements[a].value=b.value
                }
                shippingRegionUpdater.update();
                $("shipping:region_id").value=$("billing:region_id").value;
                $("shipping:region").value=$("billing:region").value
            }else{
                $("shipping-address-select").value=$("billing-address-select").value
            }
	    billing.saveCountry_ship();
        },
        fillForm_ship:function(a){
            var b={};
            if(a&&a.responseText)
                try{
                    b=a.responseText.evalJSON()
                }catch(c){
                    b={}
                }
            else
                this.resetSelectedAddress_ship();
                arrElements=Form.getElements(billling.formreview);
                for(var d in arrElements)
                    if(arrElements[d].id){
                        a=arrElements[d].id.replace(/^shipping:/,"");
                        if(b[a]!=undefined&&b[a])arrElements[d].value=b[a]
                    }
                    this.saveCountry_ship()
        },
        setRegionValue_ship:function(){
            $("shipping:region").value=$("billing:region").value
        },	
	     // SHIPPNG ======= ENDS
	    
		//START OF SHIPPING METHOD
	     saveShippingMethod:function(){
        for(var a=document.getElementsByName("shipping_method"),b="",c=0;c<a.length;c++)
            if(a[c].checked)b=a[c].value;
            if(b!=""){

                this.isReloadPayment==1&&easycheckout.setLoadWaitingPayment(true);
                new Ajax.Updater('',this.saveUrl,{
                                    parameters:{shipping_method:b},
                                    method:"post",
                                    onComplete:easycheckout.resetLoadWaitingPayment.bind(easycheckout),
                                    onSuccess:easycheckout.processRespone.bind(easycheckout),
                                    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                })
            }
        },
	
	   //End OF SHIPPING METHOD	 ==========
	
	// START OF PaYMENT METHOD ======================
	    beforeInitFunc:$H({}),
        afterInitFunc:$H({}),
        beforeValidateFunc:$H({}),
        afterValidateFunc:$H({}),
	    init:function(){ //alert("In payment");
                for(var a=$$("input[name^=payment]"),b=null,c=0;c<a.length;c++)
                { 
                    if(a[c].name=="payment[method]")
                    {
                        if(a[c].checked)b=a[c].value
                    }
                    else
                   
                        a[c].disabled=true;
                        a[c].setAttribute("autocomplete","off")
                }
                b&&this.switchMethod(b)
            },
            savePayment:function(){
                var a=document.getElementsByName("payment[method]");

                value="";
                for(var b=0;b<a.length;b++)
                    if(a[b].checked)value=a[b].value;
                    if(value!=""){easycheckout.setLoadWaitingReview(true);
                  
                        new Ajax.Updater('',this.saveUrlpayment,{
                            parameters:{method:value},
                            method:"post",
                            onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
                            onSuccess:easycheckout.processRespone.bind(easycheckout),
                            onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                        })
                    }
            },
	    /////////Ipayment fix ///////////////
	    save:function(){
                var a=document.getElementsByName("payment[method]");

                value="";
                for(var b=0;b<a.length;b++)
                    if(a[b].checked)value=a[b].value;
                    if(value!=""){easycheckout.setLoadWaitingReview(true);
                  
                        new Ajax.Updater('',this.saveUrlpayment,{
                            parameters:{method:value},
                            method:"post",
                            onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
                            onSuccess:easycheckout.processRespone.bind(easycheckout),
                            onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                        })
                    }
            },
	    beforeValidate : function() {
        var validateResult = true;
        var hasValidation = false;
        (this.beforeValidateFunc).each(function(validate){
            hasValidation = true;
            if ((validate.value)() == false) {
                validateResult = false;
            }
        }.bind(this));
        if (!hasValidation) {
            validateResult = false;
        }
        return validateResult;
    },

    validate: function() {
        var result = this.beforeValidate();
        if (result) {
            return true;
        }
        var methods = document.getElementsByName('payment[method]');
        if (methods.length==0) {
            alert(Translator.translate('Your order cannot be completed at this time as there is no payment methods available for it.').stripTags());
            return false;
        }
        for (var i=0; i<methods.length; i++) {
            if (methods[i].checked) {
                return true;
            }
        }
        result = this.afterValidate();
        if (result) {
            return true;
        }
        alert(Translator.translate('Please specify payment method.').stripTags());
        return false;
    },addAfterValidateFunction : function(code, func) {
        this.afterValidateFunc.set(code, func);
    },

    afterValidate : function() {
        var validateResult = true;
        var hasValidation = false;
        (this.afterValidateFunc).each(function(validate){
            hasValidation = true;
            if ((validate.value)() == false) {
                validateResult = false;
            }
        }.bind(this));
        if (!hasValidation) {
            validateResult = false;
        }
        return validateResult;
    },
           
	    /////////////////////////////////////
            switchMethod:function(a){
               
                if(this.currentMethod&&$("payment_form_"+this.currentMethod))
                { 
                    var b=$("payment_form_"+this.currentMethod);
                    b.hide();
                    b=b.select("input","select","textarea");
                    for(var c=0;c<b.length;c++)b[c].disabled=true
                }
                if($("payment_form_"+a))
                { 
                    b=$("payment_form_"+a);
                    b.show();
                    b=b.select("input","select","textarea");
                    for(c=0;c<b.length;c++)b[c].disabled=false
                }else
              
                    $(document.body).fire("payment-method:switched",{
                        method_code:a
                    });
                this.currentMethod=a
            },
            initWhatIsCvvListeners:function(){
                $$(".cvv-what-is-this").each(function(a){
                    Event.observe(a,"click",toggleToolTip)
                })
            },
	// END OF PaYMENT METHOD ======================
	
	// START OF REVIEW METHOD ======================
	save_review:function(){
                if((new Validation(this.formreview)).validate()){
		    if(billing.currentMethod && billing.currentMethod.startsWith('sage') && $("billing:use_for_shipping_yes").checked!=true){
		        billing.setSameAsBilling_ship(true);
		       }                   easycheckout.setLoadWaitingReview('saving_order');
                    var a=Form.serialize(this.formreview);
                    if(this.agreementsForm)
                    a+="&"+Form.serialize(this.agreementsForm);
		    if($(billing.currentMethod+"_cc_type")){
			   pay="payment%5Bcc_type%5D="+$(billing.currentMethod+"_cc_type").value+"&payment%5Bcc_exp_month%5D="+$(billing.currentMethod+"_expiration").value+"&payment%5Bcc_exp_year%5D="+$(billing.currentMethod+"_expiration_yr").value;
		    a+="&"+pay;
		    }
		  a.save=true;
		  this.formdata =a;
		    if(billing.currentMethod && billing.currentMethod.startsWith('sage')  || billing.currentMethod.startsWith('ipayment')){
		       /////////// Ipayment Fix ///////////////
		       if( billing.currentMethod.startsWith('ipayment')){
			billing.form=this.formreview;billing.onComplete = billing.processRespone_review.bind(this);
			if ($('ipayment_cc_additional_data').value.length!=0) {
			    new Ajax.Updater('',addaddressb4review,{
				      method:"post",
				      parameters:this.formdata,				      
				      onSuccess:this.processRespone_review.bind(this),
				      onFailure:easycheckout.ajaxFailure.bind(false)
				  })
				   
				}else{
				   new Ajax.Updater('',addaddressb4review,{
					method:"post",
					parameters:this.formdata,
					onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
					onSuccess: billing.save(),
					onFailure:easycheckout.ajaxFailure.bind(false)
				    })
				}
		      }
		      
		      else{
			new Ajax.Updater('',addaddressb4review,{
			    method:"post",
			    parameters:this.formdata,			    
			    onSuccess:this.processRespone_review.bind(this),
			    onFailure:easycheckout.ajaxFailure.bind(false)
			})
		      }
			///////////////////////////////
		    }
		    else{
			 
			if(billing.currentMethod && !billing.currentMethod.startsWith('sage')){
			    this.saveUrlreview=review_url;
			}
			new Ajax.Updater('',this.saveUrlreview,{
			    method:"post",
			    parameters:this.formdata,
			    onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
			    onSuccess:easycheckout.processRespone.bind(easycheckout),
			    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
			})
		    }
		}
            },
	    processRespone_review:function(a){
            var b;
            if(a&&a.responseText)
                try{
                    b=a.responseText.evalJSON()
                }catch(c){
                    b={}
                }
            if(b.success){
		   if(billing.currentMethod && !billing.currentMethod.startsWith('sage')){
		   
                   this.saveUrlreview=review_url;
		}
                    if(billing.currentMethod.startsWith('sage') && 'sagepaydirectpro' != billing.currentMethod){
			new Ajax.Updater('',SuiteConfig.getConfig('global', 'sgps_saveorder_url'),{
							    method:"post",
							    parameters: this.formdata,
							    onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
							    onSuccess:function(f){
								var data=f.responseText.evalJSON()
								
								if(data.redirect && 'sagepayform'==billing.currentMethod){
								    if(data.response_status == 'ERROR'){
									    alert(data.response_status_detail);
									    //this.resetOscLoading();
									    return;
								    }
								    setLocation(SuiteConfig.getConfig('form','url'));
								}else{
								    SageServer.reviewSave(f);
								}
							    //skin\frontend\base\default\sagepaysuite\js\sagePaySuite_Checkout.js
							    //changes required in above js file also.
								    
							    }.bind(this)
					    });
		    }else{
			new Ajax.Updater('',this.saveUrlreview,{
			    method:"post",
			    parameters:this.formdata,
			    onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
			    onSuccess:easycheckout.processRespone.bind(easycheckout),
			    onFailure:easycheckout.ajaxFailure.bind(easycheckout)
			})
		    }
		
            }
	    
        },
	/////////////Ipayment Fix////////////////////
	processIpayment:function(a){
            
		if(!billing.currentMethod.startsWith('sage')){
		   this.saveUrlreview=review_url;
		}
		
		if(billing.currentMethod.startsWith('ipayment')){
			new Ajax.Updater('',this.saveUrlreview,{
                        method:"post",
                        parameters:Form.serialize(billing.form),
                        onComplete:easycheckout.resetLoadWaitingReview.bind(easycheckout),
                        onSuccess:easycheckout.processRespone.bind(easycheckout),
                        onFailure:easycheckout.ajaxFailure.bind(easycheckout)
                    })
		  }
        },
	
	// END OF REVIEW METHOD ======================	
	
	//START OF CART UPDATER ====================
	 cartupdate:function(id,action){
               // this.setLoadWaitingcoupon(false);
                new Ajax.Updater('',this.CartUrl,{
                    parameters:{productid:id,update:action},
                    method:"post",
                    onComplete:easycheckout.setLoadWaitingShippingMethod(false),
                    onSuccess:this.processRespone_cartupdate.bind(this),
                    onFailure:easycheckout.ajaxFailure.bind(this)
                    })
              
        },
        processRespone_cartupdate:function(a){
            var b;
            if(a&&a.responseText)
                try{
                    b=a.responseText.evalJSON()
                }catch(c){
                    b={}
                }		
	     if(b.error){
		   alert(b.error);
		
            }
	    else if (b.success){
		 if($("billing:use_for_shipping_yes").checked==true){
		    billing.saveCountry_ship();
		    }else{
		    billing.saveCountry();
		 }
		
            }
        }
	
	//End OF CART UPDATER ====================	
	
	}; 
	 
	
      
	var Easycheckout_Agreements=Class.create();
        Easycheckout_Agreements.prototype={
           initialize:function(){
		       alert("In  Easycheckout_Agreements ");
                },
            show:function(c){
                a='QC-AG-Bk';
                a+=c;
                b='QC-AG-CO';
                b+=c;
                $(a).setStyle({
                    opacity:0,
                    visibility:"visible"
                });
                new Effect.Opacity(a,{
                    duration:0.9,from:0,to:0.8
                });
                Element.show(b)
            },
            hide:function(c){
                a='QC-AG-Bk'+c;
                b='QC-AG-CO'+c;
                new Effect.Opacity(a,{
                    duration:0.9,
                    from:0.8,to:0,
                    afterFinish:function(){
                        $(a).setStyle({
                            opacity:0,visibility:"hidden"
                        })
                    }
                });
                Element.hide(b)
            }
        }; 
        var Checkout=Class.create();
Checkout.prototype={
  initialize:function(a){
    this.loadWaiting=false;
  }, ajaxFailure: function(){
        easycheckout.ajaxFailure.bind(this);
    },setLoadWaiting: function(step, keepDisabled) {
        
        
    }
  };
  checkout = new Checkout();
///////////////////////////////////
