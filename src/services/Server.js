/* 
 * The MIT License
 *
 * Copyright 2016 Eli Davis.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


var SocketMessageType = require('juke-protocols');
var ToClientMessages = SocketMessageType.ToClientMessages;
var ToServerMessages = SocketMessageType.ToServerMessages;
var Fingerprint = require('fingerprintjs2');
var Rx = require('rx');

module.exports = Server;

/*
 * @ngInject
 */
function Server() {

    var self = this;

    var socket = io();

    var ourId = null;

    new Fingerprint().get(function (result, components, toast) {
        ourId = result;
    });

    self.server$ = new Rx.Subject();

    self.entireQueue$ = new Rx.Subject();

    socket.on(ToClientMessages.EntireQ, function (queue) {
        console.log(queue);
        self.entireQueue$.onNext(queue);
    });

    self.addSongToQueue = function (song) {
        socket.emit(ToServerMessages.AddToQ, song);
    };

    self.setVoteOnSong = function (nid, vote) {
        
        if (!ourId) {
            toast.informUser("Unable to place vote");
            console.log("User does not have a finger print");
            return;
        }

        socket.emit(ToServerMessages.SetVote, {
            nid: nid,
            uid: ourId,
            vote: vote
        });
    };

}
