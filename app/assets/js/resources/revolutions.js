tumblr.resources.revolutions = (function () {
	var result = [],
	    marginalized = [
		    'aceo',
		    'black',
		    'chubby',
		    'curvy',
		    'deathfat',
		    'demi',
		    'diversity',
		    'dysphoria',
		    'ethnicity',
		    'fandom',
		    'fat',
		    'fatty',
		    'fem',
		    'furry',
		    'height',
		    'homo',
		    'latin',
		    'lesb',
		    'queer',
		    'skinny',
		    'trans',
		    'womyn',
		    'wymyn',
	    ]

	_.forEach(marginalized, function (group) {
		if (group.slice(-1).search(/[aeiouy]/) === -1) {
			// Word doesn't end in a wovel, add 'o'
			group += 'o'
		}
		result.push((group + 'lution').toUpperCase())
	})

	return result
})()
