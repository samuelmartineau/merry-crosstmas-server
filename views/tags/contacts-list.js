riot.tag("contacts-list",'<div class="contact-list"><contact each="{contact in contactModel.contacts}" contact="{contact}"></contact></div><div class="contact-control"><div class="contact-control__cell"><i onclick="{contactModel.add}" class="badge icon icon-group"></i></div><div class="contact-control__cell"><i onclick="{contactModel.send}" class="badge icon icon-paper"></i></div></div>',function(c){var t=this;contactModel.on("remove",function(c){t.update()})});