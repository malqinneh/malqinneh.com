
'use strict'

/**
 * Dependencies
 */
var engine = require('engine.io')
var random = require('randf')
var nearby = require('nearby')
var config = require('./config')

/**
 * Config
 */
var COLORS = config.dots.colors
var COUNT = config.dots.count
var INTERVAL = config.dots.interval
var PADDING = parseInt(config.dots.padding, 10)
var DISTANCE = parseInt(config.dots.minimumDistance, 10)

/**
 * Utils
 */
var randomIndex = (arr) => Math.floor(Math.random() * arr.length)
var parse = (num) => parseInt(num, 10)
var point = () => random(PADDING, 100 - PADDING)
var near = nearby(DISTANCE)

/**
 * Begin
 */
var server = engine.listen(process.env.PORT)
var dots = []

// Kick things off
for (let i = 0; i < COUNT; i++) {
	dots.push(dot())
}
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
	var positions = arr.map((pt) => parse(pt[prop]))
	// Keep generating positions until there are no other dots nearby
	let result = point()
	while (near(positions, result)) {
		result = point()
	}
	return result
}
