Please check index.html file for sample
We have two part for this plugin
1) Cart Item data ( it will be table row )
2) Cart total and discount

**This plugin working with class names.**
.pd_image = Product Image
.pd_name = Product Name
.pd_out_of_stock = Product out of stock message ( plugin will do show/hide this element )
If you need extra information for Product. This element will accept html content.
.pd_meta1 , .pd_meta2,  .pd_meta3
.pd_price = Product Price
.pd_qty = Product Quantity
.pd_subtotal = Product Subtotal display ( plugin will calculate subtotal base on price and qty)
.pd_remove = Product Remove Button

Cart Data should be in this format
```
[
	{
		pd_id : 22,
		pd_name : "product Name 1",
		pd_image : "http://via.placeholder.com/100x90.png?text=sample_image",
		pd_meta1 : "weight:1122<br/>color:white",
		pd_meta2 : "product Option data2",
		pd_meta3 : "product Option data3",
		pd_price : 120,
		pd_currency : 0, //this is product currenty,set with index
		pd_qty   : 2,
	},
	{
		pd_id : 23,
		pd_name : "product Name 2",
		pd_image : "http://via.placeholder.com/100x90.png?text=sample_image",
		pd_meta1 : "product Option data",
		pd_price : 150,
		pd_currency : 0, //if we dont defined this value, index 0 of currency will be taken.
		pd_qty   : 3,
	}
]
```

Cart Currency
if we do not defined currency, default will be US$.
```
cart_currency : ['US$','MMK']
```
Cart Item template
Plugin need cart items row template to render with cart json object data.
```
cart_template : $(".cart_template").html(),
```
Custom Function after cart table is build
```
cart_after_render : function(){
	//your custom code here
}
```