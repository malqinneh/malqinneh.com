
'use strict'

/**
 * Dependencies
 */
const engine = require('engine.io')
const random = require('randf')
const nearby = require('nearby')
const config = require('./config')

/**
 * Config
 */
const COLORS = config.dots.colors
const COUNT = config.dots.count
const INTERVAL = config.dots.interval
const PADDING = parseInt(config.dots.padding, 10)
const DISTANCE = parseInt(config.dots.minimumDistance, 10)

/**
 * Utils
 */
const randomIndex = (arr) => Math.floor(Math.random() * arr.length)
const distance = (a, b) => Math.abs(a - b)
const point = () => random(PADDING, 100 - PADDING)
const near = nearby(DISTANCE)

/**
 * Begin
 */
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

/**
 * Send signal once every interval
 */
function heartbeat () {
	dots[randomIndex(dots)] = dot()
	server.broadcast({
		clients: Object.keys(server.clients).length,
		dots: dots
	})
}

function dot () {
	let top = noNearby(dots, 'top')
	let left = noNearby(dots, 'left')
	let color = COLORS[randomIndex(COLORS)]
	return {
		top: top.toFixed(2) + '%',
		left: left.toFixed(2) + '%',
		color: color,
		radius: 8
	}
}

function noNearby (arr, prop) {
	let result = point()
	// keep generating positions until there are none nearby
	let positions = arr.map((pt) => parseInt(pt[prop], 10))
	while (near(positions, result)) result = point()
	return result
}
