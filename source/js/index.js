
/**
 * Dependencies
 */
const $ = require('cash-dom')
const ready = require('domready')
const engine = require('engine.io-client')
const config = require('../../config')
const dot = require('./lib/dot')
const track = require('./lib/track')

/**
 * Config
 */
const host = window.location.hostname
const port = config.port
const socket = engine(`ws://${host}:${port}`)

/**
 * Kick it off
 */
ready(function () {
	const $canvas = $('.canvas')
	const $main = $('main')

	// Track clicks on links for analytics purposes
	track('[data-track="email"]',    'Clicked email link')
	track('[data-track="watsi"]',    'Clicked Watsi link')
	track('[data-track="dribbble"]', 'Clicked Dribbble link')
	track('[data-track="podium"]',   'Clicked Podium link')

	// Temporary fix for https://github.com/kenwheeler/cash/issues/54
	// Should actually be `$main.find('a')`
	$('main a')
		.on('mouseover', () => $main.addClass('hovered'))
		.on('mouseout', () => $main.removeClass('hovered'))

	socket.on('open', function () {
		socket.on('message', function (message) {
			const data = JSON.parse(message)
			for (let d of data.dots) {
				dot($canvas, d)
			}
		})
	})

})