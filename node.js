module.exports = function(RED) {
    function SendGridNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(this.credentials.key);
            msg = {
              to: new String(config.to),// || msg.to,
              from: new String(config.from),// || msg.from || 'example@example.com',
              subject: new String(config.title),// || msg.topic || msg.title || 'Message from Node-RED',
              text: new String(msg.payload)
            };
            sgMail.send(msg);
        });
    }
    RED.nodes.registerType("sendgrid", SendGridNode, {
        credentials: {
            key: {type:"password"}
        }
    });
}