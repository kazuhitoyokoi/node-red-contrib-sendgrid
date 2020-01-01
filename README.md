# node-red-contrib-sendgrid

Sending e-mail node using SendGrid service

The default e-mail node sometimes encounters a login problem occurred from unusual behavior. For example, Gmail authentication will show an alert when Node-RED runtime is located in a different location from the user's local PC or smartphone. SendGrid node can solve the problem because SendGrid service ensures sending an e-mail.

## How to use 
(1) Install SendGrid node (node-red-contrib-sendgrid) using manage palette in Node-RED

(2) Get API key from SendGrid website ( https://sendgrid.com/ )

(3) Paste the API key on the property of SendGrid node
![property](https://github.com/zuhito/node-red-contrib-sendgrid/raw/master/property.png)

(4) Create flows using SendGrid node
![flow](https://github.com/zuhito/node-red-contrib-sendgrid/raw/master/flow.png)

## SendGrid node specification
Sends the <code>msg.payload</code> as an email, with a subject of <code>msg.topic</code>.
The default message recipient can be configured in the node.
If it is left blank, it should be set using the <code>msg.to</code> property of the incoming message.
you can also specify <code>msg.cc</code> and/or <code>msg.bcc</code> properties.
You can set sender of <code>msg.from</code> in the payload.
If the payload is a binary buffer then it will be converted to an attachment.
The filename should be set using <code>msg.filename</code>. Optionally <code>msg.description</code> can be added for the body text.