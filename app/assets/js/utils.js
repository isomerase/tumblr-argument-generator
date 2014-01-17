var accessProperty = function (obj, path) {
	var arr = path.split('.')

	while (arr.length && (obj = obj[arr.shift()])) {}

	return obj
}

Array.prototype.random = function (n) {
	return _.sample(this, n)
}

String.prototype.randomRepeat = function (to, from) {
	from = typeof from === 'undefined' ? 1 : from
	return (new Array(Math.floor(Math.random() * (to - from + 1) + from) + 1)).join(this)
}

String.prototype.literalize = function () {
	var text = this

	text = text.replace(/you are/g, function () {
		return (Math.random() > 0.2 ? 'you\'re literally' : 'you\'re')
	})
	text = text.replace(/i am/g, function () {
		return (Math.random() > 0.2 ? 'i\'m literally' : 'i\'m')
	})
	text = text.replace(/ will/g, function () {
		return (Math.random() > 0.2 ? '\'ll literally' : '\'ll')
	})
	text = text.replace(/it is/g, function () {
		return (Math.random() > 0.2 ? 'it\'s literally' : 'it\'s')
	})

	return text.toString()
}

String.prototype.tumblrize = function (mangleGrammar) {
	var text = this

	if (typeof mangleGrammar === 'undefined') {
		mangleGrammar = false
	}

	// Randomly make stuff literal
	text = text.literalize()

	// Replace "and" with ampersand
	text = text.replace(/\band\b/g, '&')

	if (mangleGrammar) {
		// Convert you/you're, etc
		text = text.replace(/you're/g, 'ur')
		text = text.replace(/you/g, 'u')
		text = text.replace(/people/g, 'ppl')
		text = text.replace(/\bare\b/g, 'r')
		text = text.replace(/\bplease\b/g, 'plz')
		text = text.replace(/\bhate\b/g, 'h8')
		text = text.replace(/\bto\b/g, '2')
		text = text.replace(/\bthe\b/g, function () {
			return Math.random() > 0.3 ? 'the' : 'teh'
		})

		// Swap eist -> iest
		text = text.replace(/eist/g, 'iest')

		// Remove all apostrophes
		text = text.replace(/'/g, '')

		// Randomly add out-of-place punctuation
		text = text.replace(/\b /g, function () {
			return Math.random() > 0.03 ? ' ' : [', ', '. '].random()
		})
	}

	// Tumblrize individual sentences
	text = text.replace(/(.+?)([\!\?])/gi, function (m, sentence, punc) {
		if (Math.random() > 0.6) {
			return m
		}

		sentence = sentence.trim()

		if (mangleGrammar) {
			// Randomly uppercase part of or whole sentences
			// Uppercase from random point in sentence
			var randomPoint = Math.floor(Math.random() * sentence.length / 2), wrap

			sentence = sentence.slice(0, randomPoint) + sentence.slice(randomPoint, sentence.length).toUpperCase()
			sentence += punc

			// Randomly add tildes and asterisks around text
			if (Math.random() > 0.8) {
				wrap = '~'.randomRepeat(5)
				if (Math.random() > 0.3) {
					wrap += '*'
				}
				sentence = wrap + sentence + wrap.split('').reverse().join('')
			}

			// Add emoji
			if (Math.random() > 0.75) {
				sentence += ' ' + tumblr.resources.emoji.random()
			}

			return ' ' + sentence
		}

		return m.toUpperCase()
	})

	// Randomly repeat punctuation
	text = text.replace(/([\!\?]+)/g, function (m, p1) {
		return p1.slice(0, 1).randomRepeat(8, 3)
	})

	return text.toString()
}

String.prototype.replaceTerms = function () {
	var re = /\{([a-z\.]+)(:([0-9]+))?\}/gi,
	    text = this,
	    i = 0,
	    termCount, termIndex

	while (text.search(re) !== -1 && i < 5) {
		termCount = {}
		termIndex = {}

		// Make index of unique terms to avoid repetition
		// First index how many terms we should sample
		_.forEach(text.match(re), function (item) {
			var termKey = item.match(/[a-z\.]+/i)[0]

			if (!termCount.hasOwnProperty(termKey)) {
				termCount[termKey] = 1
			}

			termCount[termKey] += 1
		})

		// Sample terms and store in index
		_.forEach(termCount, function (count, term) {
			var termDict = accessProperty(tumblr.resources, term)

			termIndex[term] = _.sample(termDict, count)
		})

		// Replace terms from index
		text = text.replace(re, function (m, matchTerm, formFull, form) {
			var term = termIndex[matchTerm].pop()

			if (typeof term === 'undefined') {
				// This may happen if there are too few terms, in that case sample random term instead
				term = accessProperty(tumblr.resources, matchTerm).random()
			}

			if (typeof form === 'undefined' || !form) {
				form = 1
			}

			if (typeof term === 'object') {
				term = term[form]
			}

			return term
		})

		i += 1
	}

	// Correct a/an
	text = text.replace(/\ba ([aeiouy])/gi, function (m, p1) {
		return 'an ' + p1
	})

	return text.toString()
}

var tumblrPrePostfixer = function (prefixes, postfixes, connector) {
	var result = []

	if (typeof connector === 'undefined') {
		connector = ' '
	}

	_.forEach(prefixes, function (pre) {
		_.forEach(postfixes, function (post) {
			result.push(pre + connector + post)
		})
	})

	return result
}
