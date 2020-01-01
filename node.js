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
                to: config.to || msg.to,
                cc: msg.cc,
                bcc: msg.bcc,
                subject: msg.topic || msg.title || 'Message from Node-RED',
            };

            if (config.content === "html") {
                data.html = msg.payload.toString();
            } else {
                data.text = msg.payload.toString();
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
