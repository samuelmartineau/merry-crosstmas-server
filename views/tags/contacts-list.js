riot.tag("contacts-list",'<div class="contact-list"><contact each="{contact in contactModel.contacts}" contact="{contact}"></contact></div><div class="contact-control"><div class="contact-control__cell"><i onclick="{contactModel.add}" class="badge icon icon-group"></i></div><div class="contact-control__cell { invalid: !isSendable }"><i onclick="{sendMails}" class="badge icon icon-paper"></i></div></div>',function(c){var t=this;t.isSendable=contactModel.isValid(),contactModel.on("remove",function(){t.isSendable=contactModel.isValid(),t.update()}),contactModel.on("mailsUpdated",function(){t.isSendable=contactModel.isValid(),t.update()}),contactModel.on("add",function(){t.isSendable=contactModel.isValid(),t.update()}),contactModel.on("nameUpdated",function(){t.isSendable=contactModel.isValid(),t.update()}),this.sendMails=function(){contactModel.send().then(function(){alert("success")})["catch"](function(c,t){alert("error")})}});