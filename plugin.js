$.fn.easyCart = function(options) {
    
    var settings = $.extend({
        cart_data : null,
        cart_template : null,
        cart_total_field :null,
        cart_tax_field : null,
        cart_discount_field : null,
        cart_after_render : null,
        customUpdate :false,
        cart_update_ajax_url : null,
        discount : 0,
        cart_currency : ['$']
    }, options );

    var self = this;

    this.update = function(){
        var temp = [];        
        $(this).find(".pd_qty").each(function(k,v){
            var item_data = {
                pd_index : $(this).attr("data-index"),
                pd_id : $(this).attr("data-id"),
                pd_qty : $(this).val()
            };
            temp.push(item_data);
        });
        $.ajax({
            dataType: "json",
            data : {cart:temp},
            method : "POST",
            url: settings.cart_update_ajax_url, 
            success: function(result){ 
                settings.cart_data = result;
                self.rebuild();
            }            
        }).fail(function() {
                alert( "EasyCart:Ajax Request fail" );
              });
    }

    this.currency = function(currency_index){
        if(typeof currency_index != "undefined" && currency_index != null){
            if(typeof settings.cart_currency[currency_index] == "undefined"){
                return settings.cart_currency[0];
            }else{
                return settings.cart_currency[currency_index];
            }
        }else{
            return settings.cart_currency[0];
        }
    }

    this.rebuild = function(){
        if(settings.cart_template){
            //replace qty text box            
            this.html("");
            var totalAmount = [];
            for(var i=0; i < settings.cart_currency.length; i++){
                totalAmount[settings.cart_currency[i]] = 0;
            }
            
            var data = settings.cart_data;
            var out_of_stock = false;
            for(var i=0; i < data.length; i++){
                var cartItem = $(settings.cart_template);

                cartItem.addClass("cart-item-row");

                if(typeof data[i].pd_id == "undefined"){
                    alert("product id is required");
                }

                if(typeof data[i].pd_name != "undefined"){                
                    cartItem.find(".pd_name").text(data[i].pd_name);
                }

                if(typeof data[i].out_of_stock != "undefined" && data[i].out_of_stock == true){  
                    out_of_stock  =  true;           
                    cartItem.find(".pd_out_of_stock").show();
                }else{
                    cartItem.find(".pd_out_of_stock").hide();
                }
                
                if(typeof data[i].pd_image != "undefined"){
                    cartItem.find(".pd_image").attr("src",data[i].pd_image);
                }

                if(typeof data[i].pd_price != "undefined"){
                    cartItem.find(".pd_price").text(data[i].pd_price+self.currency(data[i].pd_currency));
                }

                if(typeof data[i].pd_old_price != "undefined" && data[i].pd_old_price != 0){
                    cartItem.find(".pd_old_price").text(data[i].pd_old_price+self.currency(data[i].pd_currency));
                }
                
                if(typeof data[i].pd_qty != "undefined"){                
                    if(cartItem.find(".pd_qty").prop("tagName").toLowerCase() == "input"){                        
                        cartItem.find(".pd_qty").val(data[i].pd_qty)
                                                .attr("data-id",data[i].pd_id)
                                                .attr("data-index",i)
                                                .attr("data-cache",data[i].pd_qty);

                        if(settings.customUpdate == false){                            
                            cartItem.find(".pd_qty").keyup(function(){ 
                                var qty = $(this);
                                setTimeout(function(){

                                    if(qty.val() !== ""){

                                        if(Number(qty.val()) == 0)
                                        {
                                            qty.val(qty.attr("data-cache"));
                                        }else{
                                            self.update();
                                        }
                                    }
                                },1000);
                            }).change(function(){
                                var qty = $(this);
                                if(qty.val() !== ""){

                                    if(Number(qty.val()) == 0)
                                    {
                                        qty.val(qty.attr("data-cache"));
                                    }else{
                                        self.update();
                                    }
                                }
                            });

                        }
                    }
                    else
                    cartItem.find(".pd_qty").text(data[i].pd_qty);
                }
                
                if(typeof data[i].pd_meta1 != "undefined"){
                    cartItem.find(".pd_meta1").html(data[i].pd_meta1);
                }

                if(typeof data[i].pd_meta2 != "undefined"){
                    cartItem.find(".pd_meta2").html(data[i].pd_meta2);
                }

                if(typeof data[i].pd_meta3 != "undefined"){
                    cartItem.find(".pd_meta3").html(data[i].pd_meta3);
                }

                if(typeof data[i].pd_qty != "undefined" && typeof data[i].pd_price != "undefined")
                {
                    data[i].sub_total_amount = Number(data[i].pd_qty) * Number(data[i].pd_price);
                }else{
                    data[i].sub_total_amount = 0;
                }

                var currency_index = 0;

                if(typeof data[i].pd_currency != "undefined")
                {
                    currency_index = data[i].pd_currency;
                }  
                
                totalAmount[settings.cart_currency[currency_index]] += data[i].sub_total_amount;
                cartItem.find(".pd_subtotal").text(data[i].sub_total_amount+self.currency(data[i].pd_currency));
                this.append(cartItem);
            }

            var totalString = "";
            console.log(totalAmount);
            for (var key in totalAmount) {
                if (totalAmount.hasOwnProperty(key)) {
                    if(totalAmount[key] != 0){
                        totalString+= totalAmount[key]+key+" &nbsp;";
                    }
                }
            }

            $(".cart_total").html(totalString);
            if(settings.cart_currency.length == 1){
                $(".cart_discount").text(settings.discount);
                $(".cart_net_total").text((totalAmount - Number(settings.discount)));
            }   

            $(".pd_remove").click(function(){
                $(this).parents(".cart-item-row").remove();
                self.update();
            })         

            if(settings.cart_after_render !== null && typeof settings.cart_after_render == "function"){
                settings.cart_after_render({out_of_stock : out_of_stock,data : data});
            }
        }
    }

    this.rebuild();
};