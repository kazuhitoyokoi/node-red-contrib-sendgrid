var sgMail = require('@sendgrid/mail');
var fileType = require('file-type');

module.exports = function (RED) {
    'use strict';
    function SendGridNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg, send, done) {
            send = send || function () {
                node.send.apply(node, arguments);
            };
            node.status({fill: "blue", shape: "dot", text: "sendgrid.status.sending"});
            var body;
            var data = {
                from: config.from || msg.from,
                to: (config.to || msg.to || '').split(/[,; ]+/g),
                cc: (msg.cc || '').split(/[,; ]+/g),
                bcc: (msg.bcc || '').split(/[,; ]+/g),
                subject: msg.topic || msg.title || 'Message from Node-RED',
            };
            if (Buffer.isBuffer(msg.payload)) {
                data.attachments = [{
                    content: msg.payload.toString('base64'),
                    filename: msg.filename || "attachment." + fileType(msg.payload).ext
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

            sgMail.setApiKey(node.credentials.key);
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
