'use strict'

/**
 * Dependencies
 */
const engine = require('engine.io')
const random = require('randf')
const config = require('./config')

/**
 * Config
 */
const COLORS = config.dots.colors
const PADDING = config.dots.padding

const pluck = (arr) => arr[Math.floor(Math.random()*arr.length)]
const server = engine.listen(config.port)


server.broadcast = function (message, source) {
	for (let index in server.clients) {
		if (index === source) continue
		server.clients[index].send(JSON.stringify(message))
	}
}

setInterval(function () {
	server.broadcast({
		top: random(PADDING, 100 - PADDING).toFixed(2) + '%',
		left: random(PADDING, 100 - PADDING).toFixed(2) + '%',
		color: pluck(COLORS),
		radius: 8
	})
}, 2000)