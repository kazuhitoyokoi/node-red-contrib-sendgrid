module.exports = function (RED) {
    'use strict';
    function SendGridNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg, send, done) {
            send = send || function() {
                node.send.apply(node, arguments);
            };
            node.status({fill: "blue", shape: "dot", text: "sendgrid.status.sending"});

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(node.credentials.key);

            var data = {
                from: config.from || msg.from,
                to: (config.to || msg.to || '').split(/(,|;| )+/),
                cc: (msg.cc || '').split(/(,|;| )+/),
                bcc: (msg.bcc || '').split(/(,|;| )+/),
                subject: msg.topic || msg.title || 'Message from Node-RED',
            };
            var body, fname;

            if (Buffer.isBuffer(msg.payload)) {
                if (!msg.filename) {
                    var fe = "bin";
                    if ((msg.payload[0] === 0xFF)&&(msg.payload[1] === 0xD8)) { fe = "jpg"; }
                    if ((msg.payload[0] === 0x47)&&(msg.payload[1] === 0x49)) { fe = "gif"; } 
                    if ((msg.payload[0] === 0x42)&&(msg.payload[1] === 0x4D)) { fe = "bmp"; }
                    if ((msg.payload[0] === 0x89)&&(msg.payload[1] === 0x50)) { fe = "png"; }
                    fname = "attachment." + fe;
                } else {
                    fname = msg.filename;
                }
                data.attachments = [{
                    content: msg.payload.toString('base64'),
                    filename: fname,
                }];
                body = msg.description || " ";
            } else {
                body = msg.payload.toString();
            }

            if (config.content === "html") {
                data.html = body;
            } else {
                data.text = body;
            }

            sgMail.send(data, function (err) {
                if (err) {
                    node.status({fill: "red", shape: "ring", text: "sendgrid.status.sendfail"});
                    if (done) {
                        done(err.toString());
                    } else {
                        node.error(err.toString(), msg);
                    }
                } else {
                    if (done) {
                        done();
                    }
                    setTimeout(function () {
                        node.status({});
                    }, 1000);
                }
            });
        });
    }
    RED.nodes.registerType("sendgrid", SendGridNode, {
        credentials: {
            key: {type: "password"}
        }
    });
};
