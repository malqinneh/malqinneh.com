
'use strict'

/**
 * Dependencies
 */
var $ = require('cash-dom')
var random = require('randf')
var velocity = require('velocity-animate')
var config = require('../../../config')

/**
 * Config
 */
var COLORS = config.dots.colors
var INTERVAL = config.dots.interval

/**
 * Export `dot`
 */
module.exports = function (parent, opts) {

	var { top, left, color, radius } = opts
	var $container = $(parent)
	var timeout

	var $el = $('<div class="dot"></div>')
	$el.css({
		background: color,
		width: radius * 2 + 'px',
		height: radius * 2 + 'px',
		top: top,
		left: left
	})

	add()

	return {
		add: add,
		remove: remove
	}

	function add () {
		clearTimeout(timeout)
		$el.appendTo($container)
		velocity($el[0], {
			opacity: [1.0, 0.0]
		}, {
			duration: random(1500, 2000),
			easing: 'ease',
			complete: () => timeout = setTimeout(remove, INTERVAL)
		})
	}

	function remove () {
		velocity($el[0], {
			opacity: 0.0
		}, {
			duration: random(400, 800),
			easing: 'ease',
			complete: () => $el.remove()
		})
	}

}
