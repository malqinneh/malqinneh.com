
/**
 * Dependencies
 */
const $ = require('cash-dom')
const ready = require('domready')
const random = require('randf')
const engine = require('engine.io-client')
const config = require('../../config')
const dot = require('./lib/dot')

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

	// Temporary fix for https://github.com/kenwheeler/cash/issues/54
	// Should actually be `$main.find('a')`
	$('main a')
		.on('mouseover', () => $main.addClass('hovered'))
		.on('mouseout', () => $main.removeClass('hovered'))
	
	socket.on('open', function () {
		console.log('Connected to server...')
		socket.on('message', function (message) {
			const data = JSON.parse(message)
			for (let d of data.dots) {
				dot($canvas, d)
			}
		})
	})
	
})
