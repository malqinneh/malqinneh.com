
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
	
	socket.on('open', function () {
		console.log('opening')
		socket.on('message', function (message) {
			let data = JSON.parse(message)
			let opts = data
			opts.container = $canvas
			dot(opts)
		})
	})
	
})

