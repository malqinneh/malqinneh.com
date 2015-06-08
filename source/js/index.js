
/**
 * Dependencies
 */
var $ = require('cash-dom')
var ready = require('domready')
var engine = require('engine.io-client')
var config = require('../../config')
var dot = require('./lib/dot')
var track = require('./lib/track')

/**
 * Config
 */
var host = config.server.host
var port = config.server.port
var socket = engine(`ws://${host}:${port}`)

/**
 * Kick it off
 */
ready(function () {

	var $body = $(document.body)
	var $canvas = $('.canvas')
	var $main = $('.primary')
	var $info = $('.info')

	// Track clicks on links for analytics purposes
	track('[data-track="email"]',    'Clicked email link')
	track('[data-track="watsi"]',    'Clicked Watsi link')
	track('[data-track="dribbble"]', 'Clicked Dribbble link')
	track('[data-track="podium"]',   'Clicked Podium link')

	// Temporary fix for https://github.com/kenwheeler/cash/issues/54
	// Should actually be `$main.find('a')`
	$('main a')
		.on('mouseover', () => $body.addClass('link-hovered'))
		.on('mouseout', () => $body.removeClass('link-hovered'))

	$info
		.on('mouseover', () => $body.addClass('info-hovered'))
		.on('mouseout', () => $body.removeClass('info-hovered'))

	socket.on('open', function () {
		socket.on('message', function (message) {
			var data = JSON.parse(message)
			for (let d of data.dots) {
				dot($canvas, d)
			}
		})
	})

})