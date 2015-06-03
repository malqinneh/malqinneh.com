
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
const COUNT = config.dots.count
const INTERVAL = config.dots.interval
const PADDING = parseInt(config.dots.padding, 10)

const randomIndex = (arr) => Math.floor(Math.random()*arr.length)
const server = engine.listen(config.port)
const dots = []

// Populate dots to start out
for (let i = 0; i < COUNT; i++) {
	dots.push(dot())
}

// Kick things off
setInterval(heartbeat, INTERVAL)


server.broadcast = function (message, source) {
	for (let index in server.clients) {
		if (index === source) continue
		server.clients[index].send(JSON.stringify(message))
	}
}

function heartbeat() {
	dots[randomIndex(dots)] = dot()
	server.broadcast({
		clients: Object.keys(server.clients).length,
		dots: dots
	})
}

function dot() {
	return {
		top: random(PADDING, 100 - PADDING).toFixed(2) + '%',
		left: random(PADDING, 100 - PADDING).toFixed(2) + '%',
		color: COLORS[randomIndex(COLORS)],
		radius: 8
	}
}