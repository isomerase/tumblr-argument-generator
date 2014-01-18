tumblr.resources.individuals = [
	'individuals',
	'people',
	'personalities',
	'spirits',
].concat(_.map(tumblr.resources.marginalized.nouns, pluralize))

tumblr.resources.personalities = tumblrPrePostfixer([
	'aligned',
	'associating',
	'identifying',
	'type',
	'supporting',
], tumblr.resources.individuals)
