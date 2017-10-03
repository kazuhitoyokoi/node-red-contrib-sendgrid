module.exports = function(RED) {
    function SendGridNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(apikey);
            msg = {
              to: msg.to,
              from: msg.from,
              subject: 'Sending with SendGrid is Fun',
              text: new String(msg.payload),
              html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
            sgMail.send(msg);
        });
    }
    RED.nodes.registerType("sendgrid", SendGridNode);
}